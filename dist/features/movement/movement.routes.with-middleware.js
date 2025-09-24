import { MovementController } from './movement.controller';
import { MovementSchemas } from './movement.schema';
import { authMiddleware, requirePermission, requireStoreResourceAccess, requireStoreRoleAccess, Action, StoreRole } from '../../middlewares';
export async function MovementRoutesWithMiddleware(fastify) {
    // POST /movements - Criar movimentação (requer permissão + acesso à loja)
    fastify.post('/', {
        schema: MovementSchemas.create,
        preHandler: [
            authMiddleware,
            requirePermission(Action.CREATE_MOVEMENT),
            requireStoreResourceAccess('storeId'),
            requireStoreRoleAccess([StoreRole.ADMIN, StoreRole.MANAGER, StoreRole.STAFF])
        ],
        handler: MovementController.create
    });
    // GET /movements - Listar movimentações (requer permissão)
    fastify.get('/', {
        schema: MovementSchemas.list,
        preHandler: [authMiddleware, requirePermission(Action.LIST_MOVEMENTS)],
        handler: MovementController.list
    });
    // GET /movements/:id - Buscar movimentação por ID (requer permissão)
    fastify.get('/:id', {
        schema: MovementSchemas.get,
        preHandler: [authMiddleware, requirePermission(Action.READ_MOVEMENT)],
        handler: MovementController.get
    });
    // PUT /movements/:id - Atualizar movimentação (requer permissão + acesso à loja)
    fastify.put('/:id', {
        schema: MovementSchemas.update,
        preHandler: [
            authMiddleware,
            requirePermission(Action.UPDATE_MOVEMENT),
            requireStoreResourceAccess('storeId'),
            requireStoreRoleAccess([StoreRole.ADMIN, StoreRole.MANAGER])
        ],
        handler: MovementController.update
    });
    // DELETE /movements/:id - Deletar movimentação (apenas admin/manager)
    fastify.delete('/:id', {
        schema: MovementSchemas.delete,
        preHandler: [
            authMiddleware,
            requirePermission(Action.DELETE_MOVEMENT),
            requireStoreResourceAccess('storeId'),
            requireStoreRoleAccess([StoreRole.ADMIN, StoreRole.MANAGER])
        ],
        handler: MovementController.delete
    });
    // GET /movements/store/:storeId - Buscar movimentações por loja (requer acesso à loja)
    fastify.get('/store/:storeId', {
        preHandler: [
            authMiddleware,
            requireStoreResourceAccess()
        ],
        handler: MovementController.getByStore
    });
    // GET /movements/product/:productId - Buscar movimentações por produto (requer permissão)
    fastify.get('/product/:productId', {
        preHandler: [authMiddleware, requirePermission(Action.READ_MOVEMENT)],
        handler: MovementController.getByProduct
    });
    // GET /movements/supplier/:supplierId - Buscar movimentações por fornecedor (requer permissão)
    fastify.get('/supplier/:supplierId', {
        preHandler: [authMiddleware, requirePermission(Action.READ_MOVEMENT)],
        handler: MovementController.getBySupplier
    });
    // GET /movements/stats - Estatísticas das movimentações (requer permissão)
    fastify.get('/stats', {
        preHandler: [authMiddleware, requirePermission(Action.READ_MOVEMENT)],
        handler: MovementController.getStats
    });
    // GET /movements/search - Buscar movimentações (requer permissão)
    fastify.get('/search', {
        preHandler: [authMiddleware, requirePermission(Action.READ_MOVEMENT)],
        handler: MovementController.search
    });
    // GET /movements/report - Relatório de movimentações (requer permissão + acesso à loja)
    fastify.get('/report', {
        schema: MovementSchemas.getReport,
        preHandler: [
            authMiddleware,
            requirePermission(Action.READ_MOVEMENT),
            requireStoreResourceAccess('storeId'),
            requireStoreRoleAccess([StoreRole.ADMIN, StoreRole.MANAGER])
        ],
        handler: MovementController.getReport
    });
    // POST /movements/bulk - Criar múltiplas movimentações (requer permissão + acesso à loja)
    fastify.post('/bulk', {
        schema: MovementSchemas.createBulk,
        preHandler: [
            authMiddleware,
            requirePermission(Action.CREATE_MOVEMENT),
            requireStoreResourceAccess('storeId'),
            requireStoreRoleAccess([StoreRole.ADMIN, StoreRole.MANAGER])
        ],
        handler: MovementController.createBulk
    });
    // PATCH /movements/:id/verify - Verificar movimentação (apenas admin/manager)
    fastify.patch('/:id/verify', {
        schema: MovementSchemas.verify,
        preHandler: [
            authMiddleware,
            requireStoreResourceAccess('storeId'),
            requireStoreRoleAccess([StoreRole.ADMIN, StoreRole.MANAGER])
        ],
        handler: MovementController.verify
    });
    // PATCH /movements/:id/cancel - Cancelar movimentação (apenas admin/manager)
    fastify.patch('/:id/cancel', {
        schema: MovementSchemas.cancel,
        preHandler: [
            authMiddleware,
            requireStoreResourceAccess('storeId'),
            requireStoreRoleAccess([StoreRole.ADMIN, StoreRole.MANAGER])
        ],
        handler: MovementController.cancel
    });
    // GET /movements/verified - Listar movimentações verificadas (requer permissão)
    fastify.get('/verified', {
        schema: MovementSchemas.getVerifiedMovements,
        preHandler: [
            authMiddleware,
            requirePermission(Action.READ_MOVEMENT)
        ],
        handler: MovementController.getVerifiedMovements
    });
    // GET /movements/cancelled - Listar movimentações canceladas (requer permissão)
    fastify.get('/cancelled', {
        schema: MovementSchemas.getCancelledMovements,
        preHandler: [
            authMiddleware,
            requirePermission(Action.READ_MOVEMENT)
        ],
        handler: MovementController.getCancelledMovements
    });
    // GET /movements/analytics - Analytics de movimentações (requer permissão)
    fastify.get('/analytics', {
        schema: MovementSchemas.getAnalytics,
        preHandler: [
            authMiddleware,
            requirePermission(Action.READ_MOVEMENT)
        ],
        handler: MovementController.getAnalytics
    });
}
