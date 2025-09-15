import { db } from '@/plugins/prisma';
import { UnitOfMeasure } from '@/generated/prisma';

export const ProductCommands = {
  async create(data: {
    name: string
    description?: string
    unitOfMeasure: UnitOfMeasure
    referencePrice: number
    categoryId?: string
    supplierId?: string
    storeId: string
    stockMin: number
    stockMax: number
    alertPercentage: number
    status?: boolean
  }) {
    const { categoryId, supplierId, storeId, ...createData } = data;

    return await db.product.create({
      data: {
        ...createData,
        unitOfMeasure: createData.unitOfMeasure as UnitOfMeasure,
        status: data.status ?? true,
        ...(categoryId && { category: { connect: { id: categoryId } } }),
        ...(supplierId && { supplier: { connect: { id: supplierId } } }),
        store: { connect: { id: storeId } }
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
            code: true
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

  async update(id: string, data: {
    name?: string
    description?: string
    unitOfMeasure?: string
    referencePrice?: number
    categoryId?: string
    supplierId?: string
    storeId?: string
    stockMin?: number
    stockMax?: number
    alertPercentage?: number
    status?: boolean
  }) {
    const { categoryId, supplierId, storeId, ...updateData } = data;

    return await db.product.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.unitOfMeasure && { unitOfMeasure: updateData.unitOfMeasure as UnitOfMeasure }),
        ...(supplierId !== undefined && supplierId ? { supplier: { connect: { id: supplierId } } } : supplierId === null ? { supplier: { disconnect: true } } : {}),
        ...(storeId && { store: { connect: { id: storeId } } })
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
            code: true
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

  async delete(id: string) {
    return await db.product.delete({
      where: { id }
    });
  },

  async updateStatus(id: string, status: boolean) {
    return await db.product.update({
      where: { id },
      data: { status },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
            code: true
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
  async verifySku(productId: string, sku: string) {
    // Verificar se o produto existe
    const product = await db.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Verificar se o SKU já existe em outro produto
    const existingProduct = await db.product.findFirst({
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

  async updateStock(productId: string, quantity: number, type: 'ENTRADA' | 'SAIDA' | 'PERDA', note?: string, userId?: string) {
    // Verificar se o produto existe
    const product = await db.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Calcular novo estoque
    let newStock = 0;
    if (type === 'ENTRADA') {
      newStock = quantity; // Para entrada, adiciona a quantidade
    } else {
      newStock = -quantity; // Para saída e perda, subtrai a quantidade
    }

    // Criar movimentação
    const movement = await db.movement.create({
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

  async createMovement(productId: string, data: {
    type: 'ENTRADA' | 'SAIDA' | 'PERDA'
    quantity: number
    supplierId?: string
    batch?: string
    expiration?: string
    price?: number
    note?: string
    userId?: string
  }) {
    // Verificar se o produto existe
    const product = await db.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Verificar se o fornecedor existe (se fornecido)
    if (data.supplierId) {
      const supplier = await db.supplier.findUnique({
        where: { id: data.supplierId }
      });

      if (!supplier) {
        throw new Error('Supplier not found');
      }
    }

    // Criar movimentação
    const movement = await db.movement.create({
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

  async getProductStock(productId: string) {
    // Verificar se o produto existe
    const product = await db.product.findUnique({
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
    const movements = await db.movement.findMany({
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
      } else {
        currentStock -= movement.quantity;
      }
    });

    // Determinar status do estoque
    let status: 'OK' | 'LOW' | 'CRITICAL' | 'OVERSTOCK' = 'OK';
    const stockPercentage = (currentStock / product.stockMax) * 100;

    if (currentStock <= 0) {
      status = 'CRITICAL';
    } else if (currentStock <= product.stockMin) {
      status = 'LOW';
    } else if (currentStock > product.stockMax) {
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
  }
};
