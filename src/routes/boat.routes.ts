import { FastifyInstance } from 'fastify'
import { createBoat, getMyBoats } from '../controllers/boat.controller'

export async function boatRoutes(fastify: FastifyInstance) {
  const auth = { preHandler: [fastify.authenticate] }

  fastify.post('/', auth, createBoat)
  fastify.get('/',  auth, getMyBoats)
}