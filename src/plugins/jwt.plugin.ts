import fp from 'fastify-plugin'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import fastifyJwt from '@fastify/jwt'

// Tells TypeScript what's inside the JWT token
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      userId: string
      phone:  string
    }
  }
}

// Tells TypeScript that fastify.authenticate exists
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>
  }
}

async function jwtPlugin(fastify: FastifyInstance) {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET ?? 'fallback-secret',
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    },
  })

  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify()
      } catch {
        reply.status(401).send({
          success: false,
          error: 'Invalid or expired token',
        })
      }
    }
  )
}

export default fp(jwtPlugin)