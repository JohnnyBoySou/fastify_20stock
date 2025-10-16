import { FastifyInstance } from 'fastify';
import { QuoteController } from './quote.controller';
import { QuoteSchemas } from './quote.schema';
import { authMiddleware } from '../../middlewares/auth.middleware';

export async function QuoteRoutes(fastify: FastifyInstance) {
  // === ROTAS AUTENTICADAS ===
  
  // CRUD básico
  fastify.post('/', {
    schema: QuoteSchemas.create,
    preHandler: [authMiddleware],
    handler: QuoteController.create
  });

  fastify.get('/', {
    schema: QuoteSchemas.list,
    preHandler: [authMiddleware],
    handler: QuoteController.list
  });

  fastify.get('/:id', {
    schema: QuoteSchemas.get,
    preHandler: [authMiddleware],
    handler: QuoteController.get
  });

  fastify.put('/:id', {
    schema: QuoteSchemas.update,
    preHandler: [authMiddleware],
    handler: QuoteController.update
  });

  fastify.delete('/:id', {
    schema: QuoteSchemas.delete,
    preHandler: [authMiddleware],
    handler: QuoteController.delete
  });

  // Funções adicionais
  fastify.patch('/:id/status', {
    schema: QuoteSchemas.updateStatus,
    preHandler: [authMiddleware],
    handler: QuoteController.updateStatus
  });

  fastify.patch<{ Params: { id: string } }>('/:id/publish', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    preHandler: [authMiddleware],
    handler: QuoteController.publish
  });

  fastify.patch<{ Params: { id: string } }>('/:id/send', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    preHandler: [authMiddleware],
    handler: QuoteController.send
  });

  fastify.post('/:id/convert', {
    schema: QuoteSchemas.convertToMovement,
    preHandler: [authMiddleware],
    handler: QuoteController.convertToMovements
  });

  fastify.get('/stats', {
    schema: QuoteSchemas.getStats,
    preHandler: [authMiddleware],
    handler: QuoteController.getStats
  });

  fastify.get<{ Params: { userId: string } }>('/user/:userId', {
    schema: {
      params: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string' }
        }
      },
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          status: {
            type: 'string',
            enum: ['DRAFT', 'PUBLISHED', 'SENT', 'VIEWED', 'APPROVED', 'REJECTED', 'EXPIRED', 'CONVERTED', 'CANCELED']
          }
        }
      }
    },
    preHandler: [authMiddleware],
    handler: QuoteController.getByUser
  });

  fastify.get('/status/:status', {
    schema: {
      params: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['DRAFT', 'PUBLISHED', 'SENT', 'VIEWED', 'APPROVED', 'REJECTED', 'EXPIRED', 'CONVERTED', 'CANCELED']
          }
        }
      },
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          userId: { type: 'string' }
        }
      }
    },
    preHandler: [authMiddleware],
    handler: QuoteController.getByStatus
  });

  fastify.get('/search', {
    schema: {
      querystring: {
        type: 'object',
        required: ['q'],
        properties: {
          q: { type: 'string', minLength: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          userId: { type: 'string' }
        }
      }
    },
    preHandler: [authMiddleware],
    handler: QuoteController.search
  });

  fastify.get('/recent', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'number', minimum: 1, maximum: 50, default: 5 },
          userId: { type: 'string' }
        }
      }
    },
    preHandler: [authMiddleware],
    handler: QuoteController.getRecent
  });

  fastify.get('/:id/analytics', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    preHandler: [authMiddleware],
    handler: QuoteController.getAnalytics
  });

  fastify.post('/mark-expired', {
    preHandler: [authMiddleware],
    handler: QuoteController.markExpired
  });

  // === ROTAS PÚBLICAS (sem autenticação) ===
  
  fastify.get('/public/:publicId', {
    schema: QuoteSchemas.getPublic,
    handler: QuoteController.getPublic
  });

  fastify.post('/public/:publicId/approve', {
    schema: QuoteSchemas.approve,
    handler: QuoteController.approvePublic
  });

  fastify.post('/public/:publicId/reject', {
    schema: QuoteSchemas.reject,
    handler: QuoteController.rejectPublic
  });
}
