import { FastifySchema } from 'fastify';

export const CreateCheckoutSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['productId'],
    properties: {
      productId: {
        type: 'string',
        format: 'uuid',
        description: 'ID do produto Polar'
      }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        url: { type: 'string' },
        product_id: { type: 'string' },
        customer_id: { type: 'string', nullable: true }
      }
    },
    401: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
};

export const ListPolarSchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: {
        type: 'number',
        minimum: 1,
        default: 1
      },
      limit: {
        type: 'number',
        minimum: 1,
        maximum: 100,
        default: 10
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: { type: 'object' }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
          },
          required: ['page', 'limit']
        }
      },
      required: ['items', 'pagination']
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
};

export const PolarSchemas = {
  createCheckout: CreateCheckoutSchema,
  list: ListPolarSchema
};
