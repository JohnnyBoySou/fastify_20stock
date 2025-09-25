"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierResponsibleController = void 0;
const supplier_responsible_commands_1 = require("./commands/supplier-responsible.commands");
const supplier_responsible_queries_1 = require("./queries/supplier-responsible.queries");
exports.SupplierResponsibleController = {
    // === CRUD BÁSICO ===
    async create(request, reply) {
        try {
            const { supplierId } = request.params;
            const { name, email, phone, cpf } = request.body;
            const prisma = request.server.prisma;
            const commands = new supplier_responsible_commands_1.SupplierResponsibleCommands(prisma);
            const result = await commands.create(supplierId, {
                name,
                email,
                phone,
                cpf
            });
            return reply.status(201).send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Supplier not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            if (error.message === 'Email already exists for this supplier' ||
                error.message === 'CPF already exists for this supplier') {
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
            const { supplierId, responsibleId } = request.params;
            const prisma = request.server.prisma;
            const queries = new supplier_responsible_queries_1.SupplierResponsibleQueries(prisma);
            const result = await queries.getById(supplierId, responsibleId);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Responsible not found for this supplier') {
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
            const { supplierId, responsibleId } = request.params;
            const updateData = { ...request.body };
            const prisma = request.server.prisma;
            const commands = new supplier_responsible_commands_1.SupplierResponsibleCommands(prisma);
            const result = await commands.update(supplierId, responsibleId, updateData);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Responsible not found for this supplier') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            if (error.message === 'Email already exists for another responsible of this supplier' ||
                error.message === 'CPF already exists for another responsible of this supplier') {
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
            const { supplierId, responsibleId } = request.params;
            const prisma = request.server.prisma;
            const commands = new supplier_responsible_commands_1.SupplierResponsibleCommands(prisma);
            await commands.delete(supplierId, responsibleId);
            return reply.status(204).send();
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Responsible not found for this supplier') {
                return reply.status(404).send({
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
            const { supplierId } = request.params;
            const { page = 1, limit = 10, search, status } = request.query;
            const prisma = request.server.prisma;
            const queries = new supplier_responsible_queries_1.SupplierResponsibleQueries(prisma);
            const result = await queries.list(supplierId, {
                page,
                limit,
                search,
                status
            });
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
    // === FUNÇÕES ADICIONAIS (QUERIES) ===
    async getByEmail(request, reply) {
        try {
            const { supplierId, email } = request.params;
            const prisma = request.server.prisma;
            const queries = new supplier_responsible_queries_1.SupplierResponsibleQueries(prisma);
            const result = await queries.getByEmail(supplierId, email);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Responsible not found with this email for this supplier') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getByCpf(request, reply) {
        try {
            const { supplierId, cpf } = request.params;
            const prisma = request.server.prisma;
            const queries = new supplier_responsible_queries_1.SupplierResponsibleQueries(prisma);
            const result = await queries.getByCpf(supplierId, cpf);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Responsible not found with this CPF for this supplier') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getActive(request, reply) {
        try {
            const { supplierId } = request.params;
            const prisma = request.server.prisma;
            const queries = new supplier_responsible_queries_1.SupplierResponsibleQueries(prisma);
            const result = await queries.getActive(supplierId);
            return reply.send({ responsibles: result });
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
    async getStats(request, reply) {
        try {
            const { supplierId } = request.params;
            const prisma = request.server.prisma;
            const queries = new supplier_responsible_queries_1.SupplierResponsibleQueries(prisma);
            const result = await queries.getStats(supplierId);
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
    async search(request, reply) {
        try {
            const { supplierId } = request.params;
            const { q, limit = 10 } = request.query;
            const prisma = request.server.prisma;
            const queries = new supplier_responsible_queries_1.SupplierResponsibleQueries(prisma);
            const result = await queries.search(supplierId, q, limit);
            return reply.send({ responsibles: result });
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
    async getRecent(request, reply) {
        try {
            const { supplierId } = request.params;
            const { limit = 5 } = request.query;
            const prisma = request.server.prisma;
            const queries = new supplier_responsible_queries_1.SupplierResponsibleQueries(prisma);
            const result = await queries.getRecent(supplierId, limit);
            return reply.send({ responsibles: result });
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
    // === FUNÇÕES ADICIONAIS (COMMANDS) ===
    async toggleStatus(request, reply) {
        try {
            const { supplierId, responsibleId } = request.params;
            const prisma = request.server.prisma;
            const commands = new supplier_responsible_commands_1.SupplierResponsibleCommands(prisma);
            const result = await commands.toggleStatus(supplierId, responsibleId);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Responsible not found for this supplier') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async bulkCreate(request, reply) {
        try {
            const { supplierId } = request.params;
            const responsibles = request.body;
            const prisma = request.server.prisma;
            const commands = new supplier_responsible_commands_1.SupplierResponsibleCommands(prisma);
            const result = await commands.bulkCreate(supplierId, responsibles);
            return reply.status(201).send({
                message: `${result.count} responsibles created successfully`,
                count: result.count
            });
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Supplier not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            if (error.message.includes('already exist') ||
                error.message.includes('Duplicate')) {
                return reply.status(400).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    }
};
