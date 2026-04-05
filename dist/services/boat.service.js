"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoatService = void 0;
const errors_1 = require("../utils/errors");
class BoatService {
    static async create(prisma, userId, data) {
        return prisma.boat.create({ data: { ...data, ownerId: userId } });
    }
    static async getAll(prisma, userId) {
        return prisma.boat.findMany({
            where: { ownerId: userId, isActive: true },
            include: { _count: { select: { sessions: true } } },
        });
    }
    static async update(prisma, userId, boatId, data) {
        await BoatService._assertOwner(prisma, userId, boatId);
        return prisma.boat.update({ where: { id: boatId }, data });
    }
    static async remove(prisma, userId, boatId) {
        await BoatService._assertOwner(prisma, userId, boatId);
        await prisma.boat.update({ where: { id: boatId }, data: { isActive: false } });
    }
    static async _assertOwner(prisma, userId, boatId) {
        const boat = await prisma.boat.findUnique({ where: { id: boatId } });
        if (!boat)
            throw new errors_1.NotFoundError('Boat');
        if (boat.ownerId !== userId)
            throw new errors_1.UnauthorizedError('Not your boat');
        return boat;
    }
}
exports.BoatService = BoatService;
