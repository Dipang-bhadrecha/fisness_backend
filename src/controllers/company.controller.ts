import { FastifyRequest, FastifyReply } from 'fastify'
import { CompanyService } from '../services/company.service'
import { successResponse } from '../utils/response'

export async function createCompany(req: FastifyRequest, reply: FastifyReply) {
  const company = await CompanyService.create(req.server.prisma, req.user.userId, req.body as any)
  return reply.status(201).send(successResponse(company, 'Company created'))
}

export async function getMyCompanies(req: FastifyRequest, reply: FastifyReply) {
  const companies = await CompanyService.getAll(req.server.prisma, req.user.userId)
  return reply.send(successResponse(companies))
}

export async function getCompany(req: FastifyRequest<{ Params: { companyId: string } }>, reply: FastifyReply) {
  const company = await CompanyService.getOne(req.server.prisma, req.user.userId, req.params.companyId)
  return reply.send(successResponse(company))
}

export async function updateCompany(req: FastifyRequest<{ Params: { companyId: string } }>, reply: FastifyReply) {
  const company = await CompanyService.update(req.server.prisma, req.user.userId, req.params.companyId, req.body as any)
  return reply.send(successResponse(company, 'Company updated'))
}

export async function deleteCompany(req: FastifyRequest<{ Params: { companyId: string } }>, reply: FastifyReply) {
  await CompanyService.remove(req.server.prisma, req.user.userId, req.params.companyId)
  return reply.send(successResponse(null, 'Company deleted'))
}

export async function addRegisteredBoat(req: FastifyRequest<{ Params: { companyId: string } }>, reply: FastifyReply) {
  const boat = await CompanyService.addRegisteredBoat(req.server.prisma, req.user.userId, req.params.companyId, req.body as any)
  return reply.status(201).send(successResponse(boat, 'Boat registered'))
}

export async function getRegisteredBoats(req: FastifyRequest<{ Params: { companyId: string } }>, reply: FastifyReply) {
  const boats = await CompanyService.getRegisteredBoats(req.server.prisma, req.user.userId, req.params.companyId)
  return reply.send(successResponse(boats))
}