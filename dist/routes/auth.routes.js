"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const auth_controller_1 = require("../controllers/auth.controller");
const auth_validator_1 = require("../validators/auth.validator");
async function authRoutes(fastify) {
    // Public
    fastify.post('/request-otp', {
        schema: auth_validator_1.requestOTPSchema,
        config: {
            rateLimit: { max: 5, timeWindow: '15 minutes' }
        }
    }, auth_controller_1.requestOTP);
    fastify.post('/verify-otp', {
        schema: auth_validator_1.verifyOTPSchema,
        config: {
            rateLimit: { max: 5, timeWindow: '5 minutes' }
        }
    }, auth_controller_1.verifyOTP);
    // Protected
    fastify.get('/me', {
        preHandler: [fastify.authenticate]
    }, auth_controller_1.getMe);
    fastify.patch('/me', {
        schema: auth_validator_1.updateMeSchema,
        preHandler: [fastify.authenticate]
    }, auth_controller_1.updateMe);
    fastify.post('/setup', {
        preHandler: [fastify.authenticate]
    }, auth_controller_1.setup);
}
