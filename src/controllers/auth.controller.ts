import { FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from '../services/auth.service'
import { successResponse } from '../utils/response'

interface RequestOTPBody { phone: string }
interface VerifyOTPBody  { phone: string; code: string }

export async function requestOTP(
  request: FastifyRequest<{ Body: RequestOTPBody }>,
  reply: FastifyReply
) {
  const { phone } = request.body

  const result = await AuthService.requestOTP(
    request.server.prisma,
    phone
  )

  return reply.status(200).send(
    successResponse(result, 'OTP sent to your phone')
  )
}

export async function verifyOTP(
  request: FastifyRequest<{ Body: VerifyOTPBody }>,
  reply: FastifyReply
) {
  const { phone, code } = request.body

  const user = await AuthService.verifyOTP(
    request.server.prisma,
    phone,
    code
  )

  const token = await reply.jwtSign({
    userId: user.id,
    phone:  user.phone,
  })

  return reply.status(200).send(
    successResponse({
      token,
      user: {
        id:        user.id,
        phone:     user.phone,
        name:      user.name,
        isNewUser: !user.name, // if no name set yet — new user
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