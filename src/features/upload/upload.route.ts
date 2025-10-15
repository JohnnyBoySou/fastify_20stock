import { FastifyInstance } from 'fastify'
import { UploadController } from './upload.controller'
import { uploadService } from './upload.service'
import {
  createUploadSchema,
  listUploadsSchema,
  getEntityMediaSchema
} from './upload.schema'

import {
  authMiddleware,
  storeContextMiddleware
} from '@/middlewares';

export async function UploadRoutes(fastify: FastifyInstance) {
  // === REGISTRAR PLUGIN MULTIPART ===
  await fastify.register(require('@fastify/multipart'), {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 10 // máximo 10 arquivos por request
    },
    attachFieldsToBody: false, // Manter arquivos separados do body
    sharedSchemaId: 'MultipartFileType' // Schema para validação
  })

  // === CRUD BÁSICO ===
  fastify.post('/', {
    schema: createUploadSchema,
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.create
  })

  fastify.get('/', {
    schema: listUploadsSchema,
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.list
  })

  fastify.get('/:id', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.get
  })

  fastify.put('/:id', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.update
  })

  fastify.delete('/:id', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.delete
  })

  // === UPLOAD DE ARQUIVOS FÍSICOS ===
  fastify.post('/upload', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.uploadSingle
  })

  fastify.post('/upload-multiple', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.uploadMultiple
  })

  // === FUNÇÕES ADICIONAIS ===

  // Buscar por tipo
  fastify.get('/type/:type', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.getByType
  })

  // Buscar recentes
  fastify.get('/recent', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.getRecent
  })

  // Estatísticas
  fastify.get('/stats', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.getStats
  })

  // Buscar mídia
  fastify.get('/search', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.search
  })

  // Uso da mídia
  fastify.get('/:id/usage', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.getMediaUsage
  })

  // Mídias não utilizadas
  fastify.get('/unused', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.getUnusedMedia
  })

  // === GESTÃO DE ANEXOS ===

  // Anexar mídia a uma entidade
  fastify.post('/:id/attach', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.attachMedia
  })

  // Desanexar mídia de uma entidade
  fastify.post('/:id/detach', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.detachMedia
  })

  // Definir mídia principal (apenas para produtos)
  fastify.patch('/:id/set-primary', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.setPrimaryMedia
  })

  // Obter mídias de uma entidade
  fastify.get('/entity/:entityType/:entityId', {
    schema: getEntityMediaSchema,
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.getEntityMedia
  })

  // Obter mídia principal de uma entidade
  fastify.get('/entity/:entityType/:entityId/primary', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.getPrimaryMedia
  })

  // === OPERAÇÕES EM LOTE ===

  // Deletar múltiplas mídias
  fastify.post('/bulk-delete', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.bulkDelete
  })

   // === SERVIÇOS DE MANUTENÇÃO ===

  // Limpeza de arquivos órfãos
  fastify.post('/cleanup-orphaned', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.cleanupOrphanedFiles
  })

  // Configuração do serviço
  fastify.get('/service/config', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.getServiceConfig
  })

  // Estatísticas do sistema de arquivos
  fastify.get('/service/stats', {
    preHandler: [
      authMiddleware,
      storeContextMiddleware,
    ],
    handler: UploadController.getFileSystemStats
  })

  // === SERVIÇO DE ARQUIVOS ESTÁTICOS ===
  // Nota: O serviço de arquivos estáticos é registrado no servidor principal
}