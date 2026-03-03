import { PrismaClient } from '@prisma/client'
import { sendOTPSms } from './sms.service'
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

  // Step 1 — user sends phone → get OTP
  static async requestOTP(
    prisma: PrismaClient,
    phone: string
  ) {
    // Find or create user by phone
    let user = await prisma.user.findUnique({
      where: { phone },
    })

    const isNewUser = !user

    if (!user) {
      user = await prisma.user.create({
        data: { phone },
      })
    }

    // Invalidate all previous unused OTPs for this phone
    await prisma.oTP.updateMany({
      where: { phone, isUsed: false },
      data: { isUsed: true },
    })

    // Generate fresh OTP
    const code = generateOTPCode()

    await prisma.oTP.create({
      data: {
        phone,
        code,
        userId: user.id,
        expiresAt: getOTPExpiry(),
      },
    })

    // Send SMS
    await sendOTPSms(phone, code)

    return { isNewUser, phone }
  }

  // Step 2 — user sends phone + code → get JWT
  static async verifyOTP(
    prisma: PrismaClient,
    phone: string,
    code: string
  ) {
    // Find latest unused OTP for this phone
    const otp = await prisma.oTP.findFirst({
      where: {
        phone,
        code,
        isUsed: false,
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!otp) {
      throw new ValidationError('Invalid OTP code')
    }

    if (new Date() > otp.expiresAt) {
      throw new ValidationError('OTP expired — request a new one')
    }

    // Mark as used — single use only
    await prisma.oTP.update({
      where: { id: otp.id },
      data: { isUsed: true },
    })

    // Get user
    const user = await prisma.user.findUnique({
      where: { phone },
    })

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