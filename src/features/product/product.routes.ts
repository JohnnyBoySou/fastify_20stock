import { FastifyInstance } from 'fastify';
import { ProductController } from './product.controller';
import { ProductSchemas } from './product.schema';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { storeContextMiddleware } from '../../middlewares/store-context.middleware';

export async function ProductRoutes(fastify: FastifyInstance) {
  
  // Middlewares para todas as rotas
  fastify.addHook('preHandler', authMiddleware)
  fastify.addHook('preHandler', storeContextMiddleware)

  // CRUD básico
  fastify.post('/', {
    schema: ProductSchemas.create,
    
    handler: ProductController.create
  });

  fastify.get('/', {
    schema: ProductSchemas.list,
    
    handler: ProductController.list
  });

  fastify.get('/:id', {
    schema: ProductSchemas.get,
    
    handler: ProductController.get
  });

  fastify.put('/:id', {
    schema: ProductSchemas.update,
    
    handler: ProductController.update
  });

  fastify.delete('/:id', {
    schema: ProductSchemas.delete,
    
    handler: ProductController.delete
  });

  fastify.delete('/:id/force', {
    schema: ProductSchemas.delete,
    
    handler: ProductController.forceDelete
  });

  // Funções adicionais
  fastify.get('/active', {
    
    handler: ProductController.getActive
  });

  fastify.get('/stats', {
    
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
    
    handler: ProductController.getByStore
  });

  fastify.patch('/:id/status', {
    schema: ProductSchemas.updateStatus,
    
    handler: ProductController.updateStatus
  });

  // === ENDPOINTS PARA GERENCIAR CATEGORIAS DO PRODUTO ===
  fastify.post('/:id/categories', {
    schema: ProductSchemas.addCategories,
    
    handler: ProductController.addCategories
  });

  fastify.delete('/:id/categories', {
    schema: ProductSchemas.removeCategories,
    
    handler: ProductController.removeCategories
  });

  fastify.put('/:id/categories', {
    schema: ProductSchemas.setCategories,
    
    handler: ProductController.setCategories
  });

  fastify.get('/:id/categories', {
    schema: ProductSchemas.getCategories,
    
    handler: ProductController.getCategories
  });

  // fastify.get('/category/:categoryId', {
  //   schema: ProductSchemas.getByCategory,
  //   handler: ProductController.getByCategory
  // });
}
