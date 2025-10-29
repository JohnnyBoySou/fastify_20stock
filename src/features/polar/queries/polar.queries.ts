import { db } from '@/plugins/prisma';

export const PolarQueries = {
    async list({ page, limit }: { page: number, limit: number }) {
        const accessToken = process.env.POLAR_ACCESS_TOKEN as string;
        const baseUrl = process.env.POLAR_BASE_URL || 'https://api.polar.sh/v1';

        const response = await fetch(`${baseUrl}/products?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        console.log(response);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}. ${errorText}`);
        }

        const data = await response.json();
        return data;
    }
}