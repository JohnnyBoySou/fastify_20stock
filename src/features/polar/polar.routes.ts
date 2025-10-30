import { FastifyInstance } from 'fastify';
import { PolarController } from './polar.controller';
import { PolarSchemas } from './polar.schema';
import { Middlewares } from '@/middlewares';

export async function PolarRoutes(fastify: FastifyInstance) {
  fastify.get('/plans', {
    schema: PolarSchemas.list,
    handler: PolarController.list
  });

  fastify.post('/checkout', {
    schema: PolarSchemas.createCheckout,
    preHandler: [Middlewares.auth, Middlewares.store],
    handler: PolarController.checkout
  });

  fastify.post('/webhook', {
    handler: PolarController.webhook
  });
}