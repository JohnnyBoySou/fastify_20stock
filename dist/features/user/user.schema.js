"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchemas = exports.listUsersSchema = exports.deleteUserSchema = exports.updateUserSchema = exports.getUserSchema = exports.createUserSchema = void 0;
exports.createUserSchema = {
    body: {
        type: 'object',
        required: ['email', 'password', 'name'],
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            name: { type: 'string', minLength: 2 },
            roles: {
                type: 'array',
                items: { type: 'string' },
                default: ['user']
            }
        }
    },
    response: {
        201: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                roles: { type: 'array', items: { type: 'string' } },
                status: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' }
            }
        }
    }
};
exports.getUserSchema = {
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
                email: { type: 'string' },
                name: { type: 'string' },
                roles: { type: 'array', items: { type: 'string' } },
                status: { type: 'boolean' },
                emailVerified: { type: 'boolean' },
                lastLoginAt: { type: 'string', format: 'date-time' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    }
};
exports.updateUserSchema = {
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
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            name: { type: 'string', minLength: 2 },
            roles: { type: 'array', items: { type: 'string' } },
            status: { type: 'boolean' },
            emailVerified: { type: 'boolean' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                roles: { type: 'array', items: { type: 'string' } },
                status: { type: 'boolean' },
                emailVerified: { type: 'boolean' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    }
};
exports.deleteUserSchema = {
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
exports.listUsersSchema = {
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
                users: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            email: { type: 'string' },
                            name: { type: 'string' },
                            roles: { type: 'array', items: { type: 'string' } },
                            status: { type: 'boolean' },
                            emailVerified: { type: 'boolean' },
                            lastLoginAt: { type: 'string', format: 'date-time' },
                            createdAt: { type: 'string', format: 'date-time' }
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
exports.UserSchemas = {
    create: exports.createUserSchema,
    get: exports.getUserSchema,
    update: exports.updateUserSchema,
    delete: exports.deleteUserSchema,
    list: exports.listUsersSchema
};
