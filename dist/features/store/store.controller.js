import { StoreCommands } from './commands/store.commands';
import { StoreQueries } from './queries/store.queries';
export const StoreController = {
    // === CRUD BÁSICO ===
    async create(request, reply) {
        try {
            const { ownerId, name, cnpj, email, phone, cep, city, state, address, status } = request.body;
            const result = await StoreCommands.create({
                ownerId,
                name,
                cnpj,
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
            const result = await StoreQueries.getById(id);
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
            const result = await StoreCommands.update(id, updateData);
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
            await StoreCommands.delete(id);
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
            const { page = 1, limit = 10, search, status, ownerId } = request.query;
            const result = await StoreQueries.list({
                page,
                limit,
                search,
                status,
                ownerId
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
            const result = await StoreQueries.getByCnpj(cnpj);
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
            const result = await StoreQueries.getByOwner(ownerId);
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
            const result = await StoreQueries.getActive();
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
            const result = await StoreQueries.getStats();
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
            const result = await StoreQueries.search(q, limit);
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
            const result = await StoreQueries.getRecent(limit);
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
            const result = await StoreCommands.verifyCnpj(cnpj);
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
            const result = await StoreCommands.toggleStatus(id);
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
            const result = await StoreCommands.addUser(storeId, userId, role);
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
            await StoreCommands.removeUser(storeId, userId);
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
            const result = await StoreCommands.updateUserRole(storeId, userId, role);
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
            const result = await StoreQueries.getStoreUsers(storeId, {
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
            const result = await StoreQueries.getStoreUser(storeId, userId);
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
            const result = await StoreQueries.getStoreOwner(storeId);
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
            const result = await StoreQueries.getStoreAdmins(storeId);
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
            const result = await StoreQueries.getStoreManagers(storeId);
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
            const result = await StoreQueries.getStoreStaff(storeId);
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
            const result = await StoreQueries.getStoreUserStats(storeId);
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
            const result = await StoreQueries.searchStoreUsers(storeId, q, limit);
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
            const result = await StoreCommands.transferOwnership(storeId, newOwnerId);
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
