"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boatRoutes = boatRoutes;
const boat_controller_1 = require("../controllers/boat.controller");
async function boatRoutes(fastify) {
    const auth = { preHandler: [fastify.authenticate] };
    fastify.post('/', auth, boat_controller_1.createBoat);
    fastify.get('/', auth, boat_controller_1.getMyBoats);
    fastify.get('/archived', auth, boat_controller_1.getArchivedBoats);
    fastify.put('/:boatId', auth, boat_controller_1.updateBoat);
    fastify.delete('/:boatId', auth, boat_controller_1.deleteBoat);
    fastify.patch('/:boatId/restore', auth, boat_controller_1.restoreBoat);
}
