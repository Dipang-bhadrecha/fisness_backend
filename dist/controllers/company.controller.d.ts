import { FastifyRequest, FastifyReply } from 'fastify';
export declare function createCompany(req: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function getMyCompanies(req: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function getCompany(req: FastifyRequest<{
    Params: {
        companyId: string;
    };
}>, reply: FastifyReply): Promise<never>;
export declare function updateCompany(req: FastifyRequest<{
    Params: {
        companyId: string;
    };
}>, reply: FastifyReply): Promise<never>;
export declare function deleteCompany(req: FastifyRequest<{
    Params: {
        companyId: string;
    };
}>, reply: FastifyReply): Promise<never>;
export declare function addRegisteredBoat(req: FastifyRequest<{
    Params: {
        companyId: string;
    };
}>, reply: FastifyReply): Promise<never>;
export declare function getRegisteredBoats(req: FastifyRequest<{
    Params: {
        companyId: string;
    };
}>, reply: FastifyReply): Promise<never>;
//# sourceMappingURL=company.controller.d.ts.map