import { FastifyInstance } from 'fastify';
import { PlanController } from './plan.controller';
import { PlanSchemas } from './plan.schema';
import { authMiddleware } from '../../middlewares/auth.middleware';

export async function PlanRoutes(fastify: FastifyInstance) {
  // CRUD básico
  fastify.post('/', {
    schema: PlanSchemas.create,
    preHandler: [authMiddleware],
    handler: PlanController.create
  });

  fastify.get('/', {
    schema: PlanSchemas.list,
    handler: PlanController.list
  });

  fastify.get('/:id', {
    schema: PlanSchemas.get,
    handler: PlanController.get
  });

  fastify.put('/:id', {
    schema: PlanSchemas.update,
    preHandler: [authMiddleware],
    handler: PlanController.update
  });

  fastify.delete('/:id', {
    schema: PlanSchemas.delete,
    preHandler: [authMiddleware],
    handler: PlanController.delete
  });

  fastify.delete('/:id/force', {
    schema: PlanSchemas.delete,
    preHandler: [authMiddleware],
    handler: PlanController.forceDelete
  });

  // Funções adicionais
  fastify.get('/active', {
    handler: PlanController.getActive
  });

  fastify.get('/stats', {
    preHandler: [authMiddleware],
    handler: PlanController.getStats
  });

  fastify.get('/compare', {
    schema: PlanSchemas.compare,
    handler: PlanController.compare
  });

  fastify.get('/:id/customers', {
    schema: PlanSchemas.getCustomers,
    preHandler: [authMiddleware],
    handler: PlanController.getCustomers
  });

  fastify.patch('/:id/status', {
    schema: PlanSchemas.updateStatus,
    preHandler: [authMiddleware],
    handler: PlanController.updateStatus
  });
}
