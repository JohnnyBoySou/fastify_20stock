import { FastifyInstance } from 'fastify'
import { RoadmapController } from './roadmap.controller'
import { MilestoneController } from './milestone.controller'
import { RoadmapSchemas } from './roadmap.schema'
import { MilestoneSchemas } from './milestone.schema'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { storeContextMiddleware } from '@/middlewares'

export async function RoadmapRoutes(fastify: FastifyInstance) {
  // === ROADMAP ROUTES ===
  // Rotas específicas ANTES das rotas dinâmicas
  fastify.get('/active', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: RoadmapController.getActive
  })

  fastify.get('/stats', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: RoadmapController.getStats
  })

  fastify.get('/search', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: RoadmapController.search
  })

  // CRUD básico
  fastify.post('/', {
    schema: RoadmapSchemas.create,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: RoadmapController.create
  })

  fastify.get('/', {
    schema: RoadmapSchemas.list,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: RoadmapController.list
  })

  fastify.get('/:id', {
    schema: RoadmapSchemas.get,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: RoadmapController.get
  })

  fastify.put('/:id', {
    schema: RoadmapSchemas.update,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: RoadmapController.update
  })

  fastify.delete('/:id', {
    schema: RoadmapSchemas.delete,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: RoadmapController.delete
  })

  // Ações específicas em IDs
  fastify.patch('/:id/status', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: RoadmapController.updateStatus
  })

  // === MILESTONE ROUTES (nested) ===
  // Rotas de milestone específicas ANTES das rotas dinâmicas
  fastify.get('/:roadmapId/milestones/stats', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: MilestoneController.getStats
  })

  fastify.get('/:roadmapId/milestones/upcoming', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: MilestoneController.getUpcoming
  })

  fastify.get('/:roadmapId/milestones/overdue', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: MilestoneController.getOverdue
  })

  fastify.get('/:roadmapId/milestones/in-progress', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: MilestoneController.getInProgress
  })

  fastify.get('/:roadmapId/milestones/timeline', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: MilestoneController.getTimeline
  })

  fastify.get('/:roadmapId/milestones/search', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: MilestoneController.search
  })

  // CRUD básico de milestones
  fastify.post('/:roadmapId/milestones', {
    schema: MilestoneSchemas.create,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: MilestoneController.create
  })

  fastify.get('/:roadmapId/milestones', {
    schema: MilestoneSchemas.list,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: MilestoneController.list
  })

  fastify.get('/:roadmapId/milestones/:id', {
    schema: MilestoneSchemas.get,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: MilestoneController.get
  })

  fastify.put('/:roadmapId/milestones/:id', {
    schema: MilestoneSchemas.update,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: MilestoneController.update
  })

  fastify.delete('/:roadmapId/milestones/:id', {
    schema: MilestoneSchemas.delete,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: MilestoneController.delete
  })

  // Ações específicas em milestones
  fastify.patch('/:roadmapId/milestones/:id/progress', {
    schema: MilestoneSchemas.updateProgress,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: MilestoneController.updateProgress
  })

  fastify.patch('/:roadmapId/milestones/:id/status', {
    schema: MilestoneSchemas.updateStatus,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: MilestoneController.updateStatus
  })

  fastify.post('/:roadmapId/milestones/reorder', {
    schema: MilestoneSchemas.reorder,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: MilestoneController.reorder
  })
}