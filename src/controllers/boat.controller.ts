import { FastifyRequest, FastifyReply } from 'fastify'
import { BoatService } from '../services/boat.service'
import { successResponse } from '../utils/response'

export async function createBoat(req: FastifyRequest, reply: FastifyReply) {
  const boat = await BoatService.create(req.server.prisma, req.user.userId, req.body as any)
  return reply.status(201).send(successResponse(boat, 'Boat created'))
}

export async function getMyBoats(req: FastifyRequest, reply: FastifyReply) {
  const boats = await BoatService.getAll(req.server.prisma, req.user.userId)
  return reply.send(successResponse(boats))
}

export async function updateBoat(
  req: FastifyRequest<{ Params: { boatId: string } }>,
  reply: FastifyReply
) {
  const boat = await BoatService.update(req.server.prisma, req.user.userId, req.params.boatId, req.body as any)
  return reply.send(successResponse(boat, 'Boat updated'))
}

export async function deleteBoat(
  req: FastifyRequest<{ Params: { boatId: string } }>,
  reply: FastifyReply
) {
  await BoatService.remove(req.server.prisma, req.user.userId, req.params.boatId)
  return reply.send(successResponse(null, 'Boat deleted'))
}
