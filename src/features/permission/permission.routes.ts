import { FastifyInstance } from 'fastify';
import { PermissionController } from './permission.controller';
import { PermissionSchemas } from './permission.schema';
import { authMiddleware, requirePermission } from '@/middlewares';
import { Action } from '@/middlewares/authorization.middleware';

export async function PermissionRoutes(fastify: FastifyInstance) {
  // ================================
  // ROTAS PARA PERMISSÕES CUSTOMIZADAS
  // ================================

  // POST /permissions/user - Criar permissão customizada
  fastify.post('/user', {
    schema: PermissionSchemas.createUserPermission,
    preHandler: [
      authMiddleware,
      requirePermission(Action.CREATE_USER)
    ],
    handler: PermissionController.createUserPermission
  });

  // GET /permissions/user/:userId - Listar permissões de usuário
  fastify.get('/user/:userId', {
    schema: PermissionSchemas.getUserPermissions,
    preHandler: [
      authMiddleware,
      requirePermission(Action.READ_USER)
    ],
    handler: PermissionController.getUserPermissions
  });

  // PUT /permissions/user/:id - Atualizar permissão customizada
  fastify.put('/user/:id', {
    schema: PermissionSchemas.updateUserPermission,
    preHandler: [
      authMiddleware,
      requirePermission(Action.UPDATE_USER)
    ],
    handler: PermissionController.updateUserPermission
  });

  // DELETE /permissions/user/:id - Deletar permissão customizada
  fastify.delete('/user/:id', {
    schema: PermissionSchemas.deleteUserPermission,
    preHandler: [
      authMiddleware,
      requirePermission(Action.DELETE_USER)
    ],
    handler: PermissionController.deleteUserPermission
  });

  // ================================
  // ROTAS PARA PERMISSÕES DE LOJA
  // ================================

  // POST /permissions/store - Definir permissões de usuário em loja
  fastify.post('/store', {
    schema: PermissionSchemas.setStoreUserPermissions,
    preHandler: [
      authMiddleware,
      requirePermission(Action.MANAGE_STORE_USERS)
    ],
    handler: PermissionController.setStoreUserPermissions
  });

  // GET /permissions/store/:storeId - Listar permissões de loja
  fastify.get('/store/:storeId', {
    schema: PermissionSchemas.getStoreUserPermissions,
    preHandler: [
      authMiddleware,
      requirePermission(Action.READ_STORE)
    ],
    handler: PermissionController.getStoreUserPermissions
  });

  // ================================
  // ROTAS PARA CONSULTAS E RELATÓRIOS
  // ================================

  // GET /permissions/effective/:userId - Obter permissões efetivas
  fastify.get('/effective/:userId', {
    schema: PermissionSchemas.getUserEffectivePermissions,
    preHandler: [
      authMiddleware,
      requirePermission(Action.READ_USER)
    ],
    handler: PermissionController.getUserEffectivePermissions
  });

  // POST /permissions/test - Testar permissão específica
  fastify.post('/test', {
    schema: PermissionSchemas.testPermission,
    preHandler: [
      authMiddleware,
      requirePermission(Action.READ_USER)
    ],
    handler: PermissionController.testPermission
  });

  // GET /permissions/stats - Obter estatísticas de permissões
  fastify.get('/stats', {
    schema: PermissionSchemas.getPermissionStats,
    preHandler: [
      authMiddleware,
      requirePermission(Action.VIEW_AUDIT_LOGS)
    ],
    handler: PermissionController.getPermissionStats
  });
}
