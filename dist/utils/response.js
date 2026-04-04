"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
exports.paginatedResponse = paginatedResponse;
function successResponse(data, message) {
    return {
        success: true,
        message: message ?? 'OK',
        data,
        timestamp: new Date().toISOString(),
    };
}
function errorResponse(message, code, details) {
    return {
        success: false,
        message,
        code,
        details,
        timestamp: new Date().toISOString(),
    };
}
function paginatedResponse(data, total, page, limit) {
    return {
        success: true,
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasMore: page * limit < total,
        },
        timestamp: new Date().toISOString(),
    };
}
//# sourceMappingURL=response.js.map