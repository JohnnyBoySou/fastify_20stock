import { FastifyRequest, FastifyReply } from 'fastify'
import { CrmCommands } from './commands/crm.commands'
import { CrmQueries } from './queries/crm.queries'
import { CrmStageCommands } from './commands/crm.stage.commands'
import { CrmStageQueries } from './queries/crm.stage.queries'
import {
  CreateCrmClientRequest,
  GetCrmClientRequest,
  UpdateCrmClientRequest,
  DeleteCrmClientRequest,
  ListCrmClientsRequest,
  SearchCrmClientsRequest,
  TransitionStageRequest,
  ListCrmClientsGroupedRequest,
  CreateCrmStageRequest,
  GetCrmStageRequest,
  UpdateCrmStageRequest,
  DeleteCrmStageRequest,
  ListCrmStagesRequest,
  ReorderCrmStageRequest
} from './crm.interfaces'

export const CrmController = {
  // === CRUD BÁSICO DE CLIENTES ===
  async createClient(request: CreateCrmClientRequest, reply: FastifyReply) {
    try {
      const { name, email, phone, cpfCnpj, company, notes, stageId } = request.body
      const storeId = (request as any).store?.id

      if (!storeId) {
        return reply.status(400).send({
          error: 'Store context required'
        })
      }

      const result = await CrmCommands.create({
        storeId,
        name,
        email,
        phone,
        cpfCnpj,
        company,
        notes,
        stageId
      })

      return reply.status(201).send(result)
    } catch (error: any) {
      request.log.error(error)

      if (error.message === 'Stage not found or does not belong to the same store') {
        return reply.status(400).send({
          error: error.message
        })
      }

      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async getClient(request: GetCrmClientRequest, reply: FastifyReply) {
    try {
      const { id } = request.params
      const storeId = (request as any).store?.id

      if (!storeId) {
        return reply.status(400).send({
          error: 'Store context required'
        })
      }

      const result = await CrmQueries.getById(id, storeId)

      if (!result) {
        return reply.status(404).send({
          error: 'Client not found'
        })
      }

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async updateClient(request: UpdateCrmClientRequest, reply: FastifyReply) {
    try {
      const { id } = request.params
      const updateData = { ...request.body }
      const storeId = (request as any).store?.id

      if (!storeId) {
        return reply.status(400).send({
          error: 'Store context required'
        })
      }

      const result = await CrmCommands.update(id, updateData, storeId)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)

      if (error.message === 'Client not found or does not belong to the store') {
        return reply.status(404).send({
          error: error.message
        })
      }

      if (error.message === 'Stage not found or does not belong to the same store') {
        return reply.status(400).send({
          error: error.message
        })
      }

      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async deleteClient(request: DeleteCrmClientRequest, reply: FastifyReply) {
    try {
      const { id } = request.params
      const storeId = (request as any).store?.id

      if (!storeId) {
        return reply.status(400).send({
          error: 'Store context required'
        })
      }

      await CrmCommands.delete(id, storeId)

      return reply.status(204).send()
    } catch (error: any) {
      request.log.error(error)

      if (error.message === 'Client not found or does not belong to the store') {
        return reply.status(404).send({
          error: error.message
        })
      }

      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async listClients(request: ListCrmClientsRequest, reply: FastifyReply) {
    try {
      const { page = 1, limit = 10, search, stageId, grouped } = request.query as any
      const storeId = (request as any).store?.id

      if (!storeId) {
        return reply.status(400).send({
          error: 'Store context required'
        })
      }

      if (grouped) {
        const result = await CrmQueries.listGroupedByStage(storeId)
        return reply.send(result)
      }

      const result = await CrmQueries.list({
        page,
        limit,
        search,
        stageId
      }, storeId)

      return reply.send(result)
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async searchClients(request: SearchCrmClientsRequest, reply: FastifyReply) {
    try {
      const { q, limit = 10 } = request.query as any
      const storeId = (request as any).store?.id

      if (!storeId) {
        return reply.status(400).send({
          error: 'Store context required'
        })
      }

      const result = await CrmQueries.search(q, limit, storeId)

      return reply.send({ clients: result })
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async transitionStage(request: TransitionStageRequest, reply: FastifyReply) {
    try {
      const { id } = request.params
      const { stageId } = request.body
      const storeId = (request as any).store?.id

      if (!storeId) {
        return reply.status(400).send({
          error: 'Store context required'
        })
      }

      const result = await CrmCommands.transitionStage(id, stageId, storeId)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)

      if (error.message === 'Client not found or does not belong to the store') {
        return reply.status(404).send({
          error: error.message
        })
      }

      if (error.message === 'Stage not found or does not belong to the same store') {
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
      const storeId = (request as any).store?.id

      if (!storeId) {
        return reply.status(400).send({
          error: 'Store context required'
        })
      }

      const result = await CrmQueries.getStats(storeId)

      return reply.send(result)
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  // === CRUD BÁSICO DE STAGES ===
  async createStage(request: CreateCrmStageRequest, reply: FastifyReply) {
    try {
      const { name, color, order } = request.body
      const storeId = (request as any).store?.id

      if (!storeId) {
        return reply.status(400).send({
          error: 'Store context required'
        })
      }

      // Se não fornecido, obter próxima ordem
      const finalOrder = order || await CrmStageQueries.getNextOrder(storeId)

      const result = await CrmStageCommands.create({
        storeId,
        name,
        color,
        order: finalOrder
      })

      return reply.status(201).send(result)
    } catch (error: any) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async getStage(request: GetCrmStageRequest, reply: FastifyReply) {
    try {
      const { id } = request.params
      const storeId = (request as any).store?.id

      if (!storeId) {
        return reply.status(400).send({
          error: 'Store context required'
        })
      }

      const result = await CrmStageQueries.getById(id, storeId)

      if (!result) {
        return reply.status(404).send({
          error: 'Stage not found'
        })
      }

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async updateStage(request: UpdateCrmStageRequest, reply: FastifyReply) {
    try {
      const { id } = request.params
      const updateData = { ...request.body }
      const storeId = (request as any).store?.id

      if (!storeId) {
        return reply.status(400).send({
          error: 'Store context required'
        })
      }

      const result = await CrmStageCommands.update(id, updateData, storeId)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)

      if (error.message === 'Stage not found or does not belong to the store') {
        return reply.status(404).send({
          error: error.message
        })
      }

      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async deleteStage(request: DeleteCrmStageRequest, reply: FastifyReply) {
    try {
      const { id } = request.params
      const storeId = (request as any).store?.id

      if (!storeId) {
        return reply.status(400).send({
          error: 'Store context required'
        })
      }

      await CrmStageCommands.delete(id, storeId)

      return reply.status(204).send()
    } catch (error: any) {
      request.log.error(error)

      if (error.message === 'Stage not found or does not belong to the store') {
        return reply.status(404).send({
          error: error.message
        })
      }

      if (error.message === 'Cannot delete stage with clients. Move clients to another stage first.') {
        return reply.status(400).send({
          error: error.message
        })
      }

      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async listStages(request: ListCrmStagesRequest, reply: FastifyReply) {
    try {
      const { page = 1, limit = 10 } = request.query as { page?: number; limit?: number }
      const storeId = (request as any).store?.id

      if (!storeId) {
        return reply.status(400).send({
          error: 'Store context required'
        })
      }

      const result = await CrmStageQueries.list(storeId, { page, limit })

      return reply.send(result)
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async reorderStage(request: ReorderCrmStageRequest, reply: FastifyReply) {
    try {
      const { id } = request.params
      const { order } = request.body
      const storeId = (request as any).store?.id

      if (!storeId) {
        return reply.status(400).send({
          error: 'Store context required'
        })
      }

      const result = await CrmStageCommands.reorder(id, order, storeId)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)

      if (error.message === 'Stage not found or does not belong to the store') {
        return reply.status(404).send({
          error: error.message
        })
      }

      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  },

  async getStageStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const storeId = (request as any).store?.id

      if (!storeId) {
        return reply.status(400).send({
          error: 'Store context required'
        })
      }

      const result = await CrmStageQueries.getStats(storeId)

      return reply.send(result)
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  }
}