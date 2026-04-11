"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMeSchema = exports.verifyOTPSchema = exports.requestOTPSchema = void 0;
exports.requestOTPSchema = {
    body: {
        type: 'object',
        required: ['phone'],
        properties: {
            phone: {
                type: 'string',
                pattern: '^[6-9][0-9]{9}$', // Indian 10 digit validation
                description: 'Indian mobile number — 10 digits starting with 6-9'
            },
        },
        additionalProperties: false,
    },
};
exports.verifyOTPSchema = {
    body: {
        type: 'object',
        required: ['phone', 'code'],
        properties: {
            phone: {
                type: 'string',
                pattern: '^[6-9][0-9]{9}$',
            },
            code: {
                type: 'string',
                minLength: 6,
                maxLength: 6,
            },
        },
        additionalProperties: false,
    },
};
exports.updateMeSchema = {
    body: {
        type: 'object',
        required: ['name'],
        properties: {
            name: { type: 'string', minLength: 2, maxLength: 50 },
        },
        additionalProperties: false,
    },
};
