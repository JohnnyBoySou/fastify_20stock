"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreController = void 0;
const store_commands_1 = require("./commands/store.commands");
const store_queries_1 = require("./queries/store.queries");
exports.StoreController = {
    // === CRUD BÁSICO ===
    async create(request, reply) {
        try {
            const { name, cnpj, email, phone, cep, city, state, address, status } = request.body;
            const ownerId = request.user.id; // Obtém o ID do usuário autenticado
            // Remove formatação do CNPJ (mantém apenas números)
            const cleanCnpj = cnpj.replace(/\D/g, '');
            const result = await store_commands_1.StoreCommands.create({
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
        }
        catch (error) {
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
    async get(request, reply) {
        try {
            const { id } = request.params;
            const result = await store_queries_1.StoreQueries.getById(id);
            return reply.send(result);
        }
        catch (error) {
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
    async update(request, reply) {
        try {
            const { id } = request.params;
            const updateData = { ...request.body };
            // Remove formatação do CNPJ se estiver presente
            if (updateData.cnpj) {
                updateData.cnpj = updateData.cnpj.replace(/\D/g, '');
            }
            const result = await store_commands_1.StoreCommands.update(id, updateData);
            return reply.send(result);
        }
        catch (error) {
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
    async delete(request, reply) {
        try {
            const { id } = request.params;
            await store_commands_1.StoreCommands.delete(id);
            return reply.status(204).send();
        }
        catch (error) {
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
    async list(request, reply) {
        try {
            const { page = 1, limit = 10, search, status } = request.query;
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({
                    error: 'User not authenticated'
                });
            }
            const result = await store_queries_1.StoreQueries.list({
                page,
                limit,
                search,
                status,
                ownerId: userId // Filtrar apenas as lojas do usuário autenticado
            });
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    // === FUNÇÕES ADICIONAIS (QUERIES) ===
    async getByCnpj(request, reply) {
        try {
            const { cnpj } = request.params;
            // Remove formatação do CNPJ para busca
            const cleanCnpj = cnpj.replace(/\D/g, '');
            const result = await store_queries_1.StoreQueries.getByCnpj(cleanCnpj);
            return reply.send(result);
        }
        catch (error) {
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
    async getByOwner(request, reply) {
        try {
            const { ownerId } = request.params;
            const result = await store_queries_1.StoreQueries.getByOwner(ownerId);
            return reply.send({ stores: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getActive(request, reply) {
        try {
            const result = await store_queries_1.StoreQueries.getActive();
            return reply.send({ stores: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getStats(request, reply) {
        try {
            const result = await store_queries_1.StoreQueries.getStats();
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async search(request, reply) {
        try {
            const { q, limit = 10 } = request.query;
            const result = await store_queries_1.StoreQueries.search(q, limit);
            return reply.send({ stores: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getRecent(request, reply) {
        try {
            const { limit = 5 } = request.query;
            const result = await store_queries_1.StoreQueries.getRecent(limit);
            return reply.send({ stores: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    // === FUNÇÕES ADICIONAIS (COMMANDS) ===
    async verifyCnpj(request, reply) {
        try {
            const { cnpj } = request.params;
            // Remove formatação do CNPJ para verificação
            const cleanCnpj = cnpj.replace(/\D/g, '');
            const result = await store_commands_1.StoreCommands.verifyCnpj(cleanCnpj);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async toggleStatus(request, reply) {
        try {
            const { id } = request.params;
            const result = await store_commands_1.StoreCommands.toggleStatus(id);
            return reply.send(result);
        }
        catch (error) {
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
    async addUser(request, reply) {
        try {
            const { id: storeId } = request.params;
            const { userId, role } = request.body;
            const result = await store_commands_1.StoreCommands.addUser(storeId, userId, role);
            return reply.status(201).send(result);
        }
        catch (error) {
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
    async removeUser(request, reply) {
        try {
            const { id: storeId, userId } = request.params;
            await store_commands_1.StoreCommands.removeUser(storeId, userId);
            return reply.status(204).send();
        }
        catch (error) {
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
    async updateUserRole(request, reply) {
        try {
            const { id: storeId, userId } = request.params;
            const { role } = request.body;
            const result = await store_commands_1.StoreCommands.updateUserRole(storeId, userId, role);
            return reply.send(result);
        }
        catch (error) {
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
    async listUsers(request, reply) {
        try {
            const { id: storeId } = request.params;
            const { page = 1, limit = 10, search, role } = request.query;
            const result = await store_queries_1.StoreQueries.getStoreUsers(storeId, {
                page,
                limit,
                search,
                role
            });
            return reply.send(result);
        }
        catch (error) {
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
    async getStoreUser(request, reply) {
        try {
            const { id: storeId, userId } = request.params;
            const result = await store_queries_1.StoreQueries.getStoreUser(storeId, userId);
            return reply.send(result);
        }
        catch (error) {
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
    async getStoreOwner(request, reply) {
        try {
            const { id: storeId } = request.params;
            const result = await store_queries_1.StoreQueries.getStoreOwner(storeId);
            return reply.send(result);
        }
        catch (error) {
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
    async getStoreAdmins(request, reply) {
        try {
            const { id: storeId } = request.params;
            const result = await store_queries_1.StoreQueries.getStoreAdmins(storeId);
            return reply.send({ admins: result });
        }
        catch (error) {
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
    async getStoreManagers(request, reply) {
        try {
            const { id: storeId } = request.params;
            const result = await store_queries_1.StoreQueries.getStoreManagers(storeId);
            return reply.send({ managers: result });
        }
        catch (error) {
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
    async getStoreStaff(request, reply) {
        try {
            const { id: storeId } = request.params;
            const result = await store_queries_1.StoreQueries.getStoreStaff(storeId);
            return reply.send({ staff: result });
        }
        catch (error) {
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
    async getStoreUserStats(request, reply) {
        try {
            const { id: storeId } = request.params;
            const result = await store_queries_1.StoreQueries.getStoreUserStats(storeId);
            return reply.send(result);
        }
        catch (error) {
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
    async searchStoreUsers(request, reply) {
        try {
            const { id: storeId } = request.params;
            const { q, limit = 10 } = request.query;
            const result = await store_queries_1.StoreQueries.searchStoreUsers(storeId, q, limit);
            return reply.send({ storeUsers: result });
        }
        catch (error) {
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
    async transferOwnership(request, reply) {
        try {
            const { id: storeId } = request.params;
            const { newOwnerId } = request.body;
            const result = await store_commands_1.StoreCommands.transferOwnership(storeId, newOwnerId);
            return reply.send(result);
        }
        catch (error) {
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
