import type { FastifyInstance } from 'fastify'
import { Middlewares } from '@/middlewares'
import { PlanController } from './plan.controller'
import { PlanSchemas } from './plan.schema'

export async function SubscriptionRoutes(fastify: FastifyInstance) {
  // Middlewares para todas as rotas
  fastify.addHook('preHandler', Middlewares.auth)
  fastify.addHook('preHandler', Middlewares.store)

  // CRUD básico
  fastify.post('/', {
    schema: PlanSchemas.create,
    
    handler: PlanController.create,
  })

  fastify.get('/', {
    schema: PlanSchemas.list,
    handler: PlanController.list,
  })

  fastify.get('/:id', {
    schema: PlanSchemas.get,
    handler: PlanController.get,
  })

  fastify.put('/:id', {
    schema: PlanSchemas.update,
    
    handler: PlanController.update,
  })

  fastify.delete('/:id', {
    schema: PlanSchemas.delete,
    
    handler: PlanController.delete,
  })

  fastify.delete('/:id/force', {
    schema: PlanSchemas.delete,
    
    handler: PlanController.forceDelete,
  })

  // Funções adicionais
  fastify.get('/active', {
    handler: PlanController.getActive,
  })

  fastify.get('/stats', {
    
    handler: PlanController.getStats,
  })

  fastify.get('/compare', {
    schema: PlanSchemas.compare,
    handler: PlanController.compare,
  })

  fastify.get('/:id/customers', {
    schema: PlanSchemas.getCustomers,
    
    handler: PlanController.getCustomers,
  })

  fastify.patch('/:id/status', {
    schema: PlanSchemas.updateStatus,
    
    handler: PlanController.updateStatus,
  })
}
