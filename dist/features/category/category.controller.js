import { CategoryCommands } from './commands/category.commands';
import { CategoryQueries } from './queries/category.queries';
export const CategoryController = {
    // === CRUD BÁSICO ===
    async create(request, reply) {
        try {
            const result = await CategoryCommands.create(request.body);
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
            const result = await CategoryQueries.getById(id);
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
            const result = await CategoryCommands.update(id, updateData);
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
            await CategoryCommands.delete(id);
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
            const result = await CategoryQueries.list({
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
            const result = await CategoryQueries.getActive();
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
            const result = await CategoryQueries.getStats();
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
            const result = await CategoryQueries.search(q, limit);
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
            const result = await CategoryQueries.getRootCategories(status);
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
            const result = await CategoryQueries.getChildren(id);
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
            const result = await CategoryQueries.getHierarchy();
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
            const result = await CategoryQueries.getByCode(code);
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
            const result = await CategoryCommands.updateStatus(id, status);
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
            const result = await CategoryCommands.moveToParent(id, parentId);
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
    }
};
