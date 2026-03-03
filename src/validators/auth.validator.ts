export const requestOTPSchema = {
  body: {
    type: 'object',
    required: ['email', 'name'],
    properties: {
      email: { type: 'string', format: 'email' },
      name:  { type: 'string', minLength: 1 },
    },
    additionalProperties: false,
  },
}

export const verifyOTPSchema = {
  body: {
    type: 'object',
    required: ['email', 'code'],
    properties: {
      email: { type: 'string', format: 'email' },
      code:  { type: 'string', minLength: 6, maxLength: 6 },
    },
    additionalProperties: false,
  },
}