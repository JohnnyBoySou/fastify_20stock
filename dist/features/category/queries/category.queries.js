"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryQueries = void 0;
const prisma_1 = require("../../../plugins/prisma");
exports.CategoryQueries = {
    async getById(id) {
        return await prisma_1.db.category.findUnique({
            where: { id },
            include: {
                parent: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        code: true
                    }
                },
                children: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        code: true,
                        status: true,
                        color: true,
                        icon: true
                    }
                },
                products: {
                    select: {
                        id: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                status: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        children: true,
                        products: true
                    }
                }
            }
        });
    },
    async list(params) {
        const { page = 1, limit = 10, search, status, parentId } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (status !== undefined) {
            where.status = status;
        }
        if (parentId !== undefined) {
            if (parentId === null) {
                where.parentId = null;
            }
            else {
                where.parentId = parentId;
            }
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } }
            ];
        }
        const [items, total] = await Promise.all([
            prisma_1.db.category.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    parent: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            code: true
                        }
                    },
                    children: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            code: true,
                            status: true,
                            color: true,
                            icon: true
                        }
                    },
                    products: {
                        select: {
                            id: true,
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                    status: true
                                }
                            }
                        },
                        take: 5
                    },
                    _count: {
                        select: {
                            children: true,
                            products: true
                        }
                    }
                }
            }),
            prisma_1.db.category.count({ where })
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
        return await prisma_1.db.category.findMany({
            where: {
                OR: [
                    { name: { contains: term, mode: 'insensitive' } },
                    { description: { contains: term, mode: 'insensitive' } },
                    { code: { contains: term, mode: 'insensitive' } }
                ]
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                parent: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        code: true
                    }
                },
                children: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        code: true,
                        status: true,
                        color: true,
                        icon: true
                    }
                },
                _count: {
                    select: {
                        children: true,
                        products: true
                    }
                }
            }
        });
    },
    async getActive() {
        return await prisma_1.db.category.findMany({
            where: { status: true },
            orderBy: { createdAt: 'desc' },
            include: {
                parent: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        code: true
                    }
                },
                children: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        code: true,
                        status: true,
                        color: true,
                        icon: true
                    }
                },
                _count: {
                    select: {
                        children: true,
                        products: true
                    }
                }
            }
        });
    },
    async getStats() {
        const [total, active, inactive, withChildren, withoutChildren] = await Promise.all([
            prisma_1.db.category.count(),
            prisma_1.db.category.count({ where: { status: true } }),
            prisma_1.db.category.count({ where: { status: false } }),
            prisma_1.db.category.count({
                where: {
                    children: { some: {} }
                }
            }),
            prisma_1.db.category.count({
                where: {
                    children: { none: {} }
                }
            })
        ]);
        return {
            total,
            active,
            inactive,
            withChildren,
            withoutChildren
        };
    },
    async getRootCategories(status) {
        const where = { parentId: null };
        if (status !== undefined) {
            where.status = status;
        }
        return await prisma_1.db.category.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                children: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        code: true,
                        status: true,
                        color: true,
                        icon: true
                    }
                },
                _count: {
                    select: {
                        children: true,
                        products: true
                    }
                }
            }
        });
    },
    async getChildren(parentId) {
        return await prisma_1.db.category.findMany({
            where: { parentId },
            orderBy: { createdAt: 'desc' },
            include: {
                children: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        code: true,
                        status: true,
                        color: true,
                        icon: true
                    }
                },
                products: {
                    select: {
                        id: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                status: true
                            }
                        }
                    },
                    take: 5
                },
                _count: {
                    select: {
                        children: true,
                        products: true
                    }
                }
            }
        });
    },
    async getHierarchy() {
        const rootCategories = await exports.CategoryQueries.getRootCategories();
        const buildHierarchy = async (categories) => {
            for (const category of categories) {
                category.children = await exports.CategoryQueries.getChildren(category.id);
                if (category.children.length > 0) {
                    await buildHierarchy(category.children);
                }
            }
        };
        await buildHierarchy(rootCategories);
        return rootCategories;
    },
    async getByCode(code) {
        return await prisma_1.db.category.findUnique({
            where: { code },
            include: {
                parent: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        code: true
                    }
                },
                children: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        code: true,
                        status: true,
                        color: true,
                        icon: true
                    }
                },
                products: {
                    select: {
                        id: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                status: true
                            }
                        }
                    },
                    take: 5
                },
                _count: {
                    select: {
                        children: true,
                        products: true
                    }
                }
            }
        });
    },
    async getTopCategoriesByProducts(params) {
        const { limit = 10, status, includeInactive = false } = params;
        const where = {};
        // Se não incluir inativas, filtrar apenas ativas
        if (!includeInactive) {
            where.status = status !== undefined ? status : true;
        }
        else if (status !== undefined) {
            where.status = status;
        }
        // Garantir que só retorne categorias que tenham produtos
        where.products = {
            some: {}
        };
        return await prisma_1.db.category.findMany({
            where,
            take: limit,
            orderBy: {
                products: {
                    _count: 'desc'
                }
            },
            select: {
                id: true,
                name: true,
                description: true,
                code: true,
                status: true,
                color: true,
                icon: true,
                parentId: true,
                createdAt: true,
                updatedAt: true,
                parent: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        code: true
                    }
                },
                _count: {
                    select: {
                        products: true,
                        children: true
                    }
                }
            }
        });
    },
    async getTopCategoriesByProductsWithDetails(params) {
        const { limit = 10, status, includeInactive = false, includeProductDetails = false } = params;
        const where = {};
        // Se não incluir inativas, filtrar apenas ativas
        if (!includeInactive) {
            where.status = status !== undefined ? status : true;
        }
        else if (status !== undefined) {
            where.status = status;
        }
        // Garantir que só retorne categorias que tenham produtos
        where.products = {
            some: {}
        };
        const include = {
            parent: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    code: true
                }
            },
            _count: {
                select: {
                    products: true,
                    children: true
                }
            }
        };
        // Incluir detalhes dos produtos se solicitado
        if (includeProductDetails) {
            include.products = {
                select: {
                    id: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            status: true,
                            sku: true,
                            price: true,
                            stock: true
                        }
                    }
                },
                take: 5 // Limitar a 5 produtos por categoria para não sobrecarregar
            };
        }
        return await prisma_1.db.category.findMany({
            where,
            take: limit,
            orderBy: {
                products: {
                    _count: 'desc'
                }
            },
            select: {
                id: true,
                name: true,
                description: true,
                code: true,
                status: true,
                color: true,
                icon: true,
                parentId: true,
                createdAt: true,
                updatedAt: true,
                ...include
            }
        });
    },
    async getCategoryCreationEvolution(params) {
        const { period = 'month', startDate, endDate, status, includeInactive = false } = params;
        const where = {};
        // Filtro por status
        if (!includeInactive) {
            where.status = status !== undefined ? status : true;
        }
        else if (status !== undefined) {
            where.status = status;
        }
        // Filtro por data
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = startDate;
            }
            if (endDate) {
                where.createdAt.lte = endDate;
            }
        }
        // Buscar todas as categorias no período
        const categories = await prisma_1.db.category.findMany({
            where,
            select: {
                id: true,
                name: true,
                status: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        // Agrupar por período
        const groupedData = this.groupByPeriod(categories, period);
        // Calcular estatísticas
        const totalCategories = categories.length;
        const activeCategories = categories.filter(cat => cat.status).length;
        const inactiveCategories = totalCategories - activeCategories;
        // Calcular crescimento
        const periods = Object.keys(groupedData).sort();
        const growthRate = this.calculateGrowthRate(groupedData, periods);
        return {
            data: groupedData,
            metadata: {
                totalCategories,
                activeCategories,
                inactiveCategories,
                period,
                startDate: startDate || null,
                endDate: endDate || null,
                growthRate,
                description: `Evolução de criação de categorias por ${period}`,
                chartType: 'line'
            }
        };
    },
    async getCategoryCreationEvolutionDetailed(params) {
        const { period = 'month', startDate, endDate, status, includeInactive = false, includeDetails = false } = params;
        const where = {};
        // Filtro por status
        if (!includeInactive) {
            where.status = status !== undefined ? status : true;
        }
        else if (status !== undefined) {
            where.status = status;
        }
        // Filtro por data
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = startDate;
            }
            if (endDate) {
                where.createdAt.lte = endDate;
            }
        }
        const selectFields = {
            id: true,
            name: true,
            status: true,
            createdAt: true
        };
        // Incluir detalhes adicionais se solicitado
        if (includeDetails) {
            selectFields.parent = {
                select: {
                    id: true,
                    name: true
                }
            };
            selectFields._count = {
                select: {
                    children: true,
                    products: true
                }
            };
        }
        // Buscar todas as categorias no período
        const categories = await prisma_1.db.category.findMany({
            where,
            select: selectFields,
            orderBy: {
                createdAt: 'asc'
            }
        });
        // Agrupar por período
        const groupedData = this.groupByPeriod(categories, period);
        // Calcular estatísticas detalhadas
        const totalCategories = categories.length;
        const activeCategories = categories.filter(cat => cat.status).length;
        const inactiveCategories = totalCategories - activeCategories;
        // Calcular crescimento
        const periods = Object.keys(groupedData).sort();
        const growthRate = this.calculateGrowthRate(groupedData, periods);
        // Calcular estatísticas por período
        const periodStats = this.calculatePeriodStats(groupedData, periods);
        return {
            data: groupedData,
            periodStats,
            metadata: {
                totalCategories,
                activeCategories,
                inactiveCategories,
                period,
                startDate: startDate || null,
                endDate: endDate || null,
                growthRate,
                description: `Evolução detalhada de criação de categorias por ${period}`,
                chartType: 'line'
            }
        };
    },
    // Métodos auxiliares privados
    groupByPeriod(categories, period) {
        const grouped = {};
        categories.forEach(category => {
            const date = new Date(category.createdAt);
            let key;
            switch (period) {
                case 'day':
                    key = date.toISOString().split('T')[0]; // YYYY-MM-DD
                    break;
                case 'week':
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    key = weekStart.toISOString().split('T')[0];
                    break;
                case 'month':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
                case 'year':
                    key = String(date.getFullYear());
                    break;
                default:
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            }
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(category);
        });
        // Converter para formato de dados do gráfico
        const chartData = {};
        Object.keys(grouped).forEach(key => {
            chartData[key] = {
                count: grouped[key].length,
                categories: grouped[key]
            };
        });
        return chartData;
    },
    calculateGrowthRate(groupedData, periods) {
        if (periods.length < 2)
            return 0;
        const firstPeriod = periods[0];
        const lastPeriod = periods[periods.length - 1];
        const firstCount = groupedData[firstPeriod]?.count || 0;
        const lastCount = groupedData[lastPeriod]?.count || 0;
        if (firstCount === 0)
            return lastCount > 0 ? 100 : 0;
        return ((lastCount - firstCount) / firstCount) * 100;
    },
    calculatePeriodStats(groupedData, periods) {
        const stats = {
            averagePerPeriod: 0,
            maxPerPeriod: 0,
            minPerPeriod: Infinity,
            totalPeriods: periods.length,
            periodsWithGrowth: 0,
            periodsWithDecline: 0,
            periodsStable: 0
        };
        if (periods.length === 0)
            return stats;
        let totalCount = 0;
        let previousCount = 0;
        periods.forEach((period, index) => {
            const count = groupedData[period]?.count || 0;
            totalCount += count;
            stats.maxPerPeriod = Math.max(stats.maxPerPeriod, count);
            stats.minPerPeriod = Math.min(stats.minPerPeriod, count);
            if (index > 0) {
                if (count > previousCount) {
                    stats.periodsWithGrowth++;
                }
                else if (count < previousCount) {
                    stats.periodsWithDecline++;
                }
                else {
                    stats.periodsStable++;
                }
            }
            previousCount = count;
        });
        stats.averagePerPeriod = totalCount / periods.length;
        stats.minPerPeriod = stats.minPerPeriod === Infinity ? 0 : stats.minPerPeriod;
        return stats;
    },
    async getActiveInactiveRatio(params) {
        const { includeDetails = false, includeHierarchy = false } = params;
        // Buscar contagem total de categorias ativas e inativas
        const [activeCount, inactiveCount, totalCount] = await Promise.all([
            prisma_1.db.category.count({ where: { status: true } }),
            prisma_1.db.category.count({ where: { status: false } }),
            prisma_1.db.category.count()
        ]);
        // Calcular percentuais
        const activePercentage = totalCount > 0 ? (activeCount / totalCount) * 100 : 0;
        const inactivePercentage = totalCount > 0 ? (inactiveCount / totalCount) * 100 : 0;
        // Calcular taxa de "higiene" dos dados
        const hygieneScore = activePercentage; // Quanto maior, melhor a higiene
        const result = {
            active: {
                count: activeCount,
                percentage: Math.round(activePercentage * 100) / 100
            },
            inactive: {
                count: inactiveCount,
                percentage: Math.round(inactivePercentage * 100) / 100
            },
            total: totalCount,
            hygieneScore: Math.round(hygieneScore * 100) / 100,
            metadata: {
                description: 'Taxa de categorias ativas vs inativas',
                chartType: 'donut',
                lastUpdated: new Date().toISOString()
            }
        };
        // Incluir detalhes adicionais se solicitado
        if (includeDetails) {
            const [activeCategories, inactiveCategories] = await Promise.all([
                prisma_1.db.category.findMany({
                    where: { status: true },
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        createdAt: true,
                        updatedAt: true,
                        _count: {
                            select: {
                                children: true,
                                products: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10 // Limitar para não sobrecarregar
                }),
                prisma_1.db.category.findMany({
                    where: { status: false },
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        createdAt: true,
                        updatedAt: true,
                        _count: {
                            select: {
                                children: true,
                                products: true
                            }
                        }
                    },
                    orderBy: { updatedAt: 'desc' },
                    take: 10 // Limitar para não sobrecarregar
                })
            ]);
            result.active.recentCategories = activeCategories;
            result.inactive.recentCategories = inactiveCategories;
        }
        // Incluir análise hierárquica se solicitado
        if (includeHierarchy) {
            const [activeWithChildren, inactiveWithChildren, activeWithoutChildren, inactiveWithoutChildren] = await Promise.all([
                prisma_1.db.category.count({
                    where: {
                        status: true,
                        children: { some: {} }
                    }
                }),
                prisma_1.db.category.count({
                    where: {
                        status: false,
                        children: { some: {} }
                    }
                }),
                prisma_1.db.category.count({
                    where: {
                        status: true,
                        children: { none: {} }
                    }
                }),
                prisma_1.db.category.count({
                    where: {
                        status: false,
                        children: { none: {} }
                    }
                })
            ]);
            result.hierarchy = {
                activeWithChildren,
                inactiveWithChildren,
                activeWithoutChildren,
                inactiveWithoutChildren,
                totalWithChildren: activeWithChildren + inactiveWithChildren,
                totalWithoutChildren: activeWithoutChildren + inactiveWithoutChildren
            };
        }
        return result;
    },
    async getActiveInactiveTrend(params) {
        const { period = 'month', startDate, endDate } = params;
        const where = {};
        // Filtro por data se fornecido
        if (startDate || endDate) {
            where.updatedAt = {};
            if (startDate) {
                where.updatedAt.gte = startDate;
            }
            if (endDate) {
                where.updatedAt.lte = endDate;
            }
        }
        // Buscar categorias com data de atualização no período
        const categories = await prisma_1.db.category.findMany({
            where,
            select: {
                id: true,
                name: true,
                status: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: {
                updatedAt: 'asc'
            }
        });
        // Agrupar por período e calcular tendência
        const groupedData = this.groupByPeriod(categories, period);
        const trendData = {};
        Object.keys(groupedData).forEach(periodKey => {
            const periodCategories = groupedData[periodKey].categories;
            const active = periodCategories.filter(cat => cat.status).length;
            const inactive = periodCategories.filter(cat => !cat.status).length;
            trendData[periodKey] = {
                active,
                inactive,
                total: active + inactive
            };
        });
        return {
            trendData,
            metadata: {
                period,
                startDate: startDate || null,
                endDate: endDate || null,
                description: `Tendência de categorias ativas vs inativas por ${period}`,
                chartType: 'line'
            }
        };
    }
};
