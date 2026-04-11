import { FastifyInstance } from 'fastify'
import { requestOTP, verifyOTP, getMe, updateMe, setup } from '../controllers/auth.controller'
import { requestOTPSchema, verifyOTPSchema, updateMeSchema } from '../validators/auth.validator'

export async function authRoutes(fastify: FastifyInstance) {

  // Public
  fastify.post('/request-otp', {
    schema: requestOTPSchema,
    config: {
      rateLimit: { max: 5, timeWindow: '15 minutes' }
    }
  }, requestOTP)

  fastify.post('/verify-otp', {
    schema: verifyOTPSchema,
    config: {
      rateLimit: { max: 5, timeWindow: '5 minutes' }
    }
  }, verifyOTP)

  // Protected
  fastify.get('/me', {
    preHandler: [fastify.authenticate]
  }, getMe)

  fastify.patch('/me', {
    schema: updateMeSchema,
    preHandler: [fastify.authenticate]
  }, updateMe)

  fastify.post('/setup', {
    preHandler: [fastify.authenticate]
  }, setup)
}