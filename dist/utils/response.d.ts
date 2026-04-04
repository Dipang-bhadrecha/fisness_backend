export declare function successResponse<T>(data: T, message?: string): {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
};
export declare function errorResponse(message: string, code?: string, details?: unknown): {
    success: boolean;
    message: string;
    code: string | undefined;
    details: unknown;
    timestamp: string;
};
export declare function paginatedResponse<T>(data: T[], total: number, page: number, limit: number): {
    success: boolean;
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasMore: boolean;
    };
    timestamp: string;
};
//# sourceMappingURL=response.d.ts.map