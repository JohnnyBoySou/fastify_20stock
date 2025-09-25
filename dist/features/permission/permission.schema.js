"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionSchemas = void 0;
const authorization_middleware_1 = require("../../middlewares/authorization.middleware");
// ================================
// SCHEMAS PARA PERMISSÕES CUSTOMIZADAS
// ================================
exports.PermissionSchemas = {
    // Criar permissão customizada
    createUserPermission: {
        body: {
            type: 'object',
            required: ['userId', 'action', 'grant'],
            properties: {
                userId: { type: 'string', minLength: 1 },
                action: { type: 'string', enum: Object.values(authorization_middleware_1.Action) },
                resource: { type: 'string', maxLength: 100 },
                storeId: { type: 'string', minLength: 1 },
                grant: { type: 'boolean' },
                conditions: {
                    type: 'object',
                    properties: {
                        timeRange: { type: 'string', pattern: '^\\d{1,2}-\\d{1,2}$' },
                        dayOfWeek: { type: 'string', pattern: '^\\d-\\d$' },
                        dateRange: {
                            type: 'object',
                            properties: {
                                start: { type: 'string', format: 'date' },
                                end: { type: 'string', format: 'date' }
                            },
                            required: ['start', 'end']
                        },
                        amountLimit: { type: 'number', minimum: 0 },
                        custom: { type: 'string', maxLength: 500 },
                        ipWhitelist: {
                            type: 'array',
                            items: { type: 'string', format: 'ipv4' }
                        },
                        userAgent: { type: 'string', maxLength: 200 }
                    }
                },
                expiresAt: { type: 'string', format: 'date-time' },
                reason: { type: 'string', maxLength: 500 }
            }
        }
    },
    // Listar permissões de usuário
    getUserPermissions: {
        params: {
            type: 'object',
            required: ['userId'],
            properties: {
                userId: { type: 'string', minLength: 1 }
            }
        },
        querystring: {
            type: 'object',
            properties: {
                storeId: { type: 'string', minLength: 1 },
                action: { type: 'string', enum: Object.values(authorization_middleware_1.Action) },
                active: { type: 'boolean' },
                page: { type: 'integer', minimum: 1, default: 1 },
                limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
            }
        }
    },
    // Atualizar permissão customizada
    updateUserPermission: {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', minLength: 1 }
            }
        },
        body: {
            type: 'object',
            properties: {
                action: { type: 'string', enum: Object.values(authorization_middleware_1.Action) },
                resource: { type: 'string', maxLength: 100 },
                storeId: { type: 'string', minLength: 1 },
                grant: { type: 'boolean' },
                conditions: {
                    type: 'object',
                    properties: {
                        timeRange: { type: 'string', pattern: '^\\d{1,2}-\\d{1,2}$' },
                        dayOfWeek: { type: 'string', pattern: '^\\d-\\d$' },
                        dateRange: {
                            type: 'object',
                            properties: {
                                start: { type: 'string', format: 'date' },
                                end: { type: 'string', format: 'date' }
                            },
                            required: ['start', 'end']
                        },
                        amountLimit: { type: 'number', minimum: 0 },
                        custom: { type: 'string', maxLength: 500 },
                        ipWhitelist: {
                            type: 'array',
                            items: { type: 'string', format: 'ipv4' }
                        },
                        userAgent: { type: 'string', maxLength: 200 }
                    }
                },
                expiresAt: { type: 'string', format: 'date-time' },
                reason: { type: 'string', maxLength: 500 }
            }
        }
    },
    // Deletar permissão customizada
    deleteUserPermission: {
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', minLength: 1 }
            }
        }
    },
    // ================================
    // SCHEMAS PARA PERMISSÕES DE LOJA
    // ================================
    // Definir permissões de usuário em loja
    setStoreUserPermissions: {
        body: {
            type: 'object',
            required: ['userId', 'storeId', 'storeRole', 'permissions'],
            properties: {
                userId: { type: 'string', minLength: 1 },
                storeId: { type: 'string', minLength: 1 },
                storeRole: { type: 'string', enum: Object.values(authorization_middleware_1.StoreRole) },
                permissions: {
                    type: 'array',
                    items: { type: 'string', enum: Object.values(authorization_middleware_1.Action) },
                    minItems: 1
                },
                conditions: {
                    type: 'object',
                    properties: {
                        timeRange: { type: 'string', pattern: '^\\d{1,2}-\\d{1,2}$' },
                        dayOfWeek: { type: 'string', pattern: '^\\d-\\d$' },
                        dateRange: {
                            type: 'object',
                            properties: {
                                start: { type: 'string', format: 'date' },
                                end: { type: 'string', format: 'date' }
                            },
                            required: ['start', 'end']
                        },
                        amountLimit: { type: 'number', minimum: 0 },
                        custom: { type: 'string', maxLength: 500 },
                        ipWhitelist: {
                            type: 'array',
                            items: { type: 'string', format: 'ipv4' }
                        },
                        userAgent: { type: 'string', maxLength: 200 }
                    }
                },
                expiresAt: { type: 'string', format: 'date-time' }
            }
        }
    },
    // Listar permissões de loja
    getStoreUserPermissions: {
        params: {
            type: 'object',
            required: ['storeId'],
            properties: {
                storeId: { type: 'string', minLength: 1 }
            }
        },
        querystring: {
            type: 'object',
            properties: {
                page: { type: 'integer', minimum: 1, default: 1 },
                limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
            }
        }
    },
    // ================================
    // SCHEMAS PARA CONSULTAS
    // ================================
    // Obter permissões efetivas
    getUserEffectivePermissions: {
        params: {
            type: 'object',
            required: ['userId'],
            properties: {
                userId: { type: 'string', minLength: 1 }
            }
        },
        querystring: {
            type: 'object',
            properties: {
                storeId: { type: 'string', minLength: 1 }
            }
        }
    },
    // Testar permissão
    testPermission: {
        body: {
            type: 'object',
            required: ['userId', 'action'],
            properties: {
                userId: { type: 'string', minLength: 1 },
                action: { type: 'string', enum: Object.values(authorization_middleware_1.Action) },
                resource: { type: 'string', maxLength: 100 },
                storeId: { type: 'string', minLength: 1 },
                context: { type: 'object' }
            }
        }
    },
    // Obter estatísticas
    getPermissionStats: {
        querystring: {
            type: 'object',
            properties: {
                storeId: { type: 'string', minLength: 1 },
                dateFrom: { type: 'string', format: 'date' },
                dateTo: { type: 'string', format: 'date' }
            }
        }
    },
    // ================================
    // SCHEMAS PARA BULK OPERATIONS
    // ================================
    // Criar múltiplas permissões
    bulkCreateUserPermissions: {
        body: {
            type: 'object',
            required: ['permissions'],
            properties: {
                permissions: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['userId', 'action', 'grant'],
                        properties: {
                            userId: { type: 'string', minLength: 1 },
                            action: { type: 'string', enum: Object.values(authorization_middleware_1.Action) },
                            resource: { type: 'string', maxLength: 100 },
                            storeId: { type: 'string', minLength: 1 },
                            grant: { type: 'boolean' },
                            conditions: {
                                type: 'object',
                                properties: {
                                    timeRange: { type: 'string', pattern: '^\\d{1,2}-\\d{1,2}$' },
                                    dayOfWeek: { type: 'string', pattern: '^\\d-\\d$' },
                                    dateRange: {
                                        type: 'object',
                                        properties: {
                                            start: { type: 'string', format: 'date' },
                                            end: { type: 'string', format: 'date' }
                                        },
                                        required: ['start', 'end']
                                    },
                                    amountLimit: { type: 'number', minimum: 0 },
                                    custom: { type: 'string', maxLength: 500 },
                                    ipWhitelist: {
                                        type: 'array',
                                        items: { type: 'string', format: 'ipv4' }
                                    },
                                    userAgent: { type: 'string', maxLength: 200 }
                                }
                            },
                            expiresAt: { type: 'string', format: 'date-time' },
                            reason: { type: 'string', maxLength: 500 }
                        }
                    },
                    minItems: 1,
                    maxItems: 100
                }
            }
        }
    },
    // Atualizar múltiplas permissões
    bulkUpdateUserPermissions: {
        body: {
            type: 'object',
            required: ['updates'],
            properties: {
                updates: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['id'],
                        properties: {
                            id: { type: 'string', minLength: 1 },
                            action: { type: 'string', enum: Object.values(authorization_middleware_1.Action) },
                            resource: { type: 'string', maxLength: 100 },
                            storeId: { type: 'string', minLength: 1 },
                            grant: { type: 'boolean' },
                            conditions: {
                                type: 'object',
                                properties: {
                                    timeRange: { type: 'string', pattern: '^\\d{1,2}-\\d{1,2}$' },
                                    dayOfWeek: { type: 'string', pattern: '^\\d-\\d$' },
                                    dateRange: {
                                        type: 'object',
                                        properties: {
                                            start: { type: 'string', format: 'date' },
                                            end: { type: 'string', format: 'date' }
                                        },
                                        required: ['start', 'end']
                                    },
                                    amountLimit: { type: 'number', minimum: 0 },
                                    custom: { type: 'string', maxLength: 500 },
                                    ipWhitelist: {
                                        type: 'array',
                                        items: { type: 'string', format: 'ipv4' }
                                    },
                                    userAgent: { type: 'string', maxLength: 200 }
                                }
                            },
                            expiresAt: { type: 'string', format: 'date-time' },
                            reason: { type: 'string', maxLength: 500 }
                        }
                    },
                    minItems: 1,
                    maxItems: 100
                }
            }
        }
    },
    // Deletar múltiplas permissões
    bulkDeleteUserPermissions: {
        body: {
            type: 'object',
            required: ['ids'],
            properties: {
                ids: {
                    type: 'array',
                    items: { type: 'string', minLength: 1 },
                    minItems: 1,
                    maxItems: 100
                }
            }
        }
    },
    // ================================
    // SCHEMAS PARA TEMPLATES
    // ================================
    // Criar template de permissão
    createPermissionTemplate: {
        body: {
            type: 'object',
            required: ['name', 'description', 'permissions'],
            properties: {
                name: { type: 'string', minLength: 3, maxLength: 100 },
                description: { type: 'string', maxLength: 500 },
                permissions: {
                    type: 'array',
                    items: { type: 'string', enum: Object.values(authorization_middleware_1.Action) },
                    minItems: 1
                },
                conditions: {
                    type: 'object',
                    properties: {
                        timeRange: { type: 'string', pattern: '^\\d{1,2}-\\d{1,2}$' },
                        dayOfWeek: { type: 'string', pattern: '^\\d-\\d$' },
                        dateRange: {
                            type: 'object',
                            properties: {
                                start: { type: 'string', format: 'date' },
                                end: { type: 'string', format: 'date' }
                            },
                            required: ['start', 'end']
                        },
                        amountLimit: { type: 'number', minimum: 0 },
                        custom: { type: 'string', maxLength: 500 },
                        ipWhitelist: {
                            type: 'array',
                            items: { type: 'string', format: 'ipv4' }
                        },
                        userAgent: { type: 'string', maxLength: 200 }
                    }
                }
            }
        }
    },
    // Aplicar template de permissão
    applyPermissionTemplate: {
        body: {
            type: 'object',
            required: ['userId', 'templateId'],
            properties: {
                userId: { type: 'string', minLength: 1 },
                templateId: { type: 'string', minLength: 1 },
                storeId: { type: 'string', minLength: 1 },
                expiresAt: { type: 'string', format: 'date-time' }
            }
        }
    },
    // ================================
    // SCHEMAS PARA AUDITORIA
    // ================================
    // Obter log de auditoria
    getPermissionAuditLog: {
        params: {
            type: 'object',
            required: ['permissionId'],
            properties: {
                permissionId: { type: 'string', minLength: 1 }
            }
        },
        querystring: {
            type: 'object',
            properties: {
                page: { type: 'integer', minimum: 1, default: 1 },
                limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
                action: { type: 'string', enum: ['created', 'updated', 'deleted', 'expired'] },
                dateFrom: { type: 'string', format: 'date' },
                dateTo: { type: 'string', format: 'date' }
            }
        }
    }
};
