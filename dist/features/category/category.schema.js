"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorySchemas = exports.getRootCategoriesSchema = exports.getChildrenSchema = exports.updateStatusSchema = exports.deleteCategorySchema = exports.listCategoriesSchema = exports.getCategorySchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
exports.createCategorySchema = {
    body: {
        type: 'object',
        required: ['name'],
        properties: {
            name: { type: 'string', minLength: 1, maxLength: 255 },
            description: { type: 'string' },
            code: { type: 'string' },
            status: { type: 'boolean', default: true },
            color: { type: 'string' },
            icon: { type: 'string' },
            parentId: { type: 'string' }
        }
    },
    response: {
        201: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string', nullable: true },
                code: { type: 'string', nullable: true },
                status: { type: 'boolean' },
                color: { type: 'string', nullable: true },
                icon: { type: 'string', nullable: true },
                parentId: { type: 'string', nullable: true },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                parent: { type: 'object', nullable: true },
                children: { type: 'array' },
                products: { type: 'array' },
                _count: {
                    type: 'object',
                    properties: {
                        children: { type: 'number' },
                        products: { type: 'number' }
                    }
                }
            }
        }
    }
};
exports.updateCategorySchema = {
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
            name: { type: 'string', minLength: 1, maxLength: 255 },
            description: { type: 'string' },
            code: { type: 'string' },
            status: { type: 'boolean' },
            color: { type: 'string' },
            icon: { type: 'string' },
            parentId: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string', nullable: true },
                code: { type: 'string', nullable: true },
                status: { type: 'boolean' },
                color: { type: 'string', nullable: true },
                icon: { type: 'string', nullable: true },
                parentId: { type: 'string', nullable: true },
                updatedAt: { type: 'string', format: 'date-time' },
                parent: { type: 'object', nullable: true },
                children: { type: 'array' },
                products: { type: 'array' },
                _count: {
                    type: 'object',
                    properties: {
                        children: { type: 'number' },
                        products: { type: 'number' }
                    }
                }
            }
        }
    }
};
exports.getCategorySchema = {
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
                code: { type: 'string', nullable: true },
                status: { type: 'boolean' },
                color: { type: 'string', nullable: true },
                icon: { type: 'string', nullable: true },
                parentId: { type: 'string', nullable: true },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                parent: { type: 'object', nullable: true },
                children: { type: 'array' },
                products: { type: 'array' },
                _count: {
                    type: 'object',
                    properties: {
                        children: { type: 'number' },
                        products: { type: 'number' }
                    }
                }
            }
        }
    }
};
exports.listCategoriesSchema = {
    querystring: {
        type: 'object',
        properties: {
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
            search: { type: 'string' },
            status: { type: 'boolean' },
            parentId: { type: 'string' }
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
                            code: { type: 'string', nullable: true },
                            status: { type: 'boolean' },
                            color: { type: 'string', nullable: true },
                            icon: { type: 'string', nullable: true },
                            parentId: { type: 'string', nullable: true },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' },
                            parent: { type: 'object', nullable: true },
                            children: { type: 'array' },
                            products: { type: 'array' },
                            _count: {
                                type: 'object',
                                properties: {
                                    children: { type: 'number' },
                                    products: { type: 'number' }
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
exports.deleteCategorySchema = {
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
                parent: { type: 'object', nullable: true },
                children: { type: 'array' },
                products: { type: 'array' },
                _count: {
                    type: 'object',
                    properties: {
                        children: { type: 'number' },
                        products: { type: 'number' }
                    }
                }
            }
        }
    }
};
exports.getChildrenSchema = {
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
                            status: { type: 'boolean' },
                            color: { type: 'string', nullable: true },
                            icon: { type: 'string', nullable: true },
                            parentId: { type: 'string', nullable: true },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' },
                            parent: { type: 'object', nullable: true },
                            children: { type: 'array' },
                            products: { type: 'array' },
                            _count: {
                                type: 'object',
                                properties: {
                                    children: { type: 'number' },
                                    products: { type: 'number' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
exports.getRootCategoriesSchema = {
    querystring: {
        type: 'object',
        properties: {
            status: { type: 'boolean' }
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
                            status: { type: 'boolean' },
                            color: { type: 'string', nullable: true },
                            icon: { type: 'string', nullable: true },
                            parentId: { type: 'string', nullable: true },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' },
                            parent: { type: 'object', nullable: true },
                            children: { type: 'array' },
                            products: { type: 'array' },
                            _count: {
                                type: 'object',
                                properties: {
                                    children: { type: 'number' },
                                    products: { type: 'number' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
exports.CategorySchemas = {
    create: exports.createCategorySchema,
    update: exports.updateCategorySchema,
    get: exports.getCategorySchema,
    delete: exports.deleteCategorySchema,
    list: exports.listCategoriesSchema,
    updateStatus: exports.updateStatusSchema,
    getChildren: exports.getChildrenSchema,
    getRoot: exports.getRootCategoriesSchema
};
