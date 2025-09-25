import { FastifyRequest, FastifyReply } from 'fastify';
import { MovementCommands } from './commands/movement.commands';
import { MovementQueries } from './queries/movement.queries';

export const MovementController = {
  // === CRUD BÁSICO ===
  async create(request: FastifyRequest<{ Body: {
    type: 'ENTRADA' | 'SAIDA' | 'PERDA'
    quantity: number
    storeId: string
    productId: string
    supplierId?: string
    batch?: string
    expiration?: string
    price?: number
    note?: string
    userId?: string
  } }>, reply: FastifyReply) {
    try {

      const result = await MovementCommands.create(request.body);

      return reply.status(201).send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Product not found in this store') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Insufficient stock for this movement') {
        return reply.status(400).send({
          error: error.message
        });
      }

      if (error.message === 'Supplier not found or inactive') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async get(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;

      const result = await MovementQueries.getById(id);

      if (!result) {
        return reply.status(404).send({
          error: 'Movement not found'
        });
      }

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Movement not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async update(request: FastifyRequest<{ Params: { id: string }; Body: { type?: 'ENTRADA' | 'SAIDA' | 'PERDA'; quantity?: number; supplierId?: string; batch?: string; expiration?: string; price?: number; note?: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const updateData = { ...request.body };

      const result = await MovementCommands.update(id, updateData);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Movement not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Insufficient stock for this movement') {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;

      await MovementCommands.delete(id);

      return reply.status(204).send();
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Movement not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Cannot delete movement: insufficient stock to revert') {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async list(request: FastifyRequest<{ Querystring: { page?: number; limit?: number; search?: string; type?: 'ENTRADA' | 'SAIDA' | 'PERDA'; storeId?: string; productId?: string; supplierId?: string; startDate?: string; endDate?: string } }>, reply: FastifyReply) {
    try {
      const { page = 1, limit = 10, search, type, storeId, productId, supplierId, startDate, endDate } = request.query;

      const result = await MovementQueries.list({
        page,
        limit,
        search,
        type,
        storeId,
        productId,
        supplierId,
        startDate,
        endDate
      });

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  // === FUNÇÕES ADICIONAIS (QUERIES) ===
  async getByStore(request: FastifyRequest<{ Params: { storeId: string }; Querystring: { page?: number; limit?: number; type?: 'ENTRADA' | 'SAIDA' | 'PERDA'; startDate?: string; endDate?: string } }>, reply: FastifyReply) {
    try {
      const { storeId } = request.params;
      const { page = 1, limit = 10, type, startDate, endDate } = request.query;

      const result = await MovementQueries.getByStore(storeId, {
        page,
        limit,
        type,
        startDate,
        endDate
      });

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getByProduct(request: FastifyRequest<{ Params: { productId: string }; Querystring: { page?: number; limit?: number; type?: 'ENTRADA' | 'SAIDA' | 'PERDA'; startDate?: string; endDate?: string } }>, reply: FastifyReply) {
    try {
      const { productId } = request.params;
      const { page = 1, limit = 10, type, startDate, endDate } = request.query;

      const result = await MovementQueries.getByProduct(productId, {
        page,
        limit,
        type,
        startDate,
        endDate
      });

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getBySupplier(request: FastifyRequest<{ Params: { supplierId: string }; Querystring: { page?: number; limit?: number; type?: 'ENTRADA' | 'SAIDA' | 'PERDA'; startDate?: string; endDate?: string } }>, reply: FastifyReply) {
    try {
      const { supplierId } = request.params;
      const { page = 1, limit = 10, type, startDate, endDate } = request.query;

      const result = await MovementQueries.getBySupplier(supplierId, {
        page,
        limit,
        type,
        startDate,
        endDate
      });

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getStockHistory(request: FastifyRequest<{ Params: { productId: string; storeId: string }; Querystring: { startDate?: string; endDate?: string } }>, reply: FastifyReply) {
    try {
      const { productId, storeId } = request.params;
      const { startDate, endDate } = request.query;

      const result = await MovementQueries.getStockHistory(productId, storeId, {
        startDate,
        endDate
      });

      return reply.send({ movements: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getCurrentStock(request: FastifyRequest<{ Params: { productId: string; storeId: string } }>, reply: FastifyReply) {
    try {
      const { productId, storeId } = request.params;

      const result = await MovementQueries.getCurrentStock(productId, storeId);

      return reply.send({ currentStock: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    try {

      const result = await MovementQueries.getStats();

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async search(request: FastifyRequest<{ Querystring: { q: string; limit?: number } }>, reply: FastifyReply) {
    try {
      const { q, limit = 10 } = request.query;

      const result = await MovementQueries.search(q, limit);

      return reply.send({ movements: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getLowStockProducts(request: FastifyRequest<{ Querystring: { storeId?: string } }>, reply: FastifyReply) {
    try {
      const { storeId } = request.query;

      const result = await MovementQueries.getLowStockProducts(storeId);

      return reply.send({ products: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  // === FUNÇÕES ADICIONAIS (COMMANDS) ===
  async recalculateStock(request: FastifyRequest<{ Params: { productId: string; storeId: string } }>, reply: FastifyReply) {
    try {
      const { productId, storeId } = request.params;

      const result = await MovementCommands.recalculateStock(productId, storeId);

      return reply.send({ currentStock: result });
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Product not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  // === FUNÇÕES ADICIONAIS DE MOVIMENTAÇÃO ===
  async getReport(request: FastifyRequest<{ 
    Querystring: {
      storeId?: string
      productId?: string
      supplierId?: string
      type?: 'ENTRADA' | 'SAIDA' | 'PERDA'
      startDate?: string
      endDate?: string
      groupBy?: 'day' | 'week' | 'month' | 'year'
      format?: 'json' | 'csv' | 'pdf'
    }
  }>, reply: FastifyReply) {
    try {
      const { storeId, productId, supplierId, type, startDate, endDate, groupBy, format } = request.query;

      const result = await MovementQueries.getMovementReport({
        storeId,
        productId,
        supplierId,
        type,
        startDate,
        endDate,
        groupBy
      });

      // Se for CSV ou PDF, implementar geração de arquivo
      if (format === 'csv') {
        // Implementar geração de CSV
        return reply.type('text/csv').send('CSV generation not implemented yet');
      }

      if (format === 'pdf') {
        // Implementar geração de PDF
        return reply.type('application/pdf').send('PDF generation not implemented yet');
      }

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async createBulk(request: FastifyRequest<{ 
    Body: {
      movements: Array<{
        type: 'ENTRADA' | 'SAIDA' | 'PERDA'
        quantity: number
        storeId: string
        productId: string
        supplierId?: string
        batch?: string
        expiration?: string
        price?: number
        note?: string
      }>
    }
  }>, reply: FastifyReply) {
    try {
      const { movements } = request.body;
      const userId = request.user?.id;

      const result = await MovementCommands.createBulk(movements, userId);

      return reply.status(201).send(result);
    } catch (error: any) {
      request.log.error(error);

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async verify(request: FastifyRequest<{ 
    Params: { id: string }
    Body: { verified: boolean; note?: string }
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { verified, note } = request.body;
      const userId = request.user?.id;

      const result = await MovementCommands.verify(id, verified, note, userId);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Movement not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async cancel(request: FastifyRequest<{ 
    Params: { id: string }
    Body: { reason: string }
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { reason } = request.body;
      const userId = request.user?.id;

      const result = await MovementCommands.cancel(id, reason, userId);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Movement not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Movement already cancelled') {
        return reply.status(400).send({
          error: error.message
        });
      }

      if (error.message === 'Cannot cancel movement: insufficient stock to revert') {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getVerifiedMovements(request: FastifyRequest<{ 
    Querystring: { 
      page?: number; 
      limit?: number; 
      storeId?: string; 
      verified?: boolean; 
      startDate?: string; 
      endDate?: string 
    } 
  }>, reply: FastifyReply) {
    try {
      const { page = 1, limit = 10, storeId, verified, startDate, endDate } = request.query;

      const result = await MovementQueries.getVerifiedMovements({
        page,
        limit,
        storeId,
        verified,
        startDate,
        endDate
      });

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getCancelledMovements(request: FastifyRequest<{ 
    Querystring: { 
      page?: number; 
      limit?: number; 
      storeId?: string; 
      startDate?: string; 
      endDate?: string 
    } 
  }>, reply: FastifyReply) {
    try {
      const { page = 1, limit = 10, storeId, startDate, endDate } = request.query;

      const result = await MovementQueries.getCancelledMovements({
        page,
        limit,
        storeId,
        startDate,
        endDate
      });

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getAnalytics(request: FastifyRequest<{ 
    Querystring: { 
      storeId?: string; 
      productId?: string; 
      supplierId?: string; 
      startDate?: string; 
      endDate?: string 
    } 
  }>, reply: FastifyReply) {
    try {
      const { storeId, productId, supplierId, startDate, endDate } = request.query;

      const result = await MovementQueries.getMovementAnalytics({
        storeId,
        productId,
        supplierId,
        startDate,
        endDate
      });

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },


  async summarize(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await MovementQueries.summarize();
      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async summarizeProduct(request: FastifyRequest<{ 
    Params: { productId: string }
    Querystring: { 
      startDate?: string
      endDate?: string
      storeId?: string
    }
  }>, reply: FastifyReply) {
    try {
      const { productId } = request.params;
      const { startDate, endDate, storeId } = request.query;

      const result = await MovementQueries.getProductSummary(productId, {
        startDate,
        endDate,
        storeId
      });

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Product not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }
};
