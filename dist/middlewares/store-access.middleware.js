"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireStoreResourceAccess = exports.requireStoreUserManagement = exports.requireStoreRoleAccess = exports.requireStoreAccess = void 0;
const authorization_middleware_1 = require("./authorization.middleware");
// Middleware to check if user has access to a specific store
const requireStoreAccess = (storeIdParam = 'storeId') => {
    return async (request, reply) => {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    error: 'Authentication required'
                });
            }
            const storeId = request.params[storeIdParam];
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store ID is required'
                });
            }
            const prisma = request.server.prisma;
            const currentUserId = request.user.id;
            // Check if user is super admin (can access all stores)
            if (request.user.roles.includes('super_admin')) {
                return;
            }
            // Check if user owns the store
            const store = await prisma.store.findFirst({
                where: {
                    id: storeId,
                    ownerId: currentUserId
                }
            });
            if (store) {
                return; // User owns the store
            }
            // Check if user has access to the store through StoreUser relationship
            const storeUser = await prisma.storeUser.findFirst({
                where: {
                    storeId: storeId,
                    userId: currentUserId
                },
                include: {
                    store: true
                }
            });
            if (!storeUser) {
                return reply.status(403).send({
                    error: 'Access denied - no permission to access this store'
                });
            }
            // Attach store role to request for further use
            request.storeRole = storeUser.role;
            request.store = storeUser.store;
            return;
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    };
};
exports.requireStoreAccess = requireStoreAccess;
// Middleware to check if user has specific store role
const requireStoreRoleAccess = (requiredRoles, storeIdParam = 'storeId') => {
    return async (request, reply) => {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    error: 'Authentication required'
                });
            }
            const storeId = request.params[storeIdParam];
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store ID is required'
                });
            }
            const prisma = request.server.prisma;
            const currentUserId = request.user.id;
            // Check if user is super admin (can access all stores)
            if (request.user.roles.includes('super_admin')) {
                return;
            }
            // Check if user owns the store
            const store = await prisma.store.findFirst({
                where: {
                    id: storeId,
                    ownerId: currentUserId
                }
            });
            if (store) {
                return; // Store owner has all permissions
            }
            // Check if user has the required store role
            const storeUser = await prisma.storeUser.findFirst({
                where: {
                    storeId: storeId,
                    userId: currentUserId,
                    role: {
                        in: requiredRoles
                    }
                },
                include: {
                    store: true
                }
            });
            if (!storeUser) {
                return reply.status(403).send({
                    error: 'Insufficient store permissions',
                    required: requiredRoles,
                    storeId: storeId
                });
            }
            // Attach store role to request for further use
            request.storeRole = storeUser.role;
            request.store = storeUser.store;
            return;
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    };
};
exports.requireStoreRoleAccess = requireStoreRoleAccess;
// Middleware to check if user can manage store users
const requireStoreUserManagement = (storeIdParam = 'storeId') => {
    return async (request, reply) => {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    error: 'Authentication required'
                });
            }
            const storeId = request.params[storeIdParam];
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store ID is required'
                });
            }
            const prisma = request.server.prisma;
            const currentUserId = request.user.id;
            // Check if user is super admin (can manage all stores)
            if (request.user.roles.includes('super_admin')) {
                return;
            }
            // Check if user owns the store
            const store = await prisma.store.findFirst({
                where: {
                    id: storeId,
                    ownerId: currentUserId
                }
            });
            if (store) {
                return; // Store owner can manage all users
            }
            // Check if user has admin or manager role in the store
            const storeUser = await prisma.storeUser.findFirst({
                where: {
                    storeId: storeId,
                    userId: currentUserId,
                    role: {
                        in: [authorization_middleware_1.StoreRole.ADMIN, authorization_middleware_1.StoreRole.MANAGER]
                    }
                }
            });
            if (!storeUser) {
                return reply.status(403).send({
                    error: 'Access denied - insufficient permissions to manage store users'
                });
            }
            return;
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    };
};
exports.requireStoreUserManagement = requireStoreUserManagement;
// Middleware to check if user can access store resources (products, movements, etc.)
const requireStoreResourceAccess = (storeIdParam = 'storeId') => {
    return async (request, reply) => {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    error: 'Authentication required'
                });
            }
            const storeId = request.params[storeIdParam];
            if (!storeId) {
                return reply.status(400).send({
                    error: 'Store ID is required'
                });
            }
            const prisma = request.server.prisma;
            const currentUserId = request.user.id;
            // Check if user is super admin (can access all stores)
            if (request.user.roles.includes('super_admin')) {
                return;
            }
            // Check if user owns the store
            const store = await prisma.store.findFirst({
                where: {
                    id: storeId,
                    ownerId: currentUserId
                }
            });
            if (store) {
                return; // Store owner has all permissions
            }
            // Check if user has any role in the store
            const storeUser = await prisma.storeUser.findFirst({
                where: {
                    storeId: storeId,
                    userId: currentUserId
                }
            });
            if (!storeUser) {
                return reply.status(403).send({
                    error: 'Access denied - no permission to access this store\'s resources'
                });
            }
            return;
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    };
};
exports.requireStoreResourceAccess = requireStoreResourceAccess;
