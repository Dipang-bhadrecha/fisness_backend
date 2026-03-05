import { FastifyInstance } from 'fastify'
import {
  createBoat, getMyBoats, updateBoat, deleteBoat
} from '../controllers/boat.controller'

export async function boatRoutes(fastify: FastifyInstance) {
  const auth = { preHandler: [fastify.authenticate] }

  fastify.post('/',            auth, createBoat)
  fastify.get('/',             auth, getMyBoats)
//   fastify.patch('/:boatId',    auth, updateBoat)
//   fastify.delete('/:boatId',   auth, deleteBoat)
}