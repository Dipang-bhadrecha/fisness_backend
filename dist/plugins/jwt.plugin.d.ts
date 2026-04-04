import { FastifyInstance } from 'fastify';
declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: {
            userId: string;
            phone: string;
        };
    }
}
declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}
declare function jwtPlugin(fastify: FastifyInstance): Promise<void>;
declare const _default: typeof jwtPlugin;
export default _default;
//# sourceMappingURL=jwt.plugin.d.ts.map