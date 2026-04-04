import { PrismaClient } from '@prisma/client';
export declare class SessionService {
    static create(prisma: PrismaClient, userId: string, data: {
        companyId: string;
        registeredBoatId: string;
        clientId?: string;
        notes?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        boatId: string | null;
        companyId: string;
        registeredBoatId: string;
        createdById: string;
        status: import(".prisma/client").$Enums.SessionStatus;
        startTime: Date;
        endTime: Date | null;
        notes: string | null;
        clientId: string | null;
        syncedAt: Date | null;
    }>;
    static getAll(prisma: PrismaClient, userId: string, filters: {
        companyId?: string;
        boatId?: string;
    }): Promise<({
        company: {
            name: string;
            id: string;
        };
        registeredBoat: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameGujarati: string | null;
            companyId: string;
            ownerName: string | null;
            ownerPhone: string | null;
            appBoatId: string | null;
        };
        bill: {
            id: string;
            status: import(".prisma/client").$Enums.BillStatus;
            billNumber: string;
            finalTotal: number;
        } | null;
        fishEntries: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            fishId: string;
            fishName: string;
            fishNameGujarati: string | null;
            bucketWeight: number;
            totalKg: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        boatId: string | null;
        companyId: string;
        registeredBoatId: string;
        createdById: string;
        status: import(".prisma/client").$Enums.SessionStatus;
        startTime: Date;
        endTime: Date | null;
        notes: string | null;
        clientId: string | null;
        syncedAt: Date | null;
    })[]>;
    static getOne(prisma: PrismaClient, userId: string, sessionId: string): Promise<{
        company: {
            name: string;
            id: string;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameGujarati: string | null;
            ownerId: string;
            address: string | null;
            gstNumber: string | null;
        };
        registeredBoat: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameGujarati: string | null;
            companyId: string;
            ownerName: string | null;
            ownerPhone: string | null;
            appBoatId: string | null;
        };
        bill: ({
            items: {
                id: string;
                createdAt: Date;
                fishName: string;
                fishNameGujarati: string | null;
                totalKg: number;
                billId: string;
                fishEntryId: string;
                pricePerKg: number;
                totalAmount: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.BillStatus;
            sessionId: string;
            billNumber: string;
            subtotal: number;
            sellingCharge: number;
            sellingChargeRate: number;
            finalTotal: number;
            priceFilledById: string | null;
            sentViaWhatsApp: boolean;
            whatsappSentAt: Date | null;
            generatedAt: Date;
        }) | null;
        createdBy: {
            name: string | null;
            id: string;
            phone: string;
        };
        fishEntries: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            fishId: string;
            fishName: string;
            fishNameGujarati: string | null;
            bucketWeight: number;
            totalKg: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        boatId: string | null;
        companyId: string;
        registeredBoatId: string;
        createdById: string;
        status: import(".prisma/client").$Enums.SessionStatus;
        startTime: Date;
        endTime: Date | null;
        notes: string | null;
        clientId: string | null;
        syncedAt: Date | null;
    }>;
    static end(prisma: PrismaClient, userId: string, sessionId: string, data: {
        fishEntries: Array<{
            fishId: string;
            fishName: string;
            fishNameGujarati?: string;
            bucketWeight: number;
            totalKg: number;
        }>;
    }): Promise<{
        fishEntries: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            fishId: string;
            fishName: string;
            fishNameGujarati: string | null;
            bucketWeight: number;
            totalKg: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        boatId: string | null;
        companyId: string;
        registeredBoatId: string;
        createdById: string;
        status: import(".prisma/client").$Enums.SessionStatus;
        startTime: Date;
        endTime: Date | null;
        notes: string | null;
        clientId: string | null;
        syncedAt: Date | null;
    }>;
    static sync(prisma: PrismaClient, userId: string, sessionId: string, data: {
        fishEntries: Array<{
            fishId: string;
            fishName: string;
            fishNameGujarati?: string;
            bucketWeight: number;
            totalKg: number;
        }>;
        endTime?: string;
        notes?: string;
    }): Promise<{
        fishEntries: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            fishId: string;
            fishName: string;
            fishNameGujarati: string | null;
            bucketWeight: number;
            totalKg: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        boatId: string | null;
        companyId: string;
        registeredBoatId: string;
        createdById: string;
        status: import(".prisma/client").$Enums.SessionStatus;
        startTime: Date;
        endTime: Date | null;
        notes: string | null;
        clientId: string | null;
        syncedAt: Date | null;
    }>;
    static _assertCompanyAccess(prisma: PrismaClient, userId: string, companyId: string): Promise<{
        memberships: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            companyId: string;
        }[];
    } & {
        name: string;
        id: string;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameGujarati: string | null;
        ownerId: string;
        address: string | null;
        gstNumber: string | null;
    }>;
}
//# sourceMappingURL=session.service.d.ts.map