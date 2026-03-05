import { FastifyInstance } from 'fastify'
import {
  createCompany, getMyCompanies, getCompany,
  updateCompany, deleteCompany,
  addRegisteredBoat, getRegisteredBoats,
} from '../controllers/company.controller'

export async function companyRoutes(fastify: FastifyInstance) {
  const auth = { preHandler: [fastify.authenticate] }

  fastify.post('/',               auth, createCompany)
  fastify.get('/',                auth, getMyCompanies)
  fastify.get('/:companyId',      auth, getCompany)
  fastify.patch('/:companyId',    auth, updateCompany)
  fastify.delete('/:companyId',   auth, deleteCompany)

  // Registered boats (boats pre-registered to arrive at this company)
  fastify.post('/:companyId/registered-boats',  auth, addRegisteredBoat)
  fastify.get('/:companyId/registered-boats',   auth, getRegisteredBoats)
}



// POST/api/v1/companies      Create company
// GET/api/v1/companies       My companies
// GET/api/v1/companies/:id/  registered-boatsBoats at company