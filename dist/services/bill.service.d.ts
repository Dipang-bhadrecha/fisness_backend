import { PrismaClient } from '@prisma/client';
export declare class BillService {
    static create(prisma: PrismaClient, userId: string, data: {
        sessionId: string;
        sellingChargeRate?: number;
    }): Promise<{
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
    }>;
    static getOne(prisma: PrismaClient, userId: string, billId: string): Promise<{
        session: {
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
        };
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
    }>;
    static fillPrices(prisma: PrismaClient, userId: string, billId: string, data: {
        prices: Array<{
            billItemId: string;
            pricePerKg: number;
        }>;
    }): Promise<{
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
    }>;
    static confirm(prisma: PrismaClient, userId: string, billId: string): Promise<{
        session: {
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
        };
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
    }>;
    static _assertCompanyOwner(prisma: PrismaClient, userId: string, companyId: string): Promise<{
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
    static _assertCompanyAccess(prisma: PrismaClient, userId: string, companyId: string): Promise<void>;
}
//# sourceMappingURL=bill.service.d.ts.map