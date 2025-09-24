import { db } from '../../../plugins/prisma';
export const NotificationCommands = {
    async create(data) {
        return await db.notification.create({
            data: {
                userId: data.userId,
                title: data.title,
                message: data.message,
                type: data.type || 'INFO',
                priority: data.priority || 'MEDIUM',
                data: data.data,
                actionUrl: data.actionUrl,
                expiresAt: data.expiresAt
            },
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
    async update(id, data) {
        return await db.notification.update({
            where: { id },
            data,
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
    async delete(id) {
        return await db.notification.delete({
            where: { id }
        });
    },
    async markAsRead(id) {
        return await db.notification.update({
            where: { id },
            data: {
                isRead: true,
                readAt: new Date()
            },
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
    async markAsUnread(id) {
        return await db.notification.update({
            where: { id },
            data: {
                isRead: false,
                readAt: null
            },
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
    async markAllAsRead(userId) {
        return await db.notification.updateMany({
            where: {
                userId,
                isRead: false
            },
            data: {
                isRead: true,
                readAt: new Date()
            }
        });
    },
    async deleteExpired() {
        return await db.notification.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        });
    },
    async deleteByUser(userId) {
        return await db.notification.deleteMany({
            where: { userId }
        });
    }
};
