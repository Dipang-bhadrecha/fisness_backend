import { FastifyInstance } from 'fastify'
import { createBoat, getMyBoats, getArchivedBoats, updateBoat, deleteBoat, restoreBoat } from '../controllers/boat.controller'

export async function boatRoutes(fastify: FastifyInstance) {
  const auth = { preHandler: [fastify.authenticate] }

  fastify.post('/',                       auth, createBoat)
  fastify.get('/',                        auth, getMyBoats)
  fastify.get('/archived',                auth, getArchivedBoats)
  fastify.put('/:boatId',                 auth, updateBoat)
  fastify.delete('/:boatId',              auth, deleteBoat)
  fastify.patch('/:boatId/restore',       auth, restoreBoat)
}