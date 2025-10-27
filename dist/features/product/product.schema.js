"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchemas = exports.bulkDeleteProductsSchema = exports.getProductsByCategorySchema = exports.getProductCategoriesSchema = exports.setProductCategoriesSchema = exports.removeProductCategoriesSchema = exports.addProductCategoriesSchema = exports.getProductAnalyticsSchema = exports.getLowStockProductsSchema = exports.getProductStockHistorySchema = exports.getProductStockSchema = exports.createProductMovementSchema = exports.getProductMovementsSchema = exports.updateStockSchema = exports.verifySkuSchema = exports.updateStatusSchema = exports.deleteProductSchema = exports.listProductsSchema = exports.getProductSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
exports.createProductSchema = {
    body: {
        type: 'object',
        required: ['name', 'unitOfMeasure', 'referencePrice', 'stockMin', 'stockMax', 'alertPercentage'],
        properties: {
            name: { type: 'string', minLength: 1 },
            description: { type: 'string' },
            unitOfMeasure: {
                type: 'string',
                enum: ['UNIDADE', 'KG', 'L', 'ML', 'M', 'CM', 'MM', 'UN', 'DZ', 'CX', 'PCT', 'KIT', 'PAR', 'H', 'D']
            },
            referencePrice: { type: 'number', minimum: 0.01 },
            categoryIds: {
                type: 'array',
                items: { type: 'string', minLength: 1 },
                minItems: 1,
                uniqueItems: true
            },
            supplierId: { type: ['string', 'null'], minLength: 1 },
            storeId: { type: 'string', minLength: 1 },
            stockMin: { type: 'number', minimum: 0 },
            stockMax: { type: 'number', minimum: 0 },
            alertPercentage: { type: 'number', minimum: 0, maximum: 100 },
            status: { type: 'boolean', default: true }
        }
    },
    response: {
        201: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string', nullable: true },
                unitOfMeasure: { type: 'string' },
                referencePrice: { type: 'number' },
                supplierId: { type: 'string' },
                storeId: { type: 'string' },
                stockMin: { type: 'number' },
                stockMax: { type: 'number' },
                alertPercentage: { type: 'number' },
                status: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                categories: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            description: { type: 'string', nullable: true },
                            code: { type: 'string', nullable: true },
                            color: { type: 'string', nullable: true },
                            icon: { type: 'string', nullable: true }
                        }
                    }
                },
                supplier: { type: 'object' },
                store: { type: 'object' }
            }
        }
    }
};
exports.updateProductSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    body: {
        type: 'object',
        properties: {
            name: { type: 'string', minLength: 1 },
            description: { type: 'string' },
            unitOfMeasure: {
                type: 'string',
                enum: ['UNIDADE', 'KG', 'L', 'ML', 'M', 'CM', 'MM', 'UN', 'DZ', 'CX', 'PCT', 'KIT', 'PAR', 'H', 'D']
            },
            referencePrice: { type: 'number', minimum: 0.01 },
            categoryIds: {
                type: 'array',
                items: { type: 'string', minLength: 1 },
                minItems: 1,
                uniqueItems: true
            },
            supplierId: { type: ['string', 'null'], minLength: 1 },
            storeId: { type: 'string', minLength: 1 },
            stockMin: { type: 'number', minimum: 0 },
            stockMax: { type: 'number', minimum: 0 },
            alertPercentage: { type: 'number', minimum: 0, maximum: 100 },
            status: { type: 'boolean' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string', nullable: true },
                unitOfMeasure: { type: 'string' },
                referencePrice: { type: 'number' },
                supplierId: { type: 'string' },
                storeId: { type: 'string' },
                stockMin: { type: 'number' },
                stockMax: { type: 'number' },
                alertPercentage: { type: 'number' },
                status: { type: 'boolean' },
                updatedAt: { type: 'string', format: 'date-time' },
                categories: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            description: { type: 'string', nullable: true },
                            code: { type: 'string', nullable: true },
                            color: { type: 'string', nullable: true },
                            icon: { type: 'string', nullable: true }
                        }
                    }
                },
                supplier: { type: 'object' },
                store: { type: 'object' }
            }
        }
    }
};
exports.getProductSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string', nullable: true },
                unitOfMeasure: { type: 'string' },
                referencePrice: { type: 'number' },
                categories: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            description: { type: 'string', nullable: true },
                            code: { type: 'string', nullable: true },
                            color: { type: 'string', nullable: true },
                            icon: { type: 'string', nullable: true }
                        }
                    }
                },
                supplierId: { type: 'string' },
                storeId: { type: 'string' },
                stockMin: { type: 'number' },
                stockMax: { type: 'number' },
                alertPercentage: { type: 'number' },
                status: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                category: { type: 'object' },
                supplier: { type: 'object' },
                store: { type: 'object' }
            }
        }
    }
};
exports.listProductsSchema = {
    querystring: {
        type: 'object',
        properties: {
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
            search: { type: 'string' },
            status: { type: 'boolean' },
            categoryIds: {
                type: 'array',
                items: { type: 'string', minLength: 1 },
                uniqueItems: true
            },
            supplierId: { type: 'string' },
            storeId: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            description: { type: 'string', nullable: true },
                            unitOfMeasure: { type: 'string' },
                            referencePrice: { type: 'number' },
                            categories: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        name: { type: 'string' },
                                        description: { type: 'string', nullable: true },
                                        code: { type: 'string', nullable: true },
                                        color: { type: 'string', nullable: true },
                                        icon: { type: 'string', nullable: true }
                                    }
                                }
                            },
                            supplierId: { type: 'string' },
                            storeId: { type: 'string' },
                            stockMin: { type: 'number' },
                            stockMax: { type: 'number' },
                            alertPercentage: { type: 'number' },
                            status: { type: 'boolean' },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' },
                            category: { type: 'object' },
                            supplier: { type: 'object' },
                            store: { type: 'object' }
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
exports.deleteProductSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    response: {
        204: { type: 'null' }
    }
};
exports.updateStatusSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    body: {
        type: 'object',
        required: ['status'],
        properties: {
            status: { type: 'boolean' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                status: { type: 'boolean' },
                category: { type: 'object' },
                supplier: { type: 'object' },
                store: { type: 'object' }
            }
        }
    }
};
// === SCHEMAS PARA FUNÇÕES ADICIONAIS DE PRODUTO ===
exports.verifySkuSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    body: {
        type: 'object',
        required: ['sku'],
        properties: {
            sku: { type: 'string', minLength: 1 }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                available: { type: 'boolean' },
                message: { type: 'string' }
            }
        }
    }
};
exports.updateStockSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    body: {
        type: 'object',
        required: ['quantity', 'type'],
        properties: {
            quantity: { type: 'number', minimum: 0.01 },
            type: {
                type: 'string',
                enum: ['ENTRADA', 'SAIDA', 'PERDA']
            },
            note: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                product: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        currentStock: { type: 'number' }
                    }
                },
                movement: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        type: { type: 'string' },
                        quantity: { type: 'number' },
                        note: { type: 'string', nullable: true },
                        balanceAfter: { type: 'number' },
                        createdAt: { type: 'string', format: 'date-time' },
                        supplier: { type: 'object', nullable: true },
                        user: { type: 'object', nullable: true }
                    }
                }
            }
        }
    }
};
exports.getProductMovementsSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    querystring: {
        type: 'object',
        properties: {
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
            type: {
                type: 'string',
                enum: ['ENTRADA', 'SAIDA', 'PERDA']
            },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            type: { type: 'string' },
                            quantity: { type: 'number' },
                            batch: { type: 'string', nullable: true },
                            expiration: { type: 'string', format: 'date-time', nullable: true },
                            price: { type: 'number', nullable: true },
                            note: { type: 'string', nullable: true },
                            balanceAfter: { type: 'number', nullable: true },
                            createdAt: { type: 'string', format: 'date-time' },
                            product: { type: 'object' },
                            supplier: { type: 'object', nullable: true },
                            user: { type: 'object', nullable: true },
                            store: { type: 'object' }
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
exports.createProductMovementSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    body: {
        type: 'object',
        required: ['type', 'quantity'],
        properties: {
            type: {
                type: 'string',
                enum: ['ENTRADA', 'SAIDA', 'PERDA']
            },
            quantity: { type: 'number', minimum: 0.01 },
            supplierId: { type: 'string' },
            batch: { type: 'string' },
            expiration: { type: 'string', format: 'date' },
            price: { type: 'number', minimum: 0 },
            note: { type: 'string' }
        }
    },
    response: {
        201: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                type: { type: 'string' },
                quantity: { type: 'number' },
                batch: { type: 'string', nullable: true },
                expiration: { type: 'string', format: 'date-time', nullable: true },
                price: { type: 'number', nullable: true },
                note: { type: 'string', nullable: true },
                balanceAfter: { type: 'number' },
                createdAt: { type: 'string', format: 'date-time' },
                product: { type: 'object' },
                supplier: { type: 'object', nullable: true },
                user: { type: 'object', nullable: true },
                store: { type: 'object' }
            }
        }
    }
};
exports.getProductStockSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                currentStock: { type: 'number' },
                stockMin: { type: 'number' },
                stockMax: { type: 'number' },
                alertPercentage: { type: 'number' },
                status: {
                    type: 'string',
                    enum: ['OK', 'LOW', 'CRITICAL', 'OVERSTOCK']
                },
                lastMovement: {
                    type: 'object',
                    nullable: true,
                    properties: {
                        type: { type: 'string' },
                        quantity: { type: 'number' },
                        date: { type: 'string', format: 'date-time' }
                    }
                }
            }
        }
    }
};
exports.getProductStockHistorySchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    querystring: {
        type: 'object',
        properties: {
            limit: { type: 'number', minimum: 1, maximum: 100, default: 30 }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                product: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        stockMin: { type: 'number' },
                        stockMax: { type: 'number' },
                        alertPercentage: { type: 'number' }
                    }
                },
                currentStock: { type: 'number' },
                history: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            type: { type: 'string' },
                            quantity: { type: 'number' },
                            batch: { type: 'string', nullable: true },
                            expiration: { type: 'string', format: 'date-time', nullable: true },
                            price: { type: 'number', nullable: true },
                            note: { type: 'string', nullable: true },
                            balanceAfter: { type: 'number' },
                            createdAt: { type: 'string', format: 'date-time' },
                            supplier: { type: 'object', nullable: true },
                            user: { type: 'object', nullable: true }
                        }
                    }
                }
            }
        }
    }
};
exports.getLowStockProductsSchema = {
    querystring: {
        type: 'object',
        properties: {
            storeId: { type: 'string' }
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
                            currentStock: { type: 'number' },
                            stockMin: { type: 'number' },
                            stockMax: { type: 'number' },
                            stockStatus: {
                                type: 'string',
                                enum: ['LOW', 'CRITICAL']
                            },
                            category: { type: 'object', nullable: true },
                            supplier: { type: 'object', nullable: true },
                            store: { type: 'object' }
                        }
                    }
                }
            }
        }
    }
};
exports.getProductAnalyticsSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                product: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        stockMin: { type: 'number' },
                        stockMax: { type: 'number' },
                        alertPercentage: { type: 'number' }
                    }
                },
                currentStock: { type: 'number' },
                statistics: {
                    type: 'object',
                    properties: {
                        totalMovements: { type: 'number' },
                        totalEntrada: { type: 'number' },
                        totalSaida: { type: 'number' },
                        totalPerda: { type: 'number' },
                        monthlyMovements: { type: 'object' },
                        supplierStats: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    supplier: { type: 'object' },
                                    totalMovements: { type: 'number' },
                                    totalQuantity: { type: 'number' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
// === SCHEMAS PARA GERENCIAR CATEGORIAS DO PRODUTO ===
exports.addProductCategoriesSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    body: {
        type: 'object',
        required: ['categoryIds'],
        properties: {
            categoryIds: {
                type: 'array',
                items: { type: 'string', minLength: 1 },
                minItems: 1,
                uniqueItems: true
            }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                addedCount: { type: 'number' },
                categories: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            description: { type: 'string', nullable: true },
                            code: { type: 'string', nullable: true },
                            color: { type: 'string', nullable: true },
                            icon: { type: 'string', nullable: true }
                        }
                    }
                }
            }
        }
    }
};
exports.removeProductCategoriesSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    body: {
        type: 'object',
        required: ['categoryIds'],
        properties: {
            categoryIds: {
                type: 'array',
                items: { type: 'string', minLength: 1 },
                minItems: 1,
                uniqueItems: true
            }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                removedCount: { type: 'number' }
            }
        }
    }
};
exports.setProductCategoriesSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    body: {
        type: 'object',
        required: ['categoryIds'],
        properties: {
            categoryIds: {
                type: 'array',
                items: { type: 'string', minLength: 1 },
                uniqueItems: true
            }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                categories: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            description: { type: 'string', nullable: true },
                            code: { type: 'string', nullable: true },
                            color: { type: 'string', nullable: true },
                            icon: { type: 'string', nullable: true }
                        }
                    }
                }
            }
        }
    }
};
exports.getProductCategoriesSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
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
                            description: { type: 'string', nullable: true },
                            code: { type: 'string', nullable: true },
                            color: { type: 'string', nullable: true },
                            icon: { type: 'string', nullable: true }
                        }
                    }
                }
            }
        }
    }
};
exports.getProductsByCategorySchema = {
    params: {
        type: 'object',
        required: ['categoryId'],
        properties: {
            categoryId: { type: 'string' }
        }
    },
    querystring: {
        type: 'object',
        properties: {
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
            search: { type: 'string' },
            status: { type: 'boolean' }
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
                            description: { type: 'string', nullable: true },
                            unitOfMeasure: { type: 'string' },
                            referencePrice: { type: 'number' },
                            stockMin: { type: 'number' },
                            stockMax: { type: 'number' },
                            alertPercentage: { type: 'number' },
                            status: { type: 'boolean' },
                            createdAt: { type: 'string', format: 'date-time' },
                            supplier: { type: 'object', nullable: true },
                            store: { type: 'object' }
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
exports.bulkDeleteProductsSchema = {
    body: {
        type: 'object',
        required: ['ids'],
        properties: {
            ids: {
                type: 'array',
                items: { type: 'string', minLength: 1 },
                minItems: 1
            }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                deleted: { type: 'number' },
                errors: {
                    type: 'array',
                    items: { type: 'string' }
                }
            }
        }
    }
};
exports.ProductSchemas = {
    create: exports.createProductSchema,
    update: exports.updateProductSchema,
    get: exports.getProductSchema,
    delete: exports.deleteProductSchema,
    list: exports.listProductsSchema,
    updateStatus: exports.updateStatusSchema,
    bulkDelete: exports.bulkDeleteProductsSchema,
    // Funções adicionais
    verifySku: exports.verifySkuSchema,
    updateStock: exports.updateStockSchema,
    getMovements: exports.getProductMovementsSchema,
    createMovement: exports.createProductMovementSchema,
    getStock: exports.getProductStockSchema,
    getStockHistory: exports.getProductStockHistorySchema,
    getLowStock: exports.getLowStockProductsSchema,
    getAnalytics: exports.getProductAnalyticsSchema,
    // Gerenciar categorias
    addCategories: exports.addProductCategoriesSchema,
    removeCategories: exports.removeProductCategoriesSchema,
    setCategories: exports.setProductCategoriesSchema,
    getCategories: exports.getProductCategoriesSchema,
    getByCategory: exports.getProductsByCategorySchema
};
