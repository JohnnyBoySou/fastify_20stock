"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPermissions = exports.getExpiringPermissions = exports.getPermissionsByStore = exports.getPermissionsByUser = exports.getPermissionStats = exports.testPermission = exports.getUserEffectivePermissions = exports.getStoreUserPermission = exports.getStoreUserPermissions = exports.getUserPermissionById = exports.getUserPermissions = void 0;
const granular_permissions_middleware_1 = require("@/middlewares/granular-permissions.middleware");
// ================================
// CONSULTAS DE PERMISSÕES CUSTOMIZADAS
// ================================
const getUserPermissions = async (prisma, filters) => {
    const { userId, storeId, action, active, page = 1, limit = 10 } = filters;
    const where = { userId };
    if (storeId)
        where.storeId = storeId;
    if (action)
        where.action = action;
    if (active !== undefined) {
        if (active) {
            where.OR = [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } }
            ];
        }
        else {
            where.expiresAt = { lte: new Date() };
        }
    }
    const [permissions, total] = await Promise.all([
        prisma.userPermission.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                },
                creator: {
                    select: { id: true, name: true, email: true }
                }
            }
        }),
        prisma.userPermission.count({ where })
    ]);
    return {
        permissions: permissions.map(p => ({
            ...p,
            conditions: p.conditions ? JSON.parse(p.conditions) : null
        })),
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};
exports.getUserPermissions = getUserPermissions;
const getUserPermissionById = async (prisma, id) => {
    const permission = await prisma.userPermission.findUnique({
        where: { id },
        include: {
            user: {
                select: { id: true, name: true, email: true }
            },
            creator: {
                select: { id: true, name: true, email: true }
            }
        }
    });
    if (permission) {
        return {
            ...permission,
            conditions: permission.conditions ? JSON.parse(permission.conditions) : null
        };
    }
    return null;
};
exports.getUserPermissionById = getUserPermissionById;
// ================================
// CONSULTAS DE PERMISSÕES POR LOJA
// ================================
const getStoreUserPermissions = async (prisma, filters) => {
    const { storeId, page = 1, limit = 10 } = filters;
    const [permissions, total] = await Promise.all([
        prisma.storePermission.findMany({
            where: { storeId },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                },
                store: {
                    select: { id: true, name: true }
                },
                creator: {
                    select: { id: true, name: true, email: true }
                }
            }
        }),
        prisma.storePermission.count({ where: { storeId } })
    ]);
    return {
        permissions: permissions.map(p => ({
            ...p,
            permissions: JSON.parse(p.permissions),
            conditions: p.conditions ? JSON.parse(p.conditions) : null
        })),
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};
exports.getStoreUserPermissions = getStoreUserPermissions;
const getStoreUserPermission = async (prisma, userId, storeId) => {
    const permission = await prisma.storePermission.findUnique({
        where: {
            userId_storeId: {
                userId,
                storeId
            }
        },
        include: {
            user: {
                select: { id: true, name: true, email: true }
            },
            store: {
                select: { id: true, name: true }
            },
            creator: {
                select: { id: true, name: true, email: true }
            }
        }
    });
    if (permission) {
        return {
            ...permission,
            permissions: JSON.parse(permission.permissions),
            conditions: permission.conditions ? JSON.parse(permission.conditions) : null
        };
    }
    return null;
};
exports.getStoreUserPermission = getStoreUserPermission;
// ================================
// CONSULTAS AVANÇADAS
// ================================
const getUserEffectivePermissions = async (prisma, context) => {
    const { userId, storeId } = context;
    // Buscar usuário
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, roles: true }
    });
    if (!user) {
        throw new Error('User not found');
    }
    // Buscar permissões customizadas
    const customPermissions = await prisma.userPermission.findMany({
        where: {
            userId,
            ...(storeId ? { storeId } : {})
        }
    });
    // Buscar permissões da loja
    let storePermissions = [];
    if (storeId) {
        storePermissions = await prisma.storePermission.findMany({
            where: { userId, storeId }
        });
    }
    // Construir contexto completo
    const permissionContext = {
        userId,
        userRoles: user.roles,
        storeId,
        storeRole: storePermissions[0]?.storeRole,
        customPermissions: customPermissions.map(p => ({
            ...p,
            conditions: p.conditions ? JSON.parse(p.conditions) : null
        })),
        storePermissions: storePermissions.map(p => ({
            ...p,
            permissions: JSON.parse(p.permissions),
            conditions: p.conditions ? JSON.parse(p.conditions) : null
        }))
    };
    // Obter permissões efetivas
    const effectivePermissions = await granular_permissions_middleware_1.GranularPermissionService.getUserEffectivePermissions(permissionContext);
    return {
        userId,
        userRoles: user.roles,
        storeId,
        effectivePermissions,
        customPermissions: permissionContext.customPermissions,
        storePermissions: permissionContext.storePermissions
    };
};
exports.getUserEffectivePermissions = getUserEffectivePermissions;
const testPermission = async (prisma, context) => {
    const { userId, action, resource, storeId, testContext } = context;
    // Buscar usuário
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, roles: true }
    });
    if (!user) {
        throw new Error('User not found');
    }
    // Buscar permissões customizadas
    const customPermissions = await prisma.userPermission.findMany({
        where: { userId }
    });
    // Buscar permissões da loja
    let storePermissions = [];
    if (storeId) {
        storePermissions = await prisma.storePermission.findMany({
            where: { userId, storeId }
        });
    }
    // Construir contexto de permissão
    const permissionContext = {
        userId,
        userRoles: user.roles,
        storeId,
        storeRole: storePermissions[0]?.storeRole,
        customPermissions: customPermissions.map(p => ({
            ...p,
            conditions: p.conditions ? JSON.parse(p.conditions) : null
        })),
        storePermissions: storePermissions.map(p => ({
            ...p,
            permissions: JSON.parse(p.permissions),
            conditions: p.conditions ? JSON.parse(p.conditions) : null
        })),
        requestTime: new Date(),
        requestData: testContext || {}
    };
    // Testar permissão
    const result = await granular_permissions_middleware_1.GranularPermissionService.hasPermission(permissionContext, action, resource);
    return {
        userId,
        action,
        resource,
        storeId,
        result,
        context: permissionContext
    };
};
exports.testPermission = testPermission;
// ================================
// ESTATÍSTICAS E RELATÓRIOS
// ================================
const getPermissionStats = async (prisma) => {
    const [totalUserPermissions, activeUserPermissions, expiredUserPermissions, totalStorePermissions, permissionsByAction, permissionsByRole] = await Promise.all([
        prisma.userPermission.count(),
        prisma.userPermission.count({
            where: {
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ]
            }
        }),
        prisma.userPermission.count({
            where: {
                expiresAt: { lte: new Date() }
            }
        }),
        prisma.storePermission.count(),
        prisma.userPermission.groupBy({
            by: ['action'],
            _count: { action: true }
        }),
        prisma.storePermission.groupBy({
            by: ['storeRole'],
            _count: { storeRole: true }
        })
    ]);
    return {
        userPermissions: {
            total: totalUserPermissions,
            active: activeUserPermissions,
            expired: expiredUserPermissions
        },
        storePermissions: {
            total: totalStorePermissions
        },
        permissionsByAction: permissionsByAction.map(p => ({
            action: p.action,
            count: p._count.action
        })),
        permissionsByRole: permissionsByRole.map(p => ({
            role: p.storeRole,
            count: p._count.storeRole
        }))
    };
};
exports.getPermissionStats = getPermissionStats;
const getPermissionsByUser = async (prisma, userId) => {
    const [userPermissions, storePermissions] = await Promise.all([
        prisma.userPermission.findMany({
            where: { userId },
            include: {
                creator: {
                    select: { id: true, name: true, email: true }
                }
            }
        }),
        prisma.storePermission.findMany({
            where: { userId },
            include: {
                store: {
                    select: { id: true, name: true }
                },
                creator: {
                    select: { id: true, name: true, email: true }
                }
            }
        })
    ]);
    return {
        userPermissions: userPermissions.map(p => ({
            ...p,
            conditions: p.conditions ? JSON.parse(p.conditions) : null
        })),
        storePermissions: storePermissions.map(p => ({
            ...p,
            permissions: JSON.parse(p.permissions),
            conditions: p.conditions ? JSON.parse(p.conditions) : null
        }))
    };
};
exports.getPermissionsByUser = getPermissionsByUser;
const getPermissionsByStore = async (prisma, storeId) => {
    const storePermissions = await prisma.storePermission.findMany({
        where: { storeId },
        include: {
            user: {
                select: { id: true, name: true, email: true }
            },
            store: {
                select: { id: true, name: true }
            },
            creator: {
                select: { id: true, name: true, email: true }
            }
        }
    });
    return storePermissions.map(p => ({
        ...p,
        permissions: JSON.parse(p.permissions),
        conditions: p.conditions ? JSON.parse(p.conditions) : null
    }));
};
exports.getPermissionsByStore = getPermissionsByStore;
const getExpiringPermissions = async (prisma, days = 7) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    const [userPermissions, storePermissions] = await Promise.all([
        prisma.userPermission.findMany({
            where: {
                expiresAt: {
                    gte: new Date(),
                    lte: futureDate
                }
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        }),
        prisma.storePermission.findMany({
            where: {
                expiresAt: {
                    gte: new Date(),
                    lte: futureDate
                }
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                },
                store: {
                    select: { id: true, name: true }
                }
            }
        })
    ]);
    return {
        userPermissions: userPermissions.map(p => ({
            ...p,
            conditions: p.conditions ? JSON.parse(p.conditions) : null
        })),
        storePermissions: storePermissions.map(p => ({
            ...p,
            permissions: JSON.parse(p.permissions),
            conditions: p.conditions ? JSON.parse(p.conditions) : null
        }))
    };
};
exports.getExpiringPermissions = getExpiringPermissions;
const searchPermissions = async (prisma, query, limit = 10) => {
    const userPermissions = await prisma.userPermission.findMany({
        where: {
            OR: [
                { reason: { contains: query, mode: 'insensitive' } },
                { action: { contains: query, mode: 'insensitive' } },
                { resource: { contains: query, mode: 'insensitive' } },
                {
                    user: {
                        OR: [
                            { name: { contains: query, mode: 'insensitive' } },
                            { email: { contains: query, mode: 'insensitive' } }
                        ]
                    }
                }
            ]
        },
        take: limit,
        include: {
            user: {
                select: { id: true, name: true, email: true }
            },
            creator: {
                select: { id: true, name: true, email: true }
            }
        }
    });
    return userPermissions.map(p => ({
        ...p,
        conditions: p.conditions ? JSON.parse(p.conditions) : null
    }));
};
exports.searchPermissions = searchPermissions;
