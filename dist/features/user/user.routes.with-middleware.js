"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutesWithMiddleware = UserRoutesWithMiddleware;
const user_controller_1 = require("./user.controller");
const user_schema_1 = require("./user.schema");
const middlewares_1 = require("../../middlewares");
async function UserRoutesWithMiddleware(fastify) {
    // POST /users - Criar usuário (requer permissão)
    fastify.post('/', {
        schema: user_schema_1.UserSchemas.create,
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requirePermission)(middlewares_1.Action.CREATE_USER)],
        handler: user_controller_1.UserController.create
    });
    // GET /users - Listar usuários (requer permissão)
    fastify.get('/', {
        schema: user_schema_1.UserSchemas.list,
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requirePermission)(middlewares_1.Action.LIST_USERS)],
        handler: user_controller_1.UserController.list
    });
    // GET /users/:id - Buscar usuário por ID (requer permissão)
    fastify.get('/:id', {
        schema: user_schema_1.UserSchemas.get,
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requirePermission)(middlewares_1.Action.READ_USER)],
        handler: user_controller_1.UserController.get
    });
    // PUT /users/:id - Atualizar usuário (requer permissão + ownership)
    fastify.put('/:id', {
        schema: user_schema_1.UserSchemas.update,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(middlewares_1.Action.UPDATE_USER),
            (0, middlewares_1.requireOwnership)('id') // Usuário só pode editar seu próprio perfil
        ],
        handler: user_controller_1.UserController.update
    });
    // DELETE /users/:id - Deletar usuário (apenas admin)
    fastify.delete('/:id', {
        schema: user_schema_1.UserSchemas.delete,
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requireRole)([middlewares_1.UserRole.ADMIN, middlewares_1.UserRole.SUPER_ADMIN])],
        handler: user_controller_1.UserController.delete
    });
    // GET /users/email - Buscar usuário por email (requer permissão)
    fastify.get('/email', {
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requirePermission)(middlewares_1.Action.READ_USER)],
        handler: user_controller_1.UserController.getByEmail
    });
    // GET /users/role/:role - Buscar usuários por role (apenas admin)
    fastify.get('/role/:role', {
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requireRole)([middlewares_1.UserRole.ADMIN, middlewares_1.UserRole.SUPER_ADMIN])],
        handler: user_controller_1.UserController.getByRole
    });
    // GET /users/active - Buscar usuários ativos (requer permissão)
    fastify.get('/active', {
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requirePermission)(middlewares_1.Action.LIST_USERS)],
        handler: user_controller_1.UserController.getActive
    });
    // GET /users/stats - Estatísticas dos usuários (apenas admin)
    fastify.get('/stats', {
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requireRole)([middlewares_1.UserRole.ADMIN, middlewares_1.UserRole.SUPER_ADMIN])],
        handler: user_controller_1.UserController.getStats
    });
    // GET /users/search - Buscar usuários (requer permissão)
    fastify.get('/search', {
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requirePermission)(middlewares_1.Action.LIST_USERS)],
        handler: user_controller_1.UserController.search
    });
    // PATCH /users/:id/verify-email - Verificar email do usuário (apenas admin)
    fastify.patch('/:id/verify-email', {
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requireRole)([middlewares_1.UserRole.ADMIN, middlewares_1.UserRole.SUPER_ADMIN])],
        handler: user_controller_1.UserController.verifyEmail
    });
    // PATCH /users/:id/last-login - Atualizar último login (sistema interno)
    fastify.patch('/:id/last-login', {
        preHandler: [middlewares_1.authMiddleware, (0, middlewares_1.requireRole)([middlewares_1.UserRole.SUPER_ADMIN])],
        handler: user_controller_1.UserController.updateLastLogin
    });
}
