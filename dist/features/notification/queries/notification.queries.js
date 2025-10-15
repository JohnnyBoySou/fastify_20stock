"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationQueries = void 0;
const prisma_1 = require("@/plugins/prisma");
exports.NotificationQueries = {
    async getById(id) {
        return await prisma_1.db.notification.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    },
    async list(params) {
        const { page = 1, limit = 10, search, type, priority, isRead, userId } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (userId) {
            where.userId = userId;
        }
        if (type) {
            where.type = type;
        }
        if (priority) {
            where.priority = priority;
        }
        if (isRead !== undefined) {
            where.isRead = isRead;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { message: { contains: search, mode: 'insensitive' } }
            ];
        }
        // Filter out expired notifications
        where.OR = [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
        ];
        const [items, total] = await Promise.all([
            prisma_1.db.notification.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            prisma_1.db.notification.count({ where })
        ]);
        return {
            items,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },
    async getByUser(userId, params) {
        return await exports.NotificationQueries.list({
            userId,
            ...params
        });
    },
    async getUnread(userId, limit) {
        return await prisma_1.db.notification.findMany({
            where: {
                userId,
                isRead: false,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ]
            },
            take: limit || 10,
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' }
            ],
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    },
    async getByType(type, limit) {
        return await prisma_1.db.notification.findMany({
            where: {
                type,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ]
            },
            take: limit || 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    },
    async getByPriority(priority, limit) {
        return await prisma_1.db.notification.findMany({
            where: {
                priority,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ]
            },
            take: limit || 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    },
    async search(term, limit = 10) {
        return await prisma_1.db.notification.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { title: { contains: term, mode: 'insensitive' } },
                            { message: { contains: term, mode: 'insensitive' } }
                        ]
                    },
                    {
                        OR: [
                            { expiresAt: null },
                            { expiresAt: { gt: new Date() } }
                        ]
                    }
                ]
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    },
    async getStats(userId) {
        const where = userId ? { userId } : {};
        const [total, unread, byType, byPriority] = await Promise.all([
            prisma_1.db.notification.count({ where }),
            prisma_1.db.notification.count({
                where: {
                    ...where,
                    isRead: false,
                    OR: [
                        { expiresAt: null },
                        { expiresAt: { gt: new Date() } }
                    ]
                }
            }),
            prisma_1.db.notification.groupBy({
                by: ['type'],
                where,
                _count: true
            }),
            prisma_1.db.notification.groupBy({
                by: ['priority'],
                where,
                _count: true
            })
        ]);
        return {
            total,
            unread,
            read: total - unread,
            byType: byType.reduce((acc, item) => {
                acc[item.type] = item._count;
                return acc;
            }, {}),
            byPriority: byPriority.reduce((acc, item) => {
                acc[item.priority] = item._count;
                return acc;
            }, {})
        };
    },
    async getRecent(userId, days = 7, limit = 20) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        return await prisma_1.db.notification.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startDate
                },
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ]
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    },
    // === QUERIES ESPECÍFICAS PARA ALERTAS DE ESTOQUE ===
    async getStockAlerts(params) {
        const { userId, storeId, isRead, limit = 20 } = params;
        const where = {
            type: 'STOCK_ALERT',
            OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } }
            ]
        };
        if (userId) {
            where.userId = userId;
        }
        if (isRead !== undefined) {
            where.isRead = isRead;
        }
        if (storeId) {
            where.data = {
                path: ['storeId'],
                equals: storeId
            };
        }
        return await prisma_1.db.notification.findMany({
            where,
            take: limit,
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' }
            ],
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    },
    async getUnreadStockAlerts(userId, limit = 10) {
        return await prisma_1.db.notification.findMany({
            where: {
                userId,
                type: 'STOCK_ALERT',
                isRead: false,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ]
            },
            take: limit,
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' }
            ],
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    }
};
