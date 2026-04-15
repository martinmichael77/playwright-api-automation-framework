export const postSchema = {
  type: 'object',
  required: ['userId', 'id', 'title', 'body'],
  properties: {
    userId: { type: 'number' },
    id: { type: 'number' },
    title: { type: 'string' },
    body: { type: 'string' },
  },
};

export const postArraySchema = {
  type: 'array',
  items: postSchema,
};

export const postCreateSchema = {
  type: 'object',
  required: ['title', 'body', 'userId'],
  properties: {
    title: { type: 'string' },
    body: { type: 'string' },
    userId: { type: 'number' },
  },
};
