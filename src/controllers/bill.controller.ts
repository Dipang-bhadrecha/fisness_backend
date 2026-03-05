import { FastifyRequest, FastifyReply } from 'fastify'
import { BillService } from '../services/bill.service'
import { successResponse } from '../utils/response'

export async function createBill(req: FastifyRequest, reply: FastifyReply) {
  const bill = await BillService.create(req.server.prisma, req.user.userId, req.body as any)
  return reply.status(201).send(successResponse(bill, 'Bill draft created'))
}

export async function getBill(
  req: FastifyRequest<{ Params: { billId: string } }>,
  reply: FastifyReply
) {
  const bill = await BillService.getOne(req.server.prisma, req.user.userId, req.params.billId)
  return reply.send(successResponse(bill))
}

export async function fillPrices(
  req: FastifyRequest<{ Params: { billId: string } }>,
  reply: FastifyReply
) {
  const bill = await BillService.fillPrices(req.server.prisma, req.user.userId, req.params.billId, req.body as any)
  return reply.send(successResponse(bill, 'Prices saved'))
}

export async function confirmBill(
  req: FastifyRequest<{ Params: { billId: string } }>,
  reply: FastifyReply
) {
  const bill = await BillService.confirm(req.server.prisma, req.user.userId, req.params.billId)
  return reply.send(successResponse(bill, 'Bill confirmed'))
}