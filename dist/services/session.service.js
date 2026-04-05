"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const errors_1 = require("../utils/errors");
class SessionService {
    // ── Create (start tali) ────────────────────────────────────────────────────
    static async create(prisma, userId, data) {
        // Verify user has access to this company
        await SessionService._assertCompanyAccess(prisma, userId, data.companyId);
        // Verify the registered boat belongs to this company
        const registeredBoat = await prisma.registeredBoat.findFirst({
            where: { id: data.registeredBoatId, companyId: data.companyId, isActive: true },
        });
        if (!registeredBoat)
            throw new errors_1.NotFoundError('Registered boat');
        // Prevent duplicate if clientId already synced (offline support)
        if (data.clientId) {
            const existing = await prisma.session.findUnique({ where: { clientId: data.clientId } });
            if (existing)
                return existing;
        }
        return prisma.session.create({
            data: {
                companyId: data.companyId,
                registeredBoatId: data.registeredBoatId,
                createdById: userId,
                clientId: data.clientId,
                notes: data.notes,
            },
            include: { registeredBoat: true, company: true },
        });
    }
    // ── Get all sessions (for a company, filtered by boat, status, date) ───────
    static async getAll(prisma, userId, filters) {
        // User must access at least one company
        const whereCompany = filters.companyId
            ? { id: filters.companyId }
            : {
                OR: [
                    { ownerId: userId },
                    { memberships: { some: { userId, isActive: true } } },
                ],
            };
        const companies = await prisma.company.findMany({ where: whereCompany, select: { id: true } });
        const companyIds = companies.map((c) => c.id);
        return prisma.session.findMany({
            where: {
                companyId: { in: companyIds },
                ...(filters.boatId ? { boatId: filters.boatId } : {}),
            },
            include: {
                company: { select: { id: true, name: true } },
                registeredBoat: true,
                fishEntries: true,
                bill: { select: { id: true, status: true, finalTotal: true, billNumber: true } },
            },
            orderBy: { startTime: 'desc' },
        });
    }
    // ── Get one session ────────────────────────────────────────────────────────
    static async getOne(prisma, userId, sessionId) {
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                company: true,
                registeredBoat: true,
                fishEntries: true,
                bill: { include: { items: true } },
                createdBy: { select: { id: true, name: true, phone: true } },
            },
        });
        if (!session)
            throw new errors_1.NotFoundError('Session');
        await SessionService._assertCompanyAccess(prisma, userId, session.companyId);
        return session;
    }
    // ── End session (mark complete + save fish entries) ────────────────────────
    static async end(prisma, userId, sessionId, data) {
        const session = await prisma.session.findUnique({ where: { id: sessionId } });
        if (!session)
            throw new errors_1.NotFoundError('Session');
        if (session.status !== 'ACTIVE')
            throw new errors_1.ValidationError('Session is not active');
        await SessionService._assertCompanyAccess(prisma, userId, session.companyId);
        // Save all fish entries + mark session done in one transaction
        return prisma.$transaction(async (tx) => {
            // Delete old entries if re-syncing
            await tx.fishEntry.deleteMany({ where: { sessionId } });
            // Create all fish entries
            await tx.fishEntry.createMany({
                data: data.fishEntries.map((fe) => ({ ...fe, sessionId })),
            });
            return tx.session.update({
                where: { id: sessionId },
                data: {
                    status: 'PENDING_PRICE',
                    endTime: new Date(),
                    syncedAt: new Date(),
                },
                include: { fishEntries: true },
            });
        });
    }
    // ── Offline sync — push full session data from device ─────────────────────
    static async sync(prisma, userId, sessionId, data) {
        const session = await prisma.session.findUnique({ where: { id: sessionId } });
        if (!session)
            throw new errors_1.NotFoundError('Session');
        await SessionService._assertCompanyAccess(prisma, userId, session.companyId);
        return prisma.$transaction(async (tx) => {
            await tx.fishEntry.deleteMany({ where: { sessionId } });
            await tx.fishEntry.createMany({
                data: data.fishEntries.map((fe) => ({ ...fe, sessionId })),
            });
            return tx.session.update({
                where: { id: sessionId },
                data: {
                    status: data.fishEntries.length > 0 ? 'PENDING_PRICE' : 'ACTIVE',
                    endTime: data.endTime ? new Date(data.endTime) : undefined,
                    notes: data.notes,
                    syncedAt: new Date(),
                },
                include: { fishEntries: true },
            });
        });
    }
    // ── Helpers ────────────────────────────────────────────────────────────────
    static async _assertCompanyAccess(prisma, userId, companyId) {
        const company = await prisma.company.findUnique({
            where: { id: companyId },
            include: { memberships: { where: { userId, isActive: true } } },
        });
        if (!company)
            throw new errors_1.NotFoundError('Company');
        const hasAccess = company.ownerId === userId || company.memberships.length > 0;
        if (!hasAccess)
            throw new errors_1.UnauthorizedError('No access to this company');
        return company;
    }
}
exports.SessionService = SessionService;
