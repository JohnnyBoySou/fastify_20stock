"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionController = void 0;
const authorization_middleware_1 = require("@/middlewares/authorization.middleware");
const PermissionCommands = __importStar(require("./commands/permission.commands"));
const PermissionQueries = __importStar(require("./queries/permission.queries"));
exports.PermissionController = {
    // ================================
    // GESTÃO DE PERMISSÕES CUSTOMIZADAS
    // ================================
    // Criar permissão customizada para usuário
    async createUserPermission(request, reply) {
        try {
            const { userId, action, resource, storeId, grant, conditions, expiresAt, reason } = request.body;
            const prisma = request.server.prisma;
            // Verificar se o usuário tem permissão para criar permissões
            if (!request.user?.roles.includes(authorization_middleware_1.UserRole.SUPER_ADMIN) && !request.user?.roles.includes(authorization_middleware_1.UserRole.ADMIN)) {
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
            if (!request.user?.roles.includes(authorization_middleware_1.UserRole.SUPER_ADMIN) &&
                !request.user?.roles.includes(authorization_middleware_1.UserRole.ADMIN) &&
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
            if (!request.user?.roles.includes(authorization_middleware_1.UserRole.SUPER_ADMIN) && !request.user?.roles.includes(authorization_middleware_1.UserRole.ADMIN)) {
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
            if (!request.user?.roles.includes(authorization_middleware_1.UserRole.SUPER_ADMIN) && !request.user?.roles.includes(authorization_middleware_1.UserRole.ADMIN)) {
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
            if (!request.user?.roles.includes(authorization_middleware_1.UserRole.SUPER_ADMIN) &&
                !request.user?.roles.includes(authorization_middleware_1.UserRole.ADMIN) &&
                !request.storeRole?.includes(authorization_middleware_1.StoreRole.OWNER) &&
                !request.storeRole?.includes(authorization_middleware_1.StoreRole.ADMIN)) {
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
            if (!request.user?.roles.includes(authorization_middleware_1.UserRole.SUPER_ADMIN) &&
                !request.user?.roles.includes(authorization_middleware_1.UserRole.ADMIN) &&
                !request.storeRole?.includes(authorization_middleware_1.StoreRole.OWNER) &&
                !request.storeRole?.includes(authorization_middleware_1.StoreRole.ADMIN)) {
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
            if (!request.user?.roles.includes(authorization_middleware_1.UserRole.SUPER_ADMIN) &&
                !request.user?.roles.includes(authorization_middleware_1.UserRole.ADMIN) &&
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
            if (!request.user?.roles.includes(authorization_middleware_1.UserRole.SUPER_ADMIN) && !request.user?.roles.includes(authorization_middleware_1.UserRole.ADMIN)) {
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
            if (!request.user?.roles.includes(authorization_middleware_1.UserRole.SUPER_ADMIN) && !request.user?.roles.includes(authorization_middleware_1.UserRole.ADMIN)) {
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
