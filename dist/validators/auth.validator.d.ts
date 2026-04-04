export declare const requestOTPSchema: {
    body: {
        type: string;
        required: string[];
        properties: {
            phone: {
                type: string;
                pattern: string;
                description: string;
            };
        };
        additionalProperties: boolean;
    };
};
export declare const verifyOTPSchema: {
    body: {
        type: string;
        required: string[];
        properties: {
            phone: {
                type: string;
                pattern: string;
            };
            code: {
                type: string;
                minLength: number;
                maxLength: number;
            };
        };
        additionalProperties: boolean;
    };
};
//# sourceMappingURL=auth.validator.d.ts.map