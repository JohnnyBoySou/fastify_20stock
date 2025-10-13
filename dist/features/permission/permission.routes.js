"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionRoutes = PermissionRoutes;
const permission_controller_1 = require("./permission.controller");
const permission_schema_1 = require("./permission.schema");
const middlewares_1 = require("../../middlewares");
const authorization_middleware_1 = require("../../middlewares/authorization.middleware");
async function PermissionRoutes(fastify) {
    // ================================
    // ROTAS PARA PERMISSÕES CUSTOMIZADAS
    // ================================
    // POST /permissions/user - Criar permissão customizada
    fastify.post('/user', {
        schema: permission_schema_1.PermissionSchemas.createUserPermission,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.CREATE_USER)
        ],
        handler: permission_controller_1.PermissionController.createUserPermission
    });
    // GET /permissions/user/:userId - Listar permissões de usuário
    fastify.get('/user/:userId', {
        schema: permission_schema_1.PermissionSchemas.getUserPermissions,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.READ_USER)
        ],
        handler: permission_controller_1.PermissionController.getUserPermissions
    });
    // PUT /permissions/user/:id - Atualizar permissão customizada
    fastify.put('/user/:id', {
        schema: permission_schema_1.PermissionSchemas.updateUserPermission,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.UPDATE_USER)
        ],
        handler: permission_controller_1.PermissionController.updateUserPermission
    });
    // DELETE /permissions/user/:id - Deletar permissão customizada
    fastify.delete('/user/:id', {
        schema: permission_schema_1.PermissionSchemas.deleteUserPermission,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.DELETE_USER)
        ],
        handler: permission_controller_1.PermissionController.deleteUserPermission
    });
    // ================================
    // ROTAS PARA PERMISSÕES DE LOJA
    // ================================
    // POST /permissions/store - Definir permissões de usuário em loja
    fastify.post('/store', {
        schema: permission_schema_1.PermissionSchemas.setStoreUserPermissions,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.MANAGE_STORE_USERS)
        ],
        handler: permission_controller_1.PermissionController.setStoreUserPermissions
    });
    // GET /permissions/store/:storeId - Listar permissões de loja
    fastify.get('/store/:storeId', {
        schema: permission_schema_1.PermissionSchemas.getStoreUserPermissions,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.READ_STORE)
        ],
        handler: permission_controller_1.PermissionController.getStoreUserPermissions
    });
    // ================================
    // ROTAS PARA CONSULTAS E RELATÓRIOS
    // ================================
    // GET /permissions/effective/:userId - Obter permissões efetivas
    fastify.get('/effective/:userId', {
        schema: permission_schema_1.PermissionSchemas.getUserEffectivePermissions,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.READ_USER)
        ],
        handler: permission_controller_1.PermissionController.getUserEffectivePermissions
    });
    // POST /permissions/test - Testar permissão específica
    fastify.post('/test', {
        schema: permission_schema_1.PermissionSchemas.testPermission,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.READ_USER)
        ],
        handler: permission_controller_1.PermissionController.testPermission
    });
    // GET /permissions/stats - Obter estatísticas de permissões
    fastify.get('/stats', {
        schema: permission_schema_1.PermissionSchemas.getPermissionStats,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.VIEW_AUDIT_LOGS)
        ],
        handler: permission_controller_1.PermissionController.getPermissionStats
    });
}
