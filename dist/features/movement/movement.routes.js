"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementRoutes = MovementRoutes;
const movement_controller_1 = require("./movement.controller");
const movement_schema_1 = require("./movement.schema");
const middlewares_1 = require("../../middlewares");
async function MovementRoutes(fastify) {
    // CRUD básico
    fastify.post('/', {
        schema: movement_schema_1.MovementSchemas.create,
        preHandler: [middlewares_1.authMiddleware, middlewares_1.storeContextMiddleware],
        handler: movement_controller_1.MovementController.create
    });
    fastify.get('/', {
        schema: movement_schema_1.MovementSchemas.list,
        preHandler: [middlewares_1.authMiddleware, middlewares_1.storeContextMiddleware],
        handler: movement_controller_1.MovementController.list
    });
    // === NOVOS ENDPOINTS ESPECÍFICOS ===
    // Listar movimentações da loja do usuário autenticado
    fastify.get('/my-store', {
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'number', minimum: 1 },
                    limit: { type: 'number', minimum: 1, maximum: 100 },
                    search: { type: 'string' },
                    type: { type: 'string', enum: ['ENTRADA', 'SAIDA', 'PERDA'] },
                    productId: { type: 'string' },
                    supplierId: { type: 'string' },
                    startDate: { type: 'string', format: 'date-time' },
                    endDate: { type: 'string', format: 'date-time' }
                }
            }
        },
        preHandler: [middlewares_1.authMiddleware, middlewares_1.storeContextMiddleware],
        handler: movement_controller_1.MovementController.listByStore
    });
    // Listar movimentações por produto específico na loja do usuário
    fastify.get('/my-store/product/:productId', {
        schema: {
            params: {
                type: 'object',
                required: ['productId'],
                properties: {
                    productId: { type: 'string', minLength: 1 }
                }
            },
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'number', minimum: 1 },
                    limit: { type: 'number', minimum: 1, maximum: 100 },
                    type: { type: 'string', enum: ['ENTRADA', 'SAIDA', 'PERDA'] },
                    startDate: { type: 'string', format: 'date-time' },
                    endDate: { type: 'string', format: 'date-time' }
                }
            }
        },
        preHandler: [middlewares_1.authMiddleware, middlewares_1.storeContextMiddleware],
        handler: movement_controller_1.MovementController.listByProduct
    });
    fastify.get('/:id', {
        schema: movement_schema_1.MovementSchemas.get,
        preHandler: [middlewares_1.authMiddleware, middlewares_1.storeContextMiddleware],
        handler: movement_controller_1.MovementController.get
    });
    fastify.put('/:id', {
        schema: movement_schema_1.MovementSchemas.update,
        preHandler: [middlewares_1.authMiddleware, middlewares_1.storeContextMiddleware],
        handler: movement_controller_1.MovementController.update
    });
    fastify.delete('/:id', {
        schema: movement_schema_1.MovementSchemas.delete,
        preHandler: [middlewares_1.authMiddleware, middlewares_1.storeContextMiddleware],
        handler: movement_controller_1.MovementController.delete
    });
    // Consultas por entidade
    fastify.get('/store/:storeId', {
        schema: movement_schema_1.MovementSchemas.getByStore,
        handler: movement_controller_1.MovementController.getByStore
    });
    fastify.get('/product/:productId', {
        schema: movement_schema_1.MovementSchemas.getByProduct,
        handler: movement_controller_1.MovementController.getByProduct
    });
    fastify.get('/product/:productId/summary', {
        handler: movement_controller_1.MovementController.summarizeProduct
    });
    fastify.get('/supplier/:supplierId', {
        schema: movement_schema_1.MovementSchemas.getBySupplier,
        handler: movement_controller_1.MovementController.getBySupplier
    });
    // Histórico de estoque
    fastify.get('/stock-history/:productId/:storeId', {
        schema: movement_schema_1.MovementSchemas.getStockHistory,
        handler: movement_controller_1.MovementController.getStockHistory
    });
    // Estoque atual
    fastify.get('/current-stock/:productId/:storeId', {
        handler: movement_controller_1.MovementController.getCurrentStock
    });
    // Relatórios e estatísticas
    fastify.get('/stats', {
        handler: movement_controller_1.MovementController.getStats
    });
    fastify.get('/search', {
        handler: movement_controller_1.MovementController.search
    });
    fastify.get('/low-stock', {
        handler: movement_controller_1.MovementController.getLowStockProducts
    });
    // Comandos especiais
    fastify.post('/recalculate-stock/:productId/:storeId', {
        handler: movement_controller_1.MovementController.recalculateStock
    });
    fastify.get('/summarize', {
        handler: movement_controller_1.MovementController.summarize
    });
}
