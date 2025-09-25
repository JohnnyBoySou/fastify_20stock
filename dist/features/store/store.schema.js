"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreSchemas = exports.transferOwnershipSchema = exports.searchStoreUsersSchema = exports.getStoreUserStatsSchema = exports.getStoreStaffSchema = exports.getStoreManagersSchema = exports.getStoreAdminsSchema = exports.getStoreOwnerSchema = exports.getStoreUserSchema = exports.listStoreUsersSchema = exports.updateUserRoleSchema = exports.removeUserFromStoreSchema = exports.addUserToStoreSchema = exports.toggleStatusSchema = exports.verifyCnpjSchema = exports.getStoresByOwnerSchema = exports.getStoreByCnpjSchema = exports.listStoresSchema = exports.deleteStoreSchema = exports.getStoreSchema = exports.updateStoreSchema = exports.createStoreSchema = void 0;
exports.createStoreSchema = {
    body: {
        type: 'object',
        required: ['ownerId', 'name', 'cnpj'],
        properties: {
            ownerId: { type: 'string', minLength: 1 },
            name: { type: 'string', minLength: 1, maxLength: 255 },
            cnpj: { type: 'string', minLength: 14, maxLength: 14 },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            cep: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            address: { type: 'string' },
            status: { type: 'boolean', default: true }
        }
    },
    response: {
        201: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                cnpj: { type: 'string' },
                email: { type: 'string', nullable: true },
                phone: { type: 'string', nullable: true },
                cep: { type: 'string', nullable: true },
                city: { type: 'string', nullable: true },
                state: { type: 'string', nullable: true },
                address: { type: 'string', nullable: true },
                status: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                owner: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' }
                    }
                }
            }
        }
    }
};
exports.updateStoreSchema = {
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
            cnpj: { type: 'string', minLength: 14, maxLength: 14 },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            cep: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            address: { type: 'string' },
            status: { type: 'boolean' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                cnpj: { type: 'string' },
                email: { type: 'string', nullable: true },
                phone: { type: 'string', nullable: true },
                cep: { type: 'string', nullable: true },
                city: { type: 'string', nullable: true },
                state: { type: 'string', nullable: true },
                address: { type: 'string', nullable: true },
                status: { type: 'boolean' },
                updatedAt: { type: 'string', format: 'date-time' },
                owner: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' }
                    }
                }
            }
        }
    }
};
exports.getStoreSchema = {
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
                cnpj: { type: 'string' },
                email: { type: 'string', nullable: true },
                phone: { type: 'string', nullable: true },
                cep: { type: 'string', nullable: true },
                city: { type: 'string', nullable: true },
                state: { type: 'string', nullable: true },
                address: { type: 'string', nullable: true },
                status: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                owner: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' }
                    }
                },
                products: { type: 'array' },
                _count: {
                    type: 'object',
                    properties: {
                        products: { type: 'number' },
                        users: { type: 'number' }
                    }
                }
            }
        }
    }
};
exports.deleteStoreSchema = {
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
exports.listStoresSchema = {
    querystring: {
        type: 'object',
        properties: {
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
            search: { type: 'string' },
            status: { type: 'boolean' },
            ownerId: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                stores: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            cnpj: { type: 'string' },
                            email: { type: 'string', nullable: true },
                            phone: { type: 'string', nullable: true },
                            cep: { type: 'string', nullable: true },
                            city: { type: 'string', nullable: true },
                            state: { type: 'string', nullable: true },
                            address: { type: 'string', nullable: true },
                            status: { type: 'boolean' },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' },
                            owner: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                    email: { type: 'string' }
                                }
                            },
                            _count: {
                                type: 'object',
                                properties: {
                                    products: { type: 'number' },
                                    users: { type: 'number' }
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
exports.getStoreByCnpjSchema = {
    params: {
        type: 'object',
        required: ['cnpj'],
        properties: {
            cnpj: { type: 'string', minLength: 14, maxLength: 14 }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                cnpj: { type: 'string' },
                email: { type: 'string', nullable: true },
                phone: { type: 'string', nullable: true },
                cep: { type: 'string', nullable: true },
                city: { type: 'string', nullable: true },
                state: { type: 'string', nullable: true },
                address: { type: 'string', nullable: true },
                status: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                owner: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' }
                    }
                },
                _count: {
                    type: 'object',
                    properties: {
                        products: { type: 'number' },
                        users: { type: 'number' }
                    }
                }
            }
        }
    }
};
exports.getStoresByOwnerSchema = {
    params: {
        type: 'object',
        required: ['ownerId'],
        properties: {
            ownerId: { type: 'string', minLength: 1 }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                stores: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            cnpj: { type: 'string' },
                            email: { type: 'string', nullable: true },
                            phone: { type: 'string', nullable: true },
                            cep: { type: 'string', nullable: true },
                            city: { type: 'string', nullable: true },
                            state: { type: 'string', nullable: true },
                            address: { type: 'string', nullable: true },
                            status: { type: 'boolean' },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' },
                            owner: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                    email: { type: 'string' }
                                }
                            },
                            _count: {
                                type: 'object',
                                properties: {
                                    products: { type: 'number' },
                                    users: { type: 'number' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
exports.verifyCnpjSchema = {
    params: {
        type: 'object',
        required: ['cnpj'],
        properties: {
            cnpj: { type: 'string', minLength: 14, maxLength: 14 }
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
exports.toggleStatusSchema = {
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
                status: { type: 'boolean' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    }
};
// === SCHEMAS PARA GERENCIAMENTO DE USUÁRIOS DA LOJA ===
exports.addUserToStoreSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    body: {
        type: 'object',
        required: ['userId', 'role'],
        properties: {
            userId: { type: 'string', minLength: 1 },
            role: {
                type: 'string',
                enum: ['OWNER', 'ADMIN', 'MANAGER', 'STAFF']
            }
        }
    },
    response: {
        201: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                storeId: { type: 'string' },
                userId: { type: 'string' },
                role: { type: 'string' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        status: { type: 'boolean' },
                        lastLoginAt: { type: 'string', format: 'date-time', nullable: true }
                    }
                },
                store: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        cnpj: { type: 'string' }
                    }
                }
            }
        }
    }
};
exports.removeUserFromStoreSchema = {
    params: {
        type: 'object',
        required: ['id', 'userId'],
        properties: {
            id: { type: 'string' },
            userId: { type: 'string' }
        }
    },
    response: {
        204: { type: 'null' }
    }
};
exports.updateUserRoleSchema = {
    params: {
        type: 'object',
        required: ['id', 'userId'],
        properties: {
            id: { type: 'string' },
            userId: { type: 'string' }
        }
    },
    body: {
        type: 'object',
        required: ['role'],
        properties: {
            role: {
                type: 'string',
                enum: ['OWNER', 'ADMIN', 'MANAGER', 'STAFF']
            }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                storeId: { type: 'string' },
                userId: { type: 'string' },
                role: { type: 'string' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        status: { type: 'boolean' },
                        lastLoginAt: { type: 'string', format: 'date-time', nullable: true }
                    }
                },
                store: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        cnpj: { type: 'string' }
                    }
                }
            }
        }
    }
};
exports.listStoreUsersSchema = {
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
            search: { type: 'string' },
            role: {
                type: 'string',
                enum: ['OWNER', 'ADMIN', 'MANAGER', 'STAFF']
            }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                storeUsers: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            storeId: { type: 'string' },
                            userId: { type: 'string' },
                            role: { type: 'string' },
                            user: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                    email: { type: 'string' },
                                    status: { type: 'boolean' },
                                    lastLoginAt: { type: 'string', format: 'date-time', nullable: true },
                                    createdAt: { type: 'string', format: 'date-time' }
                                }
                            },
                            store: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                    cnpj: { type: 'string' }
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
exports.getStoreUserSchema = {
    params: {
        type: 'object',
        required: ['id', 'userId'],
        properties: {
            id: { type: 'string' },
            userId: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                storeId: { type: 'string' },
                userId: { type: 'string' },
                role: { type: 'string' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        status: { type: 'boolean' },
                        lastLoginAt: { type: 'string', format: 'date-time', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                store: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        cnpj: { type: 'string' }
                    }
                }
            }
        }
    }
};
exports.getStoreOwnerSchema = {
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
                storeId: { type: 'string' },
                userId: { type: 'string' },
                role: { type: 'string' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        status: { type: 'boolean' },
                        lastLoginAt: { type: 'string', format: 'date-time', nullable: true }
                    }
                }
            }
        }
    }
};
exports.getStoreAdminsSchema = {
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
                admins: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            storeId: { type: 'string' },
                            userId: { type: 'string' },
                            role: { type: 'string' },
                            user: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                    email: { type: 'string' },
                                    status: { type: 'boolean' },
                                    lastLoginAt: { type: 'string', format: 'date-time', nullable: true }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
exports.getStoreManagersSchema = {
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
                managers: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            storeId: { type: 'string' },
                            userId: { type: 'string' },
                            role: { type: 'string' },
                            user: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                    email: { type: 'string' },
                                    status: { type: 'boolean' },
                                    lastLoginAt: { type: 'string', format: 'date-time', nullable: true }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
exports.getStoreStaffSchema = {
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
                staff: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            storeId: { type: 'string' },
                            userId: { type: 'string' },
                            role: { type: 'string' },
                            user: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                    email: { type: 'string' },
                                    status: { type: 'boolean' },
                                    lastLoginAt: { type: 'string', format: 'date-time', nullable: true }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
exports.getStoreUserStatsSchema = {
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
                total: { type: 'number' },
                byRole: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            role: { type: 'string' },
                            _count: {
                                type: 'object',
                                properties: {
                                    id: { type: 'number' }
                                }
                            }
                        }
                    }
                },
                active: { type: 'number' },
                inactive: { type: 'number' }
            }
        }
    }
};
exports.searchStoreUsersSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    querystring: {
        type: 'object',
        required: ['q'],
        properties: {
            q: { type: 'string', minLength: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 10 }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                storeUsers: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            storeId: { type: 'string' },
                            userId: { type: 'string' },
                            role: { type: 'string' },
                            user: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                    email: { type: 'string' },
                                    status: { type: 'boolean' },
                                    lastLoginAt: { type: 'string', format: 'date-time', nullable: true }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
exports.transferOwnershipSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' }
        }
    },
    body: {
        type: 'object',
        required: ['newOwnerId'],
        properties: {
            newOwnerId: { type: 'string', minLength: 1 }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                cnpj: { type: 'string' },
                ownerId: { type: 'string' },
                owner: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' }
                    }
                }
            }
        }
    }
};
exports.StoreSchemas = {
    create: exports.createStoreSchema,
    update: exports.updateStoreSchema,
    get: exports.getStoreSchema,
    delete: exports.deleteStoreSchema,
    list: exports.listStoresSchema,
    getByCnpj: exports.getStoreByCnpjSchema,
    getByOwner: exports.getStoresByOwnerSchema,
    verifyCnpj: exports.verifyCnpjSchema,
    toggleStatus: exports.toggleStatusSchema,
    // Gerenciamento de usuários
    addUser: exports.addUserToStoreSchema,
    removeUser: exports.removeUserFromStoreSchema,
    updateUserRole: exports.updateUserRoleSchema,
    listUsers: exports.listStoreUsersSchema,
    getStoreUser: exports.getStoreUserSchema,
    getStoreOwner: exports.getStoreOwnerSchema,
    getStoreAdmins: exports.getStoreAdminsSchema,
    getStoreManagers: exports.getStoreManagersSchema,
    getStoreStaff: exports.getStoreStaffSchema,
    getStoreUserStats: exports.getStoreUserStatsSchema,
    searchStoreUsers: exports.searchStoreUsersSchema,
    transferOwnership: exports.transferOwnershipSchema
};
