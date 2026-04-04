import { PrismaClient } from '@prisma/client';
export declare class BoatService {
    static create(prisma: PrismaClient, userId: string, data: {
        name: string;
        nameGujarati?: string;
        registrationNumber?: string;
    }): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameGujarati: string | null;
        registrationNumber: string | null;
        ownerId: string;
    }>;
    static getAll(prisma: PrismaClient, userId: string): Promise<({
        _count: {
            sessions: number;
        };
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameGujarati: string | null;
        registrationNumber: string | null;
        ownerId: string;
    })[]>;
    static update(prisma: PrismaClient, userId: string, boatId: string, data: Partial<{
        name: string;
        nameGujarati: string;
        registrationNumber: string;
    }>): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameGujarati: string | null;
        registrationNumber: string | null;
        ownerId: string;
    }>;
    static remove(prisma: PrismaClient, userId: string, boatId: string): Promise<void>;
    static _assertOwner(prisma: PrismaClient, userId: string, boatId: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameGujarati: string | null;
        registrationNumber: string | null;
        ownerId: string;
    }>;
}
//# sourceMappingURL=boat.service.d.ts.map