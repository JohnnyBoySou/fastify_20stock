import { FastifyInstance } from 'fastify';
import { ProductController } from './product.controller';
import { ProductSchemas } from './product.schema';
import { authMiddleware } from '../../middlewares/auth.middleware';

export async function ProductRoutes(fastify: FastifyInstance) {
  // CRUD básico
  fastify.post('/', {
    schema: ProductSchemas.create,
    preHandler: [authMiddleware],
    handler: ProductController.create
  });

  fastify.get('/', {
    schema: ProductSchemas.list,
    preHandler: [authMiddleware],
    handler: ProductController.list
  });

  fastify.get('/:id', {
    schema: ProductSchemas.get,
    preHandler: [authMiddleware],
    handler: ProductController.get
  });

  fastify.put('/:id', {
    schema: ProductSchemas.update,
    preHandler: [authMiddleware],
    handler: ProductController.update
  });

  fastify.delete('/:id', {
    schema: ProductSchemas.delete,
    preHandler: [authMiddleware],
    handler: ProductController.delete
  });

  fastify.delete('/:id/force', {
    schema: ProductSchemas.delete,
    preHandler: [authMiddleware],
    handler: ProductController.forceDelete
  });

  // Funções adicionais
  fastify.get('/active', {
    preHandler: [authMiddleware],
    handler: ProductController.getActive
  });

  fastify.get('/stats', {
    preHandler: [authMiddleware],
    handler: ProductController.getStats
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
    handler: ProductController.search
  });

  fastify.get('/category/:categoryId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          categoryId: { type: 'string' }
        },
        required: ['categoryId']
      }
    },
    preHandler: [authMiddleware],
    handler: ProductController.getByCategory
  });

  fastify.get('/supplier/:supplierId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          supplierId: { type: 'string' }
        },
        required: ['supplierId']
      }
    },
    preHandler: [authMiddleware],
    handler: ProductController.getBySupplier
  });

  fastify.get('/store/:storeId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          storeId: { type: 'string' }
        },
        required: ['storeId']
      }
    },
    preHandler: [authMiddleware],
    handler: ProductController.getByStore
  });

  fastify.patch('/:id/status', {
    schema: ProductSchemas.updateStatus,
    preHandler: [authMiddleware],
    handler: ProductController.updateStatus
  });

  // === ENDPOINTS PARA GERENCIAR CATEGORIAS DO PRODUTO ===
  fastify.post('/:id/categories', {
    schema: ProductSchemas.addCategories,
    preHandler: [authMiddleware],
    handler: ProductController.addCategories
  });

  fastify.delete('/:id/categories', {
    schema: ProductSchemas.removeCategories,
    preHandler: [authMiddleware],
    handler: ProductController.removeCategories
  });

  fastify.put('/:id/categories', {
    schema: ProductSchemas.setCategories,
    preHandler: [authMiddleware],
    handler: ProductController.setCategories
  });

  fastify.get('/:id/categories', {
    schema: ProductSchemas.getCategories,
    preHandler: [authMiddleware],
    handler: ProductController.getCategories
  });

  // fastify.get('/category/:categoryId', {
  //   schema: ProductSchemas.getByCategory,
  //   handler: ProductController.getByCategory
  // });
}
