import { FastifyInstance } from 'fastify';
import { SupplierController } from './supplier.controller';
import {
  SupplierSchemas
} from './supplier.schema';
import { SupplierResponsibleRoutes } from './supplier-responsible.routes';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { storeContextMiddleware } from '@/middlewares/store-context.middleware';

export async function SupplierRoutes(fastify: FastifyInstance) {
  // CRUD básico
  fastify.post('/', {
    schema: SupplierSchemas.create,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: SupplierController.create
  });

  fastify.get('/', {
    schema: SupplierSchemas.list,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: SupplierController.list
  });

  fastify.get('/:id', {
    schema: SupplierSchemas.get,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: SupplierController.get
  });

  fastify.put('/:id', {
    schema: SupplierSchemas.update,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: SupplierController.update
  });

  fastify.delete('/:id', {
    schema: SupplierSchemas.delete,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: SupplierController.delete
  });

  // Funções adicionais
  fastify.get('/cnpj/:cnpj', {
    schema: SupplierSchemas.getByCnpj,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: SupplierController.getByCnpj
  });

  fastify.get('/city/:city', {
    schema: SupplierSchemas.getByCity,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: SupplierController.getByCity
  });

  fastify.get('/state/:state', {
    schema: SupplierSchemas.getByState,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: SupplierController.getByState
  });

  fastify.get('/active', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: SupplierController.getActive
  });

  fastify.get('/stats', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: SupplierController.getStats
  });

  fastify.get('/search', {
    schema: SupplierSchemas.search,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: SupplierController.search
  });

  fastify.get('/top', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: SupplierController.getTopSuppliers
  });

  fastify.patch('/:id/toggle-status', {
    schema: SupplierSchemas.get,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: SupplierController.toggleStatus
  });

  // Registrar rotas de responsáveis
  await fastify.register(SupplierResponsibleRoutes);
}
