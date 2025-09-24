import { db } from '../../../plugins/prisma';
export const MovementQueries = {
    async getById(id) {
        return await db.movement.findUnique({
            where: { id },
            include: {
                store: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                product: {
                    select: {
                        id: true,
                        name: true,
                        unitOfMeasure: true
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        corporateName: true
                    }
                },
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
        const { page = 1, limit = 10, search, type, storeId, productId, supplierId, startDate, endDate } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (type) {
            where.type = type;
        }
        if (storeId) {
            where.storeId = storeId;
        }
        if (productId) {
            where.productId = productId;
        }
        if (supplierId) {
            where.supplierId = supplierId;
        }
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                where.createdAt.lte = new Date(endDate);
            }
        }
        if (search) {
            where.OR = [
                {
                    product: {
                        name: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                },
                {
                    store: {
                        name: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                },
                {
                    supplier: {
                        corporateName: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                },
                {
                    batch: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    note: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ];
        }
        const [items, total] = await Promise.all([
            db.movement.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    store: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    product: {
                        select: {
                            id: true,
                            name: true,
                            unitOfMeasure: true
                        }
                    },
                    supplier: {
                        select: {
                            id: true,
                            corporateName: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            db.movement.count({ where })
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
    async search(term, limit = 10) {
        return await db.movement.findMany({
            where: {
                OR: [
                    {
                        product: {
                            name: {
                                contains: term,
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        store: {
                            name: {
                                contains: term,
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        supplier: {
                            corporateName: {
                                contains: term,
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        batch: {
                            contains: term,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                store: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                product: {
                    select: {
                        id: true,
                        name: true,
                        unitOfMeasure: true
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        corporateName: true
                    }
                }
            }
        });
    },
    async getByStore(storeId, params) {
        const { page = 1, limit = 10, type, startDate, endDate } = params;
        const skip = (page - 1) * limit;
        const where = { storeId };
        if (type) {
            where.type = type;
        }
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                where.createdAt.lte = new Date(endDate);
            }
        }
        const [items, total] = await Promise.all([
            db.movement.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            unitOfMeasure: true
                        }
                    },
                    supplier: {
                        select: {
                            id: true,
                            corporateName: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            db.movement.count({ where })
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
    async getByProduct(productId, params) {
        const { page = 1, limit = 10, type, startDate, endDate } = params;
        const skip = (page - 1) * limit;
        const where = { productId };
        if (type) {
            where.type = type;
        }
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                where.createdAt.lte = new Date(endDate);
            }
        }
        const [items, total] = await Promise.all([
            db.movement.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    store: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    supplier: {
                        select: {
                            id: true,
                            corporateName: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            db.movement.count({ where })
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
    async getBySupplier(supplierId, params) {
        const { page = 1, limit = 10, type, startDate, endDate } = params;
        const skip = (page - 1) * limit;
        const where = { supplierId };
        if (type) {
            where.type = type;
        }
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                where.createdAt.lte = new Date(endDate);
            }
        }
        const [items, total] = await Promise.all([
            db.movement.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    store: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    product: {
                        select: {
                            id: true,
                            name: true,
                            unitOfMeasure: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            db.movement.count({ where })
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
    async getStockHistory(productId, storeId, params) {
        const { startDate, endDate } = params;
        const where = { productId, storeId };
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                where.createdAt.lte = new Date(endDate);
            }
        }
        return await db.movement.findMany({
            where,
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                type: true,
                quantity: true,
                balanceAfter: true,
                createdAt: true,
                batch: true,
                price: true,
                note: true,
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    },
    async getCurrentStock(productId, storeId) {
        const movements = await db.movement.findMany({
            where: {
                productId,
                storeId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        let stock = 0;
        for (const movement of movements) {
            if (movement.type === 'ENTRADA') {
                stock += movement.quantity;
            }
            else if (movement.type === 'SAIDA' || movement.type === 'PERDA') {
                stock -= movement.quantity;
            }
        }
        return Math.max(0, stock);
    },
    async getStats() {
        const [total, entrada, saida, perda, totalValue, averageValue, _byType, byStore, byProduct, bySupplier] = await Promise.all([
            db.movement.count(),
            db.movement.count({ where: { type: 'ENTRADA' } }),
            db.movement.count({ where: { type: 'SAIDA' } }),
            db.movement.count({ where: { type: 'PERDA' } }),
            db.movement.aggregate({
                _sum: {
                    price: true
                }
            }),
            db.movement.aggregate({
                _avg: {
                    price: true
                }
            }),
            db.movement.groupBy({
                by: ['type'],
                _count: {
                    id: true
                }
            }),
            db.movement.groupBy({
                by: ['storeId'],
                _count: {
                    id: true
                },
                _sum: {
                    price: true
                }
            }),
            db.movement.groupBy({
                by: ['productId'],
                _count: {
                    id: true
                },
                _sum: {
                    quantity: true
                }
            }),
            db.movement.groupBy({
                by: ['supplierId'],
                _count: {
                    id: true
                },
                _sum: {
                    price: true
                },
                where: {
                    supplierId: {
                        not: null
                    }
                }
            })
        ]);
        // Buscar nomes das entidades relacionadas
        const storeIds = byStore.map(item => item.storeId);
        const productIds = byProduct.map(item => item.productId);
        const supplierIds = bySupplier.map(item => item.supplierId).filter(Boolean);
        const [stores, products, suppliers] = await Promise.all([
            storeIds.length > 0 ? db.store.findMany({
                where: { id: { in: storeIds } },
                select: { id: true, name: true }
            }) : [],
            productIds.length > 0 ? db.product.findMany({
                where: { id: { in: productIds } },
                select: { id: true, name: true }
            }) : [],
            supplierIds.length > 0 ? db.supplier.findMany({
                where: { id: { in: supplierIds } },
                select: { id: true, corporateName: true }
            }) : []
        ]);
        const storeMap = new Map(stores.map(store => [store.id, store.name]));
        const productMap = new Map(products.map(product => [product.id, product.name]));
        const supplierMap = new Map(suppliers.map(supplier => [supplier.id, supplier.corporateName]));
        return {
            total,
            entrada,
            saida,
            perda,
            totalValue: totalValue._sum.price || 0,
            averageValue: averageValue._avg.price || 0,
            byType: {
                ENTRADA: entrada,
                SAIDA: saida,
                PERDA: perda
            },
            byStore: byStore.map(item => ({
                storeId: item.storeId,
                storeName: storeMap.get(item.storeId) || 'Unknown',
                count: item._count.id,
                totalValue: item._sum.price || 0
            })),
            byProduct: byProduct.map(item => ({
                productId: item.productId,
                productName: productMap.get(item.productId) || 'Unknown',
                count: item._count.id,
                totalQuantity: item._sum.quantity || 0
            })),
            bySupplier: bySupplier.map(item => ({
                supplierId: item.supplierId,
                supplierName: supplierMap.get(item.supplierId) || 'Unknown',
                count: item._count.id,
                totalValue: item._sum.price || 0
            }))
        };
    },
    async getLowStockProducts(storeId) {
        const where = {};
        if (storeId) {
            where.storeId = storeId;
        }
        const products = await db.product.findMany({
            where: {
                ...where,
                status: true
            },
            include: {
                movements: {
                    where: {
                        storeId: storeId || undefined
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                store: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        const lowStockProducts = [];
        for (const product of products) {
            const currentStock = await MovementQueries.getCurrentStock(product.id, product.storeId);
            const alertThreshold = Math.floor((product.stockMin * product.alertPercentage) / 100);
            if (currentStock <= alertThreshold) {
                lowStockProducts.push({
                    product: {
                        id: product.id,
                        name: product.name,
                        unitOfMeasure: product.unitOfMeasure
                    },
                    store: product.store,
                    currentStock,
                    stockMin: product.stockMin,
                    stockMax: product.stockMax,
                    alertThreshold,
                    status: currentStock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK'
                });
            }
        }
        return lowStockProducts.sort((a, b) => a.currentStock - b.currentStock);
    },
    // === FUNÇÕES ADICIONAIS DE MOVIMENTAÇÃO ===
    async getMovementReport(params) {
        // Implementação básica do relatório de movimentação
        const { storeId, productId, supplierId, type, startDate, endDate } = params;
        const where = {};
        if (storeId)
            where.storeId = storeId;
        if (productId)
            where.productId = productId;
        if (supplierId)
            where.supplierId = supplierId;
        if (type)
            where.type = type;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const movements = await db.movement.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                store: { select: { id: true, name: true } },
                product: { select: { id: true, name: true, unitOfMeasure: true } },
                supplier: { select: { id: true, corporateName: true } },
                user: { select: { id: true, name: true, email: true } }
            }
        });
        return {
            movements,
            summary: {
                total: movements.length,
                totalValue: movements.reduce((sum, m) => sum + (Number(m.price) || 0), 0),
                byType: movements.reduce((acc, m) => {
                    acc[m.type] = (acc[m.type] || 0) + 1;
                    return acc;
                }, {})
            }
        };
    },
    async getVerifiedMovements(params) {
        const { page = 1, limit = 10, storeId, verified, startDate, endDate } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (storeId)
            where.storeId = storeId;
        if (verified !== undefined)
            where.verified = verified;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const [items, total] = await Promise.all([
            db.movement.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    store: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    product: {
                        select: {
                            id: true,
                            name: true,
                            unitOfMeasure: true
                        }
                    },
                    supplier: {
                        select: {
                            id: true,
                            corporateName: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            db.movement.count({ where })
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
    async getCancelledMovements(params) {
        const { page = 1, limit = 10, storeId, startDate, endDate } = params;
        const skip = (page - 1) * limit;
        const where = { cancelled: true };
        if (storeId)
            where.storeId = storeId;
        if (startDate || endDate) {
            where.cancelledAt = {};
            if (startDate)
                where.cancelledAt.gte = new Date(startDate);
            if (endDate)
                where.cancelledAt.lte = new Date(endDate);
        }
        const [items, total] = await Promise.all([
            db.movement.findMany({
                where,
                skip,
                take: limit,
                orderBy: { cancelledAt: 'desc' },
                include: {
                    store: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    product: {
                        select: {
                            id: true,
                            name: true,
                            unitOfMeasure: true
                        }
                    },
                    supplier: {
                        select: {
                            id: true,
                            corporateName: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            db.movement.count({ where })
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
    async getMovementAnalytics(params) {
        const { storeId, productId, supplierId, startDate, endDate } = params;
        const where = {};
        if (storeId)
            where.storeId = storeId;
        if (productId)
            where.productId = productId;
        if (supplierId)
            where.supplierId = supplierId;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const [totalMovements, totalValue, averageValue, byType, byMonth, byStore, byProduct, bySupplier, verifiedCount, cancelledCount] = await Promise.all([
            db.movement.count({ where }),
            db.movement.aggregate({
                where,
                _sum: { price: true }
            }),
            db.movement.aggregate({
                where,
                _avg: { price: true }
            }),
            db.movement.groupBy({
                by: ['type'],
                where,
                _count: { id: true },
                _sum: { quantity: true, price: true }
            }),
            db.movement.groupBy({
                by: ['createdAt'],
                where,
                _count: { id: true },
                _sum: { price: true },
                orderBy: { createdAt: 'asc' }
            }),
            db.movement.groupBy({
                by: ['storeId'],
                where,
                _count: { id: true },
                _sum: { price: true }
            }),
            db.movement.groupBy({
                by: ['productId'],
                where,
                _count: { id: true },
                _sum: { quantity: true, price: true }
            }),
            db.movement.groupBy({
                by: ['supplierId'],
                where: { ...where, supplierId: { not: null } },
                _count: { id: true },
                _sum: { price: true }
            }),
            db.movement.count({ where: { ...where, verified: true } }),
            db.movement.count({ where: { ...where, cancelled: true } })
        ]);
        // Buscar nomes das entidades
        const storeIds = byStore.map(item => item.storeId);
        const productIds = byProduct.map(item => item.productId);
        const supplierIds = bySupplier.map(item => item.supplierId).filter(Boolean);
        const [stores, products, suppliers] = await Promise.all([
            storeIds.length > 0 ? db.store.findMany({
                where: { id: { in: storeIds } },
                select: { id: true, name: true }
            }) : [],
            productIds.length > 0 ? db.product.findMany({
                where: { id: { in: productIds } },
                select: { id: true, name: true }
            }) : [],
            supplierIds.length > 0 ? db.supplier.findMany({
                where: { id: { in: supplierIds } },
                select: { id: true, corporateName: true }
            }) : []
        ]);
        const storeMap = new Map(stores.map(store => [store.id, store.name]));
        const productMap = new Map(products.map((product) => [product.id, product.name]));
        const supplierMap = new Map(suppliers.map(supplier => [supplier.id, supplier.corporateName]));
        return {
            summary: {
                totalMovements,
                totalValue: totalValue._sum.price || 0,
                averageValue: averageValue._avg.price || 0,
                verifiedCount,
                cancelledCount,
                verificationRate: totalMovements > 0 ? (verifiedCount / totalMovements) * 100 : 0,
                cancellationRate: totalMovements > 0 ? (cancelledCount / totalMovements) * 100 : 0
            },
            byType: byType.map(item => ({
                type: item.type,
                count: item._count.id,
                quantity: item._sum.quantity || 0,
                value: item._sum.price || 0
            })),
            byMonth: byMonth.map(item => ({
                month: item.createdAt.toISOString().substring(0, 7),
                count: item._count.id,
                value: item._sum.price || 0
            })),
            byStore: byStore.map(item => ({
                storeId: item.storeId,
                storeName: storeMap.get(item.storeId) || 'Unknown',
                count: item._count.id,
                value: item._sum.price || 0
            })),
            byProduct: byProduct.map(item => ({
                productId: item.productId,
                productName: productMap.get(item.productId) || 'Unknown',
                count: item._count.id,
                quantity: item._sum.quantity || 0,
                value: item._sum.price || 0
            })),
            bySupplier: bySupplier.map(item => ({
                supplierId: item.supplierId,
                supplierName: supplierMap.get(item.supplierId) || 'Unknown',
                count: item._count.id,
                value: item._sum.price || 0
            }))
        };
    }
};
