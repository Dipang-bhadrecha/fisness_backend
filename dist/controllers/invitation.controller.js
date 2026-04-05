"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInvitation = sendInvitation;
exports.acceptInvitation = acceptInvitation;
exports.revokeInvitation = revokeInvitation;
const invitation_service_1 = require("../services/invitation.service");
const response_1 = require("../utils/response");
async function sendInvitation(req, reply) {
    const invite = await invitation_service_1.InvitationService.send(req.server.prisma, req.user.userId, req.body);
    return reply.status(201).send((0, response_1.successResponse)(invite, 'Invitation sent'));
}
async function acceptInvitation(req, reply) {
    const result = await invitation_service_1.InvitationService.accept(req.server.prisma, req.user.userId, req.body.code);
    return reply.send((0, response_1.successResponse)(result, 'Invitation accepted'));
}
async function revokeInvitation(req, reply) {
    await invitation_service_1.InvitationService.revoke(req.server.prisma, req.user.userId, req.params.inviteId);
    return reply.send((0, response_1.successResponse)(null, 'Invitation revoked'));
}
