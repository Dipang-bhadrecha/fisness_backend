"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invitationRoutes = invitationRoutes;
const invitation_controller_1 = require("../controllers/invitation.controller");
async function invitationRoutes(fastify) {
    const auth = { preHandler: [fastify.authenticate] };
    fastify.post('/', auth, invitation_controller_1.sendInvitation); // owner sends invite
    fastify.post('/accept', auth, invitation_controller_1.acceptInvitation); // manager accepts with code
    fastify.delete('/:inviteId', auth, invitation_controller_1.revokeInvitation); // owner revokes
}
//# sourceMappingURL=invitation.routes.js.map