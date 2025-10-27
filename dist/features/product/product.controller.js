"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_commands_1 = require("./commands/product.commands");
const product_queries_1 = require("./queries/product.queries");
exports.ProductController = {
    // === CRUD BÁSICO ===
    async create(request, reply) {
        try {
            const { name, description, unitOfMeasure, referencePrice, categoryIds, supplierId, storeId, stockMin, stockMax, alertPercentage, status } = request.body;
            // Se storeId não foi enviado, buscar a loja do usuário autenticado
            let finalStoreId = storeId;
            if (!finalStoreId) {
                if (!request.user?.id) {
                    return reply.status(401).send({
                        error: 'Authentication required to determine store'
                    });
                }
                const userStore = await (0, product_commands_1.getUserStore)(request.user.id);
                finalStoreId = userStore.id;
            }
            const result = await product_commands_1.ProductCommands.create({
                name,
                description,
                unitOfMeasure,
                referencePrice,
                categoryIds,
                supplierId,
                storeId: finalStoreId,
                stockMin,
                stockMax,
                alertPercentage,
                status
            });
            return reply.status(201).send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Product with this name already exists') {
                return reply.status(400).send({
                    error: error.message
                });
            }
            if (error.message.includes('Categories not found')) {
                return reply.status(400).send({
                    error: error.message
                });
            }
            if (error.message === 'User has no associated store') {
                return reply.status(400).send({
                    error: 'User has no associated store. Please provide a storeId or ensure user has access to a store.'
                });
            }
            if (error.code === 'P2003') {
                return reply.status(400).send({
                    error: 'Invalid supplier or store reference'
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async get(request, reply) {
        try {
            const { id, storeId } = request.params;
            const result = await product_queries_1.ProductQueries.getById(id, storeId);
            if (!result) {
                return reply.status(404).send({
                    error: 'Product not found'
                });
            }
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
    async update(request, reply) {
        try {
            const { id } = request.params;
            const updateData = { ...request.body };
            const result = await product_commands_1.ProductCommands.update(id, updateData);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.code === 'P2025') {
                return reply.status(404).send({
                    error: 'Product not found'
                });
            }
            if (error.code === 'P2002') {
                return reply.status(400).send({
                    error: 'Product with this name already exists'
                });
            }
            if (error.message.includes('Categories not found')) {
                return reply.status(400).send({
                    error: error.message
                });
            }
            if (error.code === 'P2003') {
                return reply.status(400).send({
                    error: 'Invalid supplier or store reference'
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
            await product_commands_1.ProductCommands.delete(id);
            return reply.status(204).send();
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Product not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            if (error.message.includes('Cannot delete product') && error.message.includes('associated movements')) {
                return reply.status(400).send({
                    error: error.message,
                    suggestion: 'Use DELETE /products/:id/force to delete the product and all its movements'
                });
            }
            if (error.code === 'P2003') {
                return reply.status(400).send({
                    error: 'Cannot delete product due to foreign key constraints'
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async forceDelete(request, reply) {
        try {
            const { id } = request.params;
            await product_commands_1.ProductCommands.forceDelete(id);
            return reply.status(204).send();
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
    async list(request, reply) {
        try {
            const { page = 1, limit = 10, search, status, categoryIds, supplierId } = request.query;
            const storeId = request.store?.id;
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store context required'
                });
            }
            const result = await product_queries_1.ProductQueries.list({
                page,
                limit,
                search,
                status,
                categoryIds: categoryIds ? (Array.isArray(categoryIds) ? categoryIds : [categoryIds]) : undefined,
                supplierId,
                storeId
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
    async getActive(request, reply) {
        try {
            const storeId = request.store?.id;
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store context required'
                });
            }
            const result = await product_queries_1.ProductQueries.getActive(storeId);
            return reply.send({ products: result });
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
            const storeId = request.store?.id;
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store context required'
                });
            }
            const result = await product_queries_1.ProductQueries.getStats(storeId);
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
            const { q, limit = 10, page = 1 } = request.query;
            const storeId = request.store?.id;
            const result = await product_queries_1.ProductQueries.search(q, {
                page,
                limit,
                storeId
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
    async getByCategory(request, reply) {
        try {
            const { categoryId } = request.params;
            const storeId = request.store?.id;
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store context required'
                });
            }
            const result = await product_queries_1.ProductQueries.getByCategory(categoryId, storeId);
            return reply.send({ products: result });
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
            const storeId = request.store?.id;
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store context required'
                });
            }
            const result = await product_queries_1.ProductQueries.getBySupplier(supplierId, storeId);
            return reply.send({ products: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getByStore(request, reply) {
        try {
            const { storeId } = request.params;
            const result = await product_queries_1.ProductQueries.getByStore(storeId);
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
    async updateStatus(request, reply) {
        try {
            const { id } = request.params;
            const { status } = request.body;
            const result = await product_commands_1.ProductCommands.updateStatus(id, status);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.code === 'P2025') {
                return reply.status(404).send({
                    error: 'Product not found'
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    // === FUNÇÕES ADICIONAIS DE PRODUTO ===
    async verifySku(request, reply) {
        try {
            const { id: productId } = request.params;
            const { sku } = request.body;
            const result = await product_commands_1.ProductCommands.verifySku(productId, sku);
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
    async updateStock(request, reply) {
        try {
            const { id: productId } = request.params;
            const { quantity, type, note } = request.body;
            const userId = request.user?.id;
            const result = await product_commands_1.ProductCommands.updateStock(productId, quantity, type, note, userId);
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
    async getMovements(request, reply) {
        try {
            const { id: productId } = request.params;
            const { page = 1, limit = 10, type, startDate, endDate } = request.query;
            const result = await product_queries_1.ProductQueries.getProductMovements(productId, {
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
    async createMovement(request, reply) {
        try {
            const { id: productId } = request.params;
            const { type, quantity, supplierId, batch, expiration, price, note } = request.body;
            const userId = request.user?.id;
            const result = await product_commands_1.ProductCommands.createMovement(productId, {
                type,
                quantity,
                supplierId,
                batch,
                expiration,
                price,
                note,
                userId
            });
            return reply.status(201).send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Product not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            if (error.message === 'Supplier not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getStock(request, reply) {
        try {
            const { id: productId } = request.params;
            const result = await product_commands_1.ProductCommands.getProductStock(productId);
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
    async getStockHistory(request, reply) {
        try {
            const { id: productId } = request.params;
            const { limit = 30 } = request.query;
            const result = await product_queries_1.ProductQueries.getProductStockHistory(productId, limit);
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
    async getLowStock(request, reply) {
        try {
            const storeId = request.store?.id;
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store context required'
                });
            }
            const result = await product_queries_1.ProductQueries.getLowStockProducts(storeId);
            return reply.send({ products: result });
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
            const { id: productId } = request.params;
            const result = await product_queries_1.ProductQueries.getProductAnalytics(productId);
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
    // === MÉTODOS PARA GERENCIAR CATEGORIAS DO PRODUTO ===
    async addCategories(request, reply) {
        try {
            const { id } = request.params;
            const { categoryIds } = request.body;
            const result = await product_commands_1.ProductCommands.addCategories(id, categoryIds);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Product not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            if (error.message.includes('Categories not found') ||
                error.message.includes('already associated')) {
                return reply.status(400).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async removeCategories(request, reply) {
        try {
            const { id } = request.params;
            const { categoryIds } = request.body;
            const result = await product_commands_1.ProductCommands.removeCategories(id, categoryIds);
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
    async setCategories(request, reply) {
        try {
            const { id } = request.params;
            const { categoryIds } = request.body;
            const result = await product_commands_1.ProductCommands.setCategories(id, categoryIds);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Product not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            if (error.message.includes('Categories not found')) {
                return reply.status(400).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getCategories(request, reply) {
        try {
            const { id } = request.params;
            const result = await product_queries_1.ProductQueries.getCategories(id);
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
    async bulkDelete(request, reply) {
        try {
            const { ids } = request.body;
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                return reply.status(400).send({
                    error: 'Product IDs are required and must be a non-empty array'
                });
            }
            const result = await product_commands_1.ProductCommands.bulkDelete(ids);
            return reply.send({
                deleted: result.deleted,
                errors: result.errors,
                message: `Successfully deleted ${result.deleted} products${result.errors.length > 0 ? ` with ${result.errors.length} errors` : ''}`
            });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: error.message || 'Internal server error'
            });
        }
    }
};
