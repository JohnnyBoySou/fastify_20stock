import { db } from '@/plugins/prisma';

export const PolarQueries = {
    async list({ page, limit }: { page: number, limit: number }) {
        const accessToken = process.env.POLAR_ACCESS_TOKEN as string;
        const baseUrl = process.env.POLAR_BASE_URL || 'https://api.polar.sh';

        const response = await fetch(`${baseUrl}/v1/products?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}. ${errorText}`);
        }

        const data = await response.json();
        
        // Log para debug - remover depois
        console.log('📦 Polar API Response:', JSON.stringify(data, null, 2));
        
        // A API Polar retorna: { items: [], pagination: {} }
        // Mas o schema espera: { data: [], pagination: {} }
        // Mapeando para o formato esperado
        if (data.items && Array.isArray(data.items)) {
            return {
                data: data.items,
                pagination: data.pagination || {
                    page: page,
                    limit: limit,
                    total: data.items.length
                }
            };
        }
        
        // Se já vier no formato correto, retorna direto
        if (data.data && Array.isArray(data.data)) {
            return data;
        }
        
        // Se vier apenas como array, transforma no formato esperado
        if (Array.isArray(data)) {
            return {
                data: data,
                pagination: {
                    page: page,
                    limit: limit,
                    total: data.length
                }
            };
        }
        
        // Fallback: retorna como está
        return data;
    }
}