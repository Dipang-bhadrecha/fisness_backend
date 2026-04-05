"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const client_1 = require("@prisma/client");
async function prismaPlugin(fastify) {
    const prisma = new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
    });
    await prisma.$connect();
    // Attach prisma to fastify instance
    fastify.decorate('prisma', prisma);
    // Disconnect cleanly when server closes
    fastify.addHook('onClose', async () => {
        await prisma.$disconnect();
    });
}
exports.default = (0, fastify_plugin_1.default)(prismaPlugin);
