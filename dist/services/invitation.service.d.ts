import { PrismaClient } from '@prisma/client';
export declare class InvitationService {
    static send(prisma: PrismaClient, userId: string, data: {
        phone: string;
        entityType: 'BOAT' | 'COMPANY';
        companyId?: string;
        boatId?: string;
        defaultPermissions?: string[];
    }): Promise<{
        id: string;
        createdAt: Date;
        boatId: string | null;
        companyId: string | null;
        code: string;
        expiresAt: Date;
        status: import(".prisma/client").$Enums.InvitationStatus;
        email: string;
        entityType: import(".prisma/client").$Enums.EntityType;
        invitedById: string;
        acceptedAt: Date | null;
        defaultPermissions: import("@prisma/client/runtime/library").JsonValue;
    }>;
    static accept(prisma: PrismaClient, userId: string, code: string): Promise<{
        type: string;
        companyId: string;
        membershipId?: undefined;
        boatId?: undefined;
        assignmentId?: undefined;
    } | {
        type: string;
        membershipId: string;
        companyId?: undefined;
        boatId?: undefined;
        assignmentId?: undefined;
    } | {
        type: string;
        boatId: string;
        companyId?: undefined;
        membershipId?: undefined;
        assignmentId?: undefined;
    } | {
        type: string;
        assignmentId: string;
        companyId?: undefined;
        membershipId?: undefined;
        boatId?: undefined;
    }>;
    static revoke(prisma: PrismaClient, userId: string, inviteId: string): Promise<void>;
}
//# sourceMappingURL=invitation.service.d.ts.map