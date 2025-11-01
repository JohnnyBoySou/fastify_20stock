import { Middlewares } from '@/middlewares'
import type { FastifyInstance } from 'fastify'
import { PolarController } from './polar.controller'
import { PolarSchemas } from './polar.schema'

export async function PolarRoutes(fastify: FastifyInstance) {
  fastify.get('/plans', {
    schema: PolarSchemas.list,
    handler: PolarController.list,
  })

  fastify.get('/plans/free', {
    handler: PolarController.getFreePlan,
  })

  fastify.post('/checkout', {
    schema: PolarSchemas.createCheckout,
    preHandler: [Middlewares.auth, Middlewares.store],
    handler: PolarController.checkout,
  })

  fastify.post('/webhook', {
    // Garante que fastify-raw-body anexe o rawBody neste endpoint
    config: { rawBody: true },
    handler: PolarController.webhook,
  })
}
