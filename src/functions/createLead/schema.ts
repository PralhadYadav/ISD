export default {
  type: "object",
  properties: {
    email: { type: 'string' },
    phone: { type: 'string' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    message: { type: 'string' },
    Id: { type: 'string' }
  },
  required: ['email', 'phone', 'first_name']
} as const;
