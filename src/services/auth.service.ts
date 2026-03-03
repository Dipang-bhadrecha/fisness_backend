import { PrismaClient } from '@prisma/client'
import { sendOTPEmail } from './email.service'
import { ValidationError, NotFoundError } from '../utils/errors'

// ── Helpers ───────────────────────────────────────────────────────

function generateOTPCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

function getOTPExpiry(): Date {
    const expiry = new Date()
    expiry.setMinutes(expiry.getMinutes() + 10)
    return expiry
}

// ── Auth Service ──────────────────────────────────────────────────

export class AuthService {

    // Step 1 — Request OTP
    // Creates user if first time, sends OTP to email
    static async requestOTP(
        prisma: PrismaClient,
        email: string,
        name: string
    ) {
        // Find or create user
        // If user exists — update name in case they changed it
        let user = await prisma.user.findUnique({
            where: { email },
        })

        const isNewUser = !user

        if (!user) {
            // First time — create user
            user = await prisma.user.create({
                data: { email, name },
            })
        } else {
            // Already exists — update name if different
            if (user.name !== name) {
                user = await prisma.user.update({
                    where: { email },
                    data: { name },
                })
            }
        }

        // Invalidate all previous unused OTPs for this email
        await prisma.oTP.updateMany({
            where: { email, isUsed: false },
            data: { isUsed: true },
        })

        // Create fresh OTP
        const code = generateOTPCode()
        await prisma.oTP.create({
            data: {
                email,
                code,
                userId: user.id,
                expiresAt: getOTPExpiry(),
            },
        })

        // Send email
        await sendOTPEmail(email, user.name, code)

        return { isNewUser, email }
    }

    // Step 2 — Verify OTP → return user
    static async verifyOTP(
        prisma: PrismaClient,
        email: string,
        code: string
    ) {
        // Find latest unused OTP for this email
        const otp = await prisma.oTP.findFirst({
            where: {
                email,
                code,
                isUsed: false,
            },
            orderBy: { createdAt: 'desc' },
        })

        if (!otp) {
            throw new ValidationError('Invalid OTP code')
        }

        if (new Date() > otp.expiresAt) {
            throw new ValidationError('OTP has expired — request a new one')
        }

        // Mark OTP as used — never reusable
        await prisma.oTP.update({
            where: { id: otp.id },
            data: { isUsed: true },
        })

        // Get full user
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) throw new NotFoundError('User')
        if (!user.isActive) throw new ValidationError('Account is disabled')

        return user
    }

    // Get current user profile
    static async getMe(prisma: PrismaClient, userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                ownedBoats: true,
                ownedCompanies: true,
                boatAssignments: {
                    where: { isActive: true },
                    include: { boat: true },
                },
                companyMemberships: {
                    where: { isActive: true },
                    include: { company: true },
                },
            },
        })

        if (!user) throw new NotFoundError('User')
        return user
    }
}