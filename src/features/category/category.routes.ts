import { FastifyInstance } from 'fastify';
import { CategoryController } from './category.controller';
import { CategorySchemas } from './category.schema';
import { authMiddleware } from '../../middlewares/auth.middleware';

export async function CategoryRoutes(fastify: FastifyInstance) {
  // CRUD básico
  fastify.post('/', {
    schema: CategorySchemas.create,
    preHandler: [authMiddleware],
    handler: CategoryController.create
  });

  fastify.get('/', {
    schema: CategorySchemas.list,
    preHandler: [authMiddleware],
    handler: CategoryController.list
  });

  fastify.get('/:id', {
    schema: CategorySchemas.get,
    preHandler: [authMiddleware],
    handler: CategoryController.get
  });

  fastify.put('/:id', {
    schema: CategorySchemas.update,
    preHandler: [authMiddleware],
    handler: CategoryController.update
  });

  fastify.delete('/:id', {
    schema: CategorySchemas.delete,
    preHandler: [authMiddleware],
    handler: CategoryController.delete
  });

  // Funções adicionais - Queries
  fastify.get('/active', {
    preHandler: [authMiddleware],
    handler: CategoryController.getActive
  });

  fastify.get('/stats', {
    preHandler: [authMiddleware],
    handler: CategoryController.getStats
  });

  fastify.get('/search', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          q: { type: 'string' },
          limit: { type: 'number' }
        },
        required: ['q']
      }
    },
    preHandler: [authMiddleware],
    handler: CategoryController.search
  });

  fastify.get('/root', {
    schema: CategorySchemas.getRoot,
    preHandler: [authMiddleware],
    handler: CategoryController.getRootCategories
  });

  fastify.get('/:id/children', {
    schema: CategorySchemas.getChildren,
    preHandler: [authMiddleware],
    handler: CategoryController.getChildren
  });

  fastify.get('/hierarchy', {
    preHandler: [authMiddleware],
    handler: CategoryController.getHierarchy
  });

  fastify.get('/code/:code', {
    schema: {
      params: {
        type: 'object',
        properties: {
          code: { type: 'string' }
        },
        required: ['code']
      }
    },
    preHandler: [authMiddleware],
    handler: CategoryController.getByCode
  });

  // Funções adicionais - Commands
  fastify.patch('/:id/status', {
    schema: CategorySchemas.updateStatus,
    preHandler: [authMiddleware],
    handler: CategoryController.updateStatus
  });

  fastify.patch('/:id/move', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          parentId: { type: 'string', nullable: true }
        }
      }
    },
    preHandler: [authMiddleware],
    handler: CategoryController.moveToParent
  });

  // === RELATÓRIOS ===
  fastify.get('/reports/top-by-products', {
    schema: CategorySchemas.getTopCategoriesByProducts,
    preHandler: [authMiddleware],
    handler: CategoryController.getTopCategoriesByProducts
  });

  fastify.get('/reports/creation-evolution', {
    schema: CategorySchemas.getCategoryCreationEvolution,
    preHandler: [authMiddleware],
    handler: CategoryController.getCategoryCreationEvolution
  });

  fastify.get('/reports/active-inactive-ratio', {
    schema: CategorySchemas.getActiveInactiveRatio,
    preHandler: [authMiddleware],
    handler: CategoryController.getActiveInactiveRatio
  });

  fastify.get('/reports/active-inactive-trend', {
    schema: CategorySchemas.getActiveInactiveTrend,
    preHandler: [authMiddleware],
    handler: CategoryController.getActiveInactiveTrend
  });
}
