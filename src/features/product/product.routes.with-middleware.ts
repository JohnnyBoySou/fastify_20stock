import { FastifyInstance } from 'fastify';
import { ProductController } from './product.controller';
import {
  ProductSchemas
} from './product.schema';
import {
  authMiddleware,
  requireRole,
  requirePermission,
  requireStoreResourceAccess,
  requireStoreRoleAccess,
  UserRole,
  Action,
  StoreRole
} from '../../middlewares';

export async function ProductRoutesWithMiddleware(fastify: FastifyInstance) {
  // POST /products - Criar produto (requer permissão + acesso à loja)
  fastify.post('/', {
    schema: ProductSchemas.create,
    preHandler: [
      authMiddleware,
      requirePermission(Action.CREATE_PRODUCT),
      requireStoreResourceAccess('storeId') // Verifica acesso à loja via body
    ],
    handler: ProductController.create
  });

  // GET /products - Listar produtos (requer permissão)
  fastify.get('/', {
    schema: ProductSchemas.list,
    preHandler: [authMiddleware, requirePermission(Action.LIST_PRODUCTS)],
    handler: ProductController.list
  });

  // GET /products/:id - Buscar produto por ID (requer permissão)
  fastify.get('/:id', {
    schema: ProductSchemas.get,
    preHandler: [authMiddleware, requirePermission(Action.READ_PRODUCT)],
    handler: ProductController.get
  });

  // PUT /products/:id - Atualizar produto (requer permissão + acesso à loja)
  fastify.put('/:id', {
    schema: ProductSchemas.update,
    preHandler: [
      authMiddleware,
      requirePermission(Action.UPDATE_PRODUCT),
      requireStoreResourceAccess('storeId') // Verifica acesso à loja via body
    ],
    handler: ProductController.update
  });

  // DELETE /products/:id - Deletar produto (requer permissão + acesso à loja)
  fastify.delete('/:id', {
    schema: ProductSchemas.delete,
    preHandler: [
      authMiddleware,
      requirePermission(Action.DELETE_PRODUCT),
      requireStoreResourceAccess('storeId') // Verifica acesso à loja via body
    ],
    handler: ProductController.delete
  });

  // GET /products/store/:storeId - Buscar produtos por loja (requer acesso à loja)
  fastify.get('/store/:storeId', {
    preHandler: [
      authMiddleware,
      requireStoreResourceAccess()
    ],
    handler: ProductController.getByStore
  });

  // GET /products/category/:categoryId - Buscar produtos por categoria (requer permissão)
  fastify.get('/category/:categoryId', {
    preHandler: [authMiddleware, requirePermission(Action.READ_PRODUCT)],
    handler: ProductController.getByCategory
  });

  // GET /products/supplier/:supplierId - Buscar produtos por fornecedor (requer permissão)
  fastify.get('/supplier/:supplierId', {
    preHandler: [authMiddleware, requirePermission(Action.READ_PRODUCT)],
    handler: ProductController.getBySupplier
  });

  // GET /products/active - Buscar produtos ativos (requer permissão)
  fastify.get('/active', {
    preHandler: [authMiddleware, requirePermission(Action.LIST_PRODUCTS)],
    handler: ProductController.getActive
  });

  // GET /products/stats - Estatísticas dos produtos (requer permissão)
  fastify.get('/stats', {
    preHandler: [authMiddleware, requirePermission(Action.READ_PRODUCT)],
    handler: ProductController.getStats
  });

  // GET /products/search - Buscar produtos (requer permissão)
  fastify.get('/search', {
    preHandler: [authMiddleware, requirePermission(Action.READ_PRODUCT)],
    handler: ProductController.search
  });

  // PATCH /products/:id/verify-sku - Verificar SKU do produto (requer permissão + acesso à loja)
  fastify.patch('/:id/verify-sku', {
    schema: ProductSchemas.verifySku,
    preHandler: [
      authMiddleware,
      requirePermission(Action.UPDATE_PRODUCT),
      requireStoreResourceAccess('storeId')
    ],
    handler: ProductController.verifySku
  });

  // PATCH /products/:id/update-stock - Atualizar estoque (requer permissão + acesso à loja)
  fastify.patch('/:id/update-stock', {
    schema: ProductSchemas.updateStock,
    preHandler: [
      authMiddleware,
      requirePermission(Action.UPDATE_PRODUCT),
      requireStoreResourceAccess('storeId')
    ],
    handler: ProductController.updateStock
  });

  // GET /products/:id/movements - Listar movimentações do produto (requer permissão + acesso à loja)
  fastify.get('/:id/movements', {
    schema: ProductSchemas.getMovements,
    preHandler: [
      authMiddleware,
      requirePermission(Action.READ_MOVEMENT),
      requireStoreResourceAccess('storeId')
    ],
    handler: ProductController.getMovements
  });

  // POST /products/:id/movements - Criar movimentação do produto (requer permissão + acesso à loja)
  fastify.post('/:id/movements', {
    schema: ProductSchemas.createMovement,
    preHandler: [
      authMiddleware,
      requirePermission(Action.CREATE_MOVEMENT),
      requireStoreResourceAccess('storeId'),
      requireStoreRoleAccess([StoreRole.ADMIN, StoreRole.MANAGER, StoreRole.STAFF])
    ],
    handler: ProductController.createMovement
  });

  // GET /products/:id/stock - Buscar estoque atual do produto (requer permissão + acesso à loja)
  fastify.get('/:id/stock', {
    schema: ProductSchemas.getStock,
    preHandler: [
      authMiddleware,
      requirePermission(Action.READ_PRODUCT),
      requireStoreResourceAccess('storeId')
    ],
    handler: ProductController.getStock
  });

  // GET /products/:id/stock/history - Histórico de estoque do produto (requer permissão + acesso à loja)
  fastify.get('/:id/stock/history', {
    schema: ProductSchemas.getStockHistory,
    preHandler: [
      authMiddleware,
      requirePermission(Action.READ_PRODUCT),
      requireStoreResourceAccess('storeId')
    ],
    handler: ProductController.getStockHistory
  });

  // GET /products/low-stock - Produtos com estoque baixo (requer permissão)
  fastify.get('/low-stock', {
    schema: ProductSchemas.getLowStock,
    preHandler: [
      authMiddleware,
      requirePermission(Action.READ_PRODUCT)
    ],
    handler: ProductController.getLowStock
  });

  // GET /products/:id/analytics - Analytics do produto (requer permissão + acesso à loja)
  fastify.get('/:id/analytics', {
    schema: ProductSchemas.getAnalytics,
    preHandler: [
      authMiddleware,
      requirePermission(Action.READ_PRODUCT),
      requireStoreResourceAccess('storeId')
    ],
    handler: ProductController.getAnalytics
  });
}
