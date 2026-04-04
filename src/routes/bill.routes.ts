import { FastifyInstance } from 'fastify'
import {
  createBill, getBill, fillPrices, confirmBill
} from '../controllers/bill.controller'

export async function billRoutes(fastify: FastifyInstance) {
  const auth = { preHandler: [fastify.authenticate] }

  fastify.post('/',                                                       auth, createBill)
  fastify.get<{ Params: { billId: string } }>('/:billId',         auth, getBill)
  fastify.patch<{ Params: { billId: string } }>('/:billId/prices', auth, fillPrices)
  fastify.patch<{ Params: { billId: string } }>('/:billId/confirm', auth, confirmBill)
}
