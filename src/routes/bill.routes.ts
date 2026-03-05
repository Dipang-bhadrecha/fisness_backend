import { FastifyInstance } from 'fastify'
import {
  createBill, getBill, fillPrices, confirmBill
} from '../controllers/bill.controller'

export async function billRoutes(fastify: FastifyInstance) {
  const auth = { preHandler: [fastify.authenticate] }

  fastify.post('/',                    auth, createBill)   // owner creates draft bill
//   fastify.get('/:billId',              auth, getBill)      // get bill with items
//   fastify.patch('/:billId/prices',     auth, fillPrices)   // owner fills price per kg
//   fastify.patch('/:billId/confirm',    auth, confirmBill)  // lock and send
}
