import { FastifyInstance } from 'fastify'
import {
  createCompany, getMyCompanies, getCompany,
  updateCompany, deleteCompany,
  addRegisteredBoat, getRegisteredBoats,
} from '../controllers/company.controller'

export async function companyRoutes(fastify: FastifyInstance) {
  const auth = { preHandler: [fastify.authenticate] }

  fastify.get('/',                                                               auth, getMyCompanies)
  fastify.post('/',                                                              auth, createCompany)

fastify.get<{ Params: { companyId: string } }>('/:companyId', auth, getCompany)
fastify.patch<{ Params: { companyId: string } }>('/:companyId', auth, updateCompany)
fastify.delete<{ Params: { companyId: string } }>('/:companyId', auth, deleteCompany)

fastify.post<{ Params: { companyId: string } }>('/:companyId/registered-boats', auth, addRegisteredBoat)
fastify.get<{ Params: { companyId: string } }>('/:companyId/registered-boats', auth, getRegisteredBoats)
}

