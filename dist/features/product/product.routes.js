"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = ProductRoutes;
const product_controller_1 = require("./product.controller");
const product_schema_1 = require("./product.schema");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const store_context_middleware_1 = require("../../middlewares/store-context.middleware");
async function ProductRoutes(fastify) {
    // CRUD básico
    fastify.post('/', {
        schema: product_schema_1.ProductSchemas.create,
        preHandler: [auth_middleware_1.authMiddleware, store_context_middleware_1.storeContextMiddleware],
        handler: product_controller_1.ProductController.create
    });
    fastify.get('/', {
        schema: product_schema_1.ProductSchemas.list,
        preHandler: [auth_middleware_1.authMiddleware, store_context_middleware_1.storeContextMiddleware],
        handler: product_controller_1.ProductController.list
    });
    fastify.get('/:id', {
        schema: product_schema_1.ProductSchemas.get,
        preHandler: [auth_middleware_1.authMiddleware, store_context_middleware_1.storeContextMiddleware],
        handler: product_controller_1.ProductController.get
    });
    fastify.put('/:id', {
        schema: product_schema_1.ProductSchemas.update,
        preHandler: [auth_middleware_1.authMiddleware, store_context_middleware_1.storeContextMiddleware],
        handler: product_controller_1.ProductController.update
    });
    fastify.delete('/:id', {
        schema: product_schema_1.ProductSchemas.delete,
        preHandler: [auth_middleware_1.authMiddleware, store_context_middleware_1.storeContextMiddleware],
        handler: product_controller_1.ProductController.delete
    });
    fastify.delete('/:id/force', {
        schema: product_schema_1.ProductSchemas.delete,
        preHandler: [auth_middleware_1.authMiddleware, store_context_middleware_1.storeContextMiddleware],
        handler: product_controller_1.ProductController.forceDelete
    });
    // Funções adicionais
    fastify.get('/active', {
        preHandler: [auth_middleware_1.authMiddleware, store_context_middleware_1.storeContextMiddleware],
        handler: product_controller_1.ProductController.getActive
    });
    fastify.get('/stats', {
        preHandler: [auth_middleware_1.authMiddleware, store_context_middleware_1.storeContextMiddleware],
        handler: product_controller_1.ProductController.getStats
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
        preHandler: [auth_middleware_1.authMiddleware, store_context_middleware_1.storeContextMiddleware],
        handler: product_controller_1.ProductController.search
    });
    fastify.get('/category/:categoryId', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    categoryId: { type: 'string' }
                },
                required: ['categoryId']
            }
        },
        preHandler: [auth_middleware_1.authMiddleware, store_context_middleware_1.storeContextMiddleware],
        handler: product_controller_1.ProductController.getByCategory
    });
    fastify.get('/supplier/:supplierId', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    supplierId: { type: 'string' }
                },
                required: ['supplierId']
            }
        },
        preHandler: [auth_middleware_1.authMiddleware, store_context_middleware_1.storeContextMiddleware],
        handler: product_controller_1.ProductController.getBySupplier
    });
    fastify.get('/store/:storeId', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    storeId: { type: 'string' }
                },
                required: ['storeId']
            }
        },
        preHandler: [auth_middleware_1.authMiddleware, store_context_middleware_1.storeContextMiddleware],
        handler: product_controller_1.ProductController.getByStore
    });
    fastify.patch('/:id/status', {
        schema: product_schema_1.ProductSchemas.updateStatus,
        preHandler: [auth_middleware_1.authMiddleware, store_context_middleware_1.storeContextMiddleware],
        handler: product_controller_1.ProductController.updateStatus
    });
    // === ENDPOINTS PARA GERENCIAR CATEGORIAS DO PRODUTO ===
    fastify.post('/:id/categories', {
        schema: product_schema_1.ProductSchemas.addCategories,
        preHandler: [auth_middleware_1.authMiddleware, store_context_middleware_1.storeContextMiddleware],
        handler: product_controller_1.ProductController.addCategories
    });
    fastify.delete('/:id/categories', {
        schema: product_schema_1.ProductSchemas.removeCategories,
        preHandler: [auth_middleware_1.authMiddleware, store_context_middleware_1.storeContextMiddleware],
        handler: product_controller_1.ProductController.removeCategories
    });
    fastify.put('/:id/categories', {
        schema: product_schema_1.ProductSchemas.setCategories,
        preHandler: [auth_middleware_1.authMiddleware, store_context_middleware_1.storeContextMiddleware],
        handler: product_controller_1.ProductController.setCategories
    });
    fastify.get('/:id/categories', {
        schema: product_schema_1.ProductSchemas.getCategories,
        preHandler: [auth_middleware_1.authMiddleware, store_context_middleware_1.storeContextMiddleware],
        handler: product_controller_1.ProductController.getCategories
    });
    // fastify.get('/category/:categoryId', {
    //   schema: ProductSchemas.getByCategory,
    //   handler: ProductController.getByCategory
    // });
}
