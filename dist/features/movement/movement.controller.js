"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementController = void 0;
const movement_commands_1 = require("./commands/movement.commands");
const movement_queries_1 = require("./queries/movement.queries");
const prisma_1 = require("@/plugins/prisma");
const stock_alert_service_1 = require("@/services/stock-monitoring/stock-alert.service");
const product_queries_1 = require("../product/queries/product.queries");
exports.MovementController = {
    // === CRUD BÁSICO ===
    async create(request, reply) {
        try {
            const { type, quantity, storeId, productId, supplierId, batch, expiration, price, note } = request.body;
            const userId = request.user?.id; // Obtém o ID do usuário autenticado
            console.log('Creating movement with data:', {
                type,
                quantity,
                storeId,
                productId,
                supplierId,
                batch,
                price,
                note,
                userId
            });
            const result = await movement_commands_1.MovementCommands.create({
                type,
                quantity,
                storeId, // Agora vem do middleware
                productId,
                supplierId,
                batch,
                expiration,
                price,
                note,
                userId
            });
            console.log('Movement created successfully:', result);
            // Verificar alertas de estoque após criar a movimentação
            try {
                const stockAlert = await stock_alert_service_1.StockAlertService.checkStockAlerts(productId, storeId, type, quantity, result.id);
                if (stockAlert.alertTriggered) {
                    console.log('Stock alert triggered:', stockAlert);
                    // Criar novo objeto com informação do alerta
                    const resultWithAlert = {
                        ...result,
                        stockAlert: {
                            triggered: true,
                            type: stockAlert.alertType,
                            message: stockAlert.message
                        }
                    };
                    return reply.status(201).send(resultWithAlert);
                }
            }
            catch (alertError) {
                console.error('Error checking stock alerts:', alertError);
                // Não falhar a criação da movimentação se houver erro no alerta
            }
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
            if (error.message.includes('Store ID is required')) {
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
            console.log('MovementController.get: Getting movement with id:', id);
            const result = await movement_queries_1.MovementQueries.getById(id);
            if (!result) {
                console.log('MovementController.get: Movement not found');
                return reply.status(404).send({
                    error: 'Movement not found'
                });
            }
            console.log('MovementController.get: Returning movement:', {
                id: result.id,
                store: result.store,
                product: result.product,
                supplier: result.supplier,
                user: result.user
            });
            console.log('MovementController.get: Full result JSON:', JSON.stringify(result, null, 2));
            // Forçar serialização correta dos dados relacionados
            const serializedResult = {
                ...result,
                store: result.store ? {
                    id: result.store.id,
                    name: result.store.name
                } : null,
                product: result.product ? {
                    id: result.product.id,
                    name: result.product.name,
                    unitOfMeasure: result.product.unitOfMeasure
                } : null,
                supplier: result.supplier ? {
                    id: result.supplier.id,
                    corporateName: result.supplier.corporateName
                } : null,
                user: result.user ? {
                    id: result.user.id,
                    name: result.user.name,
                    email: result.user.email
                } : null
            };
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
            const { page = 1, limit = 10, search, type, productId, supplierId, startDate, endDate } = request.query;
            const storeId = request.store?.id;
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store context required'
                });
            }
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
    // === NOVOS ENDPOINTS ESPECÍFICOS ===
    async listByStore(request, reply) {
        try {
            const { page = 1, limit = 10, search, type, productId, supplierId, startDate, endDate } = request.query;
            // Obter storeId do middleware ou do request.store
            const storeId = request.store?.id;
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store ID is required. User must be associated with a store.'
                });
            }
            console.log('Listing movements for store:', storeId);
            const result = await movement_queries_1.MovementQueries.getByStore(storeId, {
                page,
                limit,
                type,
                startDate,
                endDate
            });
            // Se houver filtros adicionais, aplicar na query
            if (search || productId || supplierId) {
                const filteredResult = await movement_queries_1.MovementQueries.list({
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
                return reply.send(filteredResult);
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
    async listByProduct(request, reply) {
        try {
            const { productId } = request.params;
            const { page = 1, limit = 10, type, startDate, endDate } = request.query;
            // Obter storeId do middleware ou do request.store
            const storeId = request.store?.id;
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store ID is required. User must be associated with a store.'
                });
            }
            console.log('Listing movements for product:', productId, 'in store:', storeId);
            // Verificar se o produto existe na loja
            const product = await prisma_1.db.product.findFirst({
                where: {
                    id: productId,
                    storeId: storeId,
                    status: true
                }
            });
            if (!product) {
                return reply.status(404).send({
                    error: 'Product not found in this store'
                });
            }
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
            // Obter storeId do middleware ou do request.store
            const storeId = request.store?.id;
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store ID is required. User must be associated with a store.'
                });
            }
            console.log('Getting movements for product:', productId, 'in store:', storeId);
            // Verificar se o produto existe na loja
            const product = await product_queries_1.ProductQueries.getById(productId, storeId);
            console.log('Product:', product);
            if (!product) {
                return reply.status(404).send({
                    error: 'Product not found in this store'
                });
            }
            const result = await movement_queries_1.MovementQueries.getByProduct(productId, {
                page,
                limit,
                type,
                startDate,
                endDate,
                storeId
            });
            console.log('Result:', result);
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
            const storeId = request.store?.id;
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store context required'
                });
            }
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
            const { productId, supplierId, type, startDate, endDate, groupBy, format } = request.query;
            const storeId = request.store?.id;
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store context required'
                });
            }
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
            const { page = 1, limit = 10, verified, startDate, endDate } = request.query;
            const storeId = request.store?.id;
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store context required'
                });
            }
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
            const { page = 1, limit = 10, startDate, endDate } = request.query;
            const storeId = request.store?.id;
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store context required'
                });
            }
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
            const { productId, supplierId, startDate, endDate } = request.query;
            const storeId = request.store?.id;
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store context required'
                });
            }
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
            const { startDate, endDate } = request.query;
            const storeId = request.store?.id;
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store context required'
                });
            }
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
    },
    // === ENDPOINTS PARA ALERTAS DE ESTOQUE ===
    async checkStockAlerts(request, reply) {
        try {
            const finalStoreId = request.store?.id;
            if (!finalStoreId) {
                return reply.status(400).send({
                    error: 'Store ID is required'
                });
            }
            const lowStockProducts = await stock_alert_service_1.StockAlertService.checkLowStockProducts(finalStoreId);
            return reply.send({
                storeId: finalStoreId,
                lowStockCount: lowStockProducts.length,
                products: lowStockProducts
            });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async createLowStockSummaryNotification(request, reply) {
        try {
            const finalStoreId = request.store?.id;
            if (!finalStoreId) {
                return reply.status(400).send({
                    error: 'Store ID is required'
                });
            }
            const notification = await stock_alert_service_1.StockAlertService.createLowStockSummaryNotification(finalStoreId);
            if (!notification) {
                return reply.send({
                    message: 'No low stock products found',
                    notification: null
                });
            }
            return reply.status(201).send({
                message: 'Low stock summary notification created',
                notification
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
