import { FastifyRequest, FastifyReply } from 'fastify';
export declare function sendInvitation(req: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function acceptInvitation(req: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function revokeInvitation(req: FastifyRequest<{
    Params: {
        inviteId: string;
    };
}>, reply: FastifyReply): Promise<never>;
//# sourceMappingURL=invitation.controller.d.ts.map