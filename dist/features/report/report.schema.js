// ================================
// SCHEMAS DE QUERY PARAMETERS
// ================================
export const getDashboardStatsSchema = {
    querystring: {
        type: 'object',
        properties: {
            storeId: { type: 'string' },
            period: {
                type: 'string',
                enum: ['day', 'week', 'month', 'year'],
                default: 'month'
            },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                overview: {
                    type: 'object',
                    properties: {
                        totalProducts: { type: 'number' },
                        totalCategories: { type: 'number' },
                        totalSuppliers: { type: 'number' },
                        totalStores: { type: 'number' },
                        totalUsers: { type: 'number' }
                    }
                },
                inventory: {
                    type: 'object',
                    properties: {
                        totalValue: { type: 'number' },
                        lowStockItems: { type: 'number' },
                        outOfStockItems: { type: 'number' },
                        averageStockValue: { type: 'number' }
                    }
                },
                movements: {
                    type: 'object',
                    properties: {
                        totalMovements: { type: 'number' },
                        entries: { type: 'number' },
                        exits: { type: 'number' },
                        losses: { type: 'number' },
                        totalValue: { type: 'number' }
                    }
                },
                recentActivity: {
                    type: 'object',
                    properties: {
                        lastMovements: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    type: { type: 'string' },
                                    productName: { type: 'string' },
                                    quantity: { type: 'number' },
                                    createdAt: { type: 'string' }
                                }
                            }
                        },
                        recentProducts: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                    createdAt: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                charts: {
                    type: 'object',
                    properties: {
                        movementsByType: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                    count: { type: 'number' },
                                    value: { type: 'number' }
                                }
                            }
                        },
                        topProducts: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    productId: { type: 'string' },
                                    productName: { type: 'string' },
                                    movements: { type: 'number' },
                                    value: { type: 'number' }
                                }
                            }
                        },
                        movementsByDay: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    date: { type: 'string' },
                                    entries: { type: 'number' },
                                    exits: { type: 'number' },
                                    losses: { type: 'number' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
export const getInventoryReportSchema = {
    querystring: {
        type: 'object',
        properties: {
            storeId: { type: 'string' },
            categoryId: { type: 'string' },
            supplierId: { type: 'string' },
            status: {
                type: 'string',
                enum: ['all', 'active', 'inactive'],
                default: 'all'
            },
            lowStock: { type: 'boolean' },
            sortBy: {
                type: 'string',
                enum: ['name', 'stock', 'value', 'category'],
                default: 'name'
            },
            sortOrder: {
                type: 'string',
                enum: ['asc', 'desc'],
                default: 'asc'
            },
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 20 }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                products: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            description: { type: 'string' },
                            category: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' }
                                }
                            },
                            supplier: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    corporateName: { type: 'string' }
                                }
                            },
                            currentStock: { type: 'number' },
                            stockMin: { type: 'number' },
                            stockMax: { type: 'number' },
                            unitPrice: { type: 'number' },
                            totalValue: { type: 'number' },
                            status: { type: 'boolean' },
                            alertLevel: {
                                type: 'string',
                                enum: ['normal', 'low', 'high', 'out']
                            },
                            lastMovement: { type: 'string' }
                        }
                    }
                },
                summary: {
                    type: 'object',
                    properties: {
                        totalProducts: { type: 'number' },
                        totalValue: { type: 'number' },
                        lowStockCount: { type: 'number' },
                        outOfStockCount: { type: 'number' },
                        averageStockValue: { type: 'number' }
                    }
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' }
                    }
                }
            }
        }
    }
};
export const getMovementReportSchema = {
    querystring: {
        type: 'object',
        properties: {
            storeId: { type: 'string' },
            productId: { type: 'string' },
            supplierId: { type: 'string' },
            type: {
                type: 'string',
                enum: ['ENTRADA', 'SAIDA', 'PERDA']
            },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 20 }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                movements: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            type: { type: 'string' },
                            quantity: { type: 'number' },
                            price: { type: 'number' },
                            totalValue: { type: 'number' },
                            batch: { type: 'string' },
                            expiration: { type: 'string' },
                            note: { type: 'string' },
                            balanceAfter: { type: 'number' },
                            product: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                    unitOfMeasure: { type: 'string' }
                                }
                            },
                            supplier: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    corporateName: { type: 'string' }
                                }
                            },
                            user: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' }
                                }
                            },
                            createdAt: { type: 'string' }
                        }
                    }
                },
                summary: {
                    type: 'object',
                    properties: {
                        totalMovements: { type: 'number' },
                        totalEntries: { type: 'number' },
                        totalExits: { type: 'number' },
                        totalLosses: { type: 'number' },
                        totalValue: { type: 'number' },
                        averageValue: { type: 'number' }
                    }
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' }
                    }
                }
            }
        }
    }
};
export const getFinancialReportSchema = {
    querystring: {
        type: 'object',
        properties: {
            storeId: { type: 'string' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            groupBy: {
                type: 'string',
                enum: ['day', 'week', 'month', 'year'],
                default: 'month'
            }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                period: {
                    type: 'object',
                    properties: {
                        startDate: { type: 'string' },
                        endDate: { type: 'string' },
                        groupBy: { type: 'string' }
                    }
                },
                summary: {
                    type: 'object',
                    properties: {
                        totalRevenue: { type: 'number' },
                        totalCosts: { type: 'number' },
                        grossProfit: { type: 'number' },
                        profitMargin: { type: 'number' },
                        totalMovements: { type: 'number' }
                    }
                },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            period: { type: 'string' },
                            revenue: { type: 'number' },
                            costs: { type: 'number' },
                            profit: { type: 'number' },
                            movements: { type: 'number' }
                        }
                    }
                },
                breakdown: {
                    type: 'object',
                    properties: {
                        byProduct: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    productId: { type: 'string' },
                                    productName: { type: 'string' },
                                    revenue: { type: 'number' },
                                    costs: { type: 'number' },
                                    profit: { type: 'number' },
                                    movements: { type: 'number' }
                                }
                            }
                        },
                        byCategory: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    categoryId: { type: 'string' },
                                    categoryName: { type: 'string' },
                                    revenue: { type: 'number' },
                                    costs: { type: 'number' },
                                    profit: { type: 'number' },
                                    movements: { type: 'number' }
                                }
                            }
                        },
                        bySupplier: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    supplierId: { type: 'string' },
                                    supplierName: { type: 'string' },
                                    revenue: { type: 'number' },
                                    costs: { type: 'number' },
                                    profit: { type: 'number' },
                                    movements: { type: 'number' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
export const getCategoryReportSchema = {
    querystring: {
        type: 'object',
        properties: {
            storeId: { type: 'string' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            includeSubcategories: { type: 'boolean', default: true }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                categories: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            description: { type: 'string' },
                            code: { type: 'string' },
                            color: { type: 'string' },
                            icon: { type: 'string' },
                            parentId: { type: 'string' },
                            parent: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' }
                                }
                            },
                            children: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        name: { type: 'string' }
                                    }
                                }
                            },
                            stats: {
                                type: 'object',
                                properties: {
                                    totalProducts: { type: 'number' },
                                    totalValue: { type: 'number' },
                                    averagePrice: { type: 'number' },
                                    movements: { type: 'number' },
                                    lastMovement: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                summary: {
                    type: 'object',
                    properties: {
                        totalCategories: { type: 'number' },
                        totalProducts: { type: 'number' },
                        totalValue: { type: 'number' },
                        averageProductsPerCategory: { type: 'number' }
                    }
                }
            }
        }
    }
};
export const getSupplierReportSchema = {
    querystring: {
        type: 'object',
        properties: {
            storeId: { type: 'string' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            status: {
                type: 'string',
                enum: ['all', 'active', 'inactive'],
                default: 'all'
            }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                suppliers: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            corporateName: { type: 'string' },
                            tradeName: { type: 'string' },
                            cnpj: { type: 'string' },
                            status: { type: 'boolean' },
                            address: {
                                type: 'object',
                                properties: {
                                    cep: { type: 'string' },
                                    city: { type: 'string' },
                                    state: { type: 'string' },
                                    address: { type: 'string' }
                                }
                            },
                            stats: {
                                type: 'object',
                                properties: {
                                    totalProducts: { type: 'number' },
                                    totalValue: { type: 'number' },
                                    totalMovements: { type: 'number' },
                                    lastMovement: { type: 'string' },
                                    averageOrderValue: { type: 'number' }
                                }
                            },
                            responsibles: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        name: { type: 'string' },
                                        phone: { type: 'string' },
                                        email: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                },
                summary: {
                    type: 'object',
                    properties: {
                        totalSuppliers: { type: 'number' },
                        activeSuppliers: { type: 'number' },
                        totalProducts: { type: 'number' },
                        totalValue: { type: 'number' },
                        averageProductsPerSupplier: { type: 'number' }
                    }
                }
            }
        }
    }
};
export const getUserActivityReportSchema = {
    querystring: {
        type: 'object',
        properties: {
            storeId: { type: 'string' },
            userId: { type: 'string' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            action: {
                type: 'string',
                enum: ['CREATE', 'UPDATE', 'DELETE']
            },
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 20 }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                activities: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            entity: { type: 'string' },
                            entityId: { type: 'string' },
                            action: { type: 'string' },
                            before: { type: 'object' },
                            after: { type: 'object' },
                            user: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                    email: { type: 'string' }
                                }
                            },
                            createdAt: { type: 'string' }
                        }
                    }
                },
                summary: {
                    type: 'object',
                    properties: {
                        totalActivities: { type: 'number' },
                        uniqueUsers: { type: 'number' },
                        mostActiveUser: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' },
                                activities: { type: 'number' }
                            }
                        },
                        activitiesByType: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    action: { type: 'string' },
                                    count: { type: 'number' }
                                }
                            }
                        }
                    }
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' }
                    }
                }
            }
        }
    }
};
export const getStockAlertReportSchema = {
    querystring: {
        type: 'object',
        properties: {
            storeId: { type: 'string' },
            alertType: {
                type: 'string',
                enum: ['low', 'high', 'expired', 'all'],
                default: 'all'
            },
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 20 }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                alerts: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            productId: { type: 'string' },
                            productName: { type: 'string' },
                            currentStock: { type: 'number' },
                            stockMin: { type: 'number' },
                            stockMax: { type: 'number' },
                            alertType: {
                                type: 'string',
                                enum: ['low', 'high', 'expired', 'out']
                            },
                            severity: {
                                type: 'string',
                                enum: ['low', 'medium', 'high', 'critical']
                            },
                            unitPrice: { type: 'number' },
                            totalValue: { type: 'number' },
                            lastMovement: { type: 'string' },
                            category: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' }
                                }
                            },
                            supplier: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    corporateName: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                summary: {
                    type: 'object',
                    properties: {
                        totalAlerts: { type: 'number' },
                        lowStockAlerts: { type: 'number' },
                        highStockAlerts: { type: 'number' },
                        expiredAlerts: { type: 'number' },
                        outOfStockAlerts: { type: 'number' },
                        totalValue: { type: 'number' }
                    }
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' }
                    }
                }
            }
        }
    }
};
export const exportReportSchema = {
    querystring: {
        type: 'object',
        required: ['reportType', 'format'],
        properties: {
            reportType: {
                type: 'string',
                enum: ['inventory', 'movement', 'financial', 'category', 'supplier', 'user-activity', 'stock-alert']
            },
            format: {
                type: 'string',
                enum: ['csv', 'xlsx', 'pdf']
            },
            storeId: { type: 'string' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            filters: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                downloadUrl: { type: 'string' },
                filename: { type: 'string' },
                format: { type: 'string' },
                generatedAt: { type: 'string' },
                expiresAt: { type: 'string' }
            }
        }
    }
};
