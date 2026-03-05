import { FastifyInstance } from 'fastify'
import {
  sendInvitation, acceptInvitation, revokeInvitation
} from '../controllers/invitation.controller'

export async function invitationRoutes(fastify: FastifyInstance) {
  const auth = { preHandler: [fastify.authenticate] }

  fastify.post('/',              auth, sendInvitation)     // owner sends invite
  fastify.post('/accept',        auth, acceptInvitation)   // manager accepts with code
  fastify.delete('/:inviteId',   auth, revokeInvitation)   // owner revokes
}