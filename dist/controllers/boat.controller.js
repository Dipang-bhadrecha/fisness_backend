"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBoat = createBoat;
exports.getMyBoats = getMyBoats;
exports.updateBoat = updateBoat;
exports.deleteBoat = deleteBoat;
const boat_service_1 = require("../services/boat.service");
const response_1 = require("../utils/response");
async function createBoat(req, reply) {
    const boat = await boat_service_1.BoatService.create(req.server.prisma, req.user.userId, req.body);
    return reply.status(201).send((0, response_1.successResponse)(boat, 'Boat created'));
}
async function getMyBoats(req, reply) {
    const boats = await boat_service_1.BoatService.getAll(req.server.prisma, req.user.userId);
    return reply.send((0, response_1.successResponse)(boats));
}
async function updateBoat(req, reply) {
    const boat = await boat_service_1.BoatService.update(req.server.prisma, req.user.userId, req.params.boatId, req.body);
    return reply.send((0, response_1.successResponse)(boat, 'Boat updated'));
}
async function deleteBoat(req, reply) {
    await boat_service_1.BoatService.remove(req.server.prisma, req.user.userId, req.params.boatId);
    return reply.send((0, response_1.successResponse)(null, 'Boat deleted'));
}
//# sourceMappingURL=boat.controller.js.map