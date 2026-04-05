"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBill = createBill;
exports.getBill = getBill;
exports.fillPrices = fillPrices;
exports.confirmBill = confirmBill;
const bill_service_1 = require("../services/bill.service");
const response_1 = require("../utils/response");
async function createBill(req, reply) {
    const bill = await bill_service_1.BillService.create(req.server.prisma, req.user.userId, req.body);
    return reply.status(201).send((0, response_1.successResponse)(bill, 'Bill draft created'));
}
async function getBill(req, reply) {
    const bill = await bill_service_1.BillService.getOne(req.server.prisma, req.user.userId, req.params.billId);
    return reply.send((0, response_1.successResponse)(bill));
}
async function fillPrices(req, reply) {
    const bill = await bill_service_1.BillService.fillPrices(req.server.prisma, req.user.userId, req.params.billId, req.body);
    return reply.send((0, response_1.successResponse)(bill, 'Prices saved'));
}
async function confirmBill(req, reply) {
    const bill = await bill_service_1.BillService.confirm(req.server.prisma, req.user.userId, req.params.billId);
    return reply.send((0, response_1.successResponse)(bill, 'Bill confirmed'));
}
