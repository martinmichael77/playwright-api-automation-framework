export const userSchema = {
  type: 'object',
  required: ['id', 'name', 'email', 'phone', 'website', 'username'],
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    username: { type: 'string' },
    email: { type: 'string', format: 'email' },
    address: {
      type: 'object',
      properties: {
        street: { type: 'string' },
        suite: { type: 'string' },
        city: { type: 'string' },
        zipcode: { type: 'string' },
        geo: {
          type: 'object',
          properties: {
            lat: { type: 'string' },
            lng: { type: 'string' },
          },
        },
      },
    },
    phone: { type: 'string' },
    website: { type: 'string' },
    company: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        catchPhrase: { type: 'string' },
        bs: { type: 'string' },
      },
    },
  },
};

export const userArraySchema = {
  type: 'array',
  items: userSchema,
};
