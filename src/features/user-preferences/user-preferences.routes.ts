import { FastifyInstance } from 'fastify'
import { UserPreferencesController } from './user-preferences.controller'
import {
  createUserPreferencesSchema,
  updateUserPreferencesSchema,
  getUserPreferencesSchema,
  getUserPreferencesByUserIdSchema,
  deleteUserPreferencesSchema,
  listUserPreferencesSchema,
  getUserPreferencesStatsSchema,
  searchUserPreferencesSchema,
  validateUserPreferencesSchema
} from './user-preferences.schema'
import { authMiddleware, storeContextMiddleware } from '@/middlewares'

// ================================
// USER PREFERENCES ROUTES
// ================================

export async function UserPreferencesRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authMiddleware)
  fastify.addHook('preHandler', storeContextMiddleware)
  // CRUD básico
  fastify.post('/', {
    schema: createUserPreferencesSchema,
    handler: UserPreferencesController.create
  })

  fastify.get('/', {
    schema: listUserPreferencesSchema,
    handler: UserPreferencesController.list
  })

  fastify.get('/:id', {
    schema: getUserPreferencesSchema,
    handler: UserPreferencesController.get
  })

  fastify.put('/:id', {
    schema: updateUserPreferencesSchema,
    handler: UserPreferencesController.update
  })

  fastify.delete('/:id', {
    schema: deleteUserPreferencesSchema,
    handler: UserPreferencesController.delete
  })

  // Funções específicas por usuário
  fastify.get('/user/:userId', {
    schema: getUserPreferencesByUserIdSchema,
    handler: UserPreferencesController.getByUserId
  })

  fastify.get('/user/:userId/or-create', {
    schema: getUserPreferencesByUserIdSchema,
    handler: UserPreferencesController.getByUserIdOrCreate
  })

  fastify.put('/user/:userId', {
    schema: updateUserPreferencesSchema,
    handler: UserPreferencesController.updateByUserId
  })

  fastify.delete('/user/:userId', {
    schema: deleteUserPreferencesSchema,
    handler: UserPreferencesController.deleteByUserId
  })

  // Funções de filtro e busca
  fastify.get('/theme/:theme', {
    handler: UserPreferencesController.getByTheme
  })

  fastify.get('/language/:language', {
    handler: UserPreferencesController.getByLanguage
  })

  fastify.get('/currency/:currency', {
    handler: UserPreferencesController.getByCurrency
  })

  fastify.get('/custom-settings', {
    handler: UserPreferencesController.getWithCustomSettings
  })

  // Funções de estatísticas e busca
  fastify.get('/stats', {
    schema: getUserPreferencesStatsSchema,
    handler: UserPreferencesController.getStats
  })

  fastify.get('/search', {
    schema: searchUserPreferencesSchema,
    handler: UserPreferencesController.search
  })

  // Funções de reset
  fastify.patch('/:id/reset', {
    schema: getUserPreferencesSchema,
    handler: UserPreferencesController.resetToDefaults
  })

  fastify.patch('/user/:userId/reset', {
    schema: getUserPreferencesByUserIdSchema,
    handler: UserPreferencesController.resetToDefaultsByUserId
  })

  // Função de validação
  fastify.post('/validate', {
    schema: validateUserPreferencesSchema,
    handler: UserPreferencesController.validatePreferences
  })
}
