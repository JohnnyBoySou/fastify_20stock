"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreRoutesWithMiddleware = StoreRoutesWithMiddleware;
const store_controller_1 = require("./store.controller");
const store_schema_1 = require("./store.schema");
const middlewares_1 = require("../../middlewares");
async function StoreRoutesWithMiddleware(fastify) {
    // POST /stores - Criar loja (requer permissão)
    fastify.post('/', {
        schema: store_schema_1.StoreSchemas.create,
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requirePermission)(middlewares_1.Action.CREATE_STORE)],
        handler: store_controller_1.StoreController.create
    });
    // GET /stores - Listar lojas (requer permissão)
    fastify.get('/', {
        schema: store_schema_1.StoreSchemas.list,
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requirePermission)(middlewares_1.Action.LIST_STORES)],
        handler: store_controller_1.StoreController.list
    });
    // GET /stores/:id - Buscar loja por ID (requer acesso à loja)
    fastify.get('/:id', {
        schema: store_schema_1.StoreSchemas.get,
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requireStoreAccess)()],
        handler: store_controller_1.StoreController.get
    });
    // PUT /stores/:id - Atualizar loja (requer acesso à loja + role de admin)
    fastify.put('/:id', {
        schema: store_schema_1.StoreSchemas.update,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requireStoreAccess)(),
            (0, middlewares_1.requireStoreRoleAccess)([middlewares_1.StoreRole.OWNER, middlewares_1.StoreRole.ADMIN])
        ],
        handler: store_controller_1.StoreController.update
    });
    // DELETE /stores/:id - Deletar loja (apenas super admin)
    fastify.delete('/:id', {
        schema: store_schema_1.StoreSchemas.delete,
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requireRole)([middlewares_1.UserRole.SUPER_ADMIN])],
        handler: store_controller_1.StoreController.delete
    });
    // GET /stores/owner/:ownerId - Buscar lojas por proprietário (requer permissão)
    fastify.get('/owner/:ownerId', {
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requirePermission)(middlewares_1.Action.READ_STORE)],
        handler: store_controller_1.StoreController.getByOwner
    });
    // GET /stores/active - Buscar lojas ativas (requer permissão)
    fastify.get('/active', {
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requirePermission)(middlewares_1.Action.LIST_STORES)],
        handler: store_controller_1.StoreController.getActive
    });
    // GET /stores/stats - Estatísticas das lojas (apenas admin)
    fastify.get('/stats', {
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requireRole)([middlewares_1.UserRole.ADMIN, middlewares_1.UserRole.SUPER_ADMIN])],
        handler: store_controller_1.StoreController.getStats
    });
    // GET /stores/search - Buscar lojas (requer permissão)
    fastify.get('/search', {
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requirePermission)(middlewares_1.Action.LIST_STORES)],
        handler: store_controller_1.StoreController.search
    });
    // POST /stores/:id/users - Adicionar usuário à loja (requer gerenciamento de usuários)
    fastify.post('/:id/users', {
        schema: store_schema_1.StoreSchemas.addUser,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requireStoreUserManagement)()
        ],
        handler: store_controller_1.StoreController.addUser
    });
    // DELETE /stores/:id/users/:userId - Remover usuário da loja (requer gerenciamento de usuários)
    fastify.delete('/:id/users/:userId', {
        schema: store_schema_1.StoreSchemas.removeUser,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requireStoreUserManagement)()
        ],
        handler: store_controller_1.StoreController.removeUser
    });
    // GET /stores/:id/users - Listar usuários da loja (requer acesso à loja)
    fastify.get('/:id/users', {
        schema: store_schema_1.StoreSchemas.listUsers,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requireStoreAccess)()
        ],
        handler: store_controller_1.StoreController.listUsers
    });
    // PATCH /stores/:id/users/:userId/role - Atualizar role do usuário na loja (requer gerenciamento de usuários)
    fastify.patch('/:id/users/:userId/role', {
        schema: store_schema_1.StoreSchemas.updateUserRole,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requireStoreUserManagement)()
        ],
        handler: store_controller_1.StoreController.updateUserRole
    });
    // GET /stores/:id/users/:userId - Buscar usuário específico da loja (requer acesso à loja)
    fastify.get('/:id/users/:userId', {
        schema: store_schema_1.StoreSchemas.getStoreUser,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requireStoreAccess)()
        ],
        handler: store_controller_1.StoreController.getStoreUser
    });
    // GET /stores/:id/owner - Buscar dono da loja (requer acesso à loja)
    fastify.get('/:id/owner', {
        schema: store_schema_1.StoreSchemas.getStoreOwner,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requireStoreAccess)()
        ],
        handler: store_controller_1.StoreController.getStoreOwner
    });
    // GET /stores/:id/admins - Buscar administradores da loja (requer acesso à loja)
    fastify.get('/:id/admins', {
        schema: store_schema_1.StoreSchemas.getStoreAdmins,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requireStoreAccess)()
        ],
        handler: store_controller_1.StoreController.getStoreAdmins
    });
    // GET /stores/:id/managers - Buscar gerentes da loja (requer acesso à loja)
    fastify.get('/:id/managers', {
        schema: store_schema_1.StoreSchemas.getStoreManagers,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requireStoreAccess)()
        ],
        handler: store_controller_1.StoreController.getStoreManagers
    });
    // GET /stores/:id/staff - Buscar funcionários da loja (requer acesso à loja)
    fastify.get('/:id/staff', {
        schema: store_schema_1.StoreSchemas.getStoreStaff,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requireStoreAccess)()
        ],
        handler: store_controller_1.StoreController.getStoreStaff
    });
    // GET /stores/:id/users/stats - Estatísticas dos usuários da loja (requer acesso à loja)
    fastify.get('/:id/users/stats', {
        schema: store_schema_1.StoreSchemas.getStoreUserStats,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requireStoreAccess)()
        ],
        handler: store_controller_1.StoreController.getStoreUserStats
    });
    // GET /stores/:id/users/search - Buscar usuários da loja (requer acesso à loja)
    fastify.get('/:id/users/search', {
        schema: store_schema_1.StoreSchemas.searchStoreUsers,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requireStoreAccess)()
        ],
        handler: store_controller_1.StoreController.searchStoreUsers
    });
    // POST /stores/:id/transfer-ownership - Transferir propriedade da loja (apenas super admin)
    fastify.post('/:id/transfer-ownership', {
        schema: store_schema_1.StoreSchemas.transferOwnership,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requireRole)([middlewares_1.UserRole.SUPER_ADMIN])
        ],
        handler: store_controller_1.StoreController.transferOwnership
    });
}
