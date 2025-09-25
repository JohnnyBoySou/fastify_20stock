"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCommands = void 0;
const prisma_1 = require("../../../plugins/prisma");
exports.ProductCommands = {
    async create(data) {
        const { categoryIds, supplierId, storeId, ...createData } = data;
        // Verificar se as categorias existem
        if (categoryIds && categoryIds.length > 0) {
            const existingCategories = await prisma_1.db.category.findMany({
                where: { id: { in: categoryIds } },
                select: { id: true }
            });
            if (existingCategories.length !== categoryIds.length) {
                const foundIds = existingCategories.map(c => c.id);
                const notFoundIds = categoryIds.filter(id => !foundIds.includes(id));
                throw new Error(`Categories not found: ${notFoundIds.join(', ')}`);
            }
        }
        return await prisma_1.db.product.create({
            data: {
                ...createData,
                unitOfMeasure: createData.unitOfMeasure,
                status: data.status ?? true,
                ...(supplierId && { supplier: { connect: { id: supplierId } } }),
                store: { connect: { id: storeId } },
                ...(categoryIds && categoryIds.length > 0 && {
                    categories: {
                        create: categoryIds.map(categoryId => ({
                            category: { connect: { id: categoryId } }
                        }))
                    }
                })
            },
            include: {
                categories: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                code: true,
                                color: true,
                                icon: true
                            }
                        }
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        corporateName: true,
                        cnpj: true,
                        tradeName: true
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
    async update(id, data) {
        const { categoryIds, supplierId, storeId, ...updateData } = data;
        // Verificar se as categorias existem (se fornecidas)
        if (categoryIds && categoryIds.length > 0) {
            const existingCategories = await prisma_1.db.category.findMany({
                where: { id: { in: categoryIds } },
                select: { id: true }
            });
            if (existingCategories.length !== categoryIds.length) {
                const foundIds = existingCategories.map(c => c.id);
                const notFoundIds = categoryIds.filter(id => !foundIds.includes(id));
                throw new Error(`Categories not found: ${notFoundIds.join(', ')}`);
            }
        }
        // Se categoryIds for fornecido, atualizar as categorias
        let categoryUpdate = {};
        if (categoryIds !== undefined) {
            if (categoryIds.length === 0) {
                // Remover todas as categorias
                categoryUpdate = {
                    categories: {
                        deleteMany: {}
                    }
                };
            }
            else {
                // Substituir todas as categorias
                categoryUpdate = {
                    categories: {
                        deleteMany: {},
                        create: categoryIds.map(categoryId => ({
                            category: { connect: { id: categoryId } }
                        }))
                    }
                };
            }
        }
        return await prisma_1.db.product.update({
            where: { id },
            data: {
                ...updateData,
                ...(updateData.unitOfMeasure && { unitOfMeasure: updateData.unitOfMeasure }),
                ...(supplierId !== undefined && supplierId ? { supplier: { connect: { id: supplierId } } } : supplierId === null ? { supplier: { disconnect: true } } : {}),
                ...(storeId && { store: { connect: { id: storeId } } }),
                ...categoryUpdate
            },
            include: {
                categories: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                code: true,
                                color: true,
                                icon: true
                            }
                        }
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        corporateName: true,
                        cnpj: true,
                        tradeName: true
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
    async delete(id) {
        return await prisma_1.db.product.delete({
            where: { id }
        });
    },
    async updateStatus(id, status) {
        return await prisma_1.db.product.update({
            where: { id },
            data: { status },
            include: {
                categories: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                code: true,
                                color: true,
                                icon: true
                            }
                        }
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        corporateName: true,
                        cnpj: true,
                        tradeName: true
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
    // === FUNÇÕES ADICIONAIS DE PRODUTO ===
    async verifySku(productId, sku) {
        // Verificar se o produto existe
        const product = await prisma_1.db.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        // Verificar se o SKU já existe em outro produto
        const existingProduct = await prisma_1.db.product.findFirst({
            where: {
                id: { not: productId },
                name: sku // Assumindo que SKU é o nome do produto
            }
        });
        return {
            available: !existingProduct,
            message: existingProduct ? 'SKU already exists' : 'SKU available'
        };
    },
    async updateStock(productId, quantity, type, note, userId) {
        // Verificar se o produto existe
        const product = await prisma_1.db.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        // Calcular novo estoque
        let newStock = 0;
        if (type === 'ENTRADA') {
            newStock = quantity; // Para entrada, adiciona a quantidade
        }
        else {
            newStock = -quantity; // Para saída e perda, subtrai a quantidade
        }
        // Criar movimentação
        const movement = await prisma_1.db.movement.create({
            data: {
                type,
                quantity,
                storeId: product.storeId,
                productId,
                note,
                userId,
                balanceAfter: newStock
            },
            include: {
                supplier: {
                    select: {
                        id: true,
                        corporateName: true,
                        cnpj: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        return {
            product: {
                id: product.id,
                name: product.name,
                currentStock: newStock
            },
            movement
        };
    },
    async createMovement(productId, data) {
        // Verificar se o produto existe
        const product = await prisma_1.db.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        // Verificar se o fornecedor existe (se fornecido)
        if (data.supplierId) {
            const supplier = await prisma_1.db.supplier.findUnique({
                where: { id: data.supplierId }
            });
            if (!supplier) {
                throw new Error('Supplier not found');
            }
        }
        // Criar movimentação
        const movement = await prisma_1.db.movement.create({
            data: {
                type: data.type,
                quantity: data.quantity,
                storeId: product.storeId,
                productId,
                supplierId: data.supplierId,
                batch: data.batch,
                expiration: data.expiration ? new Date(data.expiration) : null,
                price: data.price,
                note: data.note,
                userId: data.userId,
                balanceAfter: data.quantity // Assumindo que é o estoque após a movimentação
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        unitOfMeasure: true
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        corporateName: true,
                        cnpj: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
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
        return movement;
    },
    async getProductStock(productId) {
        // Verificar se o produto existe
        const product = await prisma_1.db.product.findUnique({
            where: { id: productId },
            include: {
                movements: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        // Calcular estoque atual baseado nas movimentações
        const movements = await prisma_1.db.movement.findMany({
            where: { productId },
            select: {
                type: true,
                quantity: true
            }
        });
        let currentStock = 0;
        movements.forEach(movement => {
            if (movement.type === 'ENTRADA') {
                currentStock += movement.quantity;
            }
            else {
                currentStock -= movement.quantity;
            }
        });
        // Determinar status do estoque
        let status = 'OK';
        const stockPercentage = (currentStock / product.stockMax) * 100;
        if (currentStock <= 0) {
            status = 'CRITICAL';
        }
        else if (currentStock <= product.stockMin) {
            status = 'LOW';
        }
        else if (currentStock > product.stockMax) {
            status = 'OVERSTOCK';
        }
        return {
            id: product.id,
            name: product.name,
            currentStock,
            stockMin: product.stockMin,
            stockMax: product.stockMax,
            alertPercentage: product.alertPercentage,
            status,
            lastMovement: product.movements[0] ? {
                type: product.movements[0].type,
                quantity: product.movements[0].quantity,
                date: product.movements[0].createdAt
            } : null
        };
    },
    // === MÉTODOS PARA GERENCIAR CATEGORIAS DO PRODUTO ===
    async addCategories(productId, categoryIds) {
        // Verificar se o produto existe
        const product = await prisma_1.db.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        // Verificar se as categorias existem
        const existingCategories = await prisma_1.db.category.findMany({
            where: { id: { in: categoryIds } },
            select: { id: true }
        });
        if (existingCategories.length !== categoryIds.length) {
            const foundIds = existingCategories.map(c => c.id);
            const notFoundIds = categoryIds.filter(id => !foundIds.includes(id));
            throw new Error(`Categories not found: ${notFoundIds.join(', ')}`);
        }
        // Verificar quais categorias já estão associadas
        const existingProductCategories = await prisma_1.db.productCategory.findMany({
            where: {
                productId,
                categoryId: { in: categoryIds }
            },
            select: { categoryId: true }
        });
        const existingCategoryIds = existingProductCategories.map(pc => pc.categoryId);
        const newCategoryIds = categoryIds.filter(id => !existingCategoryIds.includes(id));
        if (newCategoryIds.length === 0) {
            throw new Error('All provided categories are already associated with this product');
        }
        // Adicionar novas categorias
        await prisma_1.db.productCategory.createMany({
            data: newCategoryIds.map(categoryId => ({
                productId,
                categoryId
            }))
        });
        // Retornar as categorias atualizadas
        const updatedCategories = await prisma_1.db.productCategory.findMany({
            where: { productId },
            select: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        code: true,
                        color: true,
                        icon: true
                    }
                }
            }
        });
        return {
            message: `${newCategoryIds.length} categories added successfully`,
            addedCount: newCategoryIds.length,
            categories: updatedCategories.map(pc => pc.category)
        };
    },
    async removeCategories(productId, categoryIds) {
        // Verificar se o produto existe
        const product = await prisma_1.db.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        // Remover as categorias
        const result = await prisma_1.db.productCategory.deleteMany({
            where: {
                productId,
                categoryId: { in: categoryIds }
            }
        });
        return {
            message: `${result.count} categories removed successfully`,
            removedCount: result.count
        };
    },
    async setCategories(productId, categoryIds) {
        // Verificar se o produto existe
        const product = await prisma_1.db.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        // Verificar se as categorias existem (se fornecidas)
        if (categoryIds.length > 0) {
            const existingCategories = await prisma_1.db.category.findMany({
                where: { id: { in: categoryIds } },
                select: { id: true }
            });
            if (existingCategories.length !== categoryIds.length) {
                const foundIds = existingCategories.map(c => c.id);
                const notFoundIds = categoryIds.filter(id => !foundIds.includes(id));
                throw new Error(`Categories not found: ${notFoundIds.join(', ')}`);
            }
        }
        // Substituir todas as categorias
        await prisma_1.db.productCategory.deleteMany({
            where: { productId }
        });
        if (categoryIds.length > 0) {
            await prisma_1.db.productCategory.createMany({
                data: categoryIds.map(categoryId => ({
                    productId,
                    categoryId
                }))
            });
        }
        // Retornar as categorias atualizadas
        const updatedCategories = await prisma_1.db.productCategory.findMany({
            where: { productId },
            select: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        code: true,
                        color: true,
                        icon: true
                    }
                }
            }
        });
        return {
            message: 'Categories updated successfully',
            categories: updatedCategories.map(pc => pc.category)
        };
    }
};
