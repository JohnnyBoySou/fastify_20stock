"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreCommands = void 0;
const prisma_1 = require("@/plugins/prisma");
exports.StoreCommands = {
    async create(data) {
        // Check if CNPJ already exists
        const existingStore = await prisma_1.db.store.findUnique({
            where: { cnpj: data.cnpj }
        });
        if (existingStore) {
            throw new Error('CNPJ already exists');
        }
        // Check if owner exists
        const owner = await prisma_1.db.user.findUnique({
            where: { id: data.ownerId }
        });
        if (!owner) {
            throw new Error('Owner not found');
        }
        return await prisma_1.db.store.create({
            data: {
                ownerId: data.ownerId,
                name: data.name,
                cnpj: data.cnpj,
                email: data.email || null,
                phone: data.phone || null,
                cep: data.cep || null,
                city: data.city || null,
                state: data.state || null,
                address: data.address || null,
                status: data.status !== undefined ? data.status : true
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    },
    async update(id, data) {
        // Check if store exists
        const existingStore = await prisma_1.db.store.findUnique({
            where: { id }
        });
        if (!existingStore) {
            throw new Error('Store not found');
        }
        // If updating CNPJ, check if it already exists
        if (data.cnpj && data.cnpj !== existingStore.cnpj) {
            const cnpjExists = await prisma_1.db.store.findUnique({
                where: { cnpj: data.cnpj }
            });
            if (cnpjExists) {
                throw new Error('CNPJ already exists');
            }
        }
        return await prisma_1.db.store.update({
            where: { id },
            data: {
                ...data,
                email: data.email === '' ? null : data.email,
                phone: data.phone === '' ? null : data.phone,
                cep: data.cep === '' ? null : data.cep,
                city: data.city === '' ? null : data.city,
                state: data.state === '' ? null : data.state,
                address: data.address === '' ? null : data.address
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    },
    async delete(id) {
        // Check if store exists
        const existingStore = await prisma_1.db.store.findUnique({
            where: { id }
        });
        if (!existingStore) {
            throw new Error('Store not found');
        }
        // Check if store has products
        const productCount = await prisma_1.db.product.count({
            where: { storeId: id }
        });
        if (productCount > 0) {
            throw new Error('Cannot delete store with existing products');
        }
        return await prisma_1.db.store.delete({
            where: { id }
        });
    },
    async toggleStatus(id) {
        const store = await prisma_1.db.store.findUnique({
            where: { id }
        });
        if (!store) {
            throw new Error('Store not found');
        }
        return await prisma_1.db.store.update({
            where: { id },
            data: { status: !store.status },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    },
    async verifyCnpj(cnpj) {
        const store = await prisma_1.db.store.findUnique({
            where: { cnpj }
        });
        return {
            exists: !!store,
            store: store ? {
                id: store.id,
                name: store.name,
                status: store.status
            } : null
        };
    },
    // === GERENCIAMENTO DE USUÁRIOS DA LOJA ===
    async addUser(storeId, userId, role) {
        // Verificar se a loja existe
        const store = await prisma_1.db.store.findUnique({
            where: { id: storeId }
        });
        if (!store) {
            throw new Error('Store not found');
        }
        // Verificar se o usuário existe
        const user = await prisma_1.db.user.findUnique({
            where: { id: userId, status: true }
        });
        if (!user) {
            throw new Error('User not found or inactive');
        }
        // Verificar se o usuário já está na loja
        const existingStoreUser = await prisma_1.db.storeUser.findUnique({
            where: {
                storeId_userId: {
                    storeId,
                    userId
                }
            }
        });
        if (existingStoreUser) {
            throw new Error('User already exists in this store');
        }
        // Adicionar usuário à loja
        return await prisma_1.db.storeUser.create({
            data: {
                storeId,
                userId,
                role
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        status: true,
                        lastLoginAt: true
                    }
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        cnpj: true
                    }
                }
            }
        });
    },
    async removeUser(storeId, userId) {
        // Verificar se a loja existe
        const store = await prisma_1.db.store.findUnique({
            where: { id: storeId }
        });
        if (!store) {
            throw new Error('Store not found');
        }
        // Verificar se o usuário está na loja
        const storeUser = await prisma_1.db.storeUser.findUnique({
            where: {
                storeId_userId: {
                    storeId,
                    userId
                }
            }
        });
        if (!storeUser) {
            throw new Error('User not found in this store');
        }
        // Não permitir remover o dono da loja
        if (storeUser.role === 'OWNER') {
            throw new Error('Cannot remove store owner');
        }
        // Remover usuário da loja
        return await prisma_1.db.storeUser.delete({
            where: {
                storeId_userId: {
                    storeId,
                    userId
                }
            }
        });
    },
    async updateUserRole(storeId, userId, newRole) {
        // Verificar se a loja existe
        const store = await prisma_1.db.store.findUnique({
            where: { id: storeId }
        });
        if (!store) {
            throw new Error('Store not found');
        }
        // Verificar se o usuário está na loja
        const storeUser = await prisma_1.db.storeUser.findUnique({
            where: {
                storeId_userId: {
                    storeId,
                    userId
                }
            }
        });
        if (!storeUser) {
            throw new Error('User not found in this store');
        }
        // Não permitir alterar role do dono da loja
        if (storeUser.role === 'OWNER') {
            throw new Error('Cannot change store owner role');
        }
        // Atualizar role do usuário
        return await prisma_1.db.storeUser.update({
            where: {
                storeId_userId: {
                    storeId,
                    userId
                }
            },
            data: {
                role: newRole
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        status: true,
                        lastLoginAt: true
                    }
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        cnpj: true
                    }
                }
            }
        });
    },
    async transferOwnership(storeId, newOwnerId) {
        // Verificar se a loja existe
        const store = await prisma_1.db.store.findUnique({
            where: { id: storeId }
        });
        if (!store) {
            throw new Error('Store not found');
        }
        // Verificar se o novo dono existe
        const newOwner = await prisma_1.db.user.findUnique({
            where: { id: newOwnerId, status: true }
        });
        if (!newOwner) {
            throw new Error('New owner not found or inactive');
        }
        // Verificar se o novo dono já está na loja
        const existingStoreUser = await prisma_1.db.storeUser.findUnique({
            where: {
                storeId_userId: {
                    storeId,
                    userId: newOwnerId
                }
            }
        });
        // Se o usuário não está na loja, adicionar como OWNER
        if (!existingStoreUser) {
            await prisma_1.db.storeUser.create({
                data: {
                    storeId,
                    userId: newOwnerId,
                    role: 'OWNER'
                }
            });
        }
        else {
            // Se já está na loja, atualizar para OWNER
            await prisma_1.db.storeUser.update({
                where: {
                    storeId_userId: {
                        storeId,
                        userId: newOwnerId
                    }
                },
                data: {
                    role: 'OWNER'
                }
            });
        }
        // Atualizar o ownerId da loja
        return await prisma_1.db.store.update({
            where: { id: storeId },
            data: {
                ownerId: newOwnerId
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    }
};
