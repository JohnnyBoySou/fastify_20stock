"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutesWithMiddleware = ProductRoutesWithMiddleware;
const product_controller_1 = require("./product.controller");
const product_schema_1 = require("./product.schema");
const middlewares_1 = require("../../middlewares");
async function ProductRoutesWithMiddleware(fastify) {
    // POST /products - Criar produto (requer permissão + acesso à loja)
    fastify.post('/', {
        schema: product_schema_1.ProductSchemas.create,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(middlewares_1.Action.CREATE_PRODUCT),
            (0, middlewares_1.requireStoreResourceAccess)('storeId') // Verifica acesso à loja via body
        ],
        handler: product_controller_1.ProductController.create
    });
    // GET /products - Listar produtos (requer permissão)
    fastify.get('/', {
        schema: product_schema_1.ProductSchemas.list,
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requirePermission)(middlewares_1.Action.LIST_PRODUCTS)],
        handler: product_controller_1.ProductController.list
    });
    // GET /products/:id - Buscar produto por ID (requer permissão)
    fastify.get('/:id', {
        schema: product_schema_1.ProductSchemas.get,
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requirePermission)(middlewares_1.Action.READ_PRODUCT)],
        handler: product_controller_1.ProductController.get
    });
    // PUT /products/:id - Atualizar produto (requer permissão + acesso à loja)
    fastify.put('/:id', {
        schema: product_schema_1.ProductSchemas.update,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(middlewares_1.Action.UPDATE_PRODUCT),
            (0, middlewares_1.requireStoreResourceAccess)('storeId') // Verifica acesso à loja via body
        ],
        handler: product_controller_1.ProductController.update
    });
    // DELETE /products/:id - Deletar produto (requer permissão + acesso à loja)
    fastify.delete('/:id', {
        schema: product_schema_1.ProductSchemas.delete,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(middlewares_1.Action.DELETE_PRODUCT),
            (0, middlewares_1.requireStoreResourceAccess)('storeId') // Verifica acesso à loja via body
        ],
        handler: product_controller_1.ProductController.delete
    });
    // GET /products/store/:storeId - Buscar produtos por loja (requer acesso à loja)
    fastify.get('/store/:storeId', {
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requireStoreResourceAccess)()
        ],
        handler: product_controller_1.ProductController.getByStore
    });
    // GET /products/category/:categoryId - Buscar produtos por categoria (requer permissão)
    fastify.get('/category/:categoryId', {
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requirePermission)(middlewares_1.Action.READ_PRODUCT)],
        handler: product_controller_1.ProductController.getByCategory
    });
    // GET /products/supplier/:supplierId - Buscar produtos por fornecedor (requer permissão)
    fastify.get('/supplier/:supplierId', {
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requirePermission)(middlewares_1.Action.READ_PRODUCT)],
        handler: product_controller_1.ProductController.getBySupplier
    });
    // GET /products/active - Buscar produtos ativos (requer permissão)
    fastify.get('/active', {
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requirePermission)(middlewares_1.Action.LIST_PRODUCTS)],
        handler: product_controller_1.ProductController.getActive
    });
    // GET /products/stats - Estatísticas dos produtos (requer permissão)
    fastify.get('/stats', {
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requirePermission)(middlewares_1.Action.READ_PRODUCT)],
        handler: product_controller_1.ProductController.getStats
    });
    // GET /products/search - Buscar produtos (requer permissão)
    fastify.get('/search', {
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requirePermission)(middlewares_1.Action.READ_PRODUCT)],
        handler: product_controller_1.ProductController.search
    });
    // PATCH /products/:id/verify-sku - Verificar SKU do produto (requer permissão + acesso à loja)
    fastify.patch('/:id/verify-sku', {
        schema: product_schema_1.ProductSchemas.verifySku,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(middlewares_1.Action.UPDATE_PRODUCT),
            (0, middlewares_1.requireStoreResourceAccess)('storeId')
        ],
        handler: product_controller_1.ProductController.verifySku
    });
    // PATCH /products/:id/update-stock - Atualizar estoque (requer permissão + acesso à loja)
    fastify.patch('/:id/update-stock', {
        schema: product_schema_1.ProductSchemas.updateStock,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(middlewares_1.Action.UPDATE_PRODUCT),
            (0, middlewares_1.requireStoreResourceAccess)('storeId')
        ],
        handler: product_controller_1.ProductController.updateStock
    });
    // GET /products/:id/movements - Listar movimentações do produto (requer permissão + acesso à loja)
    fastify.get('/:id/movements', {
        schema: product_schema_1.ProductSchemas.getMovements,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(middlewares_1.Action.READ_MOVEMENT),
            (0, middlewares_1.requireStoreResourceAccess)('storeId')
        ],
        handler: product_controller_1.ProductController.getMovements
    });
    // POST /products/:id/movements - Criar movimentação do produto (requer permissão + acesso à loja)
    fastify.post('/:id/movements', {
        schema: product_schema_1.ProductSchemas.createMovement,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(middlewares_1.Action.CREATE_MOVEMENT),
            (0, middlewares_1.requireStoreResourceAccess)('storeId'),
            (0, middlewares_1.requireStoreRoleAccess)([middlewares_1.StoreRole.ADMIN, middlewares_1.StoreRole.MANAGER, middlewares_1.StoreRole.STAFF])
        ],
        handler: product_controller_1.ProductController.createMovement
    });
    // GET /products/:id/stock - Buscar estoque atual do produto (requer permissão + acesso à loja)
    fastify.get('/:id/stock', {
        schema: product_schema_1.ProductSchemas.getStock,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(middlewares_1.Action.READ_PRODUCT),
            (0, middlewares_1.requireStoreResourceAccess)('storeId')
        ],
        handler: product_controller_1.ProductController.getStock
    });
    // GET /products/:id/stock/history - Histórico de estoque do produto (requer permissão + acesso à loja)
    fastify.get('/:id/stock/history', {
        schema: product_schema_1.ProductSchemas.getStockHistory,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(middlewares_1.Action.READ_PRODUCT),
            (0, middlewares_1.requireStoreResourceAccess)('storeId')
        ],
        handler: product_controller_1.ProductController.getStockHistory
    });
    // GET /products/low-stock - Produtos com estoque baixo (requer permissão)
    fastify.get('/low-stock', {
        schema: product_schema_1.ProductSchemas.getLowStock,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(middlewares_1.Action.READ_PRODUCT)
        ],
        handler: product_controller_1.ProductController.getLowStock
    });
    // GET /products/:id/analytics - Analytics do produto (requer permissão + acesso à loja)
    fastify.get('/:id/analytics', {
        schema: product_schema_1.ProductSchemas.getAnalytics,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(middlewares_1.Action.READ_PRODUCT),
            (0, middlewares_1.requireStoreResourceAccess)('storeId')
        ],
        handler: product_controller_1.ProductController.getAnalytics
    });
}
