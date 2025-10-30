import { db } from '@/plugins/prisma';
import { polar } from '@/plugins/polar';

export const PolarQueries = {
    async list({ page, limit }: { page: number, limit: number }) {
        try {
            const { result } = await polar.products.list({
                organizationId: process.env.POLAR_ORGANIZATION_ID!,
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
                organizationId: process.env.POLAR_ORGANIZATION_ID!,
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
    }
}