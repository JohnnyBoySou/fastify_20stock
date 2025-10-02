"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_commands_1 = require("./commands/category.commands");
const category_queries_1 = require("./queries/category.queries");
exports.CategoryController = {
    // === CRUD BÁSICO ===
    async create(request, reply) {
        try {
            const result = await category_commands_1.CategoryCommands.create(request.body);
            return reply.status(201).send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.code === 'P2002') {
                return reply.status(400).send({
                    error: 'Category with this name or code already exists'
                });
            }
            if (error.code === 'P2003') {
                return reply.status(400).send({
                    error: 'Invalid parent category reference'
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
            const result = await category_queries_1.CategoryQueries.getById(id);
            if (!result) {
                return reply.status(404).send({
                    error: 'Category not found'
                });
            }
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Category not found') {
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
            const updateData = request.body;
            const result = await category_commands_1.CategoryCommands.update(id, updateData);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.code === 'P2025') {
                return reply.status(404).send({
                    error: 'Category not found'
                });
            }
            if (error.code === 'P2002') {
                return reply.status(400).send({
                    error: 'Category with this name or code already exists'
                });
            }
            if (error.code === 'P2003') {
                return reply.status(400).send({
                    error: 'Invalid parent category reference'
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
            await category_commands_1.CategoryCommands.delete(id);
            return reply.status(204).send();
        }
        catch (error) {
            request.log.error(error);
            if (error.code === 'P2025') {
                return reply.status(404).send({
                    error: 'Category not found'
                });
            }
            if (error.code === 'P2003') {
                return reply.status(400).send({
                    error: 'Cannot delete category with children or products'
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async list(request, reply) {
        try {
            const { page = 1, limit = 10, search, status, parentId } = request.query;
            const result = await category_queries_1.CategoryQueries.list({
                page,
                limit,
                search,
                status,
                parentId
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
            const result = await category_queries_1.CategoryQueries.getActive();
            return reply.send({ categories: result });
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
            const result = await category_queries_1.CategoryQueries.getStats();
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
            const result = await category_queries_1.CategoryQueries.search(q, limit);
            return reply.send({ categories: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getRootCategories(request, reply) {
        try {
            const { status } = request.query;
            const result = await category_queries_1.CategoryQueries.getRootCategories(status);
            return reply.send({ categories: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getChildren(request, reply) {
        try {
            const { id } = request.params;
            const result = await category_queries_1.CategoryQueries.getChildren(id);
            return reply.send({ categories: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getHierarchy(request, reply) {
        try {
            const result = await category_queries_1.CategoryQueries.getHierarchy();
            return reply.send({ categories: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getByCode(request, reply) {
        try {
            const { code } = request.params;
            const result = await category_queries_1.CategoryQueries.getByCode(code);
            if (!result) {
                return reply.status(404).send({
                    error: 'Category not found'
                });
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
    // === FUNÇÕES ADICIONAIS (COMMANDS) ===
    async updateStatus(request, reply) {
        try {
            const { id } = request.params;
            const { status } = request.body;
            const result = await category_commands_1.CategoryCommands.updateStatus(id, status);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.code === 'P2025') {
                return reply.status(404).send({
                    error: 'Category not found'
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async moveToParent(request, reply) {
        try {
            const { id } = request.params;
            const { parentId } = request.body;
            const result = await category_commands_1.CategoryCommands.moveToParent(id, parentId);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.code === 'P2025') {
                return reply.status(404).send({
                    error: 'Category not found'
                });
            }
            if (error.code === 'P2003') {
                return reply.status(400).send({
                    error: 'Invalid parent category reference'
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    // === RELATÓRIOS ===
    async getTopCategoriesByProducts(request, reply) {
        try {
            const { limit = 10, status, includeInactive = false, includeProductDetails = false } = request.query;
            const result = await category_queries_1.CategoryQueries.getTopCategoriesByProductsWithDetails({
                limit: parseInt(limit),
                status,
                includeInactive: includeInactive === 'true',
                includeProductDetails: includeProductDetails === 'true'
            });
            return reply.send({
                categories: result,
                metadata: {
                    total: result.length,
                    limit: parseInt(limit),
                    description: 'Top categorias com mais produtos',
                    chartType: 'horizontalBar',
                    recommendedLimit: Math.min(parseInt(limit), 10)
                }
            });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getCategoryCreationEvolution(request, reply) {
        try {
            const { period = 'month', startDate, endDate, status, includeInactive = false, includeDetails = false } = request.query;
            // Converter strings de data para Date se fornecidas
            const startDateObj = startDate ? new Date(startDate) : undefined;
            const endDateObj = endDate ? new Date(endDate) : undefined;
            // Validar datas
            if (startDateObj && isNaN(startDateObj.getTime())) {
                return reply.status(400).send({
                    error: 'Data de início inválida'
                });
            }
            if (endDateObj && isNaN(endDateObj.getTime())) {
                return reply.status(400).send({
                    error: 'Data de fim inválida'
                });
            }
            if (startDateObj && endDateObj && startDateObj > endDateObj) {
                return reply.status(400).send({
                    error: 'Data de início deve ser anterior à data de fim'
                });
            }
            const result = await category_queries_1.CategoryQueries.getCategoryCreationEvolutionDetailed({
                period,
                startDate: startDateObj,
                endDate: endDateObj,
                status,
                includeInactive: includeInactive === 'true',
                includeDetails: includeDetails === 'true'
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
    async getActiveInactiveRatio(request, reply) {
        try {
            const { includeDetails = false, includeHierarchy = false } = request.query;
            const result = await category_queries_1.CategoryQueries.getActiveInactiveRatio({
                includeDetails: includeDetails === 'true',
                includeHierarchy: includeHierarchy === 'true'
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
    async getActiveInactiveTrend(request, reply) {
        try {
            const { period = 'month', startDate, endDate } = request.query;
            // Converter strings de data para Date se fornecidas
            const startDateObj = startDate ? new Date(startDate) : undefined;
            const endDateObj = endDate ? new Date(endDate) : undefined;
            // Validar datas
            if (startDateObj && isNaN(startDateObj.getTime())) {
                return reply.status(400).send({
                    error: 'Data de início inválida'
                });
            }
            if (endDateObj && isNaN(endDateObj.getTime())) {
                return reply.status(400).send({
                    error: 'Data de fim inválida'
                });
            }
            if (startDateObj && endDateObj && startDateObj > endDateObj) {
                return reply.status(400).send({
                    error: 'Data de início deve ser anterior à data de fim'
                });
            }
            const result = await category_queries_1.CategoryQueries.getActiveInactiveTrend({
                period,
                startDate: startDateObj,
                endDate: endDateObj
            });
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    }
};
