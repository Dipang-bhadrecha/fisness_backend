import { FastifyInstance } from 'fastify'
import {
  getCrewMembers, addCrewMember,
  getCrewMemberDetail, updateCrewMember,
  getCrewAdvances, addCrewAdvance,
  deleteCrewAdvance, deleteCrewMember,
  getCrewLeaves, createCrewLeave, closeCrewLeave, deleteCrewLeave,
} from '../controllers/crew.controller'

export async function crewRoutes(fastify: FastifyInstance) {
  const auth = { preHandler: [fastify.authenticate] }

  // Per-boat crew
  fastify.get( '/boats/:boatId/crew',   auth, getCrewMembers  as any)
  fastify.post('/boats/:boatId/crew',   auth, addCrewMember   as any)

  // Per-member
  fastify.get  ('/crew/:memberId',          auth, getCrewMemberDetail as any)
  fastify.patch('/crew/:memberId',          auth, updateCrewMember    as any)
  fastify.get   ('/crew/:memberId/advances', auth, getCrewAdvances     as any)
  fastify.post  ('/crew/:memberId/advances',           auth, addCrewAdvance    as any)
  fastify.delete('/crew/advances/:advanceId',           auth, deleteCrewAdvance  as any)
  fastify.get   ('/crew/:memberId/leaves',              auth, getCrewLeaves     as any)
  fastify.post  ('/crew/:memberId/leaves',              auth, createCrewLeave   as any)
  fastify.patch ('/crew/leaves/:leaveId/close',         auth, closeCrewLeave    as any)
  fastify.delete('/crew/leaves/:leaveId',               auth, deleteCrewLeave   as any)
  fastify.delete('/crew/:memberId',                     auth, deleteCrewMember  as any)
}
