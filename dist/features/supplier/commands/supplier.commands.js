"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierCommands = void 0;
const prisma_1 = require("../../../plugins/prisma");
exports.SupplierCommands = {
    async create(data) {
        // Verificar se CNPJ já existe
        const existingSupplier = await prisma_1.db.supplier.findUnique({
            where: { cnpj: data.cnpj }
        });
        if (existingSupplier) {
            throw new Error('CNPJ already exists');
        }
        return await prisma_1.db.supplier.create({
            data: {
                ...data,
                status: true
            },
            include: {
                responsibles: true,
                products: {
                    select: {
                        id: true,
                        name: true,
                        status: true
                    }
                }
            }
        });
    },
    async update(id, data) {
        // Verificar se supplier existe
        const existingSupplier = await prisma_1.db.supplier.findUnique({
            where: { id }
        });
        if (!existingSupplier) {
            throw new Error('Supplier not found');
        }
        // Se CNPJ está sendo alterado, verificar se já existe
        if (data.cnpj && data.cnpj !== existingSupplier.cnpj) {
            const cnpjExists = await prisma_1.db.supplier.findUnique({
                where: { cnpj: data.cnpj }
            });
            if (cnpjExists) {
                throw new Error('CNPJ already exists');
            }
        }
        return await prisma_1.db.supplier.update({
            where: { id },
            data,
            include: {
                responsibles: true,
                products: {
                    select: {
                        id: true,
                        name: true,
                        status: true
                    }
                }
            }
        });
    },
    async delete(id) {
        // Verificar se supplier existe
        const existingSupplier = await prisma_1.db.supplier.findUnique({
            where: { id }
        });
        if (!existingSupplier) {
            throw new Error('Supplier not found');
        }
        // Verificar se tem produtos associados
        const productsCount = await prisma_1.db.product.count({
            where: { supplierId: id }
        });
        if (productsCount > 0) {
            throw new Error('Cannot delete supplier with associated products');
        }
        return await prisma_1.db.supplier.delete({
            where: { id }
        });
    },
    async toggleStatus(id) {
        const supplier = await prisma_1.db.supplier.findUnique({
            where: { id }
        });
        if (!supplier) {
            throw new Error('Supplier not found');
        }
        return await prisma_1.db.supplier.update({
            where: { id },
            data: { status: !supplier.status },
            include: {
                responsibles: true,
                products: {
                    select: {
                        id: true,
                        name: true,
                        status: true
                    }
                }
            }
        });
    }
};
