import { FastifyInstance } from 'fastify';
import { CategoryController } from './category.controller';
import { CategorySchemas } from './category.schema';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { storeContextMiddleware } from '../../middlewares/store-context.middleware';

export async function CategoryRoutes(fastify: FastifyInstance) {
  // CRUD básico
  fastify.post('/', {
    schema: CategorySchemas.create,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: CategoryController.create
  });

  fastify.get('/', {
    schema: CategorySchemas.list,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: CategoryController.list
  });

  fastify.get('/:id', {
    schema: CategorySchemas.get,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: CategoryController.get
  });

  fastify.put('/:id', {
    schema: CategorySchemas.update,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: CategoryController.update
  });

  fastify.delete('/:id', {
    schema: CategorySchemas.delete,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: CategoryController.delete
  });

  // Funções adicionais - Queries
  fastify.get('/active', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: CategoryController.getActive
  });

  fastify.get('/stats', {
    preHandler: [authMiddleware, storeContextMiddleware],
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
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: CategoryController.search
  });

  fastify.get('/root', {
    schema: CategorySchemas.getRoot,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: CategoryController.getRootCategories
  });

  fastify.get('/:id/children', {
    schema: CategorySchemas.getChildren,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: CategoryController.getChildren
  });

  fastify.get('/hierarchy', {
    preHandler: [authMiddleware, storeContextMiddleware   ],
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
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: CategoryController.getByCode
  });

  // Funções adicionais - Commands
  fastify.patch('/:id/status', {
    schema: CategorySchemas.updateStatus,
    preHandler: [authMiddleware, storeContextMiddleware],
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
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: CategoryController.moveToParent
  });

  // === RELATÓRIOS ===
  fastify.get('/reports/top-by-products', {
    schema: CategorySchemas.getTopCategoriesByProducts,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: CategoryController.getTopCategoriesByProducts
  });

  fastify.get('/reports/creation-evolution', {
    schema: CategorySchemas.getCategoryCreationEvolution,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: CategoryController.getCategoryCreationEvolution
  });

  fastify.get('/reports/active-inactive-ratio', {
    schema: CategorySchemas.getActiveInactiveRatio,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: CategoryController.getActiveInactiveRatio
  });

  fastify.get('/reports/active-inactive-trend', {
    schema: CategorySchemas.getActiveInactiveTrend,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: CategoryController.getActiveInactiveTrend
  });
}
