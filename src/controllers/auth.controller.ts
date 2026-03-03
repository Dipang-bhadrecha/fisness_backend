import { FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from '../services/auth.service'
import { successResponse } from '../utils/response'

interface RequestOTPBody { email: string; name: string }
interface VerifyOTPBody  { email: string; code: string  }

export async function requestOTP(
  request: FastifyRequest<{ Body: RequestOTPBody }>,
  reply: FastifyReply
) {
  const { email, name } = request.body
  const result = await AuthService.requestOTP(
    request.server.prisma,
    email,
    name
  )
  return reply.status(200).send(
    successResponse(result, 'OTP sent to your email')
  )
}

export async function verifyOTP(
  request: FastifyRequest<{ Body: VerifyOTPBody }>,
  reply: FastifyReply
) {
  const { email, code } = request.body

  const user = await AuthService.verifyOTP(
    request.server.prisma,
    email,
    code
  )

  // Sign JWT with user info
  const token = await reply.jwtSign({
    userId: user.id,
    email:  user.email,
  })

  return reply.status(200).send(
    successResponse({
      token,
      user: {
        id:    user.id,
        email: user.email,
        name:  user.name,
      },
    }, 'Login successful')
  )
}

export async function getMe(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = await AuthService.getMe(
    request.server.prisma,
    request.user.userId
  )
  return reply.status(200).send(successResponse(user))
}