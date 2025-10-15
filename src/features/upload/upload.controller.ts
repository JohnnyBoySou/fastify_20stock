import { FastifyRequest, FastifyReply } from 'fastify'
import path from 'path'
import { UploadCommands } from './commands/upload.commands'
import { UploadQueries } from './queries/upload.queries'
import { uploadService } from './upload.service'
import {
  CreateUploadRequest,
  GetUploadRequest,
  UpdateUploadRequest,
  DeleteUploadRequest,
  ListUploadsRequest,
  AttachMediaRequest,
  DetachMediaRequest
} from './upload.interfaces'

export const UploadController = {
  // === CRUD BÁSICO ===
  async create(request: CreateUploadRequest, reply: FastifyReply) {
    try {
      const { name, type, size } = request.body

      // URL será fornecida pelo service de upload
      const result = await UploadCommands.create({
        url: '', // Será preenchida pelo service
        name,
        type,
        size
      })

      return reply.status(201).send(result)
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message === 'Validation error') {
        return reply.status(400).send({
          error: error.message
        })
      }

      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async get(request: GetUploadRequest, reply: FastifyReply) {
    try {
      const { id } = request.params

      const result = await UploadQueries.getById(id)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message === 'Media not found') {
        return reply.status(404).send({
          error: error.message
        })
      }

      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async update(request: UpdateUploadRequest, reply: FastifyReply) {
    try {
      const { id } = request.params
      const updateData = { ...request.body }
      
      const result = await UploadCommands.update(id, updateData)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message === 'Media not found') {
        return reply.status(404).send({
          error: error.message
        })
      }

      if (error.message === 'Validation error') {
        return reply.status(400).send({
          error: error.message
        })
      }

      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async delete(request: DeleteUploadRequest, reply: FastifyReply) {
    try {
      const { id } = request.params

      // Obter informações da mídia antes de deletar
      const media = await UploadQueries.getById(id)
      if (!media) {
        return reply.status(404).send({
          error: 'Media not found'
        })
      }

      // Deletar do banco de dados
      await UploadCommands.delete(id)

      // Tentar deletar o arquivo físico (não falha se não existir)
      try {
        const filePath = path.join(process.cwd(), 'src', 'uploads', media.url.replace('/uploads/', ''))
        await uploadService.deleteFile(filePath)
      } catch (fileError) {
        // Log do erro mas não falha a operação
        request.log.warn(`Arquivo físico não encontrado: ${media.url}`)
      }

      return reply.status(204).send()
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message === 'Media not found') {
        return reply.status(404).send({
          error: error.message
        })
      }

      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async list(request: ListUploadsRequest, reply: FastifyReply) {
    try {
      const { page = 1, limit = 10, search, type, entityType, entityId } = request.query

      const result = await UploadQueries.list({
        page,
        limit,
        search,
        type,
        entityType,
        entityId
      })

      return reply.send(result)
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  // === FUNÇÕES ADICIONAIS (QUERIES) ===
  async getByType(request: FastifyRequest<{ Querystring: { type: string; limit?: number } }>, reply: FastifyReply) {
    try {
      const { type, limit = 10 } = request.query

      const result = await UploadQueries.getByType(type, limit)

      return reply.send({ uploads: result })
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async getRecent(request: FastifyRequest<{ Querystring: { limit?: number } }>, reply: FastifyReply) {
    try {
      const { limit = 20 } = request.query

      const result = await UploadQueries.getRecent(limit)

      return reply.send({ uploads: result })
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async getEntityMedia(request: FastifyRequest<{ Params: { entityType: string; entityId: string } }>, reply: FastifyReply) {
    try {
      const { entityType, entityId } = request.params

      const result = await UploadQueries.getEntityMedia(entityType, entityId)

      return reply.send({ media: result })
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message === 'Invalid entity type') {
        return reply.status(400).send({
          error: error.message
        })
      }

      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async getPrimaryMedia(request: FastifyRequest<{ Params: { entityType: string; entityId: string } }>, reply: FastifyReply) {
    try {
      const { entityType, entityId } = request.params

      const result = await UploadQueries.getPrimaryMedia(entityType, entityId)

      if (!result) {
        return reply.status(404).send({
          error: 'No media found'
        })
      }

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message === 'Invalid entity type') {
        return reply.status(400).send({
          error: error.message
        })
      }

      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    try {

      const result = await UploadQueries.getStats()

      return reply.send(result)
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async search(request: FastifyRequest<{ Querystring: { q: string; limit?: number } }>, reply: FastifyReply) {
    try {
      const { q, limit = 10 } = request.query

      const result = await UploadQueries.search(q, limit)

      return reply.send({ uploads: result })
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async getMediaUsage(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params

      const result = await UploadQueries.getMediaUsage(id)

      return reply.send(result)
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async getUnusedMedia(request: FastifyRequest<{ Querystring: { daysOld?: number } }>, reply: FastifyReply) {
    try {
      const { daysOld = 30 } = request.query

      const result = await UploadQueries.getUnusedMedia(daysOld)

      return reply.send({ uploads: result })
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  // === FUNÇÕES ADICIONAIS (COMMANDS) ===
  async attachMedia(request: AttachMediaRequest, reply: FastifyReply) {
    try {
      const { id } = request.params
      const { entityType, entityId, isPrimary } = request.body

      let result

      switch (entityType) {
        case 'product':
          result = await UploadCommands.attachToProduct({
            mediaId: id,
            entityType,
            entityId,
            isPrimary
          })
          break
        case 'supplier':
          result = await UploadCommands.attachToSupplier({
            mediaId: id,
            entityType,
            entityId
          })
          break
        case 'user':
          result = await UploadCommands.attachToUser({
            mediaId: id,
            entityType,
            entityId
          })
          break
        case 'store':
          result = await UploadCommands.attachToStore({
            mediaId: id,
            entityType,
            entityId
          })
          break
        default:
          return reply.status(400).send({
            error: 'Invalid entity type'
          })
      }

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message === 'Invalid entity type for attachment') {
        return reply.status(400).send({
          error: error.message
        })
      }

      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async detachMedia(request: DetachMediaRequest, reply: FastifyReply) {
    try {
      const { id } = request.params
      const { entityType, entityId } = request.body

      let result

      switch (entityType) {
        case 'product':
          result = await UploadCommands.detachFromProduct(id, entityId)
          break
        case 'supplier':
          result = await UploadCommands.detachFromSupplier(id, entityId)
          break
        case 'user':
          result = await UploadCommands.detachFromUser(id, entityId)
          break
        case 'store':
          result = await UploadCommands.detachFromStore(id, entityId)
          break
        default:
          return reply.status(400).send({
            error: 'Invalid entity type'
          })
      }

      return reply.send({ success: true })
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message === 'Media attachment not found') {
        return reply.status(404).send({
          error: error.message
        })
      }

      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async setPrimaryMedia(request: FastifyRequest<{ 
    Params: { id: string }
    Body: { entityType: string; entityId: string }
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const { entityType, entityId } = request.body

      let result

      if (entityType === 'product') {
        result = await UploadCommands.setPrimaryForProduct(id, entityId)
      } else {
        return reply.status(400).send({
          error: 'Primary media is only supported for products'
        })
      }

      return reply.send({ success: true })
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message === 'Media not found') {
        return reply.status(404).send({
          error: error.message
        })
      }

      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async bulkDelete(request: FastifyRequest<{ Body: { mediaIds: string[] } }>, reply: FastifyReply) {
    try {
      const { mediaIds } = request.body
      
      const result = await UploadCommands.bulkDelete(mediaIds)

      return reply.send(result)
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  // === UPLOAD DE ARQUIVOS FÍSICOS ===
  async uploadSingle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await (request as any).file()
      
      if (!data) {
        return reply.status(400).send({
          error: 'Nenhum arquivo enviado'
        })
      }

      // Verificar se o arquivo tem as propriedades necessárias
      if (!data.file) {
        return reply.status(400).send({
          error: 'Arquivo inválido - propriedade file não encontrada'
        })
      }

      // Obter configurações do body ou query
      const { entityType = 'general' } = request.body as any || request.query as any

      // Preparar objeto de arquivo no formato esperado pelo service
      const fileData = {
        fieldname: data.fieldname,
        filename: data.filename,
        originalname: data.filename,
        encoding: data.encoding,
        mimetype: data.mimetype,
        size: data.file.bytesRead,
        destination: '', // Será definido pelo service
        path: data.file.path || data.file.filename, // Usar filename se path não estiver disponível
        url: '' // Será definido pelo service
      }

      // Upload do arquivo físico
      const uploadResult = await uploadService.uploadSingle(fileData, {
        entityType: entityType as any
      })

      // Criar registro no banco
      const dbResult = await UploadCommands.create({
        url: uploadResult.url,
        name: uploadResult.name,
        type: uploadResult.type,
        size: uploadResult.size
      })

      return reply.status(201).send({
        ...dbResult,
        path: uploadResult.path
      })
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message.includes('não permitido') || error.message.includes('muito grande')) {
        return reply.status(400).send({
          error: error.message
        })
      }

      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async uploadMultiple(request: FastifyRequest, reply: FastifyReply) {
    try {
      const files = (request as any).files()
      const uploadedFiles: any[] = []

      // Obter configurações do body ou query
      const { entityType = 'general', maxFiles = 10 } = request.body as any || request.query as any

      // Processar arquivos
      for await (const file of files) {
        // Verificar se o arquivo tem as propriedades necessárias
        if (file.file) {
          const fileData = {
            fieldname: file.fieldname,
            filename: file.filename,
            originalname: file.filename,
            encoding: file.encoding,
            mimetype: file.mimetype,
            size: file.file.bytesRead,
            destination: '', // Será definido pelo service
            path: file.file.path || file.file.filename, // Usar filename se path não estiver disponível
            url: '' // Será definido pelo service
          }
          uploadedFiles.push(fileData)
        }
      }

      if (uploadedFiles.length === 0) {
        return reply.status(400).send({
          error: 'Nenhum arquivo válido enviado'
        })
      }

      // Upload dos arquivos físicos
      const uploadResults = await uploadService.uploadMultiple(uploadedFiles, {
        entityType: entityType as any,
        maxFiles: maxFiles as number
      })

      // Criar registros no banco
      const dbResults = []
      for (const uploadResult of uploadResults) {
        const dbResult = await UploadCommands.create({
          url: uploadResult.url,
          name: uploadResult.name,
          type: uploadResult.type,
          size: uploadResult.size
        })
        dbResults.push({
          ...dbResult,
          path: uploadResult.path
        })
      }

      return reply.status(201).send({
        uploads: dbResults,
        count: dbResults.length
      })
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message.includes('não permitido') || error.message.includes('muito grande') || error.message.includes('Máximo')) {
        return reply.status(400).send({
          error: error.message
        })
      }

      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  // === SERVIÇOS DE MANUTENÇÃO ===
  async cleanupOrphanedFiles(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Obter todos os caminhos de arquivos usados no banco
      const usedFiles = await UploadQueries.getAllUsedFilePaths()
      
      // Limpar arquivos órfãos
      const result = await uploadService.cleanupOrphanedFiles(usedFiles)

      return reply.send({
        message: 'Limpeza concluída',
        ...result
      })
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async getServiceConfig(request: FastifyRequest, reply: FastifyReply) {
    try {
      const config = {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxFiles: 10,
        allowedTypes: [
          'image/jpeg',
          'image/png', 
          'image/gif',
          'image/webp',
          'image/svg+xml',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain'
        ],
        uploadDir: uploadService['uploadDir'],
        entityTypes: ['product', 'supplier', 'user', 'store', 'general']
      }

      return reply.send(config)
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async getFileSystemStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const stats = await uploadService.getStats()

      return reply.send(stats)
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  }
}