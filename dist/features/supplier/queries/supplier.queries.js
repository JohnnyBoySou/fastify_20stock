"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierQueries = void 0;
const prisma_1 = require("../../../plugins/prisma");
exports.SupplierQueries = {
    async getById(id) {
        const supplier = await prisma_1.db.supplier.findUnique({
            where: { id },
            include: {
                responsibles: true,
                products: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                        referencePrice: true,
                        stockMin: true,
                        stockMax: true
                    }
                }
            }
        });
        if (!supplier) {
            throw new Error('Supplier not found');
        }
        return supplier;
    },
    async list(params) {
        const { page = 1, limit = 10, search, status, storeId } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { corporateName: { contains: search, mode: 'insensitive' } },
                { tradeName: { contains: search, mode: 'insensitive' } },
                { cnpj: { contains: search } },
                { city: { contains: search, mode: 'insensitive' } },
                { state: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (status !== undefined) {
            where.status = status;
        }
        // Filtrar fornecedores da loja específica
        if (storeId) {
            where.storeId = storeId;
        }
        const [suppliers, total] = await Promise.all([
            prisma_1.db.supplier.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    responsibles: {
                        where: { status: true }
                    },
                    products: {
                        select: {
                            id: true,
                            name: true,
                            status: true
                        }
                    }
                }
            }),
            prisma_1.db.supplier.count({ where })
        ]);
        return {
            items: suppliers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },
    async getByCnpj(cnpj, storeId) {
        const supplier = await prisma_1.db.supplier.findUnique({
            where: { cnpj_storeId: { cnpj, storeId: storeId || null } },
            include: {
                responsibles: true,
                products: {
                    select: {
                        id: true,
                        name: true,
                        status: true
                    }
                }
            }
        });
        if (!supplier) {
            throw new Error('Supplier not found');
        }
        return supplier;
    },
    async getByCity(city) {
        return await prisma_1.db.supplier.findMany({
            where: {
                city: { contains: city, mode: 'insensitive' },
                status: true
            },
            orderBy: { corporateName: 'asc' },
            include: {
                responsibles: {
                    where: { status: true }
                }
            }
        });
    },
    async getByState(state) {
        return await prisma_1.db.supplier.findMany({
            where: {
                state: { contains: state, mode: 'insensitive' },
                status: true
            },
            orderBy: { corporateName: 'asc' },
            include: {
                responsibles: {
                    where: { status: true }
                }
            }
        });
    },
    async getActive() {
        return await prisma_1.db.supplier.findMany({
            where: { status: true },
            orderBy: { corporateName: 'asc' },
            select: {
                id: true,
                corporateName: true,
                tradeName: true,
                cnpj: true,
                city: true,
                state: true
            }
        });
    },
    async search(term, limit = 10) {
        return await prisma_1.db.supplier.findMany({
            where: {
                status: true,
                OR: [
                    { corporateName: { contains: term, mode: 'insensitive' } },
                    { tradeName: { contains: term, mode: 'insensitive' } },
                    { cnpj: { contains: term } }
                ]
            },
            take: limit,
            orderBy: { corporateName: 'asc' },
            select: {
                id: true,
                corporateName: true,
                tradeName: true,
                cnpj: true,
                city: true,
                state: true
            }
        });
    },
    async getStats() {
        const [total, active, inactive, withProducts] = await Promise.all([
            prisma_1.db.supplier.count(),
            prisma_1.db.supplier.count({ where: { status: true } }),
            prisma_1.db.supplier.count({ where: { status: false } }),
            prisma_1.db.supplier.count({
                where: {
                    products: {
                        some: {}
                    }
                }
            })
        ]);
        return {
            total,
            active,
            inactive,
            withProducts,
            withoutProducts: total - withProducts
        };
    },
    async getTopSuppliers(limit = 5) {
        return await prisma_1.db.supplier.findMany({
            where: { status: true },
            orderBy: {
                products: {
                    _count: 'desc'
                }
            },
            take: limit,
            select: {
                id: true,
                corporateName: true,
                tradeName: true,
                cnpj: true,
                _count: {
                    select: { products: true }
                }
            }
        });
    }
};
