import { db } from '@/plugins/prisma';
import { polar } from '@/plugins/polar';

export const PolarQueries = {
    async createCustomer(data: {
        email: string
        name: string
        externalId: string // user.id
    }) {
        try {
            const customer = await polar.customers.create({
                email: data.email,
                name: data.name,
                externalId: data.externalId,
                //organizationId: process.env.POLAR_ORGANIZATION_ID as string,
            });

            return customer;
        } catch (error) {
            console.error('Polar create customer error:', error);
            return null;
        }
    },
    async list({ page, limit }: { page: number, limit: number }) {
        try {
            const { result } = await polar.products.list({
                organizationId: process.env.POLAR_ORGANIZATION_ID as string,
                page,
                limit,
            });

            return {
                items: result.items,
                pagination: {
                    page,
                    limit
                }
            };
        } catch (error) {
            console.error('Polar products list error:', error);
            throw new Error(`Failed to fetch products: ${error}`);
        }

    },

    async getFreePlan() {
        try {
            const { result } = await polar.products.list({
                organizationId: process.env.POLAR_ORGANIZATION_ID as string,
                page: 1,
                limit: 10,
            });

            // Encontrar o produto com preço free
            const freeProduct = result.items.find(product => 
                product.prices && product.prices.length > 0 && product.prices.some((price: any) => price.amountType === 'free')
            );

            return freeProduct || null;
        } catch (error) {
            console.error('Polar get free plan error:', error);
            return null;
        }
    },

    async createSubscription(data: {
        customerId: string // ID do customer no Polar
        productId: string // ID do produto no Polar
    }) {
        try {
            const subscription = await polar.subscriptions.create({
                customerId: data.customerId,
                productId: data.productId
            });

            return subscription;
        } catch (error) {
            console.error('Polar create subscription error:', error);
            return null;
        }
    }
}