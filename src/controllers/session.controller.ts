import { FastifyRequest, FastifyReply } from 'fastify'
import { SessionService } from '../services/session.service'
import { successResponse } from '../utils/response'

export async function createSession(req: FastifyRequest, reply: FastifyReply) {
  const session = await SessionService.create(req.server.prisma, req.user.userId, req.body as any)
  return reply.status(201).send(successResponse(session, 'Tali session started'))
}

export async function getSessions(
  req: FastifyRequest<{ Querystring: { companyId?: string; boatId?: string } }>,
  reply: FastifyReply
) {
  const sessions = await SessionService.getAll(req.server.prisma, req.user.userId, req.query)
  return reply.send(successResponse(sessions))
}

export async function getSession(
  req: FastifyRequest<{ Params: { sessionId: string } }>,
  reply: FastifyReply
) {
  const session = await SessionService.getOne(req.server.prisma, req.user.userId, req.params.sessionId)
  return reply.send(successResponse(session))
}

export async function endSession(
  req: FastifyRequest<{ Params: { sessionId: string } }>,
  reply: FastifyReply
) {
  const session = await SessionService.end(req.server.prisma, req.user.userId, req.params.sessionId, req.body as any)
  return reply.send(successResponse(session, 'Session ended'))
}

export async function syncSession(
  req: FastifyRequest<{ Params: { sessionId: string } }>,
  reply: FastifyReply
) {
  const session = await SessionService.sync(req.server.prisma, req.user.userId, req.params.sessionId, req.body as any)
  return reply.send(successResponse(session, 'Session synced'))
}