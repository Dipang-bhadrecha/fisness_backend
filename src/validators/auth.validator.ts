export const requestOTPSchema = {
  body: {
    type: 'object',
    required: ['phone'],
    properties: {
      phone: {
        type: 'string',
        pattern: '^[6-9][0-9]{9}$',  // Indian 10 digit validation
        description: 'Indian mobile number — 10 digits starting with 6-9'
      },
    },
    additionalProperties: false,
  },
}

export const verifyOTPSchema = {
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
}