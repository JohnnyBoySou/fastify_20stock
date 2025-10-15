"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportQueries = void 0;
const prisma_1 = require("@/plugins/prisma");
exports.ReportQueries = {
    // ================================
    // DASHBOARD STATS
    // ================================
    async getDashboardStats(filters) {
        const { storeId, startDate, endDate } = filters;
        // Build date filter
        const dateFilter = exports.ReportQueries.buildDateFilter(startDate, endDate);
        // Overview stats
        const [totalProducts, totalCategories, totalSuppliers, totalStores, totalUsers] = await Promise.all([
            prisma_1.db.product.count({
                where: storeId ? { storeId } : {}
            }),
            prisma_1.db.category.count(),
            prisma_1.db.supplier.count(),
            prisma_1.db.store.count(),
            prisma_1.db.user.count()
        ]);
        // Inventory stats
        const inventoryStats = await exports.ReportQueries.getInventoryStats(storeId);
        // Movement stats
        const movementStats = await exports.ReportQueries.getMovementStats(storeId, dateFilter);
        // Recent activity
        const recentActivity = await exports.ReportQueries.getRecentActivity(storeId, dateFilter);
        // Chart data
        const charts = await exports.ReportQueries.getChartData(storeId, dateFilter);
        return {
            overview: {
                totalProducts,
                totalCategories,
                totalSuppliers,
                totalStores,
                totalUsers
            },
            inventory: inventoryStats,
            movements: movementStats,
            recentActivity,
            charts
        };
    },
    // ================================
    // INVENTORY REPORT
    // ================================
    async getInventoryReport(filters, pagination, sort) {
        const { storeId, categoryId, supplierId, status, lowStock } = filters;
        const { page, limit } = pagination;
        const { field, order } = sort;
        // Build where clause
        const where = {};
        if (storeId)
            where.storeId = storeId;
        if (categoryId)
            where.categoryId = categoryId;
        if (supplierId)
            where.supplierId = supplierId;
        if (status && status !== 'all')
            where.status = status === 'active';
        if (lowStock) {
            where.AND = [
                { stockMin: { gt: 0 } },
                {
                    OR: [
                        { stockMin: { gt: 0 } },
                        { currentStock: { lte: 0 } }
                    ]
                }
            ];
        }
        // Build order by
        const orderBy = {};
        switch (field) {
            case 'name':
                orderBy.name = order;
                break;
            case 'stock':
                orderBy.currentStock = order;
                break;
            case 'value':
                orderBy.totalValue = order;
                break;
            case 'category':
                orderBy.category = { name: order };
                break;
            default:
                orderBy.name = 'asc';
        }
        // Get products with pagination
        const [products, total] = await Promise.all([
            prisma_1.db.product.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    categories: {
                        select: {
                            category: {
                                select: { id: true, name: true }
                            }
                        }
                    },
                    supplier: {
                        select: { id: true, corporateName: true }
                    },
                    movements: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                        select: { createdAt: true }
                    }
                }
            }),
            prisma_1.db.product.count({ where })
        ]);
        // Calculate product values and alert levels
        const productsWithStats = products.map(product => {
            const currentStock = exports.ReportQueries.calculateCurrentStock(product.movements || []);
            const totalValue = Number(product.referencePrice) * currentStock;
            let alertLevel = 'normal';
            if (currentStock <= 0)
                alertLevel = 'out';
            else if (currentStock <= product.stockMin)
                alertLevel = 'low';
            else if (currentStock >= product.stockMax)
                alertLevel = 'high';
            return {
                id: product.id,
                name: product.name,
                description: product.description,
                category: product.categories[0]?.category,
                supplier: product.supplier,
                currentStock,
                stockMin: product.stockMin,
                stockMax: product.stockMax,
                unitPrice: Number(product.referencePrice),
                totalValue,
                status: product.status,
                alertLevel,
                lastMovement: product.movements?.[0]?.createdAt?.toISOString()
            };
        });
        // Calculate summary
        const summary = await exports.ReportQueries.calculateInventorySummary(where);
        return {
            products: productsWithStats,
            summary,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },
    // ================================
    // MOVEMENT REPORT
    // ================================
    async getMovementReport(filters, pagination) {
        const { storeId, productId, supplierId, type, startDate, endDate } = filters;
        const { page, limit } = pagination;
        // Build where clause
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
            where.createdAt = exports.ReportQueries.buildDateFilter(startDate, endDate);
        }
        // Get movements with pagination
        const [movements, total] = await Promise.all([
            prisma_1.db.movement.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    product: {
                        select: { id: true, name: true, unitOfMeasure: true }
                    },
                    supplier: {
                        select: { id: true, corporateName: true }
                    },
                    user: {
                        select: { id: true, name: true }
                    }
                }
            }),
            prisma_1.db.movement.count({ where })
        ]);
        // Calculate summary
        const summary = await exports.ReportQueries.calculateMovementSummary(where);
        return {
            movements: movements.map(movement => ({
                id: movement.id,
                type: movement.type,
                quantity: movement.quantity,
                price: movement.price ? Number(movement.price) : undefined,
                totalValue: movement.price ? Number(movement.price) * movement.quantity : undefined,
                batch: movement.batch,
                expiration: movement.expiration?.toISOString(),
                note: movement.note,
                balanceAfter: movement.balanceAfter,
                product: movement.product,
                supplier: movement.supplier,
                user: movement.user,
                createdAt: movement.createdAt.toISOString()
            })),
            summary,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },
    // ================================
    // FINANCIAL REPORT
    // ================================
    async getFinancialReport(filters) {
        const { storeId, startDate, endDate, groupBy = 'month' } = filters;
        const dateFilter = exports.ReportQueries.buildDateFilter(startDate, endDate);
        const where = { ...dateFilter };
        if (storeId)
            where.storeId = storeId;
        // Get movements for financial calculations
        const movements = await prisma_1.db.movement.findMany({
            where: {
                ...where,
                price: { not: null }
            },
            include: {
                product: {
                    select: { id: true, name: true, categories: true }
                },
                supplier: {
                    select: { id: true, corporateName: true }
                }
            }
        });
        // Calculate financial data
        const financialData = exports.ReportQueries.calculateFinancialData(movements, groupBy);
        // Calculate breakdowns
        const breakdown = await exports.ReportQueries.calculateFinancialBreakdown(movements);
        return {
            period: {
                startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: endDate || new Date().toISOString().split('T')[0],
                groupBy
            },
            summary: financialData.summary,
            data: financialData.timeSeries,
            breakdown
        };
    },
    // ================================
    // CATEGORY REPORT
    // ================================
    async getCategoryReport(filters) {
        const { storeId, includeSubcategories = true } = filters;
        const where = {};
        if (storeId)
            where.storeId = storeId;
        // Get categories with their products
        const categories = await prisma_1.db.category.findMany({
            include: {
                products: {
                    where,
                    include: {
                        product: {
                            include: {
                                movements: {
                                    orderBy: { createdAt: 'desc' },
                                    take: 1,
                                    select: { createdAt: true }
                                }
                            }
                        }
                    }
                },
                children: includeSubcategories ? {
                    include: {
                        products: {
                            where,
                            include: {
                                product: {
                                    include: {
                                        movements: {
                                            orderBy: { createdAt: 'desc' },
                                            take: 1,
                                            select: { createdAt: true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } : false,
                parent: true
            }
        });
        // Calculate category stats
        const categoriesWithStats = categories.map(category => {
            const allProducts = includeSubcategories && category.children
                ? [...category.products, ...category.children.flatMap(child => child.products || [])]
                : category.products;
            const totalValue = allProducts.reduce((sum, productCategory) => {
                const product = productCategory.product;
                const currentStock = exports.ReportQueries.calculateCurrentStock(product.movements || []);
                return sum + (Number(product.referencePrice) * currentStock);
            }, 0);
            const totalMovements = allProducts.reduce((sum, productCategory) => {
                return sum + (productCategory.product.movements?.length || 0);
            }, 0);
            const lastMovement = allProducts
                .flatMap(productCategory => productCategory.product.movements || [])
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
            return {
                id: category.id,
                name: category.name,
                description: category.description,
                code: category.code,
                color: category.color,
                icon: category.icon,
                parentId: category.parentId,
                parent: category.parent,
                children: category.children?.map(child => ({
                    id: child.id,
                    name: child.name
                })),
                stats: {
                    totalProducts: allProducts.length,
                    totalValue,
                    averagePrice: allProducts.length > 0 ? totalValue / allProducts.length : 0,
                    movements: totalMovements,
                    lastMovement: lastMovement?.createdAt.toISOString()
                }
            };
        });
        // Calculate summary
        const totalProducts = categoriesWithStats.reduce((sum, cat) => sum + cat.stats.totalProducts, 0);
        const totalValue = categoriesWithStats.reduce((sum, cat) => sum + cat.stats.totalValue, 0);
        return {
            categories: categoriesWithStats,
            summary: {
                totalCategories: categories.length,
                totalProducts,
                totalValue,
                averageProductsPerCategory: categories.length > 0 ? totalProducts / categories.length : 0
            }
        };
    },
    // ================================
    // SUPPLIER REPORT
    // ================================
    async getSupplierReport(filters) {
        const { storeId, status } = filters;
        const where = {};
        if (status && status !== 'all')
            where.status = status === 'active';
        // Get suppliers with their products and movements
        const suppliers = await prisma_1.db.supplier.findMany({
            where,
            include: {
                products: {
                    where: storeId ? { storeId } : {},
                    include: {
                        movements: {
                            orderBy: { createdAt: 'desc' },
                            take: 1,
                            select: { createdAt: true }
                        }
                    }
                },
                movements: {
                    where: storeId ? { storeId } : {},
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { createdAt: true }
                },
                responsibles: true
            }
        });
        // Calculate supplier stats
        const suppliersWithStats = suppliers.map(supplier => {
            const totalValue = supplier.products.reduce((sum, product) => {
                const currentStock = exports.ReportQueries.calculateCurrentStock(product.movements || []);
                return sum + (Number(product.referencePrice) * currentStock);
            }, 0);
            const totalMovements = supplier.movements.length;
            const lastMovement = supplier.movements[0];
            return {
                id: supplier.id,
                corporateName: supplier.corporateName,
                tradeName: supplier.tradeName,
                cnpj: supplier.cnpj,
                status: supplier.status,
                address: {
                    cep: supplier.cep,
                    city: supplier.city,
                    state: supplier.state,
                    address: supplier.address
                },
                stats: {
                    totalProducts: supplier.products.length,
                    totalValue,
                    totalMovements,
                    lastMovement: lastMovement?.createdAt.toISOString(),
                    averageOrderValue: totalMovements > 0 ? totalValue / totalMovements : 0
                },
                responsibles: supplier.responsibles.map(resp => ({
                    id: resp.id,
                    name: resp.name,
                    phone: resp.phone,
                    email: resp.email
                }))
            };
        });
        // Calculate summary
        const totalProducts = suppliersWithStats.reduce((sum, sup) => sum + sup.stats.totalProducts, 0);
        const totalValue = suppliersWithStats.reduce((sum, sup) => sum + sup.stats.totalValue, 0);
        const activeSuppliers = suppliersWithStats.filter(sup => sup.status).length;
        return {
            suppliers: suppliersWithStats,
            summary: {
                totalSuppliers: suppliers.length,
                activeSuppliers,
                totalProducts,
                totalValue,
                averageProductsPerSupplier: suppliers.length > 0 ? totalProducts / suppliers.length : 0
            }
        };
    },
    // ================================
    // USER ACTIVITY REPORT
    // ================================
    async getUserActivityReport(filters, pagination) {
        const { storeId, userId, startDate, endDate, action } = filters;
        const { page, limit } = pagination;
        const where = {};
        if (userId)
            where.userId = userId;
        if (action)
            where.action = action;
        if (startDate || endDate) {
            where.createdAt = exports.ReportQueries.buildDateFilter(startDate, endDate);
        }
        // Get audit logs
        const [activities, total] = await Promise.all([
            prisma_1.db.auditLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                }
            }),
            prisma_1.db.auditLog.count({ where })
        ]);
        // Calculate summary
        const summary = await exports.ReportQueries.calculateUserActivitySummary(where);
        return {
            activities: activities.map(activity => ({
                id: activity.id,
                entity: activity.entity,
                entityId: activity.entityId,
                action: activity.action,
                before: activity.before,
                after: activity.after,
                user: activity.user,
                createdAt: activity.createdAt.toISOString()
            })),
            summary,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },
    // ================================
    // STOCK ALERT REPORT
    // ================================
    async getStockAlertReport(filters, pagination) {
        const { storeId, alertType = 'all' } = filters;
        const { page, limit } = pagination;
        const where = {};
        if (storeId)
            where.storeId = storeId;
        // Get products with movements to calculate current stock
        const products = await prisma_1.db.product.findMany({
            where,
            include: {
                categories: {
                    select: {
                        category: {
                            select: { id: true, name: true }
                        }
                    }
                },
                supplier: {
                    select: { id: true, corporateName: true }
                },
                movements: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { createdAt: true }
                }
            }
        });
        // Calculate alerts
        const alerts = products
            .map(product => {
            const currentStock = exports.ReportQueries.calculateCurrentStock(product.movements || []);
            const unitPrice = Number(product.referencePrice);
            const totalValue = unitPrice * currentStock;
            let alertType = null;
            let severity = 'low';
            if (currentStock <= 0) {
                alertType = 'out';
                severity = 'critical';
            }
            else if (currentStock <= product.stockMin) {
                alertType = 'low';
                severity = currentStock === 0 ? 'critical' : 'high';
            }
            else if (currentStock >= product.stockMax) {
                alertType = 'high';
                severity = 'medium';
            }
            return {
                id: product.id,
                productId: product.id,
                productName: product.name,
                currentStock,
                stockMin: product.stockMin,
                stockMax: product.stockMax,
                alertType,
                severity,
                unitPrice,
                totalValue,
                lastMovement: product.movements?.[0]?.createdAt.toISOString(),
                category: product.categories[0]?.category,
                supplier: product.supplier
            };
        })
            .filter(alert => {
            if (alertType === 'all')
                return alert.alertType !== null;
            return alert.alertType === alertType;
        })
            .sort((a, b) => {
            const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return severityOrder[b.severity] - severityOrder[a.severity];
        });
        // Apply pagination
        const paginatedAlerts = alerts.slice((page - 1) * limit, page * limit);
        // Calculate summary
        const summary = {
            totalAlerts: alerts.length,
            lowStockAlerts: alerts.filter(a => a.alertType === 'low').length,
            highStockAlerts: alerts.filter(a => a.alertType === 'high').length,
            expiredAlerts: alerts.filter(a => a.alertType === 'expired').length,
            outOfStockAlerts: alerts.filter(a => a.alertType === 'out').length,
            totalValue: alerts.reduce((sum, alert) => sum + alert.totalValue, 0)
        };
        return {
            alerts: paginatedAlerts,
            summary,
            pagination: {
                page,
                limit,
                total: alerts.length,
                totalPages: Math.ceil(alerts.length / limit)
            }
        };
    },
    // ================================
    // HELPER METHODS
    // ================================
    buildDateFilter(startDate, endDate) {
        const filter = {};
        if (startDate) {
            filter.gte = new Date(startDate);
        }
        if (endDate) {
            filter.lte = new Date(endDate);
        }
        return Object.keys(filter).length > 0 ? filter : undefined;
    },
    calculateCurrentStock(movements) {
        return movements.reduce((stock, movement) => {
            switch (movement.type) {
                case 'ENTRADA':
                    return stock + movement.quantity;
                case 'SAIDA':
                case 'PERDA':
                    return stock - movement.quantity;
                default:
                    return stock;
            }
        }, 0);
    },
    async getInventoryStats(storeId) {
        const where = storeId ? { storeId } : {};
        const [totalValue, lowStockCount, outOfStockCount] = await Promise.all([
            prisma_1.db.product.aggregate({
                where,
                _sum: { referencePrice: true }
            }),
            prisma_1.db.product.count({
                where: {
                    ...where,
                    AND: [
                        { stockMin: { gt: 0 } },
                        { stockMin: { gt: 0 } }
                    ]
                }
            }),
            prisma_1.db.product.count({
                where: {
                    ...where,
                    stockMin: { gt: 0 }
                }
            })
        ]);
        return {
            totalValue: Number(totalValue._sum.referencePrice || 0),
            lowStockItems: lowStockCount,
            outOfStockItems: outOfStockCount,
            averageStockValue: 0 // Will be calculated based on actual stock
        };
    },
    async getMovementStats(storeId, dateFilter) {
        const where = { ...dateFilter };
        if (storeId)
            where.storeId = storeId;
        const [totalMovements, entries, exits, losses, totalValue] = await Promise.all([
            prisma_1.db.movement.count({ where }),
            prisma_1.db.movement.count({ where: { ...where, type: 'ENTRADA' } }),
            prisma_1.db.movement.count({ where: { ...where, type: 'SAIDA' } }),
            prisma_1.db.movement.count({ where: { ...where, type: 'PERDA' } }),
            prisma_1.db.movement.aggregate({
                where: { ...where, price: { not: null } },
                _sum: { price: true }
            })
        ]);
        return {
            totalMovements,
            entries,
            exits,
            losses,
            totalValue: Number(totalValue._sum.price || 0)
        };
    },
    async getRecentActivity(storeId, dateFilter) {
        const where = { ...dateFilter };
        if (storeId)
            where.storeId = storeId;
        const [lastMovements, recentProducts] = await Promise.all([
            prisma_1.db.movement.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: {
                    product: {
                        select: { name: true }
                    }
                }
            }),
            prisma_1.db.product.findMany({
                where: storeId ? { storeId } : {},
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: { id: true, name: true, createdAt: true }
            })
        ]);
        return {
            lastMovements: lastMovements.map(movement => ({
                id: movement.id,
                type: movement.type,
                productName: movement.product.name,
                quantity: movement.quantity,
                createdAt: movement.createdAt.toISOString()
            })),
            recentProducts: recentProducts.map(product => ({
                id: product.id,
                name: product.name,
                createdAt: product.createdAt.toISOString()
            }))
        };
    },
    async getChartData(storeId, dateFilter) {
        const where = { ...dateFilter };
        if (storeId)
            where.storeId = storeId;
        // Movements by type
        const movementsByType = await prisma_1.db.movement.groupBy({
            by: ['type'],
            where,
            _count: { type: true },
            _sum: { price: true }
        });
        // Top products by movements
        const topProducts = await prisma_1.db.movement.groupBy({
            by: ['productId'],
            where,
            _count: { productId: true },
            _sum: { price: true },
            orderBy: { _count: { productId: 'desc' } },
            take: 5
        });
        // Get product names for top products
        const productIds = topProducts.map(p => p.productId);
        const products = await prisma_1.db.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, name: true }
        });
        const productMap = new Map(products.map(p => [p.id, p.name]));
        return {
            movementsByType: movementsByType.map(m => ({
                type: m.type,
                count: m._count.type,
                value: Number(m._sum.price || 0)
            })),
            topProducts: topProducts.map(p => ({
                productId: p.productId,
                productName: productMap.get(p.productId) || 'Unknown',
                movements: p._count.productId,
                value: Number(p._sum.price || 0)
            })),
            movementsByDay: [] // Will be implemented with proper date grouping
        };
    },
    async calculateInventorySummary(where) {
        const [totalProducts, totalValue, lowStockCount, outOfStockCount] = await Promise.all([
            prisma_1.db.product.count({ where }),
            prisma_1.db.product.aggregate({
                where,
                _sum: { referencePrice: true }
            }),
            prisma_1.db.product.count({
                where: {
                    ...where,
                    AND: [
                        { stockMin: { gt: 0 } },
                        { stockMin: { gt: 0 } }
                    ]
                }
            }),
            prisma_1.db.product.count({
                where: {
                    ...where,
                    stockMin: { gt: 0 }
                }
            })
        ]);
        return {
            totalProducts,
            totalValue: Number(totalValue._sum.referencePrice || 0),
            lowStockCount,
            outOfStockCount,
            averageStockValue: totalProducts > 0 ? Number(totalValue._sum.referencePrice || 0) / totalProducts : 0
        };
    },
    async calculateMovementSummary(where) {
        const [totalMovements, totalEntries, totalExits, totalLosses, totalValue] = await Promise.all([
            prisma_1.db.movement.count({ where }),
            prisma_1.db.movement.count({ where: { ...where, type: 'ENTRADA' } }),
            prisma_1.db.movement.count({ where: { ...where, type: 'SAIDA' } }),
            prisma_1.db.movement.count({ where: { ...where, type: 'PERDA' } }),
            prisma_1.db.movement.aggregate({
                where: { ...where, price: { not: null } },
                _sum: { price: true }
            })
        ]);
        return {
            totalMovements,
            totalEntries,
            totalExits,
            totalLosses,
            totalValue: Number(totalValue._sum.price || 0),
            averageValue: totalMovements > 0 ? Number(totalValue._sum.price || 0) / totalMovements : 0
        };
    },
    calculateFinancialData(movements, groupBy) {
        // This is a simplified implementation
        // In a real scenario, you'd want to group by date periods
        const totalRevenue = movements
            .filter(m => m.type === 'ENTRADA' && m.price)
            .reduce((sum, m) => sum + (Number(m.price) * m.quantity), 0);
        const totalCosts = movements
            .filter(m => m.type === 'SAIDA' && m.price)
            .reduce((sum, m) => sum + (Number(m.price) * m.quantity), 0);
        const grossProfit = totalRevenue - totalCosts;
        const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
        return {
            summary: {
                totalRevenue,
                totalCosts,
                grossProfit,
                profitMargin,
                totalMovements: movements.length
            },
            timeSeries: [] // Would be implemented with proper date grouping
        };
    },
    async calculateFinancialBreakdown(movements) {
        // Group by product
        const byProduct = new Map();
        const byCategory = new Map();
        const bySupplier = new Map();
        movements.forEach(movement => {
            const value = Number(movement.price || 0) * movement.quantity;
            const isRevenue = movement.type === 'ENTRADA';
            const isCost = movement.type === 'SAIDA';
            // By product
            if (!byProduct.has(movement.product.id)) {
                byProduct.set(movement.product.id, {
                    productId: movement.product.id,
                    productName: movement.product.name,
                    revenue: 0,
                    costs: 0,
                    profit: 0,
                    movements: 0
                });
            }
            const productData = byProduct.get(movement.product.id);
            productData.movements++;
            if (isRevenue)
                productData.revenue += value;
            if (isCost)
                productData.costs += value;
            productData.profit = productData.revenue - productData.costs;
            // Similar logic for category and supplier...
        });
        return {
            byProduct: Array.from(byProduct.values()),
            byCategory: Array.from(byCategory.values()),
            bySupplier: Array.from(bySupplier.values())
        };
    },
    async calculateUserActivitySummary(where) {
        const [totalActivities, uniqueUsers, activitiesByType] = await Promise.all([
            prisma_1.db.auditLog.count({ where }),
            prisma_1.db.auditLog.groupBy({
                by: ['userId'],
                where,
                _count: { userId: true }
            }),
            prisma_1.db.auditLog.groupBy({
                by: ['action'],
                where,
                _count: { action: true }
            })
        ]);
        const mostActiveUser = uniqueUsers.length > 0
            ? uniqueUsers.reduce((max, user) => user._count.userId > max._count.userId ? user : max)
            : null;
        return {
            totalActivities,
            uniqueUsers: uniqueUsers.length,
            mostActiveUser: mostActiveUser ? {
                id: mostActiveUser.userId,
                name: 'Unknown', // Would need to join with user table
                activities: mostActiveUser._count.userId
            } : null,
            activitiesByType: activitiesByType.map(activity => ({
                action: activity.action,
                count: activity._count.action
            }))
        };
    }
};
