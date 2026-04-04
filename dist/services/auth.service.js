"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const sms_service_1 = require("./sms.service");
const company_service_1 = require("./company.service");
const errors_1 = require("../utils/errors");
function generateOTPCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function getOTPExpiry() {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);
    return expiry;
}
class AuthService {
    // requestOTP — remove OTP DB logic, just call sendOTPSms(phone)
    static async requestOTP(prisma, phone) {
        let user = await prisma.user.findUnique({ where: { phone } });
        const isNewUser = !user;
        if (!user)
            user = await prisma.user.create({ data: { phone } });
        // Twilio manages OTP — no DB record needed
        await (0, sms_service_1.sendOTPSms)(phone);
        return { isNewUser, phone };
    }
    // verifyOTP — replace DB lookup with Twilio check
    static async verifyOTP(prisma, phone, code) {
        const approved = await (0, sms_service_1.verifyOTPSms)(phone, code);
        if (!approved)
            throw new errors_1.ValidationError('Invalid or expired OTP code. Please check the code or request a new one.');
        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user)
            throw new errors_1.NotFoundError('User');
        if (!user.isActive)
            throw new errors_1.ValidationError('Account is disabled');
        return user;
    }
    // Get current user profile with all contexts
    static async getMe(prisma, userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                ownedBoats: {
                    where: { isActive: true },
                },
                ownedCompanies: {
                    where: { isActive: true },
                },
                boatAssignments: {
                    where: { isActive: true },
                    include: { boat: true },
                },
                companyMemberships: {
                    where: { isActive: true },
                    include: { company: true },
                },
            },
        });
        if (!user)
            throw new errors_1.NotFoundError('User');
        return user;
    }
    /** Setup workspace after first login: create company + first registered boat */
    static async setup(prisma, userId, payload) {
        const workspaces = [];
        if ((payload.primaryRole === 'owner' || payload.primaryRole === 'both') &&
            payload.companyName) {
            const company = await company_service_1.CompanyService.create(prisma, userId, {
                name: payload.companyName,
            });
            workspaces.push({
                id: company.id,
                type: 'company',
                name: company.name,
                role: 'owner',
                permissions: [],
            });
            if (payload.firstBoatName) {
                await company_service_1.CompanyService.addRegisteredBoat(prisma, userId, company.id, {
                    name: payload.firstBoatName,
                    ownerPhone: payload.boatRegistration ?? undefined,
                });
            }
        }
        return workspaces;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map