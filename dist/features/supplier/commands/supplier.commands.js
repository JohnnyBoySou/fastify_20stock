import { db } from '../../../plugins/prisma';
export const SupplierCommands = {
    async create(data) {
        // Verificar se CNPJ já existe
        const existingSupplier = await db.supplier.findUnique({
            where: { cnpj: data.cnpj }
        });
        if (existingSupplier) {
            throw new Error('CNPJ already exists');
        }
        return await db.supplier.create({
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
        const existingSupplier = await db.supplier.findUnique({
            where: { id }
        });
        if (!existingSupplier) {
            throw new Error('Supplier not found');
        }
        // Se CNPJ está sendo alterado, verificar se já existe
        if (data.cnpj && data.cnpj !== existingSupplier.cnpj) {
            const cnpjExists = await db.supplier.findUnique({
                where: { cnpj: data.cnpj }
            });
            if (cnpjExists) {
                throw new Error('CNPJ already exists');
            }
        }
        return await db.supplier.update({
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
        const existingSupplier = await db.supplier.findUnique({
            where: { id }
        });
        if (!existingSupplier) {
            throw new Error('Supplier not found');
        }
        // Verificar se tem produtos associados
        const productsCount = await db.product.count({
            where: { supplierId: id }
        });
        if (productsCount > 0) {
            throw new Error('Cannot delete supplier with associated products');
        }
        return await db.supplier.delete({
            where: { id }
        });
    },
    async toggleStatus(id) {
        const supplier = await db.supplier.findUnique({
            where: { id }
        });
        if (!supplier) {
            throw new Error('Supplier not found');
        }
        return await db.supplier.update({
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
