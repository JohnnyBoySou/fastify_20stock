import { db } from '@/plugins/prisma';

export const PolarQueries = {
    async list({ page, limit }: { page: number, limit: number }) {
        const accessToken = process.env.POLAR_ACCESS_TOKEN as string;
        const baseUrl = process.env.POLAR_BASE_URL || 'https://api.polar.sh';

        try {
            const response = await fetch(`https://api.polar.sh/v1/products?page=${page}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();
            // Log para debug - remover depois
            console.log('📦 Polar API Response:', JSON.stringify(data, null, 2));

            return data;
        } catch (error) {
            console.error('📦 Polar API Error:', error);
            throw new Error(`Failed to fetch products: ${error}`);
        }
    },
}