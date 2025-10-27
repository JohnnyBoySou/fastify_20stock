import { db } from '@/plugins/prisma';
import { LLMService } from '@/services/llm';

export const MovementQueries = {
  async getById(id: string) {
    console.log('MovementQueries.getById: Searching for movement with id:', id);
    
    const movement = await db.movement.findUnique({
      where: { id },
      include: {
        store: {
          select: {
            id: true,
            name: true
          }
        },
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
            corporateName: true
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

    if (!movement) {
      console.log('MovementQueries.getById: Movement not found');
      return null;
    }

    console.log('MovementQueries.getById: Found movement with relations:', {
      id: movement.id,
      storeId: movement.storeId,
      productId: movement.productId,
      supplierId: movement.supplierId,
      userId: movement.userId,
      store: movement.store,
      product: movement.product,
      supplier: movement.supplier,
      user: movement.user
    });

    // Garantir que os objetos relacionados não sejam undefined
    const result = {
      ...movement,
      store: movement.store || null,
      product: movement.product || null,
      supplier: movement.supplier || null,
      user: movement.user || null
    };

    console.log('MovementQueries.getById: Final result:', JSON.stringify(result, null, 2));

    return result;
  },

  async list(params: {
    page?: number
    limit?: number
    search?: string
    type?: 'ENTRADA' | 'SAIDA' | 'PERDA'
    storeId?: string
    productId?: string
    supplierId?: string
    startDate?: string
    endDate?: string
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      storeId,
      productId,
      supplierId,
      startDate,
      endDate
    } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (storeId) {
      where.storeId = storeId;
    }

    if (productId) {
      where.productId = productId;
    }

    if (supplierId) {
      where.supplierId = supplierId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    if (search) {
      where.OR = [
        {
          product: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          store: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          supplier: {
            corporateName: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          batch: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          note: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    const [items, total] = await Promise.all([
      db.movement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          store: {
            select: {
              id: true,
              name: true
            }
          },
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
              corporateName: true
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
      }),
      db.movement.count({ where })
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async search(term: string, storeId: string, params: {
    page?: number
    limit?: number
  } = {}) {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where = {
      storeId,
      OR: [
        {
          product: {
            name: {
              contains: term,
              mode: 'insensitive'
            }
          }
        },
        {
          store: {
            name: {
              contains: term,
              mode: 'insensitive'
            }
          }
        },
        {
          supplier: {
            corporateName: {
              contains: term,
              mode: 'insensitive'
            }
          }
        },
        {
          batch: {
            contains: term,
            mode: 'insensitive'
          }
        }
      ]
    };

    const [items, total] = await Promise.all([
      db.movement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          store: {
            select: {
              id: true,
              name: true
            }
          },
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
              corporateName: true
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
      }),
      db.movement.count({ where })
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getByStore(storeId: string, params: {
    page?: number
    limit?: number
    type?: 'ENTRADA' | 'SAIDA' | 'PERDA'
    startDate?: string
    endDate?: string
  }) {
    const { page = 1, limit = 10, type, startDate, endDate } = params;
    const skip = (page - 1) * limit;

    const where: any = { storeId };

    if (type) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const [items, total] = await Promise.all([
      db.movement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          store: {
            select: {
              id: true,
              name: true
            }
          },
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
              corporateName: true
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
      }),
      db.movement.count({ where })
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getByProduct(productId: string, params: {
    page?: number
    limit?: number
    type?: 'ENTRADA' | 'SAIDA' | 'PERDA'
    startDate?: string
    endDate?: string
    storeId?: string
  }) {
    const { page = 1, limit = 10, type, startDate, endDate, storeId } = params;
    const skip = (page - 1) * limit;

    const where: any = { productId };
    
    if (storeId) {
      where.storeId = storeId;
    }

    if (type) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const [items, total] = await Promise.all([
      db.movement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          store: {
            select: {
              id: true,
              name: true
            }
          },
          supplier: {
            select: {
              id: true,
              corporateName: true
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
      }),
      db.movement.count({ where })
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getBySupplier(supplierId: string, params: {
    page?: number
    limit?: number
    type?: 'ENTRADA' | 'SAIDA' | 'PERDA'
    startDate?: string
    endDate?: string
  }) {
    const { page = 1, limit = 10, type, startDate, endDate } = params;
    const skip = (page - 1) * limit;

    const where: any = { supplierId };

    if (type) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const [items, total] = await Promise.all([
      db.movement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          store: {
            select: {
              id: true,
              name: true
            }
          },
          product: {
            select: {
              id: true,
              name: true,
              unitOfMeasure: true
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
      }),
      db.movement.count({ where })
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getStockHistory(productId: string, storeId: string, params: {
    startDate?: string
    endDate?: string
  }) {
    const { startDate, endDate } = params;

    const where: any = { productId, storeId };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    return await db.movement.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        type: true,
        quantity: true,
        balanceAfter: true,
        createdAt: true,
        batch: true,
        price: true,
        note: true,
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  },

  async getCurrentStock(productId: string, storeId: string) {
    const movements = await db.movement.findMany({
      where: {
        productId,
        storeId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    let stock = 0;
    for (const movement of movements) {
      if (movement.type === 'ENTRADA') {
        stock += movement.quantity;
      } else if (movement.type === 'SAIDA' || movement.type === 'PERDA') {
        stock -= movement.quantity;
      }
    }

    return Math.max(0, stock);
  },

  async getStats() {
    const [
      total,
      entrada,
      saida,
      perda,
      totalValue,
      averageValue,
      _byType,
      byStore,
      byProduct,
      bySupplier
    ] = await Promise.all([
      db.movement.count(),
      db.movement.count({ where: { type: 'ENTRADA' } }),
      db.movement.count({ where: { type: 'SAIDA' } }),
      db.movement.count({ where: { type: 'PERDA' } }),
      db.movement.aggregate({
        _sum: {
          price: true
        }
      }),
      db.movement.aggregate({
        _avg: {
          price: true
        }
      }),
      db.movement.groupBy({
        by: ['type'],
        _count: {
          id: true
        }
      }),
      db.movement.groupBy({
        by: ['storeId'],
        _count: {
          id: true
        },
        _sum: {
          price: true
        }
      }),
      db.movement.groupBy({
        by: ['productId'],
        _count: {
          id: true
        },
        _sum: {
          quantity: true
        }
      }),
      db.movement.groupBy({
        by: ['supplierId'],
        _count: {
          id: true
        },
        _sum: {
          price: true
        },
        where: {
          supplierId: {
            not: null
          }
        }
      })
    ]);

    // Buscar nomes das entidades relacionadas
    const storeIds = byStore.map(item => item.storeId);
    const productIds = byProduct.map(item => item.productId);
    const supplierIds = bySupplier.map(item => item.supplierId).filter(Boolean);

    const [stores, products, suppliers] = await Promise.all([
      storeIds.length > 0 ? db.store.findMany({
        where: { id: { in: storeIds } },
        select: { id: true, name: true }
      }) : [],
      productIds.length > 0 ? db.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true }
      }) : [],
      supplierIds.length > 0 ? db.supplier.findMany({
        where: { id: { in: supplierIds } },
        select: { id: true, corporateName: true }
      }) : []
    ]);

    const storeMap = new Map(stores.map(store => [store.id, store.name] as [string, string]));
    const productMap = new Map(products.map(product => [product.id, product.name] as [string, string]));
    const supplierMap = new Map(suppliers.map(supplier => [supplier.id, supplier.corporateName] as [string, string]));

    return {
      total,
      entrada,
      saida,
      perda,
      totalValue: totalValue._sum.price || 0,
      averageValue: averageValue._avg.price || 0,
      byType: {
        ENTRADA: entrada,
        SAIDA: saida,
        PERDA: perda
      },
      byStore: byStore.map(item => ({
        storeId: item.storeId!,
        storeName: storeMap.get(item.storeId) || 'Unknown',
        count: item._count.id,
        totalValue: item._sum.price || 0
      })),
      byProduct: byProduct.map(item => ({
        productId: item.productId!,
        productName: productMap.get(item.productId) || 'Unknown',
        count: item._count.id,
        totalQuantity: item._sum.quantity || 0
      })),
      bySupplier: bySupplier.map(item => ({
        supplierId: item.supplierId!,
        supplierName: supplierMap.get(item.supplierId!) || 'Unknown',
        count: item._count.id,
        totalValue: item._sum.price || 0
      }))
    };
  },

  async getLowStockProducts(storeId?: string) {
    const where: any = {};
    if (storeId) {
      where.storeId = storeId;
    }

    const products = await db.product.findMany({
      where: {
        ...where,
        status: true
      },
      include: {
        movements: {
          where: {
            storeId: storeId || undefined
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        store: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const lowStockProducts = [];

    for (const product of products) {
      const currentStock = await MovementQueries.getCurrentStock(product.id, product.storeId);
      const alertThreshold = Math.floor((product.stockMin * product.alertPercentage) / 100);

      if (currentStock <= alertThreshold) {
        lowStockProducts.push({
          product: {
            id: product.id,
            name: product.name,
            unitOfMeasure: product.unitOfMeasure
          },
          store: product.store,
          currentStock,
          stockMin: product.stockMin,
          stockMax: product.stockMax,
          alertThreshold,
          status: currentStock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK'
        });
      }
    }

    return lowStockProducts.sort((a, b) => a.currentStock - b.currentStock);
  },

  // === FUNÇÕES ADICIONAIS DE MOVIMENTAÇÃO ===
  async getMovementReport(params: {
    storeId?: string
    productId?: string
    supplierId?: string
    type?: 'ENTRADA' | 'SAIDA' | 'PERDA'
    startDate?: string
    endDate?: string
    groupBy?: 'day' | 'week' | 'month' | 'year'
  }) {
    // Implementação básica do relatório de movimentação
    const { storeId, productId, supplierId, type, startDate, endDate } = params;

    const where: any = {};
    if (storeId) where.storeId = storeId;
    if (productId) where.productId = productId;
    if (supplierId) where.supplierId = supplierId;
    if (type) where.type = type;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const movements = await db.movement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        store: { select: { id: true, name: true } },
        product: { select: { id: true, name: true, unitOfMeasure: true } },
        supplier: { select: { id: true, corporateName: true } },
        user: { select: { id: true, name: true, email: true } }
      }
    });

    return {
      movements,
      summary: {
        total: movements.length,
        totalValue: movements.reduce((sum, m) => sum + (Number(m.price) || 0), 0),
        byType: movements.reduce((acc, m) => {
          acc[m.type] = (acc[m.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }
    };
  },

  async getVerifiedMovements(params: {
    page?: number
    limit?: number
    storeId?: string
    verified?: boolean
    startDate?: string
    endDate?: string
  }) {
    const { page = 1, limit = 10, storeId, verified, startDate, endDate } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (storeId) where.storeId = storeId;
    if (verified !== undefined) where.verified = verified;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [items, total] = await Promise.all([
      db.movement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          store: {
            select: {
              id: true,
              name: true
            }
          },
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
              corporateName: true
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
      }),
      db.movement.count({ where })
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getCancelledMovements(params: {
    page?: number
    limit?: number
    storeId?: string
    startDate?: string
    endDate?: string
  }) {
    const { page = 1, limit = 10, storeId, startDate, endDate } = params;
    const skip = (page - 1) * limit;

    const where: any = { cancelled: true };

    if (storeId) where.storeId = storeId;
    if (startDate || endDate) {
      where.cancelledAt = {};
      if (startDate) where.cancelledAt.gte = new Date(startDate);
      if (endDate) where.cancelledAt.lte = new Date(endDate);
    }

    const [items, total] = await Promise.all([
      db.movement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { cancelledAt: 'desc' },
        include: {
          store: {
            select: {
              id: true,
              name: true
            }
          },
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
              corporateName: true
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
      }),
      db.movement.count({ where })
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getMovementAnalytics(params: {
    storeId?: string
    productId?: string
    supplierId?: string
    startDate?: string
    endDate?: string
  }) {
    const { storeId, productId, supplierId, startDate, endDate } = params;

    const where: any = {};

    if (storeId) where.storeId = storeId;
    if (productId) where.productId = productId;
    if (supplierId) where.supplierId = supplierId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [
      totalMovements,
      totalValue,
      averageValue,
      byType,
      byMonth,
      byStore,
      byProduct,
      bySupplier,
      verifiedCount,
      cancelledCount
    ] = await Promise.all([
      db.movement.count({ where }),
      db.movement.aggregate({
        where,
        _sum: { price: true }
      }),
      db.movement.aggregate({
        where,
        _avg: { price: true }
      }),
      db.movement.groupBy({
        by: ['type'],
        where,
        _count: { id: true },
        _sum: { quantity: true, price: true }
      }),
      db.movement.groupBy({
        by: ['createdAt'],
        where,
        _count: { id: true },
        _sum: { price: true },
        orderBy: { createdAt: 'asc' }
      }),
      db.movement.groupBy({
        by: ['storeId'],
        where,
        _count: { id: true },
        _sum: { price: true }
      }),
      db.movement.groupBy({
        by: ['productId'],
        where,
        _count: { id: true },
        _sum: { quantity: true, price: true }
      }),
      db.movement.groupBy({
        by: ['supplierId'],
        where: { ...where, supplierId: { not: null } },
        _count: { id: true },
        _sum: { price: true }
      }),
      db.movement.count({ where: { ...where, verified: true } }),
      db.movement.count({ where: { ...where, cancelled: true } })
    ]);

    // Buscar nomes das entidades
    const storeIds = byStore.map(item => item.storeId);
    const productIds = byProduct.map(item => item.productId);
    const supplierIds = bySupplier.map(item => item.supplierId).filter(Boolean);

    const [stores, products, suppliers] = await Promise.all([
      storeIds.length > 0 ? db.store.findMany({
        where: { id: { in: storeIds } },
        select: { id: true, name: true }
      }) : [],
      productIds.length > 0 ? db.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true }
      }) : [],
      supplierIds.length > 0 ? db.supplier.findMany({
        where: { id: { in: supplierIds } },
        select: { id: true, corporateName: true }
      }) : []
    ]);

    const storeMap = new Map(stores.map(store => [store.id, store.name] as [string, string]));
    const productMap = new Map(products.map((product: { id: string; name: string; }) => [product.id, product.name] as [string, string]));
    const supplierMap = new Map(suppliers.map(supplier => [supplier.id, supplier.corporateName] as [string, string]));

    return {
      summary: {
        totalMovements,
        totalValue: totalValue._sum.price || 0,
        averageValue: averageValue._avg.price || 0,
        verifiedCount,
        cancelledCount,
        verificationRate: totalMovements > 0 ? (verifiedCount / totalMovements) * 100 : 0,
        cancellationRate: totalMovements > 0 ? (cancelledCount / totalMovements) * 100 : 0
      },
      byType: byType.map(item => ({
        type: item.type,
        count: item._count.id,
        quantity: item._sum.quantity || 0,
        value: item._sum.price || 0
      })),
      byMonth: byMonth.map(item => ({
        month: item.createdAt.toISOString().substring(0, 7),
        count: item._count.id,
        value: item._sum.price || 0
      })),
      byStore: byStore.map(item => ({
        storeId: item.storeId,
        storeName: storeMap.get(item.storeId) || 'Unknown',
        count: item._count.id,
        value: item._sum.price || 0
      })),
      byProduct: byProduct.map(item => ({
        productId: item.productId,
        productName: productMap.get(item.productId) || 'Unknown',
        count: item._count.id,
        quantity: item._sum.quantity || 0,
        value: item._sum.price || 0
      })),
      bySupplier: bySupplier.map(item => ({
        supplierId: item.supplierId,
        supplierName: supplierMap.get(item.supplierId!) || 'Unknown',
        count: item._count.id,
        value: item._sum.price || 0
      }))
    };
  },

  async summarize() {
    const movements = await db.movement.findMany();
    const summary = movements
      .map(
        (m) =>
          `Produto: ${m.productId}, Tipo: ${m.type}, Quantidade: ${m.quantity}`
      )
      .join("\n");

    const prompt = `
    Olá! Sou o gerente do estoque e preciso de uma análise amigável sobre as movimentações de hoje.
      
      Analise os dados abaixo e me conte como está nosso estoque de forma conversacional e humanizada.
      Quero entender o que está acontecendo sem muito jargão técnico. Me fale sobre:
      - O que mais está entrando e saindo
      - Se temos algum problema com perdas
      - Como está a demanda geral
      - Alguma observação importante que devo saber
 
    ${summary}`;

    const result = LLMService.executePrompt(prompt);

    return result;
  },

  /*
  Resumo gerado pelo LLM:
  Olá, eu analisei os dados do seu estoque de hoje e aqui está uma resumida:

- Entradas mais comuns: Notebook Dell Inspiron 15 3000 (25 unidades), SSD NVMe 
1TB Kingston (30 unidades) e Smartphone Samsung Galaxy A54 (40 unidades). Esses 
itens estão entrando em grande quantidade, indicando uma alta demanda.

- Saídas mais comuns: Monitor Samsung 24" Full HD (12 unidades), Memória RAM 
DDR4 16GB Corsair (18 unidades) e Fone Bluetooth JBL Tune 500BT (22 unidades). 
Esses itens estão sendo vendidos em grande quantidade, indicando uma alta demanda.

- Perdas: Cabo HDMI Premium 2m (3 unidades), Carregador USB-C 65W Universal (1 
unidade) e Webcam Logitech C920 HD Pro (2 unidades). Esses itens estão sendo 
perdidos, o que pode ser causado por erros de inventário ou falhas no produto.

- Observação importante: O estoque de Memória RAM DDR4 16GB Corsair está 
sendo vendido em grande quantidade e também está entrando em pequena quantidade. 
Isso indica que a demanda pode estar ultrapassando a oferta, o que pode causar 
problemas no futuro se não for feito alguma ação para aumentar a quantidade 
disponível.

- Demanda geral: A demanda geral parece ser alta, com muitos itens entrando e 
saídas em grande quantidade. Isso é um bom sinal para o negócio, mas precisa 
ser monitorado de forma regular para evitar problemas no futuro.

Espero que essa análise ajude a entender melhor o que está acontecendo com seu 
estoque hoje!
  */



  async getProductSummary(productId: string, params: {
    startDate?: string
    endDate?: string
    storeId?: string
  }) {
    const { startDate, endDate, storeId } = params;

    // Buscar informações do produto
    const product = await db.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        unitOfMeasure: true,
        stockMin: true,
        stockMax: true,
        alertPercentage: true
      }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Construir filtros para as movimentações
    const where: any = { productId };

    if (storeId) {
      where.storeId = storeId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Buscar todas as movimentações do produto
    const movements = await db.movement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        store: {
          select: {
            id: true,
            name: true
          }
        },
        supplier: {
          select: {
            id: true,
            corporateName: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Calcular estatísticas
    const totalMovements = movements.length;
    const entradaMovements = movements.filter(m => m.type === 'ENTRADA');
    const saidaMovements = movements.filter(m => m.type === 'SAIDA');
    const perdaMovements = movements.filter(m => m.type === 'PERDA');

    const totalEntrada = entradaMovements.reduce((sum, m) => sum + m.quantity, 0);
    const totalSaida = saidaMovements.reduce((sum, m) => sum + m.quantity, 0);
    const totalPerda = perdaMovements.reduce((sum, m) => sum + m.quantity, 0);

    const totalValue = movements.reduce((sum, m) => sum + (Number(m.price) || 0), 0);
    const averageValue = totalMovements > 0 ? totalValue / totalMovements : 0;

    // Calcular estoque atual por loja
    const stores = [...new Set(movements.map(m => m.storeId))];
    const currentStockByStore = await Promise.all(
      stores.map(async (storeId) => {
        const currentStock = await MovementQueries.getCurrentStock(productId, storeId);
        const store = movements.find(m => m.storeId === storeId)?.store;
        return {
          storeId,
          storeName: store?.name || 'Unknown',
          currentStock
        };
      })
    );

    // Gerar resumo com LLM
    const movementsSummary = movements
      .slice(0, 20) // Limitar a 20 movimentações mais recentes para o prompt
      .map(m =>
        `Data: ${m.createdAt.toISOString().split('T')[0]}, ` +
        `Tipo: ${m.type}, ` +
        `Quantidade: ${m.quantity} ${product.unitOfMeasure}, ` +
        `Loja: ${m.store.name}, ` +
        `Preço: R$ ${Number(m.price || 0).toFixed(2)}, ` +
        `Lote: ${m.batch || 'N/A'}`
      )
      .join('\n');

    const prompt = `
      Você é um especialista em análise de estoque. Analise as movimentações do produto "${product.name}" e gere um resumo executivo em português.

      INFORMAÇÕES DO PRODUTO:
      - Nome: ${product.name}
      - Unidade: ${product.unitOfMeasure}
      - Estoque Mínimo: ${product.stockMin}
      - Estoque Máximo: ${product.stockMax}
      - Percentual de Alerta: ${product.alertPercentage}%

      ESTATÍSTICAS GERAIS:
      - Total de Movimentações: ${totalMovements}
      - Entradas: ${entradaMovements.length} (${totalEntrada} ${product.unitOfMeasure})
      - Saídas: ${saidaMovements.length} (${totalSaida} ${product.unitOfMeasure})
      - Perdas: ${perdaMovements.length} (${totalPerda} ${product.unitOfMeasure})
      - Valor Total: R$ ${totalValue.toFixed(2)}
      - Valor Médio por Movimentação: R$ ${averageValue.toFixed(2)}

      ESTOQUE ATUAL POR LOJA:
      ${currentStockByStore.map(s => `- ${s.storeName}: ${s.currentStock} ${product.unitOfMeasure}`).join('\n')}

      MOVIMENTAÇÕES RECENTES:
      ${movementsSummary}

      Gere um resumo executivo destacando:
      1. Situação atual do estoque
      2. Tendências de movimentação
      3. Alertas importantes (estoque baixo, perdas, etc.)
      4. Recomendações de ação
    `;

    const llmSummary = await LLMService.executePrompt(prompt);

    return {
      product: {
        id: product.id,
        name: product.name,
        unitOfMeasure: product.unitOfMeasure,
        stockMin: product.stockMin,
        stockMax: product.stockMax,
        alertPercentage: product.alertPercentage
      },
      period: {
        startDate: startDate || null,
        endDate: endDate || null,
        storeId: storeId || null
      },
      statistics: {
        totalMovements,
        entrada: {
          count: entradaMovements.length,
          quantity: totalEntrada
        },
        saida: {
          count: saidaMovements.length,
          quantity: totalSaida
        },
        perda: {
          count: perdaMovements.length,
          quantity: totalPerda
        },
        totalValue,
        averageValue
      },
      currentStockByStore,
      recentMovements: movements.slice(0, 10).map(m => ({
        id: m.id,
        type: m.type,
        quantity: m.quantity,
        price: m.price,
        batch: m.batch,
        createdAt: m.createdAt,
        store: m.store,
        supplier: m.supplier,
        user: m.user
      })),
      summary: llmSummary
    };
  }
};
