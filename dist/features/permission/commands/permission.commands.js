"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendUserPermissions = exports.expireUserPermissions = exports.bulkDeleteUserPermissions = exports.bulkUpdateUserPermissions = exports.bulkCreateUserPermissions = exports.deleteStoreUserPermissions = exports.setStoreUserPermissions = exports.deleteUserPermission = exports.updateUserPermission = exports.createUserPermission = void 0;
// ================================
// GESTÃO DE PERMISSÕES CUSTOMIZADAS
// ================================
const createUserPermission = async (prisma, data) => {
    return await prisma.userPermission.create({
        data: {
            userId: data.userId,
            action: data.action,
            resource: data.resource,
            storeId: data.storeId,
            grant: data.grant,
            conditions: data.conditions ? JSON.stringify(data.conditions) : null,
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
            reason: data.reason,
            createdBy: data.createdBy
        }
    });
};
exports.createUserPermission = createUserPermission;
const updateUserPermission = async (prisma, id, data) => {
    return await prisma.userPermission.update({
        where: { id },
        data: {
            ...data,
            conditions: data.conditions ? JSON.stringify(data.conditions) : undefined,
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined
        }
    });
};
exports.updateUserPermission = updateUserPermission;
const deleteUserPermission = async (prisma, id) => {
    return await prisma.userPermission.delete({
        where: { id }
    });
};
exports.deleteUserPermission = deleteUserPermission;
// ================================
// GESTÃO DE PERMISSÕES POR LOJA
// ================================
const setStoreUserPermissions = async (prisma, data) => {
    return await prisma.storePermission.upsert({
        where: {
            userId_storeId: {
                userId: data.userId,
                storeId: data.storeId
            }
        },
        update: {
            storeRole: data.storeRole,
            permissions: JSON.stringify(data.permissions),
            conditions: data.conditions ? JSON.stringify(data.conditions) : null,
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
            createdBy: data.createdBy
        },
        create: {
            userId: data.userId,
            storeId: data.storeId,
            storeRole: data.storeRole,
            permissions: JSON.stringify(data.permissions),
            conditions: data.conditions ? JSON.stringify(data.conditions) : null,
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
            createdBy: data.createdBy
        }
    });
};
exports.setStoreUserPermissions = setStoreUserPermissions;
const deleteStoreUserPermissions = async (prisma, userId, storeId) => {
    return await prisma.storePermission.delete({
        where: {
            userId_storeId: {
                userId,
                storeId
            }
        }
    });
};
exports.deleteStoreUserPermissions = deleteStoreUserPermissions;
// ================================
// OPERAÇÕES ESPECIAIS
// ================================
const bulkCreateUserPermissions = async (prisma, permissions) => {
    return await prisma.userPermission.createMany({
        data: permissions.map(permission => ({
            ...permission,
            conditions: permission.conditions ? JSON.stringify(permission.conditions) : null,
            expiresAt: permission.expiresAt ? new Date(permission.expiresAt) : null
        }))
    });
};
exports.bulkCreateUserPermissions = bulkCreateUserPermissions;
const bulkUpdateUserPermissions = async (prisma, updates) => {
    const transactions = updates.map(update => prisma.userPermission.update({
        where: { id: update.id },
        data: {
            ...update.data,
            conditions: update.data.conditions ? JSON.stringify(update.data.conditions) : undefined,
            expiresAt: update.data.expiresAt ? new Date(update.data.expiresAt) : undefined
        }
    }));
    return await prisma.$transaction(transactions);
};
exports.bulkUpdateUserPermissions = bulkUpdateUserPermissions;
const bulkDeleteUserPermissions = async (prisma, ids) => {
    return await prisma.userPermission.deleteMany({
        where: {
            id: {
                in: ids
            }
        }
    });
};
exports.bulkDeleteUserPermissions = bulkDeleteUserPermissions;
const expireUserPermissions = async (prisma, userIds, reason) => {
    return await prisma.userPermission.updateMany({
        where: {
            userId: {
                in: userIds
            },
            expiresAt: {
                gt: new Date()
            }
        },
        data: {
            expiresAt: new Date(),
            reason: reason || 'Bulk expiration'
        }
    });
};
exports.expireUserPermissions = expireUserPermissions;
const extendUserPermissions = async (prisma, userIds, newExpiryDate, reason) => {
    return await prisma.userPermission.updateMany({
        where: {
            userId: {
                in: userIds
            }
        },
        data: {
            expiresAt: new Date(newExpiryDate),
            reason: reason || 'Bulk extension'
        }
    });
};
exports.extendUserPermissions = extendUserPermissions;
