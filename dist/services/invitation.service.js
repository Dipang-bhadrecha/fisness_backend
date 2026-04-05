"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationService = void 0;
const errors_1 = require("../utils/errors");
function generateInviteCode() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
}
class InvitationService {
    // ── Owner sends an invite ──────────────────────────────────────────────────
    static async send(prisma, userId, data) {
        // Verify ownership
        if (data.entityType === 'COMPANY' && data.companyId) {
            const company = await prisma.company.findUnique({ where: { id: data.companyId } });
            if (!company)
                throw new errors_1.NotFoundError('Company');
            if (company.ownerId !== userId)
                throw new errors_1.UnauthorizedError('Not your company');
        }
        if (data.entityType === 'BOAT' && data.boatId) {
            const boat = await prisma.boat.findUnique({ where: { id: data.boatId } });
            if (!boat)
                throw new errors_1.NotFoundError('Boat');
            if (boat.ownerId !== userId)
                throw new errors_1.UnauthorizedError('Not your boat');
        }
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 48);
        // Use phone as email field (schema uses email but we use phone)
        return prisma.invitation.create({
            data: {
                code: generateInviteCode(),
                email: data.phone, // repurposed field — phone number
                entityType: data.entityType,
                companyId: data.companyId,
                boatId: data.boatId,
                invitedById: userId,
                expiresAt,
                defaultPermissions: data.defaultPermissions ?? [],
            },
        });
    }
    // ── Manager accepts invite with code ───────────────────────────────────────
    static async accept(prisma, userId, code) {
        const invite = await prisma.invitation.findUnique({ where: { code } });
        if (!invite)
            throw new errors_1.NotFoundError('Invitation');
        if (invite.status !== 'PENDING')
            throw new errors_1.ValidationError('Invitation is no longer valid');
        if (new Date() > invite.expiresAt) {
            await prisma.invitation.update({ where: { id: invite.id }, data: { status: 'EXPIRED' } });
            throw new errors_1.ValidationError('Invitation has expired');
        }
        return prisma.$transaction(async (tx) => {
            // Mark invite as accepted
            await tx.invitation.update({
                where: { id: invite.id },
                data: { status: 'ACCEPTED', acceptedAt: new Date() },
            });
            const permissions = invite.defaultPermissions;
            // Company invite
            if (invite.entityType === 'COMPANY' && invite.companyId) {
                const existing = await tx.companyMembership.findUnique({
                    where: { companyId_userId: { companyId: invite.companyId, userId } },
                });
                if (existing) {
                    await tx.companyMembership.update({ where: { id: existing.id }, data: { isActive: true } });
                    return { type: 'COMPANY', companyId: invite.companyId };
                }
                const membership = await tx.companyMembership.create({
                    data: {
                        companyId: invite.companyId,
                        userId,
                        permissions: {
                            create: permissions.map((p) => ({ permission: p })),
                        },
                    },
                });
                return { type: 'COMPANY', membershipId: membership.id };
            }
            // Boat invite
            if (invite.entityType === 'BOAT' && invite.boatId) {
                const existing = await tx.boatAssignment.findUnique({
                    where: { boatId_userId: { boatId: invite.boatId, userId } },
                });
                if (existing) {
                    await tx.boatAssignment.update({ where: { id: existing.id }, data: { isActive: true } });
                    return { type: 'BOAT', boatId: invite.boatId };
                }
                const assignment = await tx.boatAssignment.create({
                    data: {
                        boatId: invite.boatId,
                        userId,
                        permissions: {
                            create: permissions.map((p) => ({ permission: p })),
                        },
                    },
                });
                return { type: 'BOAT', assignmentId: assignment.id };
            }
            throw new errors_1.ValidationError('Invalid invitation type');
        });
    }
    // ── Owner revokes an invite ────────────────────────────────────────────────
    static async revoke(prisma, userId, inviteId) {
        const invite = await prisma.invitation.findUnique({ where: { id: inviteId } });
        if (!invite)
            throw new errors_1.NotFoundError('Invitation');
        if (invite.invitedById !== userId)
            throw new errors_1.UnauthorizedError('Not your invitation');
        await prisma.invitation.update({ where: { id: inviteId }, data: { status: 'REVOKED' } });
    }
}
exports.InvitationService = InvitationService;
