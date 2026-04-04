import { PrismaClient } from '@prisma/client';
export declare class CompanyService {
    static create(prisma: PrismaClient, userId: string, data: {
        name: string;
        nameGujarati?: string;
        phone?: string;
        address?: string;
        gstNumber?: string;
    }): Promise<{
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
    static getAll(prisma: PrismaClient, userId: string): Promise<{
        owned: ({
            _count: {
                sessions: number;
                registeredBoats: number;
            };
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
        })[];
        memberOf: ({
            _count: {
                sessions: number;
            };
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
        })[];
    }>;
    static getOne(prisma: PrismaClient, userId: string, companyId: string): Promise<{
        memberships: ({
            user: {
                name: string | null;
                id: string;
                phone: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            companyId: string;
        })[];
        registeredBoats: {
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
    static update(prisma: PrismaClient, userId: string, companyId: string, data: Partial<{
        name: string;
        nameGujarati: string;
        phone: string;
        address: string;
        gstNumber: string;
    }>): Promise<{
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
    static remove(prisma: PrismaClient, userId: string, companyId: string): Promise<void>;
    static addRegisteredBoat(prisma: PrismaClient, userId: string, companyId: string, data: {
        name: string;
        nameGujarati?: string;
        ownerName?: string;
        ownerPhone?: string;
    }): Promise<{
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
    }>;
    static getRegisteredBoats(prisma: PrismaClient, userId: string, companyId: string): Promise<{
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
    }[]>;
    static _assertOwner(prisma: PrismaClient, userId: string, companyId: string): Promise<{
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
    static _assertAccess(prisma: PrismaClient, userId: string, companyId: string): Promise<{
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
//# sourceMappingURL=company.service.d.ts.map