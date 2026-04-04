import { FastifyRequest, FastifyReply } from 'fastify';
export declare function createBoat(req: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function getMyBoats(req: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function updateBoat(req: FastifyRequest<{
    Params: {
        boatId: string;
    };
}>, reply: FastifyReply): Promise<never>;
export declare function deleteBoat(req: FastifyRequest<{
    Params: {
        boatId: string;
    };
}>, reply: FastifyReply): Promise<never>;
//# sourceMappingURL=boat.controller.d.ts.map