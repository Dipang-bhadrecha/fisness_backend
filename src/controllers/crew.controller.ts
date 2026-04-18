import { FastifyRequest, FastifyReply } from 'fastify'
import { CrewService, AddCrewPayload, AddCrewAdvancePayload } from '../services/crew.service'
import { successResponse } from '../utils/response'

export async function deleteCrewAdvance(
  request: FastifyRequest<{ Params: { advanceId: string } }>,
  reply: FastifyReply
) {
  await CrewService.deleteCrewAdvance(
    request.server.prisma,
    request.params.advanceId,
    request.user.userId
  )
  return reply.send(successResponse(null, 'Advance deleted'))
}

export async function deleteCrewMember(
  request: FastifyRequest<{ Params: { memberId: string } }>,
  reply: FastifyReply
) {
  await CrewService.deleteCrewMember(
    request.server.prisma,
    request.params.memberId,
    request.user.userId
  )
  return reply.send(successResponse(null, 'Crew member deleted'))
}

export async function getCrewMembers(
  request: FastifyRequest<{ Params: { boatId: string } }>,
  reply: FastifyReply
) {
  const members = await CrewService.getCrewMembers(
    request.server.prisma,
    request.params.boatId,
    request.user.userId
  )
  return reply.send(successResponse(members))
}

export async function addCrewMember(
  request: FastifyRequest<{ Params: { boatId: string }; Body: AddCrewPayload }>,
  reply: FastifyReply
) {
  const member = await CrewService.addCrewMember(
    request.server.prisma,
    request.params.boatId,
    request.user.userId,
    request.body
  )
  return reply.status(201).send(successResponse(member, 'Crew member added'))
}

export async function getCrewMemberDetail(
  request: FastifyRequest<{ Params: { memberId: string } }>,
  reply: FastifyReply
) {
  const member = await CrewService.getCrewMemberDetail(
    request.server.prisma,
    request.params.memberId,
    request.user.userId
  )
  return reply.send(successResponse(member))
}

export async function updateCrewMember(
  request: FastifyRequest<{ Params: { memberId: string }; Body: Partial<AddCrewPayload> & { status?: 'active' | 'left' } }>,
  reply: FastifyReply
) {
  const member = await CrewService.updateCrewMember(
    request.server.prisma,
    request.params.memberId,
    request.user.userId,
    request.body
  )
  return reply.send(successResponse(member, 'Crew member updated'))
}

export async function getCrewAdvances(
  request: FastifyRequest<{ Params: { memberId: string } }>,
  reply: FastifyReply
) {
  const advances = await CrewService.getCrewAdvances(
    request.server.prisma,
    request.params.memberId,
    request.user.userId
  )
  return reply.send(successResponse(advances))
}

export async function addCrewAdvance(
  request: FastifyRequest<{ Params: { memberId: string }; Body: AddCrewAdvancePayload }>,
  reply: FastifyReply
) {
  const advance = await CrewService.addCrewAdvance(
    request.server.prisma,
    request.params.memberId,
    request.user.userId,
    request.body
  )
  return reply.status(201).send(successResponse(advance, 'Advance recorded'))
}
