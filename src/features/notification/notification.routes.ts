import { FastifyInstance } from 'fastify'
import { NotificationController } from './notification.controller'
import { NotificationSchemas } from './notification.schema'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { storeContextMiddleware } from '@/middlewares/store-context.middleware'

export async function NotificationRoutes(fastify: FastifyInstance) {
  // CRUD básico
  fastify.post('/', {
    schema: NotificationSchemas.create,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.create
  })

  fastify.get('/', {
    schema: NotificationSchemas.list,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.list
  })

  fastify.get('/:id', {
    schema: NotificationSchemas.get,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.get
  })

  fastify.put('/:id', {
    schema: NotificationSchemas.update,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.update
  })

  fastify.delete('/:id', {
    schema: NotificationSchemas.delete,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.delete
  })

  // Funções de leitura específicas
  fastify.get('/user/:userId', {
    schema: NotificationSchemas.getByUser,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.getByUser
  })

  fastify.get('/user/:userId/unread', {
    schema: NotificationSchemas.getUnread,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.getUnread
  })

  fastify.get('/user/:userId/recent', {
    schema: NotificationSchemas.getRecent,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.getRecent
  })

  fastify.get('/type/:type', {
    schema: NotificationSchemas.getByType,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.getByType
  })

  fastify.get('/priority/:priority', {
    schema: NotificationSchemas.getByPriority,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.getByPriority
  })

  fastify.get('/stats', {
    schema: NotificationSchemas.getStats,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.getStats
  })

  fastify.get('/search', {
    schema: NotificationSchemas.search,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.search
  })

  // Funções de comando específicas
  fastify.patch('/:id/read', {
    schema: NotificationSchemas.markAsRead,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.markAsRead
  })

  fastify.patch('/:id/unread', {
    schema: NotificationSchemas.markAsRead,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.markAsUnread
  })

  fastify.patch('/mark-all-read', {
    schema: NotificationSchemas.markAllAsRead,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.markAllAsRead
  })

  fastify.delete('/expired', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.deleteExpired
  })

  fastify.delete('/user/:userId', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.deleteByUser
  })

  // === ROTAS ESPECÍFICAS PARA ALERTAS DE ESTOQUE ===
  fastify.get('/stock-alerts', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          storeId: { type: 'string' },
          isRead: { type: 'boolean' },
          limit: { type: 'number', minimum: 1, maximum: 100 }
        }
      }
    },
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.getStockAlerts
  })

  fastify.get('/user/:userId/stock-alerts/unread', {
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
          limit: { type: 'number', minimum: 1, maximum: 100 }
        }
      }
    },
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.getUnreadStockAlerts
  })

  fastify.patch('/stock-alerts/mark-read', {
    schema: {
      body: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string' },
          storeId: { type: 'string' }
        }
      }
    },
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: NotificationController.markStockAlertsAsRead
  })
}