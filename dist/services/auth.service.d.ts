import { PrismaClient } from '@prisma/client';
export interface WorkspaceSetupPayload {
    primaryRole: 'owner' | 'manager' | 'both';
    ownerType?: 'company' | 'personal' | 'both';
    companyName?: string;
    firstBoatName?: string;
    boatRegistration?: string;
    ownerPhone?: string;
}
export interface WorkspaceResult {
    id: string;
    type: 'company' | 'personal' | 'manager_access';
    name: string;
    role: 'owner' | 'manager';
    permissions: string[];
}
export declare class AuthService {
    static requestOTP(prisma: PrismaClient, phone: string): Promise<{
        isNewUser: boolean;
        phone: string;
    }>;
    static verifyOTP(prisma: PrismaClient, phone: string, code: string): Promise<{
        name: string | null;
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static getMe(prisma: PrismaClient, userId: string): Promise<{
        ownedBoats: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameGujarati: string | null;
            registrationNumber: string | null;
            ownerId: string;
        }[];
        ownedCompanies: {
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
        }[];
        boatAssignments: ({
            boat: {
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                nameGujarati: string | null;
                registrationNumber: string | null;
                ownerId: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            boatId: string;
            userId: string;
        })[];
        companyMemberships: ({
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
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            companyId: string;
        })[];
    } & {
        name: string | null;
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /** Setup workspace after first login: create company + first registered boat */
    static setup(prisma: PrismaClient, userId: string, payload: WorkspaceSetupPayload): Promise<WorkspaceResult[]>;
}
//# sourceMappingURL=auth.service.d.ts.map