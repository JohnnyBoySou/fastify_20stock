import { db } from '@/plugins/prisma';
export const SupplierCommands = {
  async create(data: {
    corporateName: string
    cnpj: string
    tradeName?: string
    cep?: string
    city?: string
    state?: string
    address?: string
    storeId?: string
  }) {
    // Verificar se CNPJ já existe para esta store
    const existingSupplier = await db.supplier.findUnique({
      where: { 
        cnpj_storeId: {
          cnpj: data.cnpj,
          storeId: data.storeId || null
        }
      }
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

  async update(id: string, data: {
    corporateName?: string
    cnpj?: string
    tradeName?: string
    status?: boolean
    cep?: string
    city?: string
    state?: string
    address?: string
  }) {
    // Verificar se supplier existe
    const existingSupplier = await db.supplier.findUnique({
      where: { id }
    });

    if (!existingSupplier) {
      throw new Error('Supplier not found');
    }

    // Se CNPJ está sendo alterado, verificar se já existe para esta store
    if (data.cnpj && data.cnpj !== existingSupplier.cnpj) {
      const cnpjExists = await db.supplier.findUnique({
        where: { 
          cnpj_storeId: {
            cnpj: data.cnpj,
            storeId: existingSupplier.storeId
          }
        }
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

  async delete(id: string) {
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

  async toggleStatus(id: string) {
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
