"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestOTP = requestOTP;
exports.verifyOTP = verifyOTP;
exports.getMe = getMe;
exports.setup = setup;
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
async function requestOTP(request, reply) {
    const { phone } = request.body;
    const result = await auth_service_1.AuthService.requestOTP(request.server.prisma, phone);
    return reply.status(200).send((0, response_1.successResponse)(result, 'OTP sent to your phone'));
}
async function verifyOTP(request, reply) {
    const { phone, code } = request.body;
    const user = await auth_service_1.AuthService.verifyOTP(request.server.prisma, phone, code);
    const token = await reply.jwtSign({
        userId: user.id,
        phone: user.phone,
    });
    return reply.status(200).send((0, response_1.successResponse)({
        token,
        user: {
            id: user.id,
            phone: user.phone,
            name: user.name,
            isNewUser: !user.name, // if no name set yet — new user
        },
    }, 'Login successful'));
}
async function getMe(request, reply) {
    const user = await auth_service_1.AuthService.getMe(request.server.prisma, request.user.userId);
    return reply.status(200).send((0, response_1.successResponse)(user));
}
async function setup(request, reply) {
    const workspaces = await auth_service_1.AuthService.setup(request.server.prisma, request.user.userId, request.body);
    return reply.status(200).send((0, response_1.successResponse)({ workspaces }, 'Setup complete'));
}
//# sourceMappingURL=auth.controller.js.map