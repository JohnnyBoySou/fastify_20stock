import { FastifyInstance } from 'fastify';
import { PolarController } from './polar.controller';
import { PolarSchemas } from './polar.schema';
import { Middlewares } from '@/middlewares';

export async function PolarRoutes(fastify: FastifyInstance) {
  // Listar produtos
  fastify.get('/plans', {
    schema: PolarSchemas.list,
    handler: PolarController.list
  });

  // Criar checkout
  fastify.post('/checkout', {
    schema: PolarSchemas.createCheckout,
    preHandler: [Middlewares.auth, Middlewares.store],
    handler: PolarController.checkout
  });

  // Webhook (público - não requer autenticação)
  fastify.post('/webhook', {
    handler: PolarController.webhook
  });
}