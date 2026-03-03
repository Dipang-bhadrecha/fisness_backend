import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'

// This declaration tells TypeScript that fastify.prisma exists
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

async function prismaPlugin(fastify: FastifyInstance) {
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  })

  await prisma.$connect()

  // Attach prisma to fastify instance
  fastify.decorate('prisma', prisma)

  // Disconnect cleanly when server closes
  fastify.addHook('onClose', async () => {
    await prisma.$disconnect()
  })
}

export default fp(prismaPlugin)