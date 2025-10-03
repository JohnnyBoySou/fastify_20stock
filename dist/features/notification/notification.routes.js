"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoutes = NotificationRoutes;
const notification_controller_1 = require("./notification.controller");
const notification_schema_1 = require("./notification.schema");
async function NotificationRoutes(fastify) {
    // CRUD básico
    fastify.post('/', {
        schema: notification_schema_1.NotificationSchemas.create,
        handler: notification_controller_1.NotificationController.create
    });
    fastify.get('/', {
        schema: notification_schema_1.NotificationSchemas.list,
        handler: notification_controller_1.NotificationController.list
    });
    fastify.get('/:id', {
        schema: notification_schema_1.NotificationSchemas.get,
        handler: notification_controller_1.NotificationController.get
    });
    fastify.put('/:id', {
        schema: notification_schema_1.NotificationSchemas.update,
        handler: notification_controller_1.NotificationController.update
    });
    fastify.delete('/:id', {
        schema: notification_schema_1.NotificationSchemas.delete,
        handler: notification_controller_1.NotificationController.delete
    });
    // Funções de leitura específicas
    fastify.get('/user/:userId', {
        schema: notification_schema_1.NotificationSchemas.getByUser,
        handler: notification_controller_1.NotificationController.getByUser
    });
    fastify.get('/user/:userId/unread', {
        schema: notification_schema_1.NotificationSchemas.getUnread,
        handler: notification_controller_1.NotificationController.getUnread
    });
    fastify.get('/user/:userId/recent', {
        schema: notification_schema_1.NotificationSchemas.getRecent,
        handler: notification_controller_1.NotificationController.getRecent
    });
    fastify.get('/type/:type', {
        schema: notification_schema_1.NotificationSchemas.getByType,
        handler: notification_controller_1.NotificationController.getByType
    });
    fastify.get('/priority/:priority', {
        schema: notification_schema_1.NotificationSchemas.getByPriority,
        handler: notification_controller_1.NotificationController.getByPriority
    });
    fastify.get('/stats', {
        schema: notification_schema_1.NotificationSchemas.getStats,
        handler: notification_controller_1.NotificationController.getStats
    });
    fastify.get('/search', {
        schema: notification_schema_1.NotificationSchemas.search,
        handler: notification_controller_1.NotificationController.search
    });
    // Funções de comando específicas
    fastify.patch('/:id/read', {
        schema: notification_schema_1.NotificationSchemas.markAsRead,
        handler: notification_controller_1.NotificationController.markAsRead
    });
    fastify.patch('/:id/unread', {
        schema: notification_schema_1.NotificationSchemas.markAsRead,
        handler: notification_controller_1.NotificationController.markAsUnread
    });
    fastify.patch('/mark-all-read', {
        schema: notification_schema_1.NotificationSchemas.markAllAsRead,
        handler: notification_controller_1.NotificationController.markAllAsRead
    });
    fastify.delete('/expired', {
        handler: notification_controller_1.NotificationController.deleteExpired
    });
    fastify.delete('/user/:userId', {
        handler: notification_controller_1.NotificationController.deleteByUser
    });
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
        handler: notification_controller_1.NotificationController.getStockAlerts
    });
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
        handler: notification_controller_1.NotificationController.getUnreadStockAlerts
    });
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
        handler: notification_controller_1.NotificationController.markStockAlertsAsRead
    });
}
