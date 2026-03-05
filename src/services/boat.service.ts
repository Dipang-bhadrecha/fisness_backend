import { PrismaClient } from '@prisma/client'
import { NotFoundError, UnauthorizedError } from '../utils/errors'

export class BoatService {

  static async create(prisma: PrismaClient, userId: string, data: {
    name: string; nameGujarati?: string; registrationNumber?: string
  }) {
    return prisma.boat.create({ data: { ...data, ownerId: userId } })
  }

  static async getAll(prisma: PrismaClient, userId: string) {
    return prisma.boat.findMany({
      where: { ownerId: userId, isActive: true },
      include: { _count: { select: { sessions: true } } },
    })
  }

  static async update(prisma: PrismaClient, userId: string, boatId: string, data: Partial<{
    name: string; nameGujarati: string; registrationNumber: string
  }>) {
    await BoatService._assertOwner(prisma, userId, boatId)
    return prisma.boat.update({ where: { id: boatId }, data })
  }

  static async remove(prisma: PrismaClient, userId: string, boatId: string) {
    await BoatService._assertOwner(prisma, userId, boatId)
    await prisma.boat.update({ where: { id: boatId }, data: { isActive: false } })
  }

  static async _assertOwner(prisma: PrismaClient, userId: string, boatId: string) {
    const boat = await prisma.boat.findUnique({ where: { id: boatId } })
    if (!boat) throw new NotFoundError('Boat')
    if (boat.ownerId !== userId) throw new UnauthorizedError('Not your boat')
    return boat
  }
}
