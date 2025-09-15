import { FastifyInstance } from 'fastify';
import { UserController } from './user.controller';
import {
  UserSchemas
} from './user.schema';
import {
  authMiddleware,
  requireRole,
  requirePermission,
  requireOwnership,
  UserRole,
  Action
} from '../../middlewares';

export async function UserRoutesWithMiddleware(fastify: FastifyInstance) {
  // POST /users - Criar usuário (requer permissão)
  fastify.post('/', {
    schema: UserSchemas.create,
    preHandler: [authMiddleware, requirePermission(Action.CREATE_USER)],
    handler: UserController.create
  });

  // GET /users - Listar usuários (requer permissão)
  fastify.get('/', {
    schema: UserSchemas.list,
    preHandler: [authMiddleware, requirePermission(Action.LIST_USERS)],
    handler: UserController.list
  });

  // GET /users/:id - Buscar usuário por ID (requer permissão)
  fastify.get('/:id', {
    schema: UserSchemas.get,
    preHandler: [authMiddleware, requirePermission(Action.READ_USER)],
    handler: UserController.get
  });

  // PUT /users/:id - Atualizar usuário (requer permissão + ownership)
  fastify.put('/:id', {
    schema: UserSchemas.update,
    preHandler: [
      authMiddleware, 
      requirePermission(Action.UPDATE_USER),
      requireOwnership('id') // Usuário só pode editar seu próprio perfil
    ],
    handler: UserController.update
  });

  // DELETE /users/:id - Deletar usuário (apenas admin)
  fastify.delete('/:id', {
    schema: UserSchemas.delete,
    preHandler: [authMiddleware, requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])],
    handler: UserController.delete
  });

  // GET /users/email - Buscar usuário por email (requer permissão)
  fastify.get('/email', {
    preHandler: [authMiddleware, requirePermission(Action.READ_USER)],
    handler: UserController.getByEmail
  });

  // GET /users/role/:role - Buscar usuários por role (apenas admin)
  fastify.get('/role/:role', {
    preHandler: [authMiddleware, requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])],
    handler: UserController.getByRole
  });

  // GET /users/active - Buscar usuários ativos (requer permissão)
  fastify.get('/active', {
    preHandler: [authMiddleware, requirePermission(Action.LIST_USERS)],
    handler: UserController.getActive
  });

  // GET /users/stats - Estatísticas dos usuários (apenas admin)
  fastify.get('/stats', {
    preHandler: [authMiddleware, requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])],
    handler: UserController.getStats
  });

  // GET /users/search - Buscar usuários (requer permissão)
  fastify.get('/search', {
    preHandler: [authMiddleware, requirePermission(Action.LIST_USERS)],
    handler: UserController.search
  });

  // PATCH /users/:id/verify-email - Verificar email do usuário (apenas admin)
  fastify.patch('/:id/verify-email', {
    preHandler: [authMiddleware, requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])],
    handler: UserController.verifyEmail
  });

  // PATCH /users/:id/last-login - Atualizar último login (sistema interno)
  fastify.patch('/:id/last-login', {
    preHandler: [authMiddleware, requireRole([UserRole.SUPER_ADMIN])],
    handler: UserController.updateLastLogin
  });
}
