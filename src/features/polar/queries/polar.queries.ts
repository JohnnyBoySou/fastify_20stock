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

    }
}