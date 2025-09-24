import { db } from '../../../plugins/prisma';
// Função auxiliar para calcular o estoque atual de um produto
async function calculateCurrentStock(productId) {
    const movements = await db.movement.findMany({
        where: { productId },
        select: {
            type: true,
            quantity: true
        }
    });
    let currentStock = 0;
    movements.forEach(movement => {
        if (movement.type === 'ENTRADA') {
            currentStock += movement.quantity;
        }
        else {
            currentStock -= movement.quantity;
        }
    });
    return currentStock;
}
export const ProductQueries = {
    async getById(id, storeId) {
        const product = await db.product.findUnique({
            where: { id, storeId },
            include: {
                categories: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                code: true,
                                color: true,
                                icon: true
                            }
                        }
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        corporateName: true,
                        cnpj: true,
                        tradeName: true
                    }
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        cnpj: true
                    }
                }
            }
        });
        if (!product) {
            return null;
        }
        // Calcular estoque atual
        const currentStock = await calculateCurrentStock(product.id);
        return {
            ...product,
            currentStock
        };
    },
    async list(params) {
        const { page = 1, limit = 10, search, status, categoryIds, supplierId, storeId } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (status !== undefined) {
            where.status = status;
        }
        if (categoryIds && categoryIds.length > 0) {
            where.categories = {
                some: {
                    categoryId: { in: categoryIds }
                }
            };
        }
        if (supplierId) {
            where.supplierId = supplierId;
        }
        if (storeId) {
            where.storeId = storeId;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        const [products, total] = await Promise.all([
            db.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    categories: {
                        select: {
                            category: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                    code: true,
                                    color: true,
                                    icon: true
                                }
                            }
                        }
                    },
                    supplier: {
                        select: {
                            id: true,
                            corporateName: true,
                            cnpj: true,
                            tradeName: true
                        }
                    },
                    store: {
                        select: {
                            id: true,
                            name: true,
                            cnpj: true
                        }
                    }
                }
            }),
            db.product.count({ where })
        ]);
        // Calcular estoque atual para todos os produtos
        const itemsWithStock = await Promise.all(products.map(async (product) => {
            const currentStock = await calculateCurrentStock(product.id);
            return {
                ...product,
                currentStock
            };
        }));
        return {
            items: itemsWithStock,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },
    async search(term, limit = 10) {
        const products = await db.product.findMany({
            where: {
                OR: [
                    { name: { contains: term, mode: 'insensitive' } },
                    { description: { contains: term, mode: 'insensitive' } },
                    { categories: { some: { category: { name: { contains: term, mode: 'insensitive' } } } } },
                    { supplier: { corporateName: { contains: term, mode: 'insensitive' } } },
                    { supplier: { tradeName: { contains: term, mode: 'insensitive' } } }
                ]
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                categories: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                code: true,
                                color: true,
                                icon: true
                            }
                        }
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        corporateName: true,
                        cnpj: true,
                        tradeName: true
                    }
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        cnpj: true
                    }
                }
            }
        });
        // Calcular estoque atual para todos os produtos
        const productsWithStock = await Promise.all(products.map(async (product) => {
            const currentStock = await calculateCurrentStock(product.id);
            return {
                ...product,
                currentStock
            };
        }));
        return productsWithStock;
    },
    async getActive() {
        const products = await db.product.findMany({
            where: { status: true },
            orderBy: { createdAt: 'desc' },
            include: {
                categories: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                code: true,
                                color: true,
                                icon: true
                            }
                        }
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        corporateName: true,
                        cnpj: true,
                        tradeName: true
                    }
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        cnpj: true
                    }
                }
            }
        });
        // Calcular estoque atual para todos os produtos
        const productsWithStock = await Promise.all(products.map(async (product) => {
            const currentStock = await calculateCurrentStock(product.id);
            return {
                ...product,
                currentStock
            };
        }));
        return productsWithStock;
    },
    async getStats() {
        const [total, active, inactive] = await Promise.all([
            db.product.count(),
            db.product.count({ where: { status: true } }),
            db.product.count({ where: { status: false } })
        ]);
        return {
            total,
            active,
            inactive
        };
    },
    async getByCategory(categoryId) {
        const products = await db.product.findMany({
            where: {
                categories: {
                    some: {
                        categoryId
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            include: {
                categories: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                code: true,
                                color: true,
                                icon: true
                            }
                        }
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        corporateName: true,
                        cnpj: true,
                        tradeName: true
                    }
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        cnpj: true
                    }
                }
            }
        });
        // Calcular estoque atual para todos os produtos
        const productsWithStock = await Promise.all(products.map(async (product) => {
            const currentStock = await calculateCurrentStock(product.id);
            return {
                ...product,
                currentStock
            };
        }));
        return productsWithStock;
    },
    async getBySupplier(supplierId) {
        const products = await db.product.findMany({
            where: { supplierId },
            orderBy: { createdAt: 'desc' },
            include: {
                categories: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                code: true,
                                color: true,
                                icon: true
                            }
                        }
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        corporateName: true,
                        cnpj: true,
                        tradeName: true
                    }
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        cnpj: true
                    }
                }
            }
        });
        // Calcular estoque atual para todos os produtos
        const productsWithStock = await Promise.all(products.map(async (product) => {
            const currentStock = await calculateCurrentStock(product.id);
            return {
                ...product,
                currentStock
            };
        }));
        return productsWithStock;
    },
    async getByStore(storeId) {
        const products = await db.product.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' },
            include: {
                categories: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                code: true,
                                color: true,
                                icon: true
                            }
                        }
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        corporateName: true,
                        cnpj: true,
                        tradeName: true
                    }
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        cnpj: true
                    }
                }
            }
        });
        // Calcular estoque atual para todos os produtos
        const productsWithStock = await Promise.all(products.map(async (product) => {
            const currentStock = await calculateCurrentStock(product.id);
            return {
                ...product,
                currentStock
            };
        }));
        return productsWithStock;
    },
    // === FUNÇÕES ADICIONAIS DE PRODUTO ===
    async getProductMovements(productId, params) {
        const { page = 1, limit = 10, type, startDate, endDate } = params;
        const skip = (page - 1) * limit;
        // Verificar se o produto existe
        const product = await db.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        // Construir filtros
        const where = {
            productId
        };
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
                            corporateName: true,
                            cnpj: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    store: {
                        select: {
                            id: true,
                            name: true,
                            cnpj: true
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
    async getProductStockHistory(productId, limit = 30) {
        // Verificar se o produto existe
        const product = await db.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        // Buscar histórico de movimentações
        const movements = await db.movement.findMany({
            where: { productId },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                supplier: {
                    select: {
                        id: true,
                        corporateName: true,
                        cnpj: true
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
        // Calcular estoque atual
        let currentStock = 0;
        const stockHistory = movements.map(movement => {
            if (movement.type === 'ENTRADA') {
                currentStock += movement.quantity;
            }
            else {
                currentStock -= movement.quantity;
            }
            return {
                ...movement,
                balanceAfter: currentStock
            };
        }).reverse(); // Reverter para ordem cronológica
        return {
            product: {
                id: product.id,
                name: product.name,
                stockMin: product.stockMin,
                stockMax: product.stockMax,
                alertPercentage: product.alertPercentage
            },
            currentStock,
            history: stockHistory
        };
    },
    async getLowStockProducts(storeId) {
        const where = {
            status: true
        };
        if (storeId) {
            where.storeId = storeId;
        }
        const products = await db.product.findMany({
            where,
            include: {
                movements: {
                    select: {
                        type: true,
                        quantity: true
                    }
                },
                categories: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        corporateName: true
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
        // Calcular estoque atual e filtrar produtos com estoque baixo
        const lowStockProducts = products.filter(product => {
            let currentStock = 0;
            product.movements.forEach(movement => {
                if (movement.type === 'ENTRADA') {
                    currentStock += movement.quantity;
                }
                else {
                    currentStock -= movement.quantity;
                }
            });
            return currentStock <= product.stockMin;
        }).map(product => {
            let currentStock = 0;
            product.movements.forEach(movement => {
                if (movement.type === 'ENTRADA') {
                    currentStock += movement.quantity;
                }
                else {
                    currentStock -= movement.quantity;
                }
            });
            return {
                ...product,
                currentStock,
                stockStatus: currentStock <= 0 ? 'CRITICAL' : 'LOW'
            };
        });
        return lowStockProducts;
    },
    async getProductAnalytics(productId) {
        // Verificar se o produto existe
        const product = await db.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        // Buscar todas as movimentações do produto
        const movements = await db.movement.findMany({
            where: { productId },
            include: {
                supplier: {
                    select: {
                        id: true,
                        corporateName: true
                    }
                }
            }
        });
        // Calcular estatísticas
        const totalMovements = movements.length;
        const entradaMovements = movements.filter(m => m.type === 'ENTRADA');
        const saidaMovements = movements.filter(m => m.type === 'SAIDA');
        const perdaMovements = movements.filter(m => m.type === 'PERDA');
        const totalEntrada = entradaMovements.reduce((sum, m) => sum + m.quantity, 0);
        const totalSaida = saidaMovements.reduce((sum, m) => sum + m.quantity, 0);
        const totalPerda = perdaMovements.reduce((sum, m) => sum + m.quantity, 0);
        const currentStock = totalEntrada - totalSaida - totalPerda;
        // Movimentações por mês (últimos 12 meses)
        const monthlyMovements = movements.reduce((acc, movement) => {
            const month = movement.createdAt.toISOString().substring(0, 7); // YYYY-MM
            if (!acc[month]) {
                acc[month] = { entrada: 0, saida: 0, perda: 0 };
            }
            acc[month][movement.type.toLowerCase()] += movement.quantity;
            return acc;
        }, {});
        // Fornecedores mais utilizados
        const supplierStats = movements
            .filter(m => m.supplierId)
            .reduce((acc, movement) => {
            const supplierId = movement.supplierId;
            if (!acc[supplierId]) {
                acc[supplierId] = {
                    supplier: movement.supplier,
                    totalMovements: 0,
                    totalQuantity: 0
                };
            }
            acc[supplierId].totalMovements++;
            acc[supplierId].totalQuantity += movement.quantity;
            return acc;
        }, {});
        return {
            product: {
                id: product.id,
                name: product.name,
                stockMin: product.stockMin,
                stockMax: product.stockMax,
                alertPercentage: product.alertPercentage
            },
            currentStock,
            statistics: {
                totalMovements,
                totalEntrada,
                totalSaida,
                totalPerda,
                monthlyMovements,
                supplierStats: Object.values(supplierStats)
            }
        };
    },
    // === MÉTODOS PARA GERENCIAR CATEGORIAS DO PRODUTO ===
    async getCategories(productId) {
        const product = await db.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        const categories = await db.productCategory.findMany({
            where: { productId },
            select: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        code: true,
                        color: true,
                        icon: true
                    }
                }
            }
        });
        return {
            categories: categories.map(pc => pc.category)
        };
    },
    async getProductsByCategories(categoryIds, params) {
        const { page = 1, limit = 10, search, status } = params;
        const skip = (page - 1) * limit;
        const where = {
            categories: {
                some: {
                    categoryId: { in: categoryIds }
                }
            }
        };
        if (status !== undefined) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        const [products, total] = await Promise.all([
            db.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    categories: {
                        select: {
                            category: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                    code: true,
                                    color: true,
                                    icon: true
                                }
                            }
                        }
                    },
                    supplier: {
                        select: {
                            id: true,
                            corporateName: true,
                            cnpj: true,
                            tradeName: true
                        }
                    },
                    store: {
                        select: {
                            id: true,
                            name: true,
                            cnpj: true
                        }
                    }
                }
            }),
            db.product.count({ where })
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };
    }
};
