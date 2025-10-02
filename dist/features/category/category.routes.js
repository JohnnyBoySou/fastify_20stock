"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = CategoryRoutes;
const category_controller_1 = require("./category.controller");
const category_schema_1 = require("./category.schema");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
async function CategoryRoutes(fastify) {
    // CRUD básico
    fastify.post('/', {
        schema: category_schema_1.CategorySchemas.create,
        preHandler: [auth_middleware_1.authMiddleware],
        handler: category_controller_1.CategoryController.create
    });
    fastify.get('/', {
        schema: category_schema_1.CategorySchemas.list,
        handler: category_controller_1.CategoryController.list
    });
    fastify.get('/:id', {
        schema: category_schema_1.CategorySchemas.get,
        handler: category_controller_1.CategoryController.get
    });
    fastify.put('/:id', {
        schema: category_schema_1.CategorySchemas.update,
        preHandler: [auth_middleware_1.authMiddleware],
        handler: category_controller_1.CategoryController.update
    });
    fastify.delete('/:id', {
        schema: category_schema_1.CategorySchemas.delete,
        preHandler: [auth_middleware_1.authMiddleware],
        handler: category_controller_1.CategoryController.delete
    });
    // Funções adicionais - Queries
    fastify.get('/active', {
        handler: category_controller_1.CategoryController.getActive
    });
    fastify.get('/stats', {
        handler: category_controller_1.CategoryController.getStats
    });
    fastify.get('/search', {
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    q: { type: 'string' },
                    limit: { type: 'number' }
                },
                required: ['q']
            }
        },
        handler: category_controller_1.CategoryController.search
    });
    fastify.get('/root', {
        schema: category_schema_1.CategorySchemas.getRoot,
        handler: category_controller_1.CategoryController.getRootCategories
    });
    fastify.get('/:id/children', {
        schema: category_schema_1.CategorySchemas.getChildren,
        handler: category_controller_1.CategoryController.getChildren
    });
    fastify.get('/hierarchy', {
        handler: category_controller_1.CategoryController.getHierarchy
    });
    fastify.get('/code/:code', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    code: { type: 'string' }
                },
                required: ['code']
            }
        },
        handler: category_controller_1.CategoryController.getByCode
    });
    // Funções adicionais - Commands
    fastify.patch('/:id/status', {
        schema: category_schema_1.CategorySchemas.updateStatus,
        preHandler: [auth_middleware_1.authMiddleware],
        handler: category_controller_1.CategoryController.updateStatus
    });
    fastify.patch('/:id/move', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' }
                },
                required: ['id']
            },
            body: {
                type: 'object',
                properties: {
                    parentId: { type: 'string', nullable: true }
                }
            }
        },
        preHandler: [auth_middleware_1.authMiddleware],
        handler: category_controller_1.CategoryController.moveToParent
    });
    // === RELATÓRIOS ===
    fastify.get('/reports/top-by-products', {
        schema: category_schema_1.CategorySchemas.getTopCategoriesByProducts,
        handler: category_controller_1.CategoryController.getTopCategoriesByProducts
    });
    fastify.get('/reports/creation-evolution', {
        schema: category_schema_1.CategorySchemas.getCategoryCreationEvolution,
        handler: category_controller_1.CategoryController.getCategoryCreationEvolution
    });
    fastify.get('/reports/active-inactive-ratio', {
        schema: category_schema_1.CategorySchemas.getActiveInactiveRatio,
        handler: category_controller_1.CategoryController.getActiveInactiveRatio
    });
    fastify.get('/reports/active-inactive-trend', {
        schema: category_schema_1.CategorySchemas.getActiveInactiveTrend,
        handler: category_controller_1.CategoryController.getActiveInactiveTrend
    });
}
