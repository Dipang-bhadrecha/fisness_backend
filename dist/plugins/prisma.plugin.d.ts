import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}
declare function prismaPlugin(fastify: FastifyInstance): Promise<void>;
declare const _default: typeof prismaPlugin;
export default _default;
//# sourceMappingURL=prisma.plugin.d.ts.map