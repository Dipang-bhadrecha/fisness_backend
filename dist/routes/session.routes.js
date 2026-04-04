"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRoutes = sessionRoutes;
const session_controller_1 = require("../controllers/session.controller");
async function sessionRoutes(fastify) {
    const auth = { preHandler: [fastify.authenticate] };
    fastify.post('/', auth, session_controller_1.createSession); // start tali
    fastify.get('/', auth, session_controller_1.getSessions); // list sessions for a company
    fastify.get('/:sessionId', auth, session_controller_1.getSession); // get one session
    fastify.patch('/:sessionId/end', auth, session_controller_1.endSession); // finish tali
    fastify.post('/:sessionId/sync', auth, session_controller_1.syncSession); // offline sync push
}
//# sourceMappingURL=session.routes.js.map