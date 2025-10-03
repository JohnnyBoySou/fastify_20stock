"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_commands_1 = require("./commands/notification.commands");
const notification_queries_1 = require("./queries/notification.queries");
exports.NotificationController = {
    // === CRUD BÁSICO ===
    async create(request, reply) {
        try {
            const { userId, title, message, type, priority, data, actionUrl, expiresAt } = request.body;
            const result = await notification_commands_1.NotificationCommands.create({
                userId,
                title,
                message,
                type,
                priority,
                data,
                actionUrl,
                expiresAt: expiresAt ? new Date(expiresAt) : undefined
            });
            return reply.status(201).send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'User not found') {
                return reply.status(400).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async get(request, reply) {
        try {
            const { id } = request.params;
            const result = await notification_queries_1.NotificationQueries.getById(id);
            if (!result) {
                return reply.status(404).send({
                    error: 'Notification not found'
                });
            }
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Notification not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async update(request, reply) {
        try {
            const { id } = request.params;
            const updateData = { ...request.body };
            // Convert expiresAt string to Date if provided
            if (updateData.expiresAt) {
                updateData.expiresAt = new Date(updateData.expiresAt);
            }
            const result = await notification_commands_1.NotificationCommands.update(id, updateData);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Notification not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            if (error.message === 'Validation error') {
                return reply.status(400).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async delete(request, reply) {
        try {
            const { id } = request.params;
            await notification_commands_1.NotificationCommands.delete(id);
            return reply.status(204).send();
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Notification not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async list(request, reply) {
        try {
            const { page = 1, limit = 10, search, type, priority, isRead, userId } = request.query;
            const result = await notification_queries_1.NotificationQueries.list({
                page,
                limit,
                search,
                type,
                priority,
                isRead,
                userId
            });
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    // === FUNÇÕES ADICIONAIS (QUERIES) ===
    async getByUser(request, reply) {
        try {
            const { userId } = request.params;
            const { page = 1, limit = 10, isRead, type } = request.query;
            const result = await notification_queries_1.NotificationQueries.getByUser(userId, {
                page,
                limit,
                isRead,
                type
            });
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getUnread(request, reply) {
        try {
            const { userId } = request.params;
            const { limit = 10 } = request.query;
            const result = await notification_queries_1.NotificationQueries.getUnread(userId, limit);
            return reply.send({ notifications: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getByType(request, reply) {
        try {
            const { type } = request.params;
            const { limit = 10 } = request.query;
            const result = await notification_queries_1.NotificationQueries.getByType(type, limit);
            return reply.send({ notifications: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getByPriority(request, reply) {
        try {
            const { priority } = request.params;
            const { limit = 10 } = request.query;
            const result = await notification_queries_1.NotificationQueries.getByPriority(priority, limit);
            return reply.send({ notifications: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getRecent(request, reply) {
        try {
            const { userId } = request.params;
            const { days = 7, limit = 20 } = request.query;
            const result = await notification_queries_1.NotificationQueries.getRecent(userId, days, limit);
            return reply.send({ notifications: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getStats(request, reply) {
        try {
            const { userId } = request.query;
            const result = await notification_queries_1.NotificationQueries.getStats(userId);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async search(request, reply) {
        try {
            const { q, limit = 10 } = request.query;
            const result = await notification_queries_1.NotificationQueries.search(q, limit);
            return reply.send({ notifications: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    // === FUNÇÕES ADICIONAIS (COMMANDS) ===
    async markAsRead(request, reply) {
        try {
            const { id } = request.params;
            const result = await notification_commands_1.NotificationCommands.markAsRead(id);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Notification not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async markAsUnread(request, reply) {
        try {
            const { id } = request.params;
            const result = await notification_commands_1.NotificationCommands.markAsUnread(id);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Notification not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async markAllAsRead(request, reply) {
        try {
            const { userId } = request.body;
            const result = await notification_commands_1.NotificationCommands.markAllAsRead(userId);
            return reply.send({
                success: true,
                count: result.count
            });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async deleteExpired(request, reply) {
        try {
            const result = await notification_commands_1.NotificationCommands.deleteExpired();
            return reply.send({
                success: true,
                count: result.count
            });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async deleteByUser(request, reply) {
        try {
            const { userId } = request.params;
            const result = await notification_commands_1.NotificationCommands.deleteByUser(userId);
            return reply.send({
                success: true,
                count: result.count
            });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    // === ENDPOINTS ESPECÍFICOS PARA ALERTAS DE ESTOQUE ===
    async getStockAlerts(request, reply) {
        try {
            const { userId, storeId, isRead, limit = 20 } = request.query;
            const result = await notification_queries_1.NotificationQueries.getStockAlerts({
                userId,
                storeId,
                isRead,
                limit
            });
            return reply.send({ notifications: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getUnreadStockAlerts(request, reply) {
        try {
            const { userId } = request.params;
            const { limit = 10 } = request.query;
            const result = await notification_queries_1.NotificationQueries.getUnreadStockAlerts(userId, limit);
            return reply.send({ notifications: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async markStockAlertsAsRead(request, reply) {
        try {
            const { userId, storeId } = request.body;
            const result = await notification_commands_1.NotificationCommands.markStockAlertsAsRead(userId, storeId);
            return reply.send({
                success: true,
                count: result.count
            });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    }
};
