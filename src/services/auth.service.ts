import { PrismaClient } from '@prisma/client'
import { sendOTPSms, verifyOTPSms } from './sms.service'
import { CompanyService } from './company.service'
import { ValidationError, NotFoundError } from '../utils/errors'

export interface WorkspaceSetupPayload {
  primaryRole: 'owner' | 'manager' | 'both'
  ownerType?: 'company' | 'personal' | 'both'
  companyName?: string
  firstBoatName?: string
  boatRegistration?: string
  ownerPhone?: string
}

export interface WorkspaceResult {
  id: string
  type: 'company' | 'personal' | 'manager_access' | 'boat'
  name: string
  role: 'owner' | 'manager'
  permissions: string[]
}

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
  if (!approved) throw new ValidationError('Invalid or expired OTP code. Please check the code or request a new one.')

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

  /** Setup workspace after first login: create company and/or personal boat in DB */
  static async setup(
    prisma: PrismaClient,
    userId: string,
    payload: WorkspaceSetupPayload
  ): Promise<WorkspaceResult[]> {
    const workspaces: WorkspaceResult[] = []

    // Company owner path — create company + first registered boat
    if (
      (payload.primaryRole === 'owner' || payload.primaryRole === 'both') &&
      payload.ownerType !== 'personal' &&
      payload.companyName
    ) {
      const company = await CompanyService.create(prisma, userId, {
        name: payload.companyName,
      })
      workspaces.push({
        id: company.id,
        type: 'company',
        name: company.name,
        role: 'owner',
        permissions: [],
      })

      if (payload.firstBoatName) {
        await CompanyService.addRegisteredBoat(prisma, userId, company.id, {
          name: payload.firstBoatName,
          ownerPhone: payload.boatRegistration ?? undefined,
        })
      }
    }

    // Personal boat owner path — create Boat record in DB
    if (
      (payload.primaryRole === 'owner' || payload.primaryRole === 'both') &&
      (payload.ownerType === 'personal' || payload.ownerType === 'both') &&
      payload.firstBoatName
    ) {
      const boat = await prisma.boat.create({
        data: { name: payload.firstBoatName, ownerId: userId },
      })
      workspaces.push({
        id: boat.id,
        type: 'personal',
        name: boat.name,
        role: 'owner',
        permissions: [],
      })
    }

    return workspaces
  }
}