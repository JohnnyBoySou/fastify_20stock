import { FastifyInstance } from 'fastify';
import { WebhookController } from './webhook.controller';

export async function WebhookRoutes(fastify: FastifyInstance) {
  // Webhooks específicos dos gateways
  fastify.post('/abacate-pay', {
    config: {
      // Configurações específicas para webhooks
      rawBody: true // Para preservar o body original para verificação de assinatura
    },
    handler: WebhookController.processAbacatePay
  });

  fastify.post('/stripe', {
    config: {
      rawBody: true
    },
    handler: WebhookController.processStripe
  });

  // Webhook genérico para outros gateways
  fastify.post('/:gateway', {
    config: {
      rawBody: true
    },
    handler: WebhookController.processGeneric
  });

  // Endpoints administrativos (requerem autenticação)
  fastify.get('/logs', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          gateway: { type: 'string' },
          eventType: { type: 'string' },
          success: { type: 'boolean' },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  gateway: { type: 'string' },
                  eventType: { type: 'string' },
                  eventId: { type: 'string', nullable: true },
                  success: { type: 'boolean' },
                  payload: { type: 'object' },
                  response: { type: 'object', nullable: true },
                  error: { type: 'string', nullable: true },
                  processedAt: { type: 'string', format: 'date-time' },
                  createdAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                totalPages: { type: 'number' }
              }
            }
          }
        }
      }
    },
    preHandler: [require('../../middlewares/auth.middleware').authMiddleware],
    handler: WebhookController.getLogs
  });

  fastify.get('/stats', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            successful: { type: 'number' },
            failed: { type: 'number' },
            byGateway: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  total: { type: 'number' },
                  successful: { type: 'number' },
                  failed: { type: 'number' }
                }
              }
            },
            byEventType: {
              type: 'object',
              additionalProperties: { type: 'number' }
            },
            last24Hours: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                successful: { type: 'number' },
                failed: { type: 'number' }
              }
            }
          }
        }
      }
    },
    preHandler: [require('../../middlewares/auth.middleware').authMiddleware],
    handler: WebhookController.getStats
  });

  fastify.get('/health', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            gateways: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  available: { type: 'boolean' },
                  lastWebhook: { type: 'string', format: 'date-time', nullable: true },
                  errorRate: { type: 'number', nullable: true }
                }
              }
            },
            overall: {
              type: 'object',
              properties: {
                available: { type: 'boolean' },
                totalGateways: { type: 'number' },
                availableGateways: { type: 'number' }
              }
            }
          }
        }
      }
    },
    handler: WebhookController.getHealth
  });

  fastify.get('/events', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            events: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      }
    },
    handler: WebhookController.getSupportedEvents
  });

  fastify.post('/:id/retry', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    },
    preHandler: [require('../../middlewares/auth.middleware').authMiddleware],
    handler: WebhookController.retryFailed
  });

  fastify.delete('/:id/log', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        204: { type: 'null' }
      }
    },
    preHandler: [require('../../middlewares/auth.middleware').authMiddleware],
    handler: WebhookController.deleteLog
  });
}
