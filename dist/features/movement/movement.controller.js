"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementController = void 0;
const movement_commands_1 = require("./commands/movement.commands");
const movement_queries_1 = require("./queries/movement.queries");
exports.MovementController = {
    // === CRUD BÁSICO ===
    async create(request, reply) {
        try {
            const result = await movement_commands_1.MovementCommands.create(request.body);
            return reply.status(201).send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Product not found in this store') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            if (error.message === 'Insufficient stock for this movement') {
                return reply.status(400).send({
                    error: error.message
                });
            }
            if (error.message === 'Supplier not found or inactive') {
                return reply.status(404).send({
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
            const result = await movement_queries_1.MovementQueries.getById(id);
            if (!result) {
                return reply.status(404).send({
                    error: 'Movement not found'
                });
            }
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Movement not found') {
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
            const result = await movement_commands_1.MovementCommands.update(id, updateData);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Movement not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            if (error.message === 'Insufficient stock for this movement') {
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
            await movement_commands_1.MovementCommands.delete(id);
            return reply.status(204).send();
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Movement not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            if (error.message === 'Cannot delete movement: insufficient stock to revert') {
                return reply.status(400).send({
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
            const { page = 1, limit = 10, search, type, storeId, productId, supplierId, startDate, endDate } = request.query;
            const result = await movement_queries_1.MovementQueries.list({
                page,
                limit,
                search,
                type,
                storeId,
                productId,
                supplierId,
                startDate,
                endDate
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
    async getByStore(request, reply) {
        try {
            const { storeId } = request.params;
            const { page = 1, limit = 10, type, startDate, endDate } = request.query;
            const result = await movement_queries_1.MovementQueries.getByStore(storeId, {
                page,
                limit,
                type,
                startDate,
                endDate
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
    async getByProduct(request, reply) {
        try {
            const { productId } = request.params;
            const { page = 1, limit = 10, type, startDate, endDate } = request.query;
            const result = await movement_queries_1.MovementQueries.getByProduct(productId, {
                page,
                limit,
                type,
                startDate,
                endDate
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
    async getBySupplier(request, reply) {
        try {
            const { supplierId } = request.params;
            const { page = 1, limit = 10, type, startDate, endDate } = request.query;
            const result = await movement_queries_1.MovementQueries.getBySupplier(supplierId, {
                page,
                limit,
                type,
                startDate,
                endDate
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
    async getStockHistory(request, reply) {
        try {
            const { productId, storeId } = request.params;
            const { startDate, endDate } = request.query;
            const result = await movement_queries_1.MovementQueries.getStockHistory(productId, storeId, {
                startDate,
                endDate
            });
            return reply.send({ movements: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getCurrentStock(request, reply) {
        try {
            const { productId, storeId } = request.params;
            const result = await movement_queries_1.MovementQueries.getCurrentStock(productId, storeId);
            return reply.send({ currentStock: result });
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
            const result = await movement_queries_1.MovementQueries.getStats();
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
            const result = await movement_queries_1.MovementQueries.search(q, limit);
            return reply.send({ movements: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getLowStockProducts(request, reply) {
        try {
            const { storeId } = request.query;
            const result = await movement_queries_1.MovementQueries.getLowStockProducts(storeId);
            return reply.send({ products: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    // === FUNÇÕES ADICIONAIS (COMMANDS) ===
    async recalculateStock(request, reply) {
        try {
            const { productId, storeId } = request.params;
            const result = await movement_commands_1.MovementCommands.recalculateStock(productId, storeId);
            return reply.send({ currentStock: result });
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Product not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    // === FUNÇÕES ADICIONAIS DE MOVIMENTAÇÃO ===
    async getReport(request, reply) {
        try {
            const { storeId, productId, supplierId, type, startDate, endDate, groupBy, format } = request.query;
            const result = await movement_queries_1.MovementQueries.getMovementReport({
                storeId,
                productId,
                supplierId,
                type,
                startDate,
                endDate,
                groupBy
            });
            // Se for CSV ou PDF, implementar geração de arquivo
            if (format === 'csv') {
                // Implementar geração de CSV
                return reply.type('text/csv').send('CSV generation not implemented yet');
            }
            if (format === 'pdf') {
                // Implementar geração de PDF
                return reply.type('application/pdf').send('PDF generation not implemented yet');
            }
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async createBulk(request, reply) {
        try {
            const { movements } = request.body;
            const userId = request.user?.id;
            const result = await movement_commands_1.MovementCommands.createBulk(movements, userId);
            return reply.status(201).send(result);
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async verify(request, reply) {
        try {
            const { id } = request.params;
            const { verified, note } = request.body;
            const userId = request.user?.id;
            const result = await movement_commands_1.MovementCommands.verify(id, verified, note, userId);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Movement not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async cancel(request, reply) {
        try {
            const { id } = request.params;
            const { reason } = request.body;
            const userId = request.user?.id;
            const result = await movement_commands_1.MovementCommands.cancel(id, reason, userId);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Movement not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            if (error.message === 'Movement already cancelled') {
                return reply.status(400).send({
                    error: error.message
                });
            }
            if (error.message === 'Cannot cancel movement: insufficient stock to revert') {
                return reply.status(400).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getVerifiedMovements(request, reply) {
        try {
            const { page = 1, limit = 10, storeId, verified, startDate, endDate } = request.query;
            const result = await movement_queries_1.MovementQueries.getVerifiedMovements({
                page,
                limit,
                storeId,
                verified,
                startDate,
                endDate
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
    async getCancelledMovements(request, reply) {
        try {
            const { page = 1, limit = 10, storeId, startDate, endDate } = request.query;
            const result = await movement_queries_1.MovementQueries.getCancelledMovements({
                page,
                limit,
                storeId,
                startDate,
                endDate
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
    async getAnalytics(request, reply) {
        try {
            const { storeId, productId, supplierId, startDate, endDate } = request.query;
            const result = await movement_queries_1.MovementQueries.getMovementAnalytics({
                storeId,
                productId,
                supplierId,
                startDate,
                endDate
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
    async summarize(request, reply) {
        try {
            const result = await movement_queries_1.MovementQueries.summarize();
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async summarizeProduct(request, reply) {
        try {
            const { productId } = request.params;
            const { startDate, endDate, storeId } = request.query;
            const result = await movement_queries_1.MovementQueries.getProductSummary(productId, {
                startDate,
                endDate,
                storeId
            });
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Product not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    }
};
