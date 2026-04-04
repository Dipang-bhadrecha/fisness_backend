"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const prisma_plugin_1 = __importDefault(require("./plugins/prisma.plugin"));
const jwt_plugin_1 = __importDefault(require("./plugins/jwt.plugin"));
const auth_routes_1 = require("./routes/auth.routes");
const company_routes_1 = require("./routes/company.routes");
const boat_routes_1 = require("./routes/boat.routes");
const session_routes_1 = require("./routes/session.routes");
const bill_routes_1 = require("./routes/bill.routes");
const invitation_routes_1 = require("./routes/invitation.routes");
const response_1 = require("./utils/response");
const errors_1 = require("./utils/errors");
const sms_service_1 = require("./services/sms.service");
async function buildApp() {
    const isDev = process.env.NODE_ENV === 'development';
    const fastify = (0, fastify_1.default)({
        logger: isDev
            ? {
                level: 'debug',
                transport: {
                    target: 'pino-pretty',
                    options: { colorize: true },
                },
            }
            : {
                level: 'info',
            },
    });
    // ── Security plugins ────────────────────────────────────────────────────────
    await fastify.register(helmet_1.default);
    await fastify.register(cors_1.default, {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    });
    await fastify.register(rate_limit_1.default, {
        global: true,
        max: 100,
        timeWindow: '1 minute',
    });
    // ── App plugins ─────────────────────────────────────────────────────────────
    await fastify.register(prisma_plugin_1.default);
    await fastify.register(jwt_plugin_1.default);
    await (0, sms_service_1.verifySmsService)();
    // ── Global error handler ────────────────────────────────────────────────────
    fastify.setErrorHandler(async (error, request, reply) => {
        request.log.error({ error, url: request.url }, 'Request error');
        if (error instanceof errors_1.AppError) {
            return reply.status(error.statusCode).send((0, response_1.errorResponse)(error.message, error.code));
        }
        // Prisma not found
        if (error.code === 'P2025') {
            return reply.status(404).send((0, response_1.errorResponse)('Record not found', 'NOT_FOUND'));
        }
        // Prisma unique constraint
        if (error.code === 'P2002') {
            return reply.status(409).send((0, response_1.errorResponse)('Record already exists', 'CONFLICT'));
        }
        // Fastify validation error
        if (error.statusCode === 400) {
            return reply.status(400).send((0, response_1.errorResponse)('Invalid request data', 'VALIDATION_ERROR', error.message));
        }
        return reply.status(500).send((0, response_1.errorResponse)('Internal server error', 'SERVER_ERROR'));
    });
    // ── Health check ────────────────────────────────────────────────────────────
    fastify.get('/health', async () => ({
        status: 'ok',
        service: 'matsyakosh-api',
        timestamp: new Date().toISOString(),
    }));
    // ── Routes ──────────────────────────────────────────────────────────────────
    fastify.register(auth_routes_1.authRoutes, { prefix: '/api/v1/auth' });
    fastify.register(company_routes_1.companyRoutes, { prefix: '/api/v1/companies' });
    fastify.register(boat_routes_1.boatRoutes, { prefix: '/api/v1/boats' });
    fastify.register(session_routes_1.sessionRoutes, { prefix: '/api/v1/sessions' });
    fastify.register(bill_routes_1.billRoutes, { prefix: '/api/v1/bills' });
    fastify.register(invitation_routes_1.invitationRoutes, { prefix: '/api/v1/invitations' });
    return fastify;
}
//# sourceMappingURL=app.js.map