"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
async function jwtPlugin(fastify) {
    fastify.register(jwt_1.default, {
        secret: process.env.JWT_SECRET ?? 'fallback-secret',
        sign: {
            expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
        },
    });
    fastify.decorate('authenticate', async (request, reply) => {
        try {
            await request.jwtVerify();
        }
        catch {
            reply.status(401).send({
                success: false,
                error: 'Invalid or expired token',
            });
        }
    });
}
exports.default = (0, fastify_plugin_1.default)(jwtPlugin);
