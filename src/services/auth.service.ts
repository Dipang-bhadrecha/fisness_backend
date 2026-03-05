import { PrismaClient } from '@prisma/client'
import { sendOTPSms, verifyOTPSms } from './sms.service'
import { ValidationError, NotFoundError } from '../utils/errors'

function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function getOTPExpiry(): Date {
  const expiry = new Date()
  expiry.setMinutes(expiry.getMinutes() + 10)
  return expiry
}

export class AuthService {

// requestOTP — remove OTP DB logic, just call sendOTPSms(phone)
static async requestOTP(prisma: PrismaClient, phone: string) {
  let user = await prisma.user.findUnique({ where: { phone } })
  const isNewUser = !user
  if (!user) user = await prisma.user.create({ data: { phone } })

  // Twilio manages OTP — no DB record needed
  await sendOTPSms(phone)
  return { isNewUser, phone }
}

// verifyOTP — replace DB lookup with Twilio check
static async verifyOTP(prisma: PrismaClient, phone: string, code: string) {
  const approved = await verifyOTPSms(phone, code)
  if (!approved) throw new ValidationError('Invalid or expired OTP code')

  const user = await prisma.user.findUnique({ where: { phone } })
  if (!user) throw new NotFoundError('User')
  if (!user.isActive) throw new ValidationError('Account is disabled')
  return user
}

  // Get current user profile with all contexts
  static async getMe(
    prisma: PrismaClient,
    userId: string
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        ownedBoats: {
          where: { isActive: true },
        },
        ownedCompanies: {
          where: { isActive: true },
        },
        boatAssignments: {
          where: { isActive: true },
          include: { boat: true },
        },
        companyMemberships: {
          where: { isActive: true },
          include: { company: true },
        },
      },
    })

    if (!user) throw new NotFoundError('User')
    return user
  }
}