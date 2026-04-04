import { FastifyRequest, FastifyReply } from 'fastify';
export declare function createBill(req: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function getBill(req: FastifyRequest<{
    Params: {
        billId: string;
    };
}>, reply: FastifyReply): Promise<never>;
export declare function fillPrices(req: FastifyRequest<{
    Params: {
        billId: string;
    };
}>, reply: FastifyReply): Promise<never>;
export declare function confirmBill(req: FastifyRequest<{
    Params: {
        billId: string;
    };
}>, reply: FastifyReply): Promise<never>;
//# sourceMappingURL=bill.controller.d.ts.map