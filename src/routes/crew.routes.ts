import { FastifyInstance } from 'fastify'
import {
  getCrewMembers, addCrewMember,
  getCrewMemberDetail, updateCrewMember,
  getCrewAdvances, addCrewAdvance,
} from '../controllers/crew.controller'

export async function crewRoutes(fastify: FastifyInstance) {
  const auth = { preHandler: [fastify.authenticate] }

  // Per-boat crew
  fastify.get( '/boats/:boatId/crew',   auth, getCrewMembers  as any)
  fastify.post('/boats/:boatId/crew',   auth, addCrewMember   as any)

  // Per-member
  fastify.get  ('/crew/:memberId',          auth, getCrewMemberDetail as any)
  fastify.patch('/crew/:memberId',          auth, updateCrewMember    as any)
  fastify.get  ('/crew/:memberId/advances', auth, getCrewAdvances     as any)
  fastify.post ('/crew/:memberId/advances', auth, addCrewAdvance      as any)
}
