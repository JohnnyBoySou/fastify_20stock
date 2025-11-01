import path from 'path'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { UploadCommands } from './commands/upload.commands'
import { UploadQueries } from './queries/upload.queries'
import type {
  AttachMediaRequest,
  CreateUploadRequest,
  DeleteUploadRequest,
  DetachMediaRequest,
  GetUploadRequest,
  ListUploadsRequest,
  UpdateUploadRequest,
} from './upload.interfaces'
import { uploadService } from './upload.service'

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
        size,
      })

      return reply.status(201).send(result)
    } catch (error: any) {
      request.log.error(error)

      if (error.message === 'Validation error') {
        return reply.status(400).send({
          error: error.message,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
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
          error: error.message,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
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
          error: error.message,
        })
      }

      if (error.message === 'Validation error') {
        return reply.status(400).send({
          error: error.message,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
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
          error: 'Media not found',
        })
      }

      // Deletar do banco de dados
      await UploadCommands.delete(id)

      // Tentar deletar o arquivo físico (não falha se não existir)
      try {
        const filePath = path.join(
          process.cwd(),
          'src',
          'uploads',
          media.url.replace('/uploads/', '')
        )
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
          error: error.message,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
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
        entityId,
      })

      // Gerar URL completa baseada no request
      const protocol =
        request.headers['x-forwarded-proto'] || (request.server as any).https ? 'https' : 'http'
      const host = request.headers['x-forwarded-host'] || request.headers.host || 'localhost:3000'

      // Adicionar fullUrl para cada upload
      const responseData = {
        ...result,
        uploads:
          result.uploads?.map((upload: any) => ({
            ...upload,
            fullUrl: `${protocol}://${host}${upload.url}`,
          })) || [],
      }

      return reply.send(responseData)
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  },

  // === FUNÇÕES ADICIONAIS (QUERIES) ===
  async getByType(
    request: FastifyRequest<{ Querystring: { type: string; limit?: number } }>,
    reply: FastifyReply
  ) {
    try {
      const { type, limit = 10 } = request.query

      const result = await UploadQueries.getByType(type, limit)

      // Gerar URL completa baseada no request
      const protocol =
        request.headers['x-forwarded-proto'] || (request.server as any).https ? 'https' : 'http'
      const host = request.headers['x-forwarded-host'] || request.headers.host || 'localhost:3000'

      // Adicionar fullUrl para cada upload
      const uploadsWithFullUrl = result.map((upload: any) => ({
        ...upload,
        fullUrl: `${protocol}://${host}${upload.url}`,
      }))

      return reply.send({ uploads: uploadsWithFullUrl })
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  },

  async getRecent(
    request: FastifyRequest<{ Querystring: { limit?: number } }>,
    reply: FastifyReply
  ) {
    try {
      const { limit = 20 } = request.query

      const result = await UploadQueries.getRecent(limit)

      // Gerar URL completa baseada no request
      const protocol =
        request.headers['x-forwarded-proto'] || (request.server as any).https ? 'https' : 'http'
      const host = request.headers['x-forwarded-host'] || request.headers.host || 'localhost:3000'

      // Adicionar fullUrl para cada upload
      const uploadsWithFullUrl = result.map((upload: any) => ({
        ...upload,
        fullUrl: `${protocol}://${host}${upload.url}`,
      }))

      return reply.send({ uploads: uploadsWithFullUrl })
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  },

  async getEntityMedia(
    request: FastifyRequest<{ Params: { entityType: string; entityId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { entityType, entityId } = request.params

      const result = await UploadQueries.getEntityMedia(entityType, entityId)

      // Gerar URL completa baseada no request
      const protocol =
        request.headers['x-forwarded-proto'] || (request.server as any).https ? 'https' : 'http'
      const host = request.headers['x-forwarded-host'] || request.headers.host || 'localhost:3000'

      // Adicionar fullUrl para cada media
      const mediaWithFullUrl = result.map((media: any) => ({
        ...media,
        fullUrl: `${protocol}://${host}${media.url}`,
      }))

      return reply.send({ media: mediaWithFullUrl })
    } catch (error: any) {
      request.log.error(error)

      if (error.message === 'Invalid entity type') {
        return reply.status(400).send({
          error: error.message,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  },

  async getPrimaryMedia(
    request: FastifyRequest<{ Params: { entityType: string; entityId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { entityType, entityId } = request.params

      const result = await UploadQueries.getPrimaryMedia(entityType, entityId)

      if (!result) {
        return reply.status(404).send({
          error: 'No media found',
        })
      }

      // Gerar URL completa baseada no request
      const protocol =
        request.headers['x-forwarded-proto'] || (request.server as any).https ? 'https' : 'http'
      const host = request.headers['x-forwarded-host'] || request.headers.host || 'localhost:3000'

      // Adicionar fullUrl ao resultado
      const resultWithFullUrl = {
        ...result,
        fullUrl: `${protocol}://${host}${result.url}`,
      }

      return reply.send(resultWithFullUrl)
    } catch (error: any) {
      request.log.error(error)

      if (error.message === 'Invalid entity type') {
        return reply.status(400).send({
          error: error.message,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
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
        error: 'Internal server error',
      })
    }
  },

  async search(
    request: FastifyRequest<{ Querystring: { q: string; limit?: number } }>,
    reply: FastifyReply
  ) {
    try {
      const { q, limit = 10 } = request.query

      const result = await UploadQueries.search(q, limit)

      // Gerar URL completa baseada no request
      const protocol =
        request.headers['x-forwarded-proto'] || (request.server as any).https ? 'https' : 'http'
      const host = request.headers['x-forwarded-host'] || request.headers.host || 'localhost:3000'

      // Adicionar fullUrl para cada upload
      const uploadsWithFullUrl = result.map((upload: any) => ({
        ...upload,
        fullUrl: `${protocol}://${host}${upload.url}`,
      }))

      return reply.send({ uploads: uploadsWithFullUrl })
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error',
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
        error: 'Internal server error',
      })
    }
  },

  async getUnusedMedia(
    request: FastifyRequest<{ Querystring: { daysOld?: number } }>,
    reply: FastifyReply
  ) {
    try {
      const { daysOld = 30 } = request.query

      const result = await UploadQueries.getUnusedMedia(daysOld)

      // Gerar URL completa baseada no request
      const protocol =
        request.headers['x-forwarded-proto'] || (request.server as any).https ? 'https' : 'http'
      const host = request.headers['x-forwarded-host'] || request.headers.host || 'localhost:3000'

      // Adicionar fullUrl para cada upload
      const uploadsWithFullUrl = result.map((upload: any) => ({
        ...upload,
        fullUrl: `${protocol}://${host}${upload.url}`,
      }))

      return reply.send({ uploads: uploadsWithFullUrl })
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error',
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
            isPrimary,
          })
          break
        case 'supplier':
          result = await UploadCommands.attachToSupplier({
            mediaId: id,
            entityType,
            entityId,
          })
          break
        case 'user':
          result = await UploadCommands.attachToUser({
            mediaId: id,
            entityType,
            entityId,
          })
          break
        case 'store':
          result = await UploadCommands.attachToStore({
            mediaId: id,
            entityType,
            entityId,
          })
          break
        default:
          return reply.status(400).send({
            error: 'Invalid entity type',
          })
      }

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)

      if (error.message === 'Invalid entity type for attachment') {
        return reply.status(400).send({
          error: error.message,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
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
            error: 'Invalid entity type',
          })
      }

      return reply.send({ success: true })
    } catch (error: any) {
      request.log.error(error)

      if (error.message === 'Media attachment not found') {
        return reply.status(404).send({
          error: error.message,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  },

  async setPrimaryMedia(
    request: FastifyRequest<{
      Params: { id: string }
      Body: { entityType: string; entityId: string }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      const { entityType, entityId } = request.body

      let result

      if (entityType === 'product') {
        result = await UploadCommands.setPrimaryForProduct(id, entityId)
      } else {
        return reply.status(400).send({
          error: 'Primary media is only supported for products',
        })
      }

      return reply.send({ success: true })
    } catch (error: any) {
      request.log.error(error)

      if (error.message === 'Media not found') {
        return reply.status(404).send({
          error: error.message,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
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
        error: 'Internal server error',
      })
    }
  },

  // === UPLOAD DE ARQUIVOS FÍSICOS ===
  async uploadSingle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await (request as any).file()

      if (!data) {
        return reply.status(400).send({
          error: 'Nenhum arquivo enviado',
        })
      }

      // Debug: Log da estrutura do objeto para entender melhor
      console.log(
        'Estrutura do objeto data:',
        JSON.stringify(
          {
            fieldname: data.fieldname,
            filename: data.filename,
            mimetype: data.mimetype,
            encoding: data.encoding,
            hasFile: !!data.file,
            fileKeys: data.file ? Object.keys(data.file) : 'no file object',
            filePath: data.file?.path,
            fileFilename: data.file?.filename,
            // Verificar se é um stream
            isStream: data.file?.toBuffer ? 'yes' : 'no',
            // Verificar outras propriedades possíveis
            allKeys: Object.keys(data),
          },
          null,
          2
        )
      )

      // Obter configurações do body ou query
      const { entityType = 'general' } = (request.body as any) || (request.query as any)

      // Obter userId do contexto de autenticação
      const userId = (request as any).user?.id
      if (!userId) {
        return reply.status(401).send({
          error: 'Usuário não autenticado',
        })
      }

      // Determinar o path do arquivo baseado na estrutura
      let filePath: string | undefined
      let fileSize = 0

      // O @fastify/multipart retorna streams, precisamos convertê-los para arquivos temporários
      if (data.toBuffer) {
        // Método 1: Usar toBuffer do próprio data
        console.log('Convertendo stream para buffer usando data.toBuffer...')
        const buffer = await data.toBuffer()
        fileSize = buffer.length

        // Salvar em arquivo temporário
        const tempPath = require('path').join(
          require('os').tmpdir(),
          `temp-${Date.now()}-${data.filename}`
        )
        await require('fs').promises.writeFile(tempPath, buffer)
        filePath = tempPath

        console.log(`Arquivo temporário criado: ${tempPath}`)
      } else if (data.file && data.file.toBuffer) {
        // Método 2: Usar toBuffer do data.file
        console.log('Convertendo stream para buffer usando data.file.toBuffer...')
        const buffer = await data.file.toBuffer()
        fileSize = buffer.length

        // Salvar em arquivo temporário
        const tempPath = require('path').join(
          require('os').tmpdir(),
          `temp-${Date.now()}-${data.filename}`
        )
        await require('fs').promises.writeFile(tempPath, buffer)
        filePath = tempPath

        console.log(`Arquivo temporário criado: ${tempPath}`)
      } else if (data.file && data.file.bytesRead) {
        // Método 3: Arquivo já salvo temporariamente
        filePath = data.file.path || data.file.filepath || data.file.filename
        fileSize = data.file.bytesRead
      } else {
        // Método 4: Tentar outras propriedades
        filePath = data.path || data.filepath || data.filename
        fileSize = data.size || data.bytesRead || 0
      }

      // Preparar objeto de arquivo no formato esperado pelo service
      const fileData = {
        fieldname: data.fieldname || 'file',
        filename: data.filename || 'unknown',
        originalname: data.filename || 'unknown',
        encoding: data.encoding || '7bit',
        mimetype: data.mimetype || 'application/octet-stream',
        size: fileSize,
        destination: '', // Será definido pelo service
        path: filePath,
        url: '', // Será definido pelo service
      }

      // Validação adicional do path
      if (!fileData.path) {
        console.error('Estrutura completa do data:', JSON.stringify(data, null, 2))
        return reply.status(400).send({
          error:
            'Não foi possível determinar o caminho do arquivo. Estrutura do objeto inesperada.',
        })
      }

      // Upload do arquivo físico
      const uploadResult = await uploadService.uploadSingle(fileData, {
        entityType: entityType as any,
        userId: userId,
      })

      // Criar registro no banco
      const dbResult = await UploadCommands.create({
        url: uploadResult.url,
        name: uploadResult.name,
        type: uploadResult.type,
        size: uploadResult.size,
      })

      // Limpar arquivo temporário se foi criado
      if (filePath && filePath.includes('temp-')) {
        try {
          await require('fs').promises.unlink(filePath)
          console.log(`Arquivo temporário removido: ${filePath}`)
        } catch (cleanupError) {
          console.warn(`Erro ao remover arquivo temporário ${filePath}:`, cleanupError)
        }
      }

      // Gerar URL completa baseada no request
      const protocol =
        request.headers['x-forwarded-proto'] || (request.server as any).https ? 'https' : 'http'
      const host = request.headers['x-forwarded-host'] || request.headers.host || 'localhost:3000'
      const fullUrl = `${protocol}://${host}${uploadResult.url}`

      return reply.status(201).send({
        ...dbResult,
        path: uploadResult.path,
        fullUrl: fullUrl,
      })
    } catch (error: any) {
      request.log.error(error)

      if (error.message.includes('não permitido') || error.message.includes('muito grande')) {
        return reply.status(400).send({
          error: error.message,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  },

  async uploadMultiple(request: FastifyRequest, reply: FastifyReply) {
    try {
      const files = (request as any).files()
      const uploadedFiles: any[] = []

      // Obter configurações do body ou query
      const { entityType = 'general', maxFiles = 10 } =
        (request.body as any) || (request.query as any)

      // Obter userId do contexto de autenticação
      const userId = (request as any).user?.id
      if (!userId) {
        return reply.status(401).send({
          error: 'Usuário não autenticado',
        })
      }

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
            url: '', // Será definido pelo service
          }
          uploadedFiles.push(fileData)
        }
      }

      if (uploadedFiles.length === 0) {
        return reply.status(400).send({
          error: 'Nenhum arquivo válido enviado',
        })
      }

      // Upload dos arquivos físicos
      const uploadResults = await uploadService.uploadMultiple(uploadedFiles, {
        entityType: entityType as any,
        userId: userId,
        maxFiles: maxFiles as number,
      })

      // Criar registros no banco
      const dbResults = []
      for (const uploadResult of uploadResults) {
        const dbResult = await UploadCommands.create({
          url: uploadResult.url,
          name: uploadResult.name,
          type: uploadResult.type,
          size: uploadResult.size,
        })

        // Gerar URL completa baseada no request
        const protocol =
          request.headers['x-forwarded-proto'] || (request.server as any).https ? 'https' : 'http'
        const host = request.headers['x-forwarded-host'] || request.headers.host || 'localhost:3000'
        const fullUrl = `${protocol}://${host}${uploadResult.url}`

        dbResults.push({
          ...dbResult,
          path: uploadResult.path,
          fullUrl: fullUrl,
        })
      }

      return reply.status(201).send({
        uploads: dbResults,
        count: dbResults.length,
      })
    } catch (error: any) {
      request.log.error(error)

      if (
        error.message.includes('não permitido') ||
        error.message.includes('muito grande') ||
        error.message.includes('Máximo')
      ) {
        return reply.status(400).send({
          error: error.message,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
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
        ...result,
      })
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error',
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
          'text/plain',
        ],
        uploadDir: uploadService['uploadDir'],
        entityTypes: ['product', 'supplier', 'user', 'store', 'general'],
      }

      return reply.send(config)
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error',
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
        error: 'Internal server error',
      })
    }
  },
}
