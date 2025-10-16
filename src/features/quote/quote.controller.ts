import { FastifyRequest, FastifyReply } from 'fastify';
import { QuoteCommands } from './commands/quote.commands';
import { QuoteQueries } from './queries/quote.queries';
import {
  CreateQuoteRequest,
  UpdateQuoteRequest,
  GetQuoteRequest,
  GetPublicQuoteRequest,
  ListQuotesRequest,
  DeleteQuoteRequest,
  ApproveQuoteRequest,
  RejectQuoteRequest,
  UpdateQuoteStatusRequest,
  ConvertToMovementRequest,
  PublishQuoteRequest,
  SendQuoteRequest,
  GetQuotesByUserRequest
} from './quote.interfaces';

export const QuoteController = {
  // === CRUD BÁSICO ===
  async create(request: CreateQuoteRequest, reply: FastifyReply) {
    try {
      const { title, description, paymentType, paymentTerms, paymentDueDays, expiresAt, observations, discount, interest, items, installments } = request.body;
      const userId = request.user?.id;

      if (!userId) {
        return reply.status(401).send({
          error: 'Authentication required'
        });
      }

      const prisma = (request.server as any).prisma;
      const quoteCommands = new QuoteCommands(prisma);

      const result = await quoteCommands.create({
        userId,
        title,
        description,
        paymentType,
        paymentTerms,
        paymentDueDays,
        expiresAt,
        observations,
        discount,
        interest,
        items,
        installments
      });

      return reply.status(201).send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message.includes('Products not found')) {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async get(request: GetQuoteRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const prisma = (request.server as any).prisma;
      const quoteQueries = new QuoteQueries(prisma);

      const result = await quoteQueries.getById(id);

      if (!result) {
        return reply.status(404).send({
          error: 'Quote not found'
        });
      }

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Quote not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async update(request: UpdateQuoteRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const updateData = { ...request.body };
      const prisma = (request.server as any).prisma;
      const quoteCommands = new QuoteCommands(prisma);

      const result = await quoteCommands.update(id, updateData);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Quote not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Only DRAFT quotes can be updated') {
        return reply.status(400).send({
          error: error.message
        });
      }

      if (error.message.includes('Products not found')) {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async delete(request: DeleteQuoteRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const prisma = (request.server as any).prisma;
      const quoteCommands = new QuoteCommands(prisma);

      await quoteCommands.delete(id);

      return reply.status(204).send();
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Quote not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Only DRAFT or CANCELED quotes can be deleted') {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async list(request: ListQuotesRequest, reply: FastifyReply) {
    try {
      const { page = 1, limit = 10, search, status, userId, startDate, endDate } = request.query;
      const prisma = (request.server as any).prisma;
      const quoteQueries = new QuoteQueries(prisma);

      const result = await quoteQueries.list({
        page,
        limit,
        search,
        status,
        userId,
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

  // === FUNÇÕES PÚBLICAS (sem autenticação) ===
  async getPublic(request: GetPublicQuoteRequest, reply: FastifyReply) {
    try {
      const { publicId } = request.params;
      const { authCode } = request.query;
      const prisma = (request.server as any).prisma;
      const quoteQueries = new QuoteQueries(prisma);

      const result = await quoteQueries.getByPublicId(publicId, authCode);

      if (!result) {
        return reply.status(404).send({
          error: 'Quote not found or invalid authorization code'
        });
      }

      // Verificar se expirou
      if (result.expiresAt && new Date() > result.expiresAt) {
        return reply.status(410).send({
          error: 'Quote has expired'
        });
      }

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Quote not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async approvePublic(request: ApproveQuoteRequest, reply: FastifyReply) {
    try {
      const { publicId } = request.params;
      const { authCode } = request.body;
      const prisma = (request.server as any).prisma;
      const quoteCommands = new QuoteCommands(prisma);

      const result = await quoteCommands.approve(publicId, authCode);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Quote not found or not available for approval') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Quote has expired') {
        return reply.status(410).send({
          error: error.message
        });
      }

      if (error.message.includes('Failed to create movement')) {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async rejectPublic(request: RejectQuoteRequest, reply: FastifyReply) {
    try {
      const { publicId } = request.params;
      const { authCode, reason } = request.body;
      const prisma = (request.server as any).prisma;
      const quoteCommands = new QuoteCommands(prisma);

      const result = await quoteCommands.reject(publicId, authCode, reason);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Quote not found or not available for rejection') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  // === FUNÇÕES ADICIONAIS (autenticadas) ===
  async updateStatus(request: UpdateQuoteStatusRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { status } = request.body;
      const prisma = (request.server as any).prisma;
      const quoteCommands = new QuoteCommands(prisma);

      const result = await quoteCommands.updateStatus(id, status);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Quote not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async publish(request: PublishQuoteRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const prisma = (request.server as any).prisma;
      const quoteCommands = new QuoteCommands(prisma);

      const result = await quoteCommands.publish(id);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Quote not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Only DRAFT quotes can be published') {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async send(request: SendQuoteRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const prisma = (request.server as any).prisma;
      const quoteCommands = new QuoteCommands(prisma);

      const result = await quoteCommands.send(id);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Quote not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Only PUBLISHED quotes can be sent') {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async convertToMovements(request: ConvertToMovementRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const prisma = (request.server as any).prisma;
      const quoteCommands = new QuoteCommands(prisma);

      const movements = await quoteCommands.convertToMovements(id);

      return reply.send({
        message: 'Quote converted to movements successfully',
        movements
      });
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Quote not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Quote cannot be converted to movements') {
        return reply.status(400).send({
          error: error.message
        });
      }

      if (error.message.includes('Failed to create movement')) {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getStats(request: FastifyRequest<{ Querystring: { userId?: string } }>, reply: FastifyReply) {
    try {
      const { userId } = request.query;
      const prisma = (request.server as any).prisma;
      const quoteQueries = new QuoteQueries(prisma);

      const result = await quoteQueries.getStats(userId);

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getByUser(request: GetQuotesByUserRequest, reply: FastifyReply) {
    try {
      const { userId } = request.params;
      const { page = 1, limit = 10, status } = request.query;
      const prisma = (request.server as any).prisma;
      const quoteQueries = new QuoteQueries(prisma);

      const result = await quoteQueries.getByUser(userId, {
        page,
        limit,
        status
      });

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async search(request: FastifyRequest<{ Querystring: { q: string; limit?: number; userId?: string } }>, reply: FastifyReply) {
    try {
      const { q, limit = 10, userId } = request.query;
      const prisma = (request.server as any).prisma;
      const quoteQueries = new QuoteQueries(prisma);

      const result = await quoteQueries.search(q, limit, userId);

      return reply.send({ quotes: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getByStatus(request: FastifyRequest<{ 
    Params: { status: string }
    Querystring: { page?: number; limit?: number; userId?: string }
  }>, reply: FastifyReply) {
    try {
      const { status } = request.params;
      const { page = 1, limit = 10, userId } = request.query;
      const prisma = (request.server as any).prisma;
      const quoteQueries = new QuoteQueries(prisma);

      const result = await quoteQueries.getByStatus(status as any, {
        page,
        limit,
        userId
      });

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getRecent(request: FastifyRequest<{ Querystring: { limit?: number; userId?: string } }>, reply: FastifyReply) {
    try {
      const { limit = 5, userId } = request.query;
      const prisma = (request.server as any).prisma;
      const quoteQueries = new QuoteQueries(prisma);

      const result = await quoteQueries.getRecentQuotes(limit, userId);

      return reply.send({ quotes: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getAnalytics(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const prisma = (request.server as any).prisma;
      const quoteQueries = new QuoteQueries(prisma);

      const result = await quoteQueries.getQuoteAnalytics(id);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Quote not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async markExpired(request: FastifyRequest, reply: FastifyReply) {
    try {
      const prisma = (request.server as any).prisma;
      const quoteQueries = new QuoteQueries(prisma);

      const count = await quoteQueries.markAsExpired();

      return reply.send({
        message: `${count} quotes marked as expired`,
        expiredCount: count
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }
};
