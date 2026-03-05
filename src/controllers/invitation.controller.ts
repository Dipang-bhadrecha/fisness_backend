import { FastifyRequest, FastifyReply } from 'fastify'
import { InvitationService } from '../services/invitation.service'
import { successResponse } from '../utils/response'

export async function sendInvitation(req: FastifyRequest, reply: FastifyReply) {
  const invite = await InvitationService.send(req.server.prisma, req.user.userId, req.body as any)
  return reply.status(201).send(successResponse(invite, 'Invitation sent'))
}

export async function acceptInvitation(req: FastifyRequest, reply: FastifyReply) {
  const result = await InvitationService.accept(req.server.prisma, req.user.userId, (req.body as any).code)
  return reply.send(successResponse(result, 'Invitation accepted'))
}

export async function revokeInvitation(
  req: FastifyRequest<{ Params: { inviteId: string } }>,
  reply: FastifyReply
) {
  await InvitationService.revoke(req.server.prisma, req.user.userId, req.params.inviteId)
  return reply.send(successResponse(null, 'Invitation revoked'))
}