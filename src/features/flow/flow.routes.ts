import { Middlewares } from '@/middlewares'
import type { FastifyInstance } from 'fastify'
import { FlowController } from './flow.controller'
import { FlowSchemas } from './flow.schema'

export async function FlowRoutes(fastify: FastifyInstance) {
  // Middlewares para todas as rotas
  fastify.addHook('preHandler', Middlewares.auth)
  fastify.addHook('preHandler', Middlewares.store)

  // CRUD básico
  fastify.post('/flows', {
    schema: FlowSchemas.create,
    handler: FlowController.create,
  })

  fastify.get('/flows', {
    schema: FlowSchemas.list,
    handler: FlowController.list,
  })

  fastify.get('/flows/stats', {
    handler: FlowController.getStats,
  })

  fastify.get('/flows/search', {
    handler: FlowController.search,
  })

  fastify.get('/flows/store', {
    handler: FlowController.getByStore,
  })

  fastify.get('/flows/:id', {
    schema: FlowSchemas.get,
    handler: FlowController.get,
  })

  fastify.put('/flows/:id', {
    schema: FlowSchemas.update,
    handler: FlowController.update,
  })

  fastify.delete('/flows/:id', {
    schema: FlowSchemas.delete,
    handler: FlowController.delete,
  })

  // Funções adicionais
  fastify.patch('/flows/:id/status', {
    schema: FlowSchemas.updateStatus,
    handler: FlowController.updateStatus,
  })

  fastify.post('/flows/:id/duplicate', {
    schema: FlowSchemas.duplicate,
    handler: FlowController.duplicate,
  })

  fastify.post('/flows/:id/test', {
    schema: FlowSchemas.test,
    handler: FlowController.test,
  })
}
