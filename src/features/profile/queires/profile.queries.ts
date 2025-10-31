import { db } from '@/plugins/prisma';

export const ProfileQueries = {
    async single(userId: string) {
        const user = await db.user.findUnique({
            where: { id: userId, status: true },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            }
        });
        return user;
    },

    async plan(userId: string) {
        const customer = await db.customer.findFirst({
            where: { 
                userId: userId, 
                status: 'ACTIVE' 
            },
            select: {
                id: true,
                planId: true,
                plan: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                        interval: true,
                        features: true,
                    }
                }
            }
        });

        console.log(customer?.plan);
        return {
            plan: customer?.plan || null,
        };
    },

    async preferences(userId: string) {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            }
        });
        return user;
    }
};
