"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementSchemas = exports.getMovementAnalyticsSchema = exports.getCancelledMovementsSchema = exports.getVerifiedMovementsSchema = exports.cancelMovementSchema = exports.verifyMovementSchema = exports.createBulkMovementSchema = exports.getMovementReportSchema = exports.getStockHistorySchema = exports.getBySupplierSchema = exports.getByProductSchema = exports.getByStoreSchema = exports.deleteMovementSchema = exports.listMovementsSchema = exports.getMovementSchema = exports.updateMovementSchema = exports.createMovementSchema = void 0;
exports.createMovementSchema = {
    body: {
        type: 'object',
        required: ['type', 'quantity', 'productId'],
        properties: {
            type: {
                type: 'string',
                enum: ['ENTRADA', 'SAIDA', 'PERDA']
            },
            quantity: { type: 'number', minimum: 1 },
            storeId: { type: 'string', minLength: 1 }, // Obrigatório, vem do middleware
            productId: { type: 'string', minLength: 1 },
            supplierId: { type: 'string' },
            batch: { type: 'string' },
            expiration: { type: 'string', format: 'date-time' },
            price: { type: 'number', minimum: 0.01 },
            note: { type: 'string', maxLength: 500 },
            userId: { type: 'string' }
        }
    },
    response: {
        201: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                type: { type: 'string' },
                quantity: { type: 'number' },
                storeId: { type: 'string' },
                productId: { type: 'string' },
                supplierId: { type: 'string', nullable: true },
                batch: { type: 'string', nullable: true },
                expiration: { type: 'string', format: 'date-time', nullable: true },
                price: { type: 'number', nullable: true },
                note: { type: 'string', nullable: true },
                userId: { type: 'string', nullable: true },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                store: { type: 'object' },
                product: { type: 'object' },
                supplier: { type: 'object', nullable: true },
                user: { type: 'object', nullable: true }
            }
        }
    }
};
exports.updateMovementSchema = {
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
            type: {
                type: 'string',
                enum: ['ENTRADA', 'SAIDA', 'PERDA']
            },
            quantity: { type: 'number', minimum: 1 },
            supplierId: { type: 'string' },
            batch: { type: 'string' },
            expiration: { type: 'string', format: 'date-time' },
            price: { type: 'number', minimum: 0.01 },
            note: { type: 'string', maxLength: 500 }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                type: { type: 'string' },
                quantity: { type: 'number' },
                storeId: { type: 'string' },
                productId: { type: 'string' },
                supplierId: { type: 'string', nullable: true },
                batch: { type: 'string', nullable: true },
                expiration: { type: 'string', format: 'date-time', nullable: true },
                price: { type: 'number', nullable: true },
                note: { type: 'string', nullable: true },
                userId: { type: 'string', nullable: true },
                updatedAt: { type: 'string', format: 'date-time' },
                store: { type: 'object' },
                product: { type: 'object' },
                supplier: { type: 'object', nullable: true },
                user: { type: 'object', nullable: true }
            }
        }
    }
};
exports.getMovementSchema = {
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
                type: { type: 'string' },
                quantity: { type: 'number' },
                storeId: { type: 'string' },
                productId: { type: 'string' },
                supplierId: { type: 'string', nullable: true },
                batch: { type: 'string', nullable: true },
                expiration: { type: 'string', format: 'date-time', nullable: true },
                price: { type: 'number', nullable: true },
                note: { type: 'string', nullable: true },
                userId: { type: 'string', nullable: true },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                store: { type: 'object' },
                product: { type: 'object' },
                supplier: { type: 'object', nullable: true },
                user: { type: 'object', nullable: true }
            }
        }
    }
};
exports.listMovementsSchema = {
    querystring: {
        type: 'object',
        properties: {
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
            search: { type: 'string' },
            type: {
                type: 'string',
                enum: ['ENTRADA', 'SAIDA', 'PERDA']
            },
            storeId: { type: 'string' },
            productId: { type: 'string' },
            supplierId: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' }
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
                            storeId: { type: 'string' },
                            productId: { type: 'string' },
                            supplierId: { type: 'string', nullable: true },
                            batch: { type: 'string', nullable: true },
                            expiration: { type: 'string', format: 'date-time', nullable: true },
                            price: { type: 'number', nullable: true },
                            note: { type: 'string', nullable: true },
                            userId: { type: 'string', nullable: true },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' },
                            store: { type: 'object' },
                            product: { type: 'object' },
                            supplier: { type: 'object', nullable: true },
                            user: { type: 'object', nullable: true }
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
exports.deleteMovementSchema = {
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
exports.getByStoreSchema = {
    params: {
        type: 'object',
        required: ['storeId'],
        properties: {
            storeId: { type: 'string' }
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
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' }
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
                            storeId: { type: 'string' },
                            productId: { type: 'string' },
                            supplierId: { type: 'string', nullable: true },
                            batch: { type: 'string', nullable: true },
                            expiration: { type: 'string', format: 'date-time', nullable: true },
                            price: { type: 'number', nullable: true },
                            note: { type: 'string', nullable: true },
                            userId: { type: 'string', nullable: true },
                            createdAt: { type: 'string', format: 'date-time' },
                            store: { type: 'object' },
                            product: { type: 'object' },
                            supplier: { type: 'object', nullable: true },
                            user: { type: 'object', nullable: true }
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
exports.getByProductSchema = {
    params: {
        type: 'object',
        required: ['productId'],
        properties: {
            productId: { type: 'string' }
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
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' }
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
                            storeId: { type: 'string' },
                            productId: { type: 'string' },
                            supplierId: { type: 'string', nullable: true },
                            batch: { type: 'string', nullable: true },
                            expiration: { type: 'string', format: 'date-time', nullable: true },
                            price: { type: 'number', nullable: true },
                            note: { type: 'string', nullable: true },
                            userId: { type: 'string', nullable: true },
                            createdAt: { type: 'string', format: 'date-time' },
                            store: { type: 'object' },
                            product: { type: 'object' },
                            supplier: { type: 'object', nullable: true },
                            user: { type: 'object', nullable: true }
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
exports.getBySupplierSchema = {
    params: {
        type: 'object',
        required: ['supplierId'],
        properties: {
            supplierId: { type: 'string' }
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
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' }
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
                            storeId: { type: 'string' },
                            productId: { type: 'string' },
                            supplierId: { type: 'string', nullable: true },
                            batch: { type: 'string', nullable: true },
                            expiration: { type: 'string', format: 'date-time', nullable: true },
                            price: { type: 'number', nullable: true },
                            note: { type: 'string', nullable: true },
                            userId: { type: 'string', nullable: true },
                            createdAt: { type: 'string', format: 'date-time' },
                            store: { type: 'object' },
                            product: { type: 'object' },
                            supplier: { type: 'object', nullable: true },
                            user: { type: 'object', nullable: true }
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
exports.getStockHistorySchema = {
    params: {
        type: 'object',
        required: ['productId', 'storeId'],
        properties: {
            productId: { type: 'string' },
            storeId: { type: 'string' }
        }
    },
    querystring: {
        type: 'object',
        properties: {
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                product: { type: 'object' },
                store: { type: 'object' },
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
                            createdAt: { type: 'string', format: 'date-time' },
                            supplier: { type: 'object', nullable: true },
                            user: { type: 'object', nullable: true }
                        }
                    }
                },
                summary: {
                    type: 'object',
                    properties: {
                        totalEntries: { type: 'number' },
                        totalExits: { type: 'number' },
                        totalLosses: { type: 'number' },
                        netMovement: { type: 'number' }
                    }
                }
            }
        }
    }
};
// === SCHEMAS PARA FUNÇÕES ADICIONAIS DE MOVIMENTAÇÃO ===
exports.getMovementReportSchema = {
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
            groupBy: {
                type: 'string',
                enum: ['day', 'week', 'month', 'year'],
                default: 'day'
            },
            format: {
                type: 'string',
                enum: ['json', 'csv', 'pdf'],
                default: 'json'
            }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                summary: {
                    type: 'object',
                    properties: {
                        totalMovements: { type: 'number' },
                        totalValue: { type: 'number' },
                        period: {
                            type: 'object',
                            properties: {
                                startDate: { type: 'string' },
                                endDate: { type: 'string' }
                            }
                        }
                    }
                },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            date: { type: 'string' },
                            movements: { type: 'number' },
                            value: { type: 'number' },
                            entrada: { type: 'number' },
                            saida: { type: 'number' },
                            perda: { type: 'number' }
                        }
                    }
                },
                byType: {
                    type: 'object',
                    properties: {
                        ENTRADA: {
                            type: 'object',
                            properties: {
                                count: { type: 'number' },
                                value: { type: 'number' },
                                quantity: { type: 'number' }
                            }
                        },
                        SAIDA: {
                            type: 'object',
                            properties: {
                                count: { type: 'number' },
                                value: { type: 'number' },
                                quantity: { type: 'number' }
                            }
                        },
                        PERDA: {
                            type: 'object',
                            properties: {
                                count: { type: 'number' },
                                value: { type: 'number' },
                                quantity: { type: 'number' }
                            }
                        }
                    }
                },
                byStore: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            storeId: { type: 'string' },
                            storeName: { type: 'string' },
                            movements: { type: 'number' },
                            value: { type: 'number' }
                        }
                    }
                },
                byProduct: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            productId: { type: 'string' },
                            productName: { type: 'string' },
                            movements: { type: 'number' },
                            quantity: { type: 'number' }
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
                            movements: { type: 'number' },
                            value: { type: 'number' }
                        }
                    }
                }
            }
        }
    }
};
exports.createBulkMovementSchema = {
    body: {
        type: 'object',
        required: ['movements'],
        properties: {
            movements: {
                type: 'array',
                minItems: 1,
                maxItems: 100,
                items: {
                    type: 'object',
                    required: ['type', 'quantity', 'storeId', 'productId'],
                    properties: {
                        type: {
                            type: 'string',
                            enum: ['ENTRADA', 'SAIDA', 'PERDA']
                        },
                        quantity: { type: 'number', minimum: 1 },
                        storeId: { type: 'string', minLength: 1 },
                        productId: { type: 'string', minLength: 1 },
                        supplierId: { type: 'string' },
                        batch: { type: 'string' },
                        expiration: { type: 'string', format: 'date' },
                        price: { type: 'number', minimum: 0 },
                        note: { type: 'string', maxLength: 500 }
                    }
                }
            }
        }
    },
    response: {
        201: {
            type: 'object',
            properties: {
                success: { type: 'number' },
                failed: { type: 'number' },
                results: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            index: { type: 'number' },
                            success: { type: 'boolean' },
                            movement: { type: 'object', nullable: true },
                            error: { type: 'string', nullable: true }
                        }
                    }
                }
            }
        }
    }
};
exports.verifyMovementSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    body: {
        type: 'object',
        required: ['verified'],
        properties: {
            verified: { type: 'boolean' },
            note: { type: 'string', maxLength: 500 }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                verified: { type: 'boolean' },
                verifiedAt: { type: 'string', format: 'date-time', nullable: true },
                verifiedBy: { type: 'string', nullable: true },
                verificationNote: { type: 'string', nullable: true },
                updatedAt: { type: 'string', format: 'date-time' },
                store: { type: 'object' },
                product: { type: 'object' },
                supplier: { type: 'object', nullable: true },
                user: { type: 'object', nullable: true }
            }
        }
    }
};
exports.cancelMovementSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    body: {
        type: 'object',
        required: ['reason'],
        properties: {
            reason: { type: 'string', minLength: 1, maxLength: 500 }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                cancelled: { type: 'boolean' },
                cancelledAt: { type: 'string', format: 'date-time' },
                cancelledBy: { type: 'string', nullable: true },
                cancellationReason: { type: 'string' },
                updatedAt: { type: 'string', format: 'date-time' },
                store: { type: 'object' },
                product: { type: 'object' },
                supplier: { type: 'object', nullable: true },
                user: { type: 'object', nullable: true }
            }
        }
    }
};
exports.getVerifiedMovementsSchema = {
    querystring: {
        type: 'object',
        properties: {
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
            storeId: { type: 'string' },
            verified: { type: 'boolean' },
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
                            verified: { type: 'boolean' },
                            verifiedAt: { type: 'string', format: 'date-time', nullable: true },
                            verifiedBy: { type: 'string', nullable: true },
                            createdAt: { type: 'string', format: 'date-time' },
                            store: { type: 'object' },
                            product: { type: 'object' },
                            supplier: { type: 'object', nullable: true },
                            user: { type: 'object', nullable: true }
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
exports.getCancelledMovementsSchema = {
    querystring: {
        type: 'object',
        properties: {
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
            storeId: { type: 'string' },
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
                            cancelled: { type: 'boolean' },
                            cancelledAt: { type: 'string', format: 'date-time' },
                            cancelledBy: { type: 'string', nullable: true },
                            cancellationReason: { type: 'string' },
                            createdAt: { type: 'string', format: 'date-time' },
                            store: { type: 'object' },
                            product: { type: 'object' },
                            supplier: { type: 'object', nullable: true },
                            user: { type: 'object', nullable: true }
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
exports.getMovementAnalyticsSchema = {
    querystring: {
        type: 'object',
        properties: {
            storeId: { type: 'string' },
            productId: { type: 'string' },
            supplierId: { type: 'string' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                summary: {
                    type: 'object',
                    properties: {
                        totalMovements: { type: 'number' },
                        totalValue: { type: 'number' },
                        averageValue: { type: 'number' },
                        verifiedCount: { type: 'number' },
                        cancelledCount: { type: 'number' },
                        verificationRate: { type: 'number' },
                        cancellationRate: { type: 'number' }
                    }
                },
                byType: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            type: { type: 'string' },
                            count: { type: 'number' },
                            quantity: { type: 'number' },
                            value: { type: 'number' }
                        }
                    }
                },
                byMonth: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            month: { type: 'string' },
                            count: { type: 'number' },
                            value: { type: 'number' }
                        }
                    }
                },
                byStore: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            storeId: { type: 'string' },
                            storeName: { type: 'string' },
                            count: { type: 'number' },
                            value: { type: 'number' }
                        }
                    }
                },
                byProduct: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            productId: { type: 'string' },
                            productName: { type: 'string' },
                            count: { type: 'number' },
                            quantity: { type: 'number' },
                            value: { type: 'number' }
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
                            count: { type: 'number' },
                            value: { type: 'number' }
                        }
                    }
                }
            }
        }
    }
};
exports.MovementSchemas = {
    create: exports.createMovementSchema,
    update: exports.updateMovementSchema,
    get: exports.getMovementSchema,
    delete: exports.deleteMovementSchema,
    list: exports.listMovementsSchema,
    getByStore: exports.getByStoreSchema,
    getByProduct: exports.getByProductSchema,
    getBySupplier: exports.getBySupplierSchema,
    getStockHistory: exports.getStockHistorySchema,
    // Funções adicionais
    getReport: exports.getMovementReportSchema,
    createBulk: exports.createBulkMovementSchema,
    verify: exports.verifyMovementSchema,
    cancel: exports.cancelMovementSchema,
    getVerifiedMovements: exports.getVerifiedMovementsSchema,
    getCancelledMovements: exports.getCancelledMovementsSchema,
    getAnalytics: exports.getMovementAnalyticsSchema
};
