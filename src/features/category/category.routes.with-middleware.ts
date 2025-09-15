import { FastifyInstance } from 'fastify';
import { CategoryController } from './category.controller';
import { CategorySchemas } from './category.schema';
import { authMiddleware, requirePermission, requireStoreResourceAccess, requireStoreRoleAccess } from '@/middlewares';
import { Action, StoreRole } from '@/middlewares/authorization.middleware';

export async function categoryRoutesWithMiddleware(fastify: FastifyInstance) {
  // POST /categories - Criar categoria (requer permissão)
  fastify.post('/', {
    schema: CategorySchemas.create,
    preHandler: [
      authMiddleware,
      requirePermission(Action.CREATE_CATEGORY)
    ],
    handler: CategoryController.create
  });

  // GET /categories - Listar categorias (requer permissão)
  fastify.get('/', {
    schema: CategorySchemas.list,
    preHandler: [
      authMiddleware,
      requirePermission(Action.READ_CATEGORY)
    ],
    handler: CategoryController.list
  });

  // GET /categories/:id - Buscar categoria por ID (requer permissão)
  fastify.get('/:id', {
    schema: CategorySchemas.get,
    preHandler: [
      authMiddleware,
      requirePermission(Action.READ_CATEGORY)
    ],
    handler: CategoryController.get
  });

  // PUT /categories/:id - Atualizar categoria (requer permissão)
  fastify.put('/:id', {
    schema: CategorySchemas.update,
    preHandler: [
      authMiddleware,
      requirePermission(Action.UPDATE_CATEGORY)
    ],
    handler: CategoryController.update
  });

  // DELETE /categories/:id - Deletar categoria (requer permissão)
  fastify.delete('/:id', {
    schema: CategorySchemas.delete,
    preHandler: [
      authMiddleware,
      requirePermission(Action.DELETE_CATEGORY)
    ],
    handler: CategoryController.delete
  });

  // PATCH /categories/:id/status - Atualizar status da categoria (requer permissão)
  fastify.patch('/:id/status', {
    schema: CategorySchemas.updateStatus,
    preHandler: [
      authMiddleware,
      requirePermission(Action.UPDATE_CATEGORY)
    ],
    handler: CategoryController.updateStatus
  });

  // PATCH /categories/:id/move - Mover categoria para outro pai (requer permissão)
  fastify.patch('/:id/move', {
    preHandler: [
      authMiddleware,
      requirePermission(Action.UPDATE_CATEGORY)
    ],
    handler: CategoryController.moveToParent
  });

  // GET /categories/active - Listar categorias ativas (requer permissão)
  fastify.get('/active', {
    preHandler: [
      authMiddleware,
      requirePermission(Action.READ_CATEGORY)
    ],
    handler: CategoryController.getActive
  });

  // GET /categories/root - Listar categorias raiz (requer permissão)
  fastify.get('/root', {
    schema: CategorySchemas.getRoot,
    preHandler: [
      authMiddleware,
      requirePermission(Action.READ_CATEGORY)
    ],
    handler: CategoryController.getRootCategories
  });

  // GET /categories/hierarchy - Listar hierarquia de categorias (requer permissão)
  fastify.get('/hierarchy', {
    preHandler: [
      authMiddleware,
      requirePermission(Action.READ_CATEGORY)
    ],
    handler: CategoryController.getHierarchy
  });

  // GET /categories/:id/children - Listar categorias filhas (requer permissão)
  fastify.get('/:id/children', {
    schema: CategorySchemas.getChildren,
    preHandler: [
      authMiddleware,
      requirePermission(Action.READ_CATEGORY)
    ],
    handler: CategoryController.getChildren
  });

  // GET /categories/code/:code - Buscar categoria por código (requer permissão)
  fastify.get('/code/:code', {
    preHandler: [
      authMiddleware,
      requirePermission(Action.READ_CATEGORY)
    ],
    handler: CategoryController.getByCode
  });

  // GET /categories/search - Buscar categorias (requer permissão)
  fastify.get('/search', {
    preHandler: [
      authMiddleware,
      requirePermission(Action.READ_CATEGORY)
    ],
    handler: CategoryController.search
  });

  // GET /categories/stats - Estatísticas das categorias (requer permissão)
  fastify.get('/stats', {
    preHandler: [
      authMiddleware,
      requirePermission(Action.READ_CATEGORY)
    ],
    handler: CategoryController.getStats
  });
}

