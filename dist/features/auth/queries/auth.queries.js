"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthQueries = void 0;
const prisma_1 = require("../../../plugins/prisma");
exports.AuthQueries = {
    async getById(id) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id, status: true },
            select: {
                id: true,
                email: true,
                name: true,
                emailVerified: true,
                status: true,
                roles: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return user;
    },
    async getByEmail(email) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email, status: true },
            select: {
                id: true,
                email: true,
                name: true,
                emailVerified: true,
                status: true,
                roles: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return user;
    },
    async getByResetToken(token) {
        const user = await prisma_1.prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    gt: new Date()
                },
                status: true
            },
            select: {
                id: true,
                email: true,
                name: true,
                emailVerified: true,
                status: true,
                roles: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return user;
    },
    async getByVerificationToken(token) {
        const user = await prisma_1.prisma.user.findFirst({
            where: {
                emailVerificationToken: token,
                emailVerified: false,
                status: true
            },
            select: {
                id: true,
                email: true,
                name: true,
                emailVerified: true,
                status: true,
                roles: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return user;
    },
    async getActiveUsers() {
        const users = await prisma_1.prisma.user.findMany({
            where: { status: true },
            select: {
                id: true,
                email: true,
                name: true,
                emailVerified: true,
                status: true,
                roles: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return users;
    },
    async getVerifiedUsers() {
        const users = await prisma_1.prisma.user.findMany({
            where: {
                status: true,
                emailVerified: true
            },
            select: {
                id: true,
                email: true,
                name: true,
                emailVerified: true,
                status: true,
                roles: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return users;
    },
    async getUnverifiedUsers() {
        const users = await prisma_1.prisma.user.findMany({
            where: {
                status: true,
                emailVerified: false
            },
            select: {
                id: true,
                email: true,
                name: true,
                emailVerified: true,
                status: true,
                roles: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return users;
    },
    async getUserStats() {
        const [totalUsers, activeUsers, verifiedUsers, unverifiedUsers, recentLogins] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { status: true } }),
            this.prisma.user.count({
                where: {
                    status: true,
                    emailVerified: true
                }
            }),
            this.prisma.user.count({
                where: {
                    status: true,
                    emailVerified: false
                }
            }),
            this.prisma.user.count({
                where: {
                    status: true,
                    lastLoginAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                    }
                }
            })
        ]);
        return {
            totalUsers,
            activeUsers,
            verifiedUsers,
            unverifiedUsers,
            recentLogins
        };
    },
    async searchUsers(searchTerm, limit = 10) {
        const users = await prisma_1.prisma.user.findMany({
            where: {
                status: true,
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { email: { contains: searchTerm, mode: 'insensitive' } }
                ]
            },
            select: {
                id: true,
                email: true,
                name: true,
                emailVerified: true,
                status: true,
                roles: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true
            },
            take: limit,
            orderBy: { createdAt: 'desc' }
        });
        return users;
    },
    async getUsersWithPendingVerification() {
        const users = await prisma_1.prisma.user.findMany({
            where: {
                status: true,
                emailVerified: false,
                emailVerificationToken: {
                    not: null
                }
            },
            select: {
                id: true,
                email: true,
                name: true,
                emailVerified: true,
                emailVerificationToken: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return users;
    },
    async getUsersWithPendingReset() {
        const users = await prisma_1.prisma.user.findMany({
            where: {
                status: true,
                resetPasswordToken: {
                    not: null
                },
                resetPasswordExpires: {
                    gt: new Date()
                }
            },
            select: {
                id: true,
                email: true,
                name: true,
                resetPasswordToken: true,
                resetPasswordExpires: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return users;
    },
    // Verify if user exists by email
    async userExists(email) {
        const count = await prisma_1.prisma.user.count({
            where: { email }
        });
        return count > 0;
    },
    // Verify if email is already verified
    async isEmailVerified(email) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
            select: { emailVerified: true }
        });
        return user?.emailVerified || false;
    },
    // Get user profile for authenticated user
    async getUserProfile(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId, status: true },
            select: {
                id: true,
                email: true,
                name: true,
                emailVerified: true,
                status: true,
                roles: true,
                lastLoginAt: true,
                phone: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
    // Get store owned by user
    async getStoreByOwner(userId) {
        const store = await prisma_1.prisma.store.findFirst({
            where: {
                ownerId: userId,
                status: true
            },
            select: {
                id: true,
                name: true,
                cnpj: true,
                email: true,
                phone: true,
                status: true,
                cep: true,
                city: true,
                state: true,
                address: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return store;
    },
    // Get user profile permissions
    async getProfilePermissions(userId, filters) {
        const { storeId, active, page = 1, limit = 10 } = filters;
        // Get user basic info
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId, status: true },
            select: { id: true, roles: true }
        });
        if (!user) {
            throw new Error('User not found');
        }
        // Build where conditions for custom permissions
        const customPermissionsWhere = { userId };
        if (storeId)
            customPermissionsWhere.storeId = storeId;
        if (active !== undefined) {
            if (active) {
                customPermissionsWhere.OR = [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ];
            }
            else {
                customPermissionsWhere.expiresAt = { lte: new Date() };
            }
        }
        // Get custom permissions
        const [customPermissions, customPermissionsTotal] = await Promise.all([
            prisma_1.prisma.userPermission.findMany({
                where: customPermissionsWhere,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    creator: {
                        select: { id: true, name: true, email: true }
                    }
                }
            }),
            prisma_1.prisma.userPermission.count({ where: customPermissionsWhere })
        ]);
        // Build where conditions for store permissions
        const storePermissionsWhere = { userId };
        if (storeId)
            storePermissionsWhere.storeId = storeId;
        if (active !== undefined) {
            if (active) {
                storePermissionsWhere.OR = [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ];
            }
            else {
                storePermissionsWhere.expiresAt = { lte: new Date() };
            }
        }
        // Get store permissions
        const [storePermissions, storePermissionsTotal] = await Promise.all([
            prisma_1.prisma.storePermission.findMany({
                where: storePermissionsWhere,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    store: {
                        select: { id: true, name: true }
                    },
                    creator: {
                        select: { id: true, name: true, email: true }
                    }
                }
            }),
            prisma_1.prisma.storePermission.count({ where: storePermissionsWhere })
        ]);
        // Get effective permissions using the existing function
        const effectivePermissions = await this.getUserEffectivePermissions(userId, { storeId });
        return {
            userId: user.id,
            userRoles: user.roles,
            storeId: storeId || null,
            effectivePermissions: effectivePermissions.effectivePermissions,
            customPermissions: customPermissions.map(p => ({
                ...p,
                conditions: p.conditions ? JSON.parse(p.conditions) : null
            })),
            storePermissions: storePermissions.map(p => ({
                ...p,
                permissions: JSON.parse(p.permissions),
                conditions: p.conditions ? JSON.parse(p.conditions) : null
            })),
            pagination: {
                page,
                limit,
                total: customPermissionsTotal + storePermissionsTotal,
                pages: Math.ceil((customPermissionsTotal + storePermissionsTotal) / limit)
            }
        };
    },
    // Get user effective permissions (helper method)
    async getUserEffectivePermissions(userId, context) {
        const { storeId } = context;
        // Get user
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, roles: true }
        });
        if (!user) {
            throw new Error('User not found');
        }
        // Get custom permissions
        const customPermissions = await prisma_1.prisma.userPermission.findMany({
            where: {
                userId,
                ...(storeId ? { storeId } : {})
            }
        });
        // Get store permissions
        let storePermissions = [];
        if (storeId) {
            storePermissions = await prisma_1.prisma.storePermission.findMany({
                where: { userId, storeId }
            });
        }
        // For now, return basic effective permissions based on roles
        // In a real implementation, you would use the GranularPermissionService
        const effectivePermissions = [];
        // Add role-based permissions
        if (user.roles.includes('admin')) {
            effectivePermissions.push('*'); // Admin has all permissions
        }
        else if (user.roles.includes('manager')) {
            effectivePermissions.push('read', 'create', 'update', 'delete');
        }
        else if (user.roles.includes('user')) {
            effectivePermissions.push('read');
        }
        // Add custom permissions
        customPermissions.forEach(perm => {
            if (perm.grant && (!perm.expiresAt || perm.expiresAt > new Date())) {
                if (!effectivePermissions.includes(perm.action)) {
                    effectivePermissions.push(perm.action);
                }
            }
        });
        // Add store permissions
        storePermissions.forEach(perm => {
            if (!perm.expiresAt || perm.expiresAt > new Date()) {
                const permissions = JSON.parse(perm.permissions);
                permissions.forEach((action) => {
                    if (!effectivePermissions.includes(action)) {
                        effectivePermissions.push(action);
                    }
                });
            }
        });
        return {
            userId,
            userRoles: user.roles,
            storeId,
            effectivePermissions,
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
    }
};
