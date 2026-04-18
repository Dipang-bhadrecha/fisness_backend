import { PrismaClient } from '@prisma/client'
import { NotFoundError, ForbiddenError, ValidationError } from '../utils/errors'

export interface AddCrewPayload {
  name: string
  role: string
  phone?: string
  aadhaarNumber?: string
  joiningDate?: string
  monthlyPagar?: number
  seasonAdvance?: number
}

export interface AddCrewAdvancePayload {
  amount: number
  reason?: string
  givenBy?: string
  date?: string
}

export class CrewService {

  // Verify the requesting user owns this boat
  private static async assertBoatOwner(prisma: PrismaClient, boatId: string, userId: string) {
    const boat = await prisma.boat.findUnique({ where: { id: boatId }, select: { ownerId: true } })
    if (!boat) throw new NotFoundError('Boat')
    if (boat.ownerId !== userId) throw new ForbiddenError('You do not own this boat')
  }

  static async getCrewMembers(prisma: PrismaClient, boatId: string, userId: string) {
    await this.assertBoatOwner(prisma, boatId, userId)
    const members = await prisma.crewMember.findMany({
      where:   { boatId },
      include: { advances: { select: { amount: true } } },
      orderBy: { createdAt: 'asc' },
    })
    return members.map(m => ({
      ...m,
      totalKharchi: m.advances.reduce((sum, a) => sum + a.amount, 0),
      advances:     undefined,
    }))
  }

  static async addCrewMember(prisma: PrismaClient, boatId: string, userId: string, payload: AddCrewPayload) {
    await this.assertBoatOwner(prisma, boatId, userId)
    if (!payload.name?.trim()) throw new ValidationError('Name is required')
    if (!payload.role?.trim()) throw new ValidationError('Role is required')
    return prisma.crewMember.create({
      data: {
        boatId,
        name:          payload.name.trim(),
        role:          payload.role.trim(),
        phone:         payload.phone         ?? null,
        aadhaarNumber: payload.aadhaarNumber ?? null,
        joiningDate:   payload.joiningDate   ? new Date(payload.joiningDate) : null,
        monthlyPagar:  payload.monthlyPagar  ?? null,
        seasonAdvance: payload.seasonAdvance ?? null,
      },
    })
  }

  static async getCrewMemberDetail(prisma: PrismaClient, memberId: string, userId: string) {
    const member = await prisma.crewMember.findUnique({
      where:   { id: memberId },
      include: {
        boat:     { select: { ownerId: true } },
        advances: { select: { amount: true } },
      },
    })
    if (!member) throw new NotFoundError('Crew member')
    if (member.boat.ownerId !== userId) throw new ForbiddenError('You do not own this boat')
    return {
      ...member,
      totalKharchi: member.advances.reduce((sum, a) => sum + a.amount, 0),
      advances:     undefined,
      boat:         undefined,
    }
  }

  static async updateCrewMember(prisma: PrismaClient, memberId: string, userId: string, payload: Partial<AddCrewPayload> & { status?: 'active' | 'left' }) {
    const member = await prisma.crewMember.findUnique({
      where:   { id: memberId },
      include: { boat: { select: { ownerId: true } } },
    })
    if (!member) throw new NotFoundError('Crew member')
    if (member.boat.ownerId !== userId) throw new ForbiddenError('You do not own this boat')

    return prisma.crewMember.update({
      where: { id: memberId },
      data: {
        ...(payload.name          != null && { name:          payload.name.trim() }),
        ...(payload.role          != null && { role:          payload.role.trim() }),
        ...(payload.phone         != null && { phone:         payload.phone }),
        ...(payload.aadhaarNumber != null && { aadhaarNumber: payload.aadhaarNumber }),
        ...(payload.joiningDate   != null && { joiningDate:   new Date(payload.joiningDate) }),
        ...(payload.monthlyPagar  != null && { monthlyPagar:  payload.monthlyPagar }),
        ...(payload.seasonAdvance != null && { seasonAdvance: payload.seasonAdvance }),
        ...(payload.status        != null && { status:        payload.status }),
      },
    })
  }

  static async getCrewAdvances(prisma: PrismaClient, memberId: string, userId: string) {
    const member = await prisma.crewMember.findUnique({
      where:   { id: memberId },
      include: { boat: { select: { ownerId: true } } },
    })
    if (!member) throw new NotFoundError('Crew member')
    if (member.boat.ownerId !== userId) throw new ForbiddenError('You do not own this boat')

    return prisma.crewAdvance.findMany({
      where:   { crewMemberId: memberId },
      orderBy: { date: 'desc' },
    })
  }

  static async addCrewAdvance(prisma: PrismaClient, memberId: string, userId: string, payload: AddCrewAdvancePayload) {
    const member = await prisma.crewMember.findUnique({
      where:   { id: memberId },
      include: { boat: { select: { ownerId: true } } },
    })
    if (!member) throw new NotFoundError('Crew member')
    if (member.boat.ownerId !== userId) throw new ForbiddenError('You do not own this boat')
    if (!payload.amount || payload.amount <= 0) throw new ValidationError('Amount must be greater than 0')

    return prisma.crewAdvance.create({
      data: {
        crewMemberId: memberId,
        amount:       payload.amount,
        reason:       payload.reason  ?? null,
        givenBy:      payload.givenBy ?? null,
        date:         payload.date    ? new Date(payload.date) : new Date(),
      },
    })
  }
}
