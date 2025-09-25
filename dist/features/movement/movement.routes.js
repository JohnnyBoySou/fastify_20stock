"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementRoutes = MovementRoutes;
const movement_controller_1 = require("./movement.controller");
const movement_schema_1 = require("./movement.schema");
async function MovementRoutes(fastify) {
    // CRUD básico
    fastify.post('/', {
        schema: movement_schema_1.MovementSchemas.create,
        handler: movement_controller_1.MovementController.create
    });
    fastify.get('/', {
        schema: movement_schema_1.MovementSchemas.list,
        handler: movement_controller_1.MovementController.list
    });
    fastify.get('/:id', {
        schema: movement_schema_1.MovementSchemas.get,
        handler: movement_controller_1.MovementController.get
    });
    fastify.put('/:id', {
        schema: movement_schema_1.MovementSchemas.update,
        handler: movement_controller_1.MovementController.update
    });
    fastify.delete('/:id', {
        schema: movement_schema_1.MovementSchemas.delete,
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
