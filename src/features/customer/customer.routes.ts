import { FastifyInstance } from 'fastify';
import { CustomerController } from './customer.controller';
import { CustomerSchemas } from './customer.schema';
import { authMiddleware } from '../../middlewares/auth.middleware';

export async function CustomerRoutes(fastify: FastifyInstance) {
  // CRUD básico
  fastify.post('/', {
    schema: CustomerSchemas.create,
    preHandler: [authMiddleware],
    handler: CustomerController.create
  });

  fastify.get('/', {
    schema: CustomerSchemas.list,
    preHandler: [authMiddleware],
    handler: CustomerController.list
  });

  fastify.get('/:id', {
    schema: CustomerSchemas.get,
    handler: CustomerController.get
  });

  fastify.put('/:id', {
    schema: CustomerSchemas.update,
    preHandler: [authMiddleware],
    handler: CustomerController.update
  });

  fastify.delete('/:id', {
    schema: CustomerSchemas.delete,
    preHandler: [authMiddleware],
    handler: CustomerController.delete
  });

  fastify.delete('/:id/force', {
    schema: CustomerSchemas.delete,
    preHandler: [authMiddleware],
    handler: CustomerController.forceDelete
  });

  // Funções adicionais
  fastify.get('/user/:userId', {
    schema: {
      params: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string' }
        }
      }
    },
    handler: CustomerController.getByUserId
  });

  fastify.get('/active', {
    handler: CustomerController.getActive
  });

  fastify.get('/trial', {
    preHandler: [authMiddleware],
    handler: CustomerController.getTrial
  });

  fastify.get('/cancelled', {
    preHandler: [authMiddleware],
    handler: CustomerController.getCancelled
  });

  fastify.get('/stats', {
    preHandler: [authMiddleware],
    handler: CustomerController.getStats
  });

  fastify.get('/:id/invoices', {
    schema: CustomerSchemas.getInvoices,
    handler: CustomerController.getInvoices
  });

  fastify.get('/:id/subscription-status', {
    schema: CustomerSchemas.getSubscriptionStatus,
    handler: CustomerController.getSubscriptionStatus
  });

  // Funções de gerenciamento
  fastify.patch('/:id/plan', {
    schema: CustomerSchemas.updatePlan,
    preHandler: [authMiddleware],
    handler: CustomerController.updatePlan
  });

  fastify.patch('/:id/cancel', {
    schema: CustomerSchemas.cancel,
    preHandler: [authMiddleware],
    handler: CustomerController.cancel
  });

  fastify.patch('/:id/renew', {
    schema: CustomerSchemas.renew,
    preHandler: [authMiddleware],
    handler: CustomerController.renew
  });

  fastify.patch('/:id/trial', {
    schema: CustomerSchemas.startTrial,
    preHandler: [authMiddleware],
    handler: CustomerController.startTrial
  });

  fastify.patch('/:id/status', {
    schema: CustomerSchemas.updateStatus,
    preHandler: [authMiddleware],
    handler: CustomerController.updateStatus
  });
}
