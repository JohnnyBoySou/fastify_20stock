import { FastifyRequest, FastifyReply } from 'fastify';
import { StoreCommands } from './commands/store.commands';
import { StoreQueries } from './queries/store.queries';
import {
  CreateStoreRequest,
  GetStoreRequest,
  UpdateStoreRequest,
  DeleteStoreRequest,
  ListStoresRequest,
  GetStoreByCnpjRequest,
  GetStoresByOwnerRequest,
  AddUserToStoreRequest,
  RemoveUserFromStoreRequest,
  UpdateUserRoleRequest,
  ListStoreUsersRequest,
  GetStoreUserRequest
} from './store.interfaces';

export const StoreController = {
  // === CRUD BÁSICO ===
  async create(request: CreateStoreRequest, reply: FastifyReply) {
    try {
      const { name, cnpj, email, phone, cep, city, state, address, status } = request.body;
      const ownerId = request.user!.id; // Obtém o ID do usuário autenticado

      // Remove formatação do CNPJ (mantém apenas números)
      const cleanCnpj = cnpj.replace(/\D/g, '');

      const result = await StoreCommands.create({
        ownerId,
        name,
        cnpj: cleanCnpj,
        email,
        phone,
        cep,
        city,
        state,
        address,
        status
      });

      return reply.status(201).send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'CNPJ already exists') {
        return reply.status(400).send({
          error: error.message
        });
      }

      if (error.message === 'Owner not found') {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async get(request: GetStoreRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;

      const result = await StoreQueries.getById(id);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Store not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async update(request: UpdateStoreRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const updateData = { ...request.body };

      // Remove formatação do CNPJ se estiver presente
      if (updateData.cnpj) {
        updateData.cnpj = updateData.cnpj.replace(/\D/g, '');
      }

      const result = await StoreCommands.update(id, updateData);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Store not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'CNPJ already exists') {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async delete(request: DeleteStoreRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;

      await StoreCommands.delete(id);

      return reply.status(204).send();
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Store not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Cannot delete store with existing products') {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async list(request: ListStoresRequest, reply: FastifyReply) {
    try {
      const { page = 1, limit = 10, search, status, ownerId } = request.query;

      const result = await StoreQueries.list({
        page,
        limit,
        search,
        status,
        ownerId
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
  async getByCnpj(request: GetStoreByCnpjRequest, reply: FastifyReply) {
    try {
      const { cnpj } = request.params;

      // Remove formatação do CNPJ para busca
      const cleanCnpj = cnpj.replace(/\D/g, '');

      const result = await StoreQueries.getByCnpj(cleanCnpj);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Store not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getByOwner(request: GetStoresByOwnerRequest, reply: FastifyReply) {
    try {
      const { ownerId } = request.params;

      const result = await StoreQueries.getByOwner(ownerId);

      return reply.send({ stores: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getActive(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await StoreQueries.getActive();

      return reply.send({ stores: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    try {

      const result = await StoreQueries.getStats();

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

      const result = await StoreQueries.search(q, limit);

      return reply.send({ stores: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getRecent(request: FastifyRequest<{ Querystring: { limit?: number } }>, reply: FastifyReply) {
    try {
      const { limit = 5 } = request.query;

      const result = await StoreQueries.getRecent(limit);

      return reply.send({ stores: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  // === FUNÇÕES ADICIONAIS (COMMANDS) ===
  async verifyCnpj(request: FastifyRequest<{ Params: { cnpj: string } }>, reply: FastifyReply) {
    try {
      const { cnpj } = request.params;

      // Remove formatação do CNPJ para verificação
      const cleanCnpj = cnpj.replace(/\D/g, '');

      const result = await StoreCommands.verifyCnpj(cleanCnpj);

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async toggleStatus(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;

      const result = await StoreCommands.toggleStatus(id);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Store not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  // === GERENCIAMENTO DE USUÁRIOS DA LOJA ===
  async addUser(request: AddUserToStoreRequest, reply: FastifyReply) {
    try {
      const { id: storeId } = request.params;
      const { userId, role } = request.body;

      const result = await StoreCommands.addUser(storeId, userId, role);

      return reply.status(201).send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Store not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'User not found or inactive') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'User already exists in this store') {
        return reply.status(409).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async removeUser(request: RemoveUserFromStoreRequest, reply: FastifyReply) {
    try {
      const { id: storeId, userId } = request.params;

      await StoreCommands.removeUser(storeId, userId);

      return reply.status(204).send();
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Store not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'User not found in this store') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Cannot remove store owner') {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async updateUserRole(request: UpdateUserRoleRequest, reply: FastifyReply) {
    try {
      const { id: storeId, userId } = request.params;
      const { role } = request.body;

      const result = await StoreCommands.updateUserRole(storeId, userId, role);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Store not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'User not found in this store') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Cannot change store owner role') {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async listUsers(request: ListStoreUsersRequest, reply: FastifyReply) {
    try {
      const { id: storeId } = request.params;
      const { page = 1, limit = 10, search, role } = request.query;

      const result = await StoreQueries.getStoreUsers(storeId, {
        page,
        limit,
        search,
        role
      });

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Store not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getStoreUser(request: GetStoreUserRequest, reply: FastifyReply) {
    try {
      const { id: storeId, userId } = request.params;

      const result = await StoreQueries.getStoreUser(storeId, userId);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Store not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'User not found in this store') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getStoreOwner(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id: storeId } = request.params;

      const result = await StoreQueries.getStoreOwner(storeId);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Store not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Store owner not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getStoreAdmins(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id: storeId } = request.params;

      const result = await StoreQueries.getStoreAdmins(storeId);

      return reply.send({ admins: result });
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Store not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getStoreManagers(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id: storeId } = request.params;

      const result = await StoreQueries.getStoreManagers(storeId);

      return reply.send({ managers: result });
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Store not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getStoreStaff(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id: storeId } = request.params;

      const result = await StoreQueries.getStoreStaff(storeId);

      return reply.send({ staff: result });
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Store not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getStoreUserStats(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id: storeId } = request.params;

      const result = await StoreQueries.getStoreUserStats(storeId);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Store not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async searchStoreUsers(request: FastifyRequest<{ 
    Params: { id: string }
    Querystring: { q: string; limit?: number }
  }>, reply: FastifyReply) {
    try {
      const { id: storeId } = request.params;
      const { q, limit = 10 } = request.query;

      const result = await StoreQueries.searchStoreUsers(storeId, q, limit);

      return reply.send({ storeUsers: result });
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Store not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async transferOwnership(request: FastifyRequest<{ 
    Params: { id: string }
    Body: { newOwnerId: string }
  }>, reply: FastifyReply) {
    try {
      const { id: storeId } = request.params;
      const { newOwnerId } = request.body;

      const result = await StoreCommands.transferOwnership(storeId, newOwnerId);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Store not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'New owner not found or inactive') {
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
