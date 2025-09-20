import { FastifyRequest, FastifyReply } from 'fastify';
import { ProductCommands } from './commands/product.commands';
import { ProductQueries } from './queries/product.queries';
import {
  VerifySkuRequest,
  UpdateStockRequest,
  GetProductMovementsRequest,
  CreateProductMovementRequest
} from './product.interfaces';

export const ProductController = {
  // === CRUD BÁSICO ===
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, description, unitOfMeasure, referencePrice, categoryIds, supplierId, storeId, stockMin, stockMax, alertPercentage, status } = request.body as any;

      const result = await ProductCommands.create({
        name,
        description,
        unitOfMeasure,
        referencePrice,
        categoryIds,
        supplierId,
        storeId,
        stockMin,
        stockMax,
        alertPercentage,
        status
      });

      return reply.status(201).send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Product with this name already exists') {
        return reply.status(400).send({
          error: error.message
        });
      }

      if (error.message.includes('Categories not found')) {
        return reply.status(400).send({
          error: error.message
        });
      }

      if (error.code === 'P2003') {
        return reply.status(400).send({
          error: 'Invalid supplier or store reference'
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async get(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id, storeId } = request.params as any;

      const result = await ProductQueries.getById(id, storeId);

      if (!result) {
        return reply.status(404).send({
          error: 'Product not found'
        });
      }

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
  },

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const updateData = { ...request.body as any };

      const result = await ProductCommands.update(id, updateData);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.code === 'P2025') {
        return reply.status(404).send({
          error: 'Product not found'
        });
      }

      if (error.code === 'P2002') {
        return reply.status(400).send({
          error: 'Product with this name already exists'
        });
      }

      if (error.message.includes('Categories not found')) {
        return reply.status(400).send({
          error: error.message
        });
      }

      if (error.code === 'P2003') {
        return reply.status(400).send({
          error: 'Invalid supplier or store reference'
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;

      await ProductCommands.delete(id);

      return reply.status(204).send();
    } catch (error: any) {
      request.log.error(error);

      if (error.code === 'P2025') {
        return reply.status(404).send({
          error: 'Product not found'
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { page = 1, limit = 10, search, status, categoryIds, supplierId, storeId } = request.query as any;

      const result = await ProductQueries.list({
        page,
        limit,
        search,
        status,
        categoryIds: categoryIds ? (Array.isArray(categoryIds) ? categoryIds : [categoryIds]) : undefined,
        supplierId,
        storeId
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
  async getActive(request: FastifyRequest, reply: FastifyReply) {
    try {

      const result = await ProductQueries.getActive();

      return reply.send({ products: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await ProductQueries.getStats();

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

      const result = await ProductQueries.search(q, limit);

      return reply.send({ products: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getByCategory(request: FastifyRequest<{ Params: { categoryId: string } }>, reply: FastifyReply) {
    try {
      const { categoryId } = request.params;

      const result = await ProductQueries.getByCategory(categoryId);

      return reply.send({ products: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getBySupplier(request: FastifyRequest<{ Params: { supplierId: string } }>, reply: FastifyReply) {
    try {
      const { supplierId } = request.params;

      const result = await ProductQueries.getBySupplier(supplierId);

      return reply.send({ products: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getByStore(request: FastifyRequest<{ Params: { storeId: string } }>, reply: FastifyReply) {
    try {
      const { storeId } = request.params;

      const result = await ProductQueries.getByStore(storeId);

      return reply.send({ products: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  // === FUNÇÕES ADICIONAIS (COMMANDS) ===
  async updateStatus(request: FastifyRequest<{ Params: { id: string }; Body: { status: boolean } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { status } = request.body;

      const result = await ProductCommands.updateStatus(id, status);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.code === 'P2025') {
        return reply.status(404).send({
          error: 'Product not found'
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  // === FUNÇÕES ADICIONAIS DE PRODUTO ===
  async verifySku(request: VerifySkuRequest, reply: FastifyReply) {
    try {
      const { id: productId } = request.params;
      const { sku } = request.body;

      const result = await ProductCommands.verifySku(productId, sku);

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
  },

  async updateStock(request: UpdateStockRequest, reply: FastifyReply) {
    try {
      const { id: productId } = request.params;
      const { quantity, type, note } = request.body;
      const userId = request.user?.id;

      const result = await ProductCommands.updateStock(productId, quantity, type, note, userId);

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
  },

  async getMovements(request: GetProductMovementsRequest, reply: FastifyReply) {
    try {
      const { id: productId } = request.params;
      const { page = 1, limit = 10, type, startDate, endDate } = request.query;

      const result = await ProductQueries.getProductMovements(productId, {
        page,
        limit,
        type,
        startDate,
        endDate
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
  },

  async createMovement(request: CreateProductMovementRequest, reply: FastifyReply) {
    try {
      const { id: productId } = request.params;
      const { type, quantity, supplierId, batch, expiration, price, note } = request.body;
      const userId = request.user?.id;

      const result = await ProductCommands.createMovement(productId, {
        type,
        quantity,
        supplierId,
        batch,
        expiration,
        price,
        note,
        userId
      });

      return reply.status(201).send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Product not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Supplier not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getStock(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id: productId } = request.params;

      const result = await ProductCommands.getProductStock(productId);

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
  },

  async getStockHistory(request: FastifyRequest<{ 
    Params: { id: string }
    Querystring: { limit?: number }
  }>, reply: FastifyReply) {
    try {
      const { id: productId } = request.params;
      const { limit = 30 } = request.query;

      const result = await ProductQueries.getProductStockHistory(productId, limit);

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
  },

  async getLowStock(request: FastifyRequest<{ 
    Querystring: { storeId?: string }
  }>, reply: FastifyReply) {
    try {
      const { storeId } = request.query;

      const result = await ProductQueries.getLowStockProducts(storeId);

      return reply.send({ products: result });
    } catch (error: any) {
      request.log.error(error);

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getAnalytics(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id: productId } = request.params;

      const result = await ProductQueries.getProductAnalytics(productId);

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
  },

  // === MÉTODOS PARA GERENCIAR CATEGORIAS DO PRODUTO ===
  async addCategories(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const { categoryIds } = request.body as any;

      const result = await ProductCommands.addCategories(id, categoryIds);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Product not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message.includes('Categories not found') || 
          error.message.includes('already associated')) {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async removeCategories(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const { categoryIds } = request.body as any;

      const result = await ProductCommands.removeCategories(id, categoryIds);

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
  },

  async setCategories(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const { categoryIds } = request.body as any;

      const result = await ProductCommands.setCategories(id, categoryIds);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Product not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message.includes('Categories not found')) {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getCategories(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;

      const result = await ProductQueries.getCategories(id);

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
  },

  async getByCategory(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { categoryId } = request.params as any;
      const { page = 1, limit = 10, search, status } = request.query as any;

      const result = await ProductQueries.getByCategory(categoryId, {
        page,
        limit,
        search,
        status
      });

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }
};
