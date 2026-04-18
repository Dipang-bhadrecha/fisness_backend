import 'dotenv/config'
import Fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import prismaPlugin from './plugins/prisma.plugin'
import jwtPlugin from './plugins/jwt.plugin'
import { authRoutes }       from './routes/auth.routes'
import { companyRoutes }    from './routes/company.routes'
import { boatRoutes }       from './routes/boat.routes'
import { sessionRoutes }    from './routes/session.routes'
import { billRoutes }       from './routes/bill.routes'
import { invitationRoutes } from './routes/invitation.routes'
import { crewRoutes }       from './routes/crew.routes'
import { errorResponse }    from './utils/response'
import { AppError }         from './utils/errors'
import { verifySmsService } from './services/sms.service'

export async function buildApp(): Promise<FastifyInstance> {
  const isDev = process.env.NODE_ENV === 'development'

  const fastify = Fastify({
    logger: isDev
      ? {
          level: 'debug',
          transport: {
            target: 'pino-pretty',
            options: { colorize: true },
          },
        }
      : {
          level: 'info',
        },
  })

  // ── Security plugins ────────────────────────────────────────────────────────
  await fastify.register(helmet)
  await fastify.register(cors, {
    origin: '*' ,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
  await fastify.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
  })

  // ── App plugins ─────────────────────────────────────────────────────────────
  await fastify.register(prismaPlugin)
  await fastify.register(jwtPlugin)

  await verifySmsService()

  // ── Global error handler ────────────────────────────────────────────────────
  fastify.setErrorHandler(async (error: any, request, reply) => {
    request.log.error({ error, url: request.url }, 'Request error')

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send(
        errorResponse(error.message, error.code)
      )
    }

    // Prisma not found
    if (error.code === 'P2025') {
      return reply.status(404).send(
        errorResponse('Record not found', 'NOT_FOUND')
      )
    }

    // Prisma unique constraint
    if (error.code === 'P2002') {
      return reply.status(409).send(
        errorResponse('Record already exists', 'CONFLICT')
      )
    }

    // Fastify validation error
    if (error.statusCode === 400) {
      return reply.status(400).send(
        errorResponse('Invalid request data', 'VALIDATION_ERROR', error.message)
      )
    }

    return reply.status(500).send(
      errorResponse('Internal server error', 'SERVER_ERROR')
    )
  })

  // ── Health check ────────────────────────────────────────────────────────────
  fastify.get('/health', async () => ({
    status: 'ok',
    service: 'matsyakosh-api',
    timestamp: new Date().toISOString(),
  }))

  // ── Routes ──────────────────────────────────────────────────────────────────
  fastify.register(authRoutes,       { prefix: '/api/v1/auth' })
  fastify.register(companyRoutes,    { prefix: '/api/v1/companies' })
  fastify.register(boatRoutes,       { prefix: '/api/v1/boats' })
  fastify.register(sessionRoutes,    { prefix: '/api/v1/sessions' })
  fastify.register(billRoutes,       { prefix: '/api/v1/bills' })
  fastify.register(invitationRoutes, { prefix: '/api/v1/invitations' })
  fastify.register(crewRoutes,       { prefix: '/api/v1' })

  return fastify
}