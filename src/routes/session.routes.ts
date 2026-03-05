import { FastifyInstance } from 'fastify'
import {
  createSession, getSessions, getSession,
  endSession, syncSession,
} from '../controllers/session.controller'

export async function sessionRoutes(fastify: FastifyInstance) {
  const auth = { preHandler: [fastify.authenticate] }

  fastify.post('/',                      auth, createSession)  // start tali
//   fastify.get('/',                       auth, getSessions)    // list sessions for a company
//   fastify.get('/:sessionId',             auth, getSession)     // get one session
//   fastify.patch('/:sessionId/end',       auth, endSession)     // finish tali
//   fastify.post('/:sessionId/sync',       auth, syncSession)    // offline sync push
}


