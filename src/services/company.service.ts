import { PrismaClient } from '@prisma/client'
import { NotFoundError, UnauthorizedError, ConflictError } from '../utils/errors'

export class CompanyService {

  // ── Create a company ────────────────────────────────────────────────────────
  static async create(prisma: PrismaClient, userId: string, data: {
    name: string
    nameGujarati?: string
    phone?: string
    address?: string
    gstNumber?: string
  }) {
    return prisma.company.create({
      data: { ...data, ownerId: userId },
    })
  }

  // ── Get all companies for this user (owned + member of) ────────────────────
  static async getAll(prisma: PrismaClient, userId: string) {
    const [owned, memberOf] = await Promise.all([
      prisma.company.findMany({
        where: { ownerId: userId, isActive: true },
        include: { _count: { select: { sessions: true, registeredBoats: true } } },
      }),
      prisma.company.findMany({
        where: {
          memberships: { some: { userId, isActive: true } },
          isActive: true,
        },
        include: { _count: { select: { sessions: true } } },
      }),
    ])

    return {
      owned,
      memberOf,
    }
  }

  // ── Get one company (owner or active member) ───────────────────────────────
  static async getOne(prisma: PrismaClient, userId: string, companyId: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        registeredBoats: { where: { isActive: true } },
        memberships: {
          where: { isActive: true },
          include: { user: { select: { id: true, name: true, phone: true } } },
        },
      },
    })

    if (!company) throw new NotFoundError('Company')

    const isOwner = company.ownerId === userId
    const isMember = company.memberships.some((m) => m.userId === userId)
    if (!isOwner && !isMember) throw new UnauthorizedError('No access to this company')

    return company
  }

  // ── Update (owner only) ────────────────────────────────────────────────────
  static async update(prisma: PrismaClient, userId: string, companyId: string, data: Partial<{
    name: string; nameGujarati: string; phone: string; address: string; gstNumber: string
  }>) {
    await CompanyService._assertOwner(prisma, userId, companyId)
    return prisma.company.update({ where: { id: companyId }, data })
  }

  // ── Soft delete (owner only) ───────────────────────────────────────────────
  static async remove(prisma: PrismaClient, userId: string, companyId: string) {
    await CompanyService._assertOwner(prisma, userId, companyId)
    await prisma.company.update({ where: { id: companyId }, data: { isActive: false } })
  }

  // ── Add a registered boat ──────────────────────────────────────────────────
  static async addRegisteredBoat(prisma: PrismaClient, userId: string, companyId: string, data: {
    name: string; nameGujarati?: string; ownerName?: string; ownerPhone?: string
  }) {
    await CompanyService._assertOwner(prisma, userId, companyId)

    const existing = await prisma.registeredBoat.findUnique({
      where: { companyId_name: { companyId, name: data.name } },
    })
    if (existing) throw new ConflictError(`Boat "${data.name}" already registered`)

    return prisma.registeredBoat.create({
      data: { ...data, companyId },
    })
  }

  // ── Get registered boats ───────────────────────────────────────────────────
  static async getRegisteredBoats(prisma: PrismaClient, userId: string, companyId: string) {
    await CompanyService._assertAccess(prisma, userId, companyId)
    return prisma.registeredBoat.findMany({
      where: { companyId, isActive: true },
      orderBy: { name: 'asc' },
    })
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  static async _assertOwner(prisma: PrismaClient, userId: string, companyId: string) {
    const company = await prisma.company.findUnique({ where: { id: companyId } })
    if (!company) throw new NotFoundError('Company')
    if (company.ownerId !== userId) throw new UnauthorizedError('Only the owner can do this')
    return company
  }

  static async _assertAccess(prisma: PrismaClient, userId: string, companyId: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { memberships: { where: { userId, isActive: true } } },
    })
    if (!company) throw new NotFoundError('Company')
    const isOwner = company.ownerId === userId
    const isMember = company.memberships.length > 0
    if (!isOwner && !isMember) throw new UnauthorizedError('No access to this company')
    return company
  }
}
