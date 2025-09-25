"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierResponsibleSchemas = exports.getSupplierResponsibleByCpfSchema = exports.getSupplierResponsibleByEmailSchema = exports.listSupplierResponsiblesSchema = exports.deleteSupplierResponsibleSchema = exports.getSupplierResponsibleSchema = exports.updateSupplierResponsibleSchema = exports.createSupplierResponsibleSchema = void 0;
exports.createSupplierResponsibleSchema = {
    params: {
        type: 'object',
        required: ['supplierId'],
        properties: {
            supplierId: { type: 'string' }
        }
    },
    body: {
        type: 'object',
        required: ['name'],
        properties: {
            name: { type: 'string', minLength: 1 },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            cpf: { type: 'string', minLength: 11, maxLength: 14 }
        }
    },
    response: {
        201: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string', nullable: true },
                phone: { type: 'string', nullable: true },
                cpf: { type: 'string', nullable: true },
                status: { type: 'boolean' },
                supplierId: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    }
};
exports.updateSupplierResponsibleSchema = {
    params: {
        type: 'object',
        required: ['supplierId', 'responsibleId'],
        properties: {
            supplierId: { type: 'string' },
            responsibleId: { type: 'string' }
        }
    },
    body: {
        type: 'object',
        properties: {
            name: { type: 'string', minLength: 1 },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            cpf: { type: 'string', minLength: 11, maxLength: 14 },
            status: { type: 'boolean' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string', nullable: true },
                phone: { type: 'string', nullable: true },
                cpf: { type: 'string', nullable: true },
                status: { type: 'boolean' },
                supplierId: { type: 'string' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    }
};
exports.getSupplierResponsibleSchema = {
    params: {
        type: 'object',
        required: ['supplierId', 'responsibleId'],
        properties: {
            supplierId: { type: 'string' },
            responsibleId: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string', nullable: true },
                phone: { type: 'string', nullable: true },
                cpf: { type: 'string', nullable: true },
                status: { type: 'boolean' },
                supplierId: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    }
};
exports.deleteSupplierResponsibleSchema = {
    params: {
        type: 'object',
        required: ['supplierId', 'responsibleId'],
        properties: {
            supplierId: { type: 'string' },
            responsibleId: { type: 'string' }
        }
    },
    response: {
        204: { type: 'null' }
    }
};
exports.listSupplierResponsiblesSchema = {
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
            search: { type: 'string' },
            status: { type: 'boolean' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                responsibles: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            email: { type: 'string', nullable: true },
                            phone: { type: 'string', nullable: true },
                            cpf: { type: 'string', nullable: true },
                            status: { type: 'boolean' },
                            supplierId: { type: 'string' },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' }
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
exports.getSupplierResponsibleByEmailSchema = {
    params: {
        type: 'object',
        required: ['supplierId', 'email'],
        properties: {
            supplierId: { type: 'string' },
            email: { type: 'string', format: 'email' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string', nullable: true },
                phone: { type: 'string', nullable: true },
                cpf: { type: 'string', nullable: true },
                status: { type: 'boolean' },
                supplierId: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    }
};
exports.getSupplierResponsibleByCpfSchema = {
    params: {
        type: 'object',
        required: ['supplierId', 'cpf'],
        properties: {
            supplierId: { type: 'string' },
            cpf: { type: 'string', minLength: 11, maxLength: 14 }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string', nullable: true },
                phone: { type: 'string', nullable: true },
                cpf: { type: 'string', nullable: true },
                status: { type: 'boolean' },
                supplierId: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    }
};
exports.SupplierResponsibleSchemas = {
    create: exports.createSupplierResponsibleSchema,
    update: exports.updateSupplierResponsibleSchema,
    get: exports.getSupplierResponsibleSchema,
    delete: exports.deleteSupplierResponsibleSchema,
    list: exports.listSupplierResponsiblesSchema,
    getByEmail: exports.getSupplierResponsibleByEmailSchema,
    getByCpf: exports.getSupplierResponsibleByCpfSchema
};
