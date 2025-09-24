import { StoreController } from './store.controller';
import { StoreSchemas } from './store.schema';
import { authMiddleware, requireRole, requirePermission, requireStoreAccess, requireStoreRoleAccess, requireStoreUserManagement, UserRole, Action, StoreRole } from '../../middlewares';
export async function StoreRoutesWithMiddleware(fastify) {
    // POST /stores - Criar loja (requer permissão)
    fastify.post('/', {
        schema: StoreSchemas.create,
        preHandler: [authMiddleware, requirePermission(Action.CREATE_STORE)],
        handler: StoreController.create
    });
    // GET /stores - Listar lojas (requer permissão)
    fastify.get('/', {
        schema: StoreSchemas.list,
        preHandler: [authMiddleware, requirePermission(Action.LIST_STORES)],
        handler: StoreController.list
    });
    // GET /stores/:id - Buscar loja por ID (requer acesso à loja)
    fastify.get('/:id', {
        schema: StoreSchemas.get,
        preHandler: [authMiddleware, requireStoreAccess()],
        handler: StoreController.get
    });
    // PUT /stores/:id - Atualizar loja (requer acesso à loja + role de admin)
    fastify.put('/:id', {
        schema: StoreSchemas.update,
        preHandler: [
            authMiddleware,
            requireStoreAccess(),
            requireStoreRoleAccess([StoreRole.OWNER, StoreRole.ADMIN])
        ],
        handler: StoreController.update
    });
    // DELETE /stores/:id - Deletar loja (apenas super admin)
    fastify.delete('/:id', {
        schema: StoreSchemas.delete,
        preHandler: [authMiddleware, requireRole([UserRole.SUPER_ADMIN])],
        handler: StoreController.delete
    });
    // GET /stores/owner/:ownerId - Buscar lojas por proprietário (requer permissão)
    fastify.get('/owner/:ownerId', {
        preHandler: [authMiddleware, requirePermission(Action.READ_STORE)],
        handler: StoreController.getByOwner
    });
    // GET /stores/active - Buscar lojas ativas (requer permissão)
    fastify.get('/active', {
        preHandler: [authMiddleware, requirePermission(Action.LIST_STORES)],
        handler: StoreController.getActive
    });
    // GET /stores/stats - Estatísticas das lojas (apenas admin)
    fastify.get('/stats', {
        preHandler: [authMiddleware, requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])],
        handler: StoreController.getStats
    });
    // GET /stores/search - Buscar lojas (requer permissão)
    fastify.get('/search', {
        preHandler: [authMiddleware, requirePermission(Action.LIST_STORES)],
        handler: StoreController.search
    });
    // POST /stores/:id/users - Adicionar usuário à loja (requer gerenciamento de usuários)
    fastify.post('/:id/users', {
        schema: StoreSchemas.addUser,
        preHandler: [
            authMiddleware,
            requireStoreUserManagement()
        ],
        handler: StoreController.addUser
    });
    // DELETE /stores/:id/users/:userId - Remover usuário da loja (requer gerenciamento de usuários)
    fastify.delete('/:id/users/:userId', {
        schema: StoreSchemas.removeUser,
        preHandler: [
            authMiddleware,
            requireStoreUserManagement()
        ],
        handler: StoreController.removeUser
    });
    // GET /stores/:id/users - Listar usuários da loja (requer acesso à loja)
    fastify.get('/:id/users', {
        schema: StoreSchemas.listUsers,
        preHandler: [
            authMiddleware,
            requireStoreAccess()
        ],
        handler: StoreController.listUsers
    });
    // PATCH /stores/:id/users/:userId/role - Atualizar role do usuário na loja (requer gerenciamento de usuários)
    fastify.patch('/:id/users/:userId/role', {
        schema: StoreSchemas.updateUserRole,
        preHandler: [
            authMiddleware,
            requireStoreUserManagement()
        ],
        handler: StoreController.updateUserRole
    });
    // GET /stores/:id/users/:userId - Buscar usuário específico da loja (requer acesso à loja)
    fastify.get('/:id/users/:userId', {
        schema: StoreSchemas.getStoreUser,
        preHandler: [
            authMiddleware,
            requireStoreAccess()
        ],
        handler: StoreController.getStoreUser
    });
    // GET /stores/:id/owner - Buscar dono da loja (requer acesso à loja)
    fastify.get('/:id/owner', {
        schema: StoreSchemas.getStoreOwner,
        preHandler: [
            authMiddleware,
            requireStoreAccess()
        ],
        handler: StoreController.getStoreOwner
    });
    // GET /stores/:id/admins - Buscar administradores da loja (requer acesso à loja)
    fastify.get('/:id/admins', {
        schema: StoreSchemas.getStoreAdmins,
        preHandler: [
            authMiddleware,
            requireStoreAccess()
        ],
        handler: StoreController.getStoreAdmins
    });
    // GET /stores/:id/managers - Buscar gerentes da loja (requer acesso à loja)
    fastify.get('/:id/managers', {
        schema: StoreSchemas.getStoreManagers,
        preHandler: [
            authMiddleware,
            requireStoreAccess()
        ],
        handler: StoreController.getStoreManagers
    });
    // GET /stores/:id/staff - Buscar funcionários da loja (requer acesso à loja)
    fastify.get('/:id/staff', {
        schema: StoreSchemas.getStoreStaff,
        preHandler: [
            authMiddleware,
            requireStoreAccess()
        ],
        handler: StoreController.getStoreStaff
    });
    // GET /stores/:id/users/stats - Estatísticas dos usuários da loja (requer acesso à loja)
    fastify.get('/:id/users/stats', {
        schema: StoreSchemas.getStoreUserStats,
        preHandler: [
            authMiddleware,
            requireStoreAccess()
        ],
        handler: StoreController.getStoreUserStats
    });
    // GET /stores/:id/users/search - Buscar usuários da loja (requer acesso à loja)
    fastify.get('/:id/users/search', {
        schema: StoreSchemas.searchStoreUsers,
        preHandler: [
            authMiddleware,
            requireStoreAccess()
        ],
        handler: StoreController.searchStoreUsers
    });
    // POST /stores/:id/transfer-ownership - Transferir propriedade da loja (apenas super admin)
    fastify.post('/:id/transfer-ownership', {
        schema: StoreSchemas.transferOwnership,
        preHandler: [
            authMiddleware,
            requireRole([UserRole.SUPER_ADMIN])
        ],
        handler: StoreController.transferOwnership
    });
}
