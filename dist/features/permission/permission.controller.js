import { UserRole, StoreRole } from '../../middlewares/authorization.middleware';
import * as PermissionCommands from './commands/permission.commands';
import * as PermissionQueries from './queries/permission.queries';
export const PermissionController = {
    // ================================
    // GESTÃO DE PERMISSÕES CUSTOMIZADAS
    // ================================
    // Criar permissão customizada para usuário
    async createUserPermission(request, reply) {
        try {
            const { userId, action, resource, storeId, grant, conditions, expiresAt, reason } = request.body;
            const prisma = request.server.prisma;
            // Verificar se o usuário tem permissão para criar permissões
            if (!request.user?.roles.includes(UserRole.SUPER_ADMIN) && !request.user?.roles.includes(UserRole.ADMIN)) {
                return reply.status(403).send({
                    error: 'Insufficient permissions to create user permissions'
                });
            }
            const userPermission = await PermissionCommands.createUserPermission(prisma, {
                userId,
                action,
                resource,
                storeId,
                grant,
                conditions,
                expiresAt,
                reason,
                createdBy: request.user.id
            });
            return reply.status(201).send({
                message: 'User permission created successfully',
                permission: userPermission
            });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    // Listar permissões customizadas de um usuário
    async getUserPermissions(request, reply) {
        try {
            const { userId } = request.params;
            const { storeId, action, active, page = 1, limit = 10 } = request.query;
            const prisma = request.server.prisma;
            // Verificar se o usuário tem permissão para ver permissões
            if (!request.user?.roles.includes(UserRole.SUPER_ADMIN) &&
                !request.user?.roles.includes(UserRole.ADMIN) &&
                request.user?.id !== userId) {
                return reply.status(403).send({
                    error: 'Insufficient permissions to view user permissions'
                });
            }
            const result = await PermissionQueries.getUserPermissions(prisma, {
                userId,
                storeId,
                action,
                active,
                page,
                limit
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
    // Atualizar permissão customizada
    async updateUserPermission(request, reply) {
        try {
            const { id } = request.params;
            const updateData = request.body;
            const prisma = request.server.prisma;
            // Verificar se o usuário tem permissão para atualizar permissões
            if (!request.user?.roles.includes(UserRole.SUPER_ADMIN) && !request.user?.roles.includes(UserRole.ADMIN)) {
                return reply.status(403).send({
                    error: 'Insufficient permissions to update user permissions'
                });
            }
            const permission = await PermissionCommands.updateUserPermission(prisma, id, updateData);
            return reply.send({
                message: 'User permission updated successfully',
                permission: {
                    ...permission,
                    conditions: permission.conditions ? JSON.parse(permission.conditions) : null
                }
            });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    // Deletar permissão customizada
    async deleteUserPermission(request, reply) {
        try {
            const { id } = request.params;
            const prisma = request.server.prisma;
            // Verificar se o usuário tem permissão para deletar permissões
            if (!request.user?.roles.includes(UserRole.SUPER_ADMIN) && !request.user?.roles.includes(UserRole.ADMIN)) {
                return reply.status(403).send({
                    error: 'Insufficient permissions to delete user permissions'
                });
            }
            await PermissionCommands.deleteUserPermission(prisma, id);
            return reply.status(204).send();
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    // ================================
    // GESTÃO DE PERMISSÕES POR LOJA
    // ================================
    // Definir permissões de usuário em uma loja
    async setStoreUserPermissions(request, reply) {
        try {
            const { userId, storeId, storeRole, permissions, conditions, expiresAt } = request.body;
            const prisma = request.server.prisma;
            // Verificar se o usuário tem permissão para gerenciar permissões da loja
            if (!request.user?.roles.includes(UserRole.SUPER_ADMIN) &&
                !request.user?.roles.includes(UserRole.ADMIN) &&
                !request.storeRole?.includes(StoreRole.OWNER) &&
                !request.storeRole?.includes(StoreRole.ADMIN)) {
                return reply.status(403).send({
                    error: 'Insufficient permissions to manage store user permissions'
                });
            }
            // Verificar se o usuário tem acesso à loja
            if (request.store?.id !== storeId) {
                return reply.status(403).send({
                    error: 'Access denied to this store'
                });
            }
            const storePermission = await PermissionCommands.setStoreUserPermissions(prisma, {
                userId,
                storeId,
                storeRole,
                permissions,
                conditions,
                expiresAt,
                createdBy: request.user.id
            });
            return reply.send({
                message: 'Store user permissions set successfully',
                permission: {
                    ...storePermission,
                    permissions: JSON.parse(storePermission.permissions),
                    conditions: storePermission.conditions ? JSON.parse(storePermission.conditions) : null
                }
            });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    // Listar permissões de usuários em uma loja
    async getStoreUserPermissions(request, reply) {
        try {
            const { storeId } = request.params;
            const { page = 1, limit = 10 } = request.query;
            const prisma = request.server.prisma;
            // Verificar se o usuário tem permissão para ver permissões da loja
            if (!request.user?.roles.includes(UserRole.SUPER_ADMIN) &&
                !request.user?.roles.includes(UserRole.ADMIN) &&
                !request.storeRole?.includes(StoreRole.OWNER) &&
                !request.storeRole?.includes(StoreRole.ADMIN)) {
                return reply.status(403).send({
                    error: 'Insufficient permissions to view store user permissions'
                });
            }
            // Verificar se o usuário tem acesso à loja
            if (request.store?.id !== storeId) {
                return reply.status(403).send({
                    error: 'Access denied to this store'
                });
            }
            const result = await PermissionQueries.getStoreUserPermissions(prisma, {
                storeId,
                page,
                limit
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
    // ================================
    // CONSULTAS E RELATÓRIOS
    // ================================
    // Obter permissões efetivas de um usuário
    async getUserEffectivePermissions(request, reply) {
        try {
            const { userId } = request.params;
            const { storeId } = request.query;
            // Verificar se o usuário tem permissão para ver permissões
            if (!request.user?.roles.includes(UserRole.SUPER_ADMIN) &&
                !request.user?.roles.includes(UserRole.ADMIN) &&
                request.user?.id !== userId) {
                return reply.status(403).send({
                    error: 'Insufficient permissions to view user permissions'
                });
            }
            const prisma = request.server.prisma;
            const result = await PermissionQueries.getUserEffectivePermissions(prisma, {
                userId,
                storeId
            });
            return reply.send(result);
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
    // Testar permissão específica
    async testPermission(request, reply) {
        try {
            const { userId, action, resource, storeId, context: testContext } = request.body;
            // Verificar se o usuário tem permissão para testar permissões
            if (!request.user?.roles.includes(UserRole.SUPER_ADMIN) && !request.user?.roles.includes(UserRole.ADMIN)) {
                return reply.status(403).send({
                    error: 'Insufficient permissions to test permissions'
                });
            }
            const prisma = request.server.prisma;
            const result = await PermissionQueries.testPermission(prisma, {
                userId,
                action,
                resource,
                storeId,
                testContext
            });
            return reply.send(result);
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
    // Obter estatísticas de permissões
    async getPermissionStats(request, reply) {
        try {
            const prisma = request.server.prisma;
            // Verificar se o usuário tem permissão para ver estatísticas
            if (!request.user?.roles.includes(UserRole.SUPER_ADMIN) && !request.user?.roles.includes(UserRole.ADMIN)) {
                return reply.status(403).send({
                    error: 'Insufficient permissions to view permission statistics'
                });
            }
            const result = await PermissionQueries.getPermissionStats(prisma);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    }
};
