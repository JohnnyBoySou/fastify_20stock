import type { FastifySchema } from 'fastify';

const update: FastifySchema = {
  body: {
    type: 'object',
    required: ['name', 'email'],
    properties: {
      name: { type: 'string', minLength: 1 },
      email: { type: 'string', format: 'email' },
      phone: { type: 'string', minLength: 1 },
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
          },
          additionalProperties: false
        },
        message: { type: 'string' }
      },
      additionalProperties: false
    }
  }
};

const single: FastifySchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
          },
          additionalProperties: false
        }
      },
      additionalProperties: false
    }
  }
}

const exclude: FastifySchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
          },
          additionalProperties: false
        },
        message: { type: 'string' }
      },
      additionalProperties: false
    }
  }
}

const plan: FastifySchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        plan: {
          type: ['object', 'null'],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            interval: { type: 'string' },
            features: { type: 'array', items: { type: 'string' } },
          },
        }
      },
    }
  }
}

export const ProfileSchemas = {
  update,
  single,
  exclude,
  plan,
}