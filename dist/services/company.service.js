"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const errors_1 = require("../utils/errors");
class CompanyService {
    // ── Create a company ────────────────────────────────────────────────────────
    static async create(prisma, userId, data) {
        return prisma.company.create({
            data: { ...data, ownerId: userId },
        });
    }
    // ── Get all companies for this user (owned + member of) ────────────────────
    static async getAll(prisma, userId) {
        const [owned, memberOf] = await Promise.all([
            prisma.company.findMany({
                where: { ownerId: userId, isActive: true },
                include: { _count: { select: { sessions: true, registeredBoats: true } } },
            }),
            prisma.company.findMany({
                where: {
                    memberships: { some: { userId, isActive: true } },
                    isActive: true,
                },
                include: { _count: { select: { sessions: true } } },
            }),
        ]);
        return {
            owned,
            memberOf,
        };
    }
    // ── Get one company (owner or active member) ───────────────────────────────
    static async getOne(prisma, userId, companyId) {
        const company = await prisma.company.findUnique({
            where: { id: companyId },
            include: {
                registeredBoats: { where: { isActive: true } },
                memberships: {
                    where: { isActive: true },
                    include: { user: { select: { id: true, name: true, phone: true } } },
                },
            },
        });
        if (!company)
            throw new errors_1.NotFoundError('Company');
        const isOwner = company.ownerId === userId;
        const isMember = company.memberships.some((m) => m.userId === userId);
        if (!isOwner && !isMember)
            throw new errors_1.UnauthorizedError('No access to this company');
        return company;
    }
    // ── Update (owner only) ────────────────────────────────────────────────────
    static async update(prisma, userId, companyId, data) {
        await CompanyService._assertOwner(prisma, userId, companyId);
        return prisma.company.update({ where: { id: companyId }, data });
    }
    // ── Soft delete (owner only) ───────────────────────────────────────────────
    static async remove(prisma, userId, companyId) {
        await CompanyService._assertOwner(prisma, userId, companyId);
        await prisma.company.update({ where: { id: companyId }, data: { isActive: false } });
    }
    // ── Add a registered boat ──────────────────────────────────────────────────
    static async addRegisteredBoat(prisma, userId, companyId, data) {
        await CompanyService._assertOwner(prisma, userId, companyId);
        const existing = await prisma.registeredBoat.findUnique({
            where: { companyId_name: { companyId, name: data.name } },
        });
        if (existing)
            throw new errors_1.ConflictError(`Boat "${data.name}" already registered`);
        return prisma.registeredBoat.create({
            data: { ...data, companyId },
        });
    }
    // ── Get registered boats ───────────────────────────────────────────────────
    static async getRegisteredBoats(prisma, userId, companyId) {
        await CompanyService._assertAccess(prisma, userId, companyId);
        return prisma.registeredBoat.findMany({
            where: { companyId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    // ── Helpers ────────────────────────────────────────────────────────────────
    static async _assertOwner(prisma, userId, companyId) {
        const company = await prisma.company.findUnique({ where: { id: companyId } });
        if (!company)
            throw new errors_1.NotFoundError('Company');
        if (company.ownerId !== userId)
            throw new errors_1.UnauthorizedError('Only the owner can do this');
        return company;
    }
    static async _assertAccess(prisma, userId, companyId) {
        const company = await prisma.company.findUnique({
            where: { id: companyId },
            include: { memberships: { where: { userId, isActive: true } } },
        });
        if (!company)
            throw new errors_1.NotFoundError('Company');
        const isOwner = company.ownerId === userId;
        const isMember = company.memberships.length > 0;
        if (!isOwner && !isMember)
            throw new errors_1.UnauthorizedError('No access to this company');
        return company;
    }
}
exports.CompanyService = CompanyService;
//# sourceMappingURL=company.service.js.map