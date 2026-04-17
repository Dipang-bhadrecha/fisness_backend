import { FastifyRequest, FastifyReply } from 'fastify'
import { AuthService, WorkspaceSetupPayload } from '../services/auth.service'
import { successResponse } from '../utils/response'
import { ForbiddenError, ValidationError } from '../utils/errors'

interface RequestOTPBody { phone: string }
interface VerifyOTPBody  { phone: string; code: string }
interface UpdateOwnerTypeBody {
  ownerType: 'company' | 'personal' | 'both'
  companyName?: string
  firstBoatName?: string
}

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
        ownerType: user.ownerType,
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

export async function updateMe(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { name } = request.body as { name?: string }
  const user = await AuthService.updateMe(
    request.server.prisma,
    request.user.userId,
    { name }
  )
  return reply.status(200).send(successResponse({
    id:        user.id,
    phone:     user.phone,
    name:      user.name,
    ownerType: user.ownerType,
  }, 'Profile updated'))
}

export async function setup(
  request: FastifyRequest<{ Body: WorkspaceSetupPayload }>,
  reply: FastifyReply
) {
  const workspaces = await AuthService.setup(
    request.server.prisma,
    request.user.userId,
    request.body
  )
  return reply.status(200).send(successResponse({ workspaces }, 'Setup complete'))
}

export async function updateOwnerType(
  request: FastifyRequest<{ Body: UpdateOwnerTypeBody }>,
  reply: FastifyReply
) {
  // Fetch current user to check if they are an owner (not a manager)
  const current = await request.server.prisma.user.findUnique({
    where:  { id: request.user.userId },
    select: { ownerType: true },
  })
  if (!current?.ownerType) {
    throw new ForbiddenError('Managers cannot change their own role. Role is assigned by the owner.')
  }

  const { ownerType, companyName, firstBoatName } = request.body
  if ((ownerType === 'company' || ownerType === 'both') && !companyName) {
    throw new ValidationError('companyName is required when adding company owner role')
  }
  if ((ownerType === 'personal' || ownerType === 'both') && !firstBoatName) {
    throw new ValidationError('firstBoatName is required when adding boat owner role')
  }

  const user = await AuthService.updateOwnerType(
    request.server.prisma,
    request.user.userId,
    { ownerType, companyName, firstBoatName }
  )
  return reply.status(200).send(successResponse({
    id:        user.id,
    phone:     user.phone,
    name:      user.name,
    ownerType: user.ownerType,
  }, 'Owner role updated'))
}