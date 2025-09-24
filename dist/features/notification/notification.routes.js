import { NotificationController } from './notification.controller';
import { NotificationSchemas } from './notification.schema';
export async function NotificationRoutes(fastify) {
    // CRUD básico
    fastify.post('/', {
        schema: NotificationSchemas.create,
        handler: NotificationController.create
    });
    fastify.get('/', {
        schema: NotificationSchemas.list,
        handler: NotificationController.list
    });
    fastify.get('/:id', {
        schema: NotificationSchemas.get,
        handler: NotificationController.get
    });
    fastify.put('/:id', {
        schema: NotificationSchemas.update,
        handler: NotificationController.update
    });
    fastify.delete('/:id', {
        schema: NotificationSchemas.delete,
        handler: NotificationController.delete
    });
    // Funções de leitura específicas
    fastify.get('/user/:userId', {
        schema: NotificationSchemas.getByUser,
        handler: NotificationController.getByUser
    });
    fastify.get('/user/:userId/unread', {
        schema: NotificationSchemas.getUnread,
        handler: NotificationController.getUnread
    });
    fastify.get('/user/:userId/recent', {
        schema: NotificationSchemas.getRecent,
        handler: NotificationController.getRecent
    });
    fastify.get('/type/:type', {
        schema: NotificationSchemas.getByType,
        handler: NotificationController.getByType
    });
    fastify.get('/priority/:priority', {
        schema: NotificationSchemas.getByPriority,
        handler: NotificationController.getByPriority
    });
    fastify.get('/stats', {
        schema: NotificationSchemas.getStats,
        handler: NotificationController.getStats
    });
    fastify.get('/search', {
        schema: NotificationSchemas.search,
        handler: NotificationController.search
    });
    // Funções de comando específicas
    fastify.patch('/:id/read', {
        schema: NotificationSchemas.markAsRead,
        handler: NotificationController.markAsRead
    });
    fastify.patch('/:id/unread', {
        schema: NotificationSchemas.markAsRead,
        handler: NotificationController.markAsUnread
    });
    fastify.patch('/mark-all-read', {
        schema: NotificationSchemas.markAllAsRead,
        handler: NotificationController.markAllAsRead
    });
    fastify.delete('/expired', {
        handler: NotificationController.deleteExpired
    });
    fastify.delete('/user/:userId', {
        handler: NotificationController.deleteByUser
    });
}
