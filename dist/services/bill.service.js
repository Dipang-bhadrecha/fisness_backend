"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillService = void 0;
const errors_1 = require("../utils/errors");
const SELLING_CHARGE_RATE = 0.06; // 6% company commission
function generateBillNumber() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `BILL-${date}-${rand}`;
}
class BillService {
    // ── Create draft bill for a session ───────────────────────────────────────
    static async create(prisma, userId, data) {
        const session = await prisma.session.findUnique({
            where: { id: data.sessionId },
            include: { fishEntries: true },
        });
        if (!session)
            throw new errors_1.NotFoundError('Session');
        if (session.status === 'ACTIVE')
            throw new errors_1.ValidationError('Session must be ended before billing');
        if (session.status === 'BILLED')
            throw new errors_1.ConflictError('Bill already generated for this session');
        // Only company owner can generate bills
        await BillService._assertCompanyOwner(prisma, userId, session.companyId);
        if (session.fishEntries.length === 0)
            throw new errors_1.ValidationError('No fish entries in this session');
        const rate = data.sellingChargeRate ?? SELLING_CHARGE_RATE;
        return prisma.$transaction(async (tx) => {
            // Create bill with zero totals — prices filled next step
            const bill = await tx.bill.create({
                data: {
                    sessionId: data.sessionId,
                    billNumber: generateBillNumber(),
                    sellingChargeRate: rate,
                    subtotal: 0,
                    sellingCharge: 0,
                    finalTotal: 0,
                    status: 'DRAFT',
                    items: {
                        create: session.fishEntries.map((fe) => ({
                            fishEntryId: fe.id,
                            fishName: fe.fishName,
                            fishNameGujarati: fe.fishNameGujarati,
                            totalKg: fe.totalKg,
                            pricePerKg: 0, // filled by owner
                            totalAmount: 0,
                        })),
                    },
                },
                include: { items: true },
            });
            return bill;
        });
    }
    // ── Get one bill ──────────────────────────────────────────────────────────
    static async getOne(prisma, userId, billId) {
        const bill = await prisma.bill.findUnique({
            where: { id: billId },
            include: {
                items: true,
                session: {
                    include: { company: true, registeredBoat: true },
                },
            },
        });
        if (!bill)
            throw new errors_1.NotFoundError('Bill');
        await BillService._assertCompanyAccess(prisma, userId, bill.session.companyId);
        return bill;
    }
    // ── Owner fills price per kg for each fish ────────────────────────────────
    static async fillPrices(prisma, userId, billId, data) {
        const bill = await prisma.bill.findUnique({
            where: { id: billId },
            include: { items: true, session: true },
        });
        if (!bill)
            throw new errors_1.NotFoundError('Bill');
        if (bill.status === 'CONFIRMED')
            throw new errors_1.ValidationError('Bill is already confirmed');
        await BillService._assertCompanyOwner(prisma, userId, bill.session.companyId);
        return prisma.$transaction(async (tx) => {
            // Update each item's price and total
            for (const p of data.prices) {
                const item = bill.items.find((i) => i.id === p.billItemId);
                if (!item)
                    continue;
                await tx.billItem.update({
                    where: { id: p.billItemId },
                    data: {
                        pricePerKg: p.pricePerKg,
                        totalAmount: item.totalKg * p.pricePerKg,
                    },
                });
            }
            // Recalculate totals
            const updatedItems = await tx.billItem.findMany({ where: { billId } });
            const subtotal = updatedItems.reduce((s, i) => s + i.totalAmount, 0);
            const sellingCharge = subtotal * bill.sellingChargeRate;
            const finalTotal = subtotal - sellingCharge;
            return tx.bill.update({
                where: { id: billId },
                data: { subtotal, sellingCharge, finalTotal, priceFilledById: userId },
                include: { items: true },
            });
        });
    }
    // ── Confirm bill — lock it, mark session BILLED ───────────────────────────
    static async confirm(prisma, userId, billId) {
        const bill = await prisma.bill.findUnique({
            where: { id: billId },
            include: { session: true, items: true },
        });
        if (!bill)
            throw new errors_1.NotFoundError('Bill');
        if (bill.status === 'CONFIRMED')
            throw new errors_1.ConflictError('Already confirmed');
        const unpricedItems = bill.items.filter((i) => i.pricePerKg === 0);
        if (unpricedItems.length > 0)
            throw new errors_1.ValidationError('Fill all prices before confirming');
        await BillService._assertCompanyOwner(prisma, userId, bill.session.companyId);
        return prisma.$transaction(async (tx) => {
            await tx.session.update({
                where: { id: bill.sessionId },
                data: { status: 'BILLED' },
            });
            return tx.bill.update({
                where: { id: billId },
                data: { status: 'CONFIRMED', generatedAt: new Date() },
                include: { items: true, session: { include: { registeredBoat: true } } },
            });
        });
    }
    // ── Helpers ────────────────────────────────────────────────────────────────
    static async _assertCompanyOwner(prisma, userId, companyId) {
        const company = await prisma.company.findUnique({ where: { id: companyId } });
        if (!company)
            throw new errors_1.NotFoundError('Company');
        if (company.ownerId !== userId)
            throw new errors_1.UnauthorizedError('Only the company owner can manage bills');
        return company;
    }
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
    }
}
exports.BillService = BillService;
//# sourceMappingURL=bill.service.js.map