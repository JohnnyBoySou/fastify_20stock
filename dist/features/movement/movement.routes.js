import { MovementController } from './movement.controller';
import { MovementSchemas } from './movement.schema';
export async function MovementRoutes(fastify) {
    // CRUD básico
    fastify.post('/', {
        schema: MovementSchemas.create,
        handler: MovementController.create
    });
    fastify.get('/', {
        schema: MovementSchemas.list,
        handler: MovementController.list
    });
    fastify.get('/:id', {
        schema: MovementSchemas.get,
        handler: MovementController.get
    });
    fastify.put('/:id', {
        schema: MovementSchemas.update,
        handler: MovementController.update
    });
    fastify.delete('/:id', {
        schema: MovementSchemas.delete,
        handler: MovementController.delete
    });
    // Consultas por entidade
    fastify.get('/store/:storeId', {
        schema: MovementSchemas.getByStore,
        handler: MovementController.getByStore
    });
    fastify.get('/product/:productId', {
        schema: MovementSchemas.getByProduct,
        handler: MovementController.getByProduct
    });
    fastify.get('/supplier/:supplierId', {
        schema: MovementSchemas.getBySupplier,
        handler: MovementController.getBySupplier
    });
    // Histórico de estoque
    fastify.get('/stock-history/:productId/:storeId', {
        schema: MovementSchemas.getStockHistory,
        handler: MovementController.getStockHistory
    });
    // Estoque atual
    fastify.get('/current-stock/:productId/:storeId', {
        handler: MovementController.getCurrentStock
    });
    // Relatórios e estatísticas
    fastify.get('/stats', {
        handler: MovementController.getStats
    });
    fastify.get('/search', {
        handler: MovementController.search
    });
    fastify.get('/low-stock', {
        handler: MovementController.getLowStockProducts
    });
    // Comandos especiais
    fastify.post('/recalculate-stock/:productId/:storeId', {
        handler: MovementController.recalculateStock
    });
}
