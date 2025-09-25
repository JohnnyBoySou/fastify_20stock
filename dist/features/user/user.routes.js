"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = UserRoutes;
const user_controller_1 = require("./user.controller");
const user_schema_1 = require("./user.schema");
async function UserRoutes(fastify) {
    // POST /users - Criar usuário
    fastify.post('/', {
        schema: user_schema_1.UserSchemas.create,
        handler: user_controller_1.UserController.create
    });
    // GET /users - Listar usuários
    fastify.get('/', {
        schema: user_schema_1.UserSchemas.list,
        handler: user_controller_1.UserController.list
    });
    // GET /users/:id - Buscar usuário por ID
    fastify.get('/:id', {
        schema: user_schema_1.UserSchemas.get,
        handler: user_controller_1.UserController.get
    });
    // PUT /users/:id - Atualizar usuário
    fastify.put('/:id', {
        schema: user_schema_1.UserSchemas.update,
        handler: user_controller_1.UserController.update
    });
    // DELETE /users/:id - Deletar usuário (soft delete)
    fastify.delete('/:id', {
        schema: user_schema_1.UserSchemas.delete,
        handler: user_controller_1.UserController.delete
    });
    // GET /users/email - Buscar usuário por email
    fastify.get('/email', {
        handler: user_controller_1.UserController.getByEmail
    });
    // GET /users/role/:role - Buscar usuários por role
    fastify.get('/role/:role', {
        handler: user_controller_1.UserController.getByRole
    });
    // GET /users/active - Buscar usuários ativos
    fastify.get('/active', {
        handler: user_controller_1.UserController.getActive
    });
    // GET /users/stats - Estatísticas dos usuários
    fastify.get('/stats', {
        handler: user_controller_1.UserController.getStats
    });
    // GET /users/search - Buscar usuários
    fastify.get('/search', {
        handler: user_controller_1.UserController.search
    });
    // PATCH /users/:id/verify-email - Verificar email do usuário
    fastify.patch('/:id/verify-email', {
        handler: user_controller_1.UserController.verifyEmail
    });
    // PATCH /users/:id/last-login - Atualizar último login
    fastify.patch('/:id/last-login', {
        handler: user_controller_1.UserController.updateLastLogin
    });
}
