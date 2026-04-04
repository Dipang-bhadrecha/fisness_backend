import { FastifyRequest, FastifyReply } from 'fastify';
import { WorkspaceSetupPayload } from '../services/auth.service';
interface RequestOTPBody {
    phone: string;
}
interface VerifyOTPBody {
    phone: string;
    code: string;
}
export declare function requestOTP(request: FastifyRequest<{
    Body: RequestOTPBody;
}>, reply: FastifyReply): Promise<never>;
export declare function verifyOTP(request: FastifyRequest<{
    Body: VerifyOTPBody;
}>, reply: FastifyReply): Promise<never>;
export declare function getMe(request: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function setup(request: FastifyRequest<{
    Body: WorkspaceSetupPayload;
}>, reply: FastifyReply): Promise<never>;
export {};
//# sourceMappingURL=auth.controller.d.ts.map