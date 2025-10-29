import { FastifyInstance } from 'fastify';
import { PushSubscriptionController } from './push-subscription.controller';
import { PushSubscriptionSchemas } from './push-subscription.schema';
import { authMiddleware } from '@/middlewares/auth.middleware';

export async function PushSubscriptionRoutes(fastify: FastifyInstance) {
  // Rotas autenticadas
  fastify.post('/', {
    schema: PushSubscriptionSchemas.create,
    preHandler: [authMiddleware],
    handler: PushSubscriptionController.create
  });

  fastify.delete('/:id', {
    schema: PushSubscriptionSchemas.delete,
    preHandler: [authMiddleware],
    handler: PushSubscriptionController.delete
  });

  fastify.get('/user/:userId', {
    preHandler: [authMiddleware],
    handler: PushSubscriptionController.listByUser
  });

  fastify.get('/vapid-key', {
    schema: PushSubscriptionSchemas.getVapidKey,
    handler: PushSubscriptionController.getVapidKey
  });
}

