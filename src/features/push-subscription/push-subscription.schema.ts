import type { FastifySchema } from 'fastify'

export const createPushSubscriptionSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['endpoint', 'keys'],
    properties: {
      endpoint: { type: 'string' },
      keys: {
        type: 'object',
        required: ['p256dh', 'auth'],
        properties: {
          p256dh: { type: 'string' },
          auth: { type: 'string' },
        },
      },
      userAgent: { type: 'string' },
      deviceInfo: {},
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        endpoint: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

export const deletePushSubscriptionSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  response: {
    204: { type: 'null' },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

export const listPushSubscriptionsSchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'number', minimum: 1 },
      limit: { type: 'number', minimum: 1, maximum: 100 },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        items: { type: 'array' },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

export const getVapidKeySchema: FastifySchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        publicKey: { type: 'string' },
      },
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

export const PushSubscriptionSchemas = {
  create: createPushSubscriptionSchema,
  delete: deletePushSubscriptionSchema,
  list: listPushSubscriptionsSchema,
  getVapidKey: getVapidKeySchema,
}
