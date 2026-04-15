export const commentSchema = {
  type: 'object',
  required: ['postId', 'id', 'name', 'email', 'body'],
  properties: {
    postId: { type: 'number' },
    id: { type: 'number' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    body: { type: 'string' },
  },
};

export const commentArraySchema = {
  type: 'array',
  items: commentSchema,
};

export const commentCreateSchema = {
  type: 'object',
  required: ['postId', 'name', 'email', 'body'],
  properties: {
    postId: { type: 'number' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    body: { type: 'string' },
  },
};
