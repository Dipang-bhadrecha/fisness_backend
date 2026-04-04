import { FastifyRequest, FastifyReply } from 'fastify';
export declare function createSession(req: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function getSessions(req: FastifyRequest<{
    Querystring: {
        companyId?: string;
        boatId?: string;
    };
}>, reply: FastifyReply): Promise<never>;
export declare function getSession(req: FastifyRequest<{
    Params: {
        sessionId: string;
    };
}>, reply: FastifyReply): Promise<never>;
export declare function endSession(req: FastifyRequest<{
    Params: {
        sessionId: string;
    };
}>, reply: FastifyReply): Promise<never>;
export declare function syncSession(req: FastifyRequest<{
    Params: {
        sessionId: string;
    };
}>, reply: FastifyReply): Promise<never>;
//# sourceMappingURL=session.controller.d.ts.map