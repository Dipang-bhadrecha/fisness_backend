"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = createSession;
exports.getSessions = getSessions;
exports.getSession = getSession;
exports.endSession = endSession;
exports.syncSession = syncSession;
const session_service_1 = require("../services/session.service");
const response_1 = require("../utils/response");
async function createSession(req, reply) {
    const session = await session_service_1.SessionService.create(req.server.prisma, req.user.userId, req.body);
    return reply.status(201).send((0, response_1.successResponse)(session, 'Tali session started'));
}
async function getSessions(req, reply) {
    const sessions = await session_service_1.SessionService.getAll(req.server.prisma, req.user.userId, req.query);
    return reply.send((0, response_1.successResponse)(sessions));
}
async function getSession(req, reply) {
    const session = await session_service_1.SessionService.getOne(req.server.prisma, req.user.userId, req.params.sessionId);
    return reply.send((0, response_1.successResponse)(session));
}
async function endSession(req, reply) {
    const session = await session_service_1.SessionService.end(req.server.prisma, req.user.userId, req.params.sessionId, req.body);
    return reply.send((0, response_1.successResponse)(session, 'Session ended'));
}
async function syncSession(req, reply) {
    const session = await session_service_1.SessionService.sync(req.server.prisma, req.user.userId, req.params.sessionId, req.body);
    return reply.send((0, response_1.successResponse)(session, 'Session synced'));
}
