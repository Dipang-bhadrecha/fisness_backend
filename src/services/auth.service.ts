import { PrismaClient, OwnerType } from '@prisma/client'
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
  // upsert is atomic — prevents duplicate users if called twice concurrently
  const user = await prisma.user.upsert({
    where:  { phone },
    update: {},
    create: { phone },
  })
  const isNewUser = !user.name

  // Twilio manages OTP — no DB record needed
  await sendOTPSms(phone)
  return { isNewUser, phone }
}

// verifyOTP — replace DB lookup with Twilio check
static async verifyOTP(prisma: PrismaClient, phone: string, code: string) {
  const approved = await verifyOTPSms(phone, code)
  if (!approved) throw new ValidationError('Invalid or expired OTP code. Please check the code or request a new one.')

  const user = await prisma.user.findUnique({
    where:   { phone },
    include: {
      ownedBoats:     { where: { isActive: true }, select: { id: true } },
      ownedCompanies: { where: { isActive: true }, select: { id: true } },
    },
  })
  if (!user) throw new NotFoundError('User')
  if (!user.isActive) throw new ValidationError('Account is disabled')

  // Backfill ownerType for users created before this field existed
  if (!user.ownerType) {
    const hasBoats     = user.ownedBoats.length > 0
    const hasCompanies = user.ownedCompanies.length > 0
    if (hasBoats || hasCompanies) {
      const derived = hasBoats && hasCompanies ? OwnerType.BOTH
                    : hasBoats                 ? OwnerType.BOAT
                    :                            OwnerType.COMPANY
      await prisma.user.update({ where: { id: user.id }, data: { ownerType: derived } })
      return { ...user, ownerType: derived }
    }
  }

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

    // Backfill ownerType for users created before this field existed
    if (!user.ownerType) {
      const hasBoats     = user.ownedBoats.length > 0
      const hasCompanies = user.ownedCompanies.length > 0
      if (hasBoats || hasCompanies) {
        const derived = hasBoats && hasCompanies ? OwnerType.BOTH
                      : hasBoats                 ? OwnerType.BOAT
                      :                            OwnerType.COMPANY
        await prisma.user.update({ where: { id: user.id }, data: { ownerType: derived } })
        return { ...user, ownerType: derived }
      }
    }

    return user
  }

  /** Update user profile fields (name only for now) */
  static async updateMe(
    prisma: PrismaClient,
    userId: string,
    data: { name?: string }
  ) {
    if (!data.name?.trim()) throw new ValidationError('Name cannot be empty')
    return prisma.user.update({
      where:  { id: userId },
      data:   { name: data.name.trim() },
      select: { id: true, phone: true, name: true, ownerType: true },
    })
  }

  /** Setup workspace after first login: create company and/or personal boat in DB */
  static async setup(
    prisma: PrismaClient,
    userId: string,
    payload: WorkspaceSetupPayload
  ): Promise<WorkspaceResult[]> {
    const workspaces: WorkspaceResult[] = []

    // Derive and persist ownerType from setup payload
    const ownerTypeMap: Record<string, OwnerType> = {
      personal: OwnerType.BOAT,
      company:  OwnerType.COMPANY,
      both:     OwnerType.BOTH,
    }
    const resolvedOwnerType =
      (payload.primaryRole === 'owner' || payload.primaryRole === 'both') && payload.ownerType
        ? ownerTypeMap[payload.ownerType] ?? null
        : null

    if (resolvedOwnerType) {
      await prisma.user.update({
        where: { id: userId },
        data:  { ownerType: resolvedOwnerType },
      })
    }

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

  /**
   * Owners can expand their ownerType from profile (e.g. BOAT → BOTH).
   * Managers (ownerType = null) cannot call this — enforced in controller.
   * When adding COMPANY role, creates the company entity.
   * When adding BOAT role, creates the first boat entity.
   */
  static async updateOwnerType(
    prisma: PrismaClient,
    userId: string,
    payload: { ownerType: 'company' | 'personal' | 'both'; companyName?: string; firstBoatName?: string }
  ) {
    const ownerTypeMap: Record<string, OwnerType> = {
      personal: OwnerType.BOAT,
      company:  OwnerType.COMPANY,
      both:     OwnerType.BOTH,
    }

    const newOwnerType = ownerTypeMap[payload.ownerType]

    // Create company entity if transitioning to include COMPANY
    if (
      (payload.ownerType === 'company' || payload.ownerType === 'both') &&
      payload.companyName
    ) {
      const existing = await prisma.company.findFirst({ where: { ownerId: userId, isActive: true } })
      if (!existing) {
        await CompanyService.create(prisma, userId, { name: payload.companyName })
      }
    }

    // Create boat entity if transitioning to include BOAT
    if (
      (payload.ownerType === 'personal' || payload.ownerType === 'both') &&
      payload.firstBoatName
    ) {
      const existing = await prisma.boat.findFirst({ where: { ownerId: userId, isActive: true } })
      if (!existing) {
        await prisma.boat.create({ data: { name: payload.firstBoatName, ownerId: userId } })
      }
    }

    return prisma.user.update({
      where: { id: userId },
      data:  { ownerType: newOwnerType },
      select: { id: true, phone: true, name: true, ownerType: true, createdAt: true },
    })
  }
}