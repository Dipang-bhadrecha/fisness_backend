"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billRoutes = billRoutes;
const bill_controller_1 = require("../controllers/bill.controller");
async function billRoutes(fastify) {
    const auth = { preHandler: [fastify.authenticate] };
    fastify.post('/', auth, bill_controller_1.createBill);
    fastify.get('/:billId', auth, bill_controller_1.getBill);
    fastify.patch('/:billId/prices', auth, bill_controller_1.fillPrices);
    fastify.patch('/:billId/confirm', auth, bill_controller_1.confirmBill);
}
