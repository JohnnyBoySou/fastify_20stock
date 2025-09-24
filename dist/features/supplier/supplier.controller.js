import { SupplierCommands } from './commands/supplier.commands';
import { SupplierQueries } from './queries/supplier.queries';
export const SupplierController = {
    // === CRUD BÁSICO ===
    async create(request, reply) {
        try {
            const { corporateName, cnpj, tradeName, cep, city, state, address } = request.body;
            const result = await SupplierCommands.create({
                corporateName,
                cnpj,
                tradeName,
                cep,
                city,
                state,
                address
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
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async get(request, reply) {
        try {
            const { id } = request.params;
            const result = await SupplierQueries.getById(id);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
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
    async update(request, reply) {
        try {
            const { id } = request.params;
            const updateData = { ...request.body };
            const result = await SupplierCommands.update(id, updateData);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Supplier not found') {
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
            await SupplierCommands.delete(id);
            return reply.status(204).send();
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Supplier not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            if (error.message === 'Cannot delete supplier with associated products') {
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
            const result = await SupplierQueries.list({
                page,
                limit,
                search,
                status
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
            const result = await SupplierQueries.getByCnpj(cnpj);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
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
    async getByCity(request, reply) {
        try {
            const { city } = request.params;
            const result = await SupplierQueries.getByCity(city);
            return reply.send({ suppliers: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getByState(request, reply) {
        try {
            const { state } = request.params;
            const result = await SupplierQueries.getByState(state);
            return reply.send({ suppliers: result });
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
            const result = await SupplierQueries.getActive();
            return reply.send({ suppliers: result });
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
            const result = await SupplierQueries.getStats();
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
            const result = await SupplierQueries.search(q, limit);
            return reply.send({ suppliers: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getTopSuppliers(request, reply) {
        try {
            const { limit = 5 } = request.query;
            const result = await SupplierQueries.getTopSuppliers(limit);
            return reply.send({ suppliers: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    // === FUNÇÕES ADICIONAIS (COMMANDS) ===
    async toggleStatus(request, reply) {
        try {
            const { id } = request.params;
            const result = await SupplierCommands.toggleStatus(id);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Supplier not found') {
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
