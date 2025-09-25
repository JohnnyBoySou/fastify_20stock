"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_commands_1 = require("./commands/user.commands");
const user_query_1 = require("./querys/user.query");
exports.UserController = {
    async create(request, reply) {
        try {
            const { email, password, name, roles = ['user'] } = request.body;
            const user = await user_commands_1.UserCommands.create({
                email,
                password,
                name,
                roles
            });
            return reply.status(201).send(user);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'User with this email already exists') {
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
            const user = await user_query_1.UserQueries.getById(id);
            return reply.send(user);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'User not found') {
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
            const user = await user_commands_1.UserCommands.update(id, updateData);
            return reply.send(user);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'User not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            if (error.message === 'Email already exists') {
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
            await user_commands_1.UserCommands.delete(id);
            return reply.status(204).send();
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'User not found') {
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
            const { page = 1, limit = 10, search, status } = request.query;
            const result = await user_query_1.UserQueries.list({
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
    // Funções adicionais usando queries
    async getByEmail(request, reply) {
        try {
            const { email } = request.query;
            const user = await user_query_1.UserQueries.getByEmail(email);
            if (!user) {
                return reply.status(404).send({
                    error: 'User not found'
                });
            }
            return reply.send(user);
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getByRole(request, reply) {
        try {
            const { role } = request.params;
            const users = await user_query_1.UserQueries.getByRole(role);
            return reply.send({ users });
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
            const users = await user_query_1.UserQueries.getActive();
            return reply.send({ users });
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
            const stats = await user_query_1.UserQueries.getStats();
            return reply.send(stats);
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
            const users = await user_query_1.UserQueries.search(q, limit);
            return reply.send({ users });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    // Funções adicionais usando commands
    async verifyEmail(request, reply) {
        try {
            const { id } = request.params;
            const user = await user_commands_1.UserCommands.verifyEmail(id);
            return reply.send(user);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'User not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async updateLastLogin(request, reply) {
        try {
            const { id } = request.params;
            await user_commands_1.UserCommands.updateLastLogin(id);
            return reply.send({ success: true });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    }
};
