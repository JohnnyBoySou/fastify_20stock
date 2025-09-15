import { PaginationUtils, PaginationParams } from '@/utils/pagination';
import { db } from '@/plugins/prisma';

export const StoreQueries = {
  async getById(id: string) {
    const store = await db.store.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        products: {
          select: {
            id: true,
            name: true,
            referencePrice: true,
            status: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            products: true,
            users: true
          }
        }
      }
    });

    if (!store) {
      throw new Error('Store not found');
    }

    return store;
  },

  async getByCnpj(cnpj: string) {
    const store = await db.store.findUnique({
      where: { cnpj },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            products: true,
            users: true
          }
        }
      }
    });

    if (!store) {
      throw new Error('Store not found');
    }

    return store;
  },

  async list(params: PaginationParams & {
    search?: string
    status?: boolean
    ownerId?: string
  }) {
    // Construir filtros
    const where: any = {};

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { cnpj: { contains: params.search } },
        { email: { contains: params.search, mode: 'insensitive' } }
      ];
    }

    if (params.status !== undefined) {
      where.status = params.status;
    }

    if (params.ownerId) {
      where.ownerId = params.ownerId;
    }

    // Usar o util de paginação
    const result = await PaginationUtils.paginate(db, 'store', {
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            products: true,
            users: true
          }
        }
      },
      orderBy: { id: 'desc' },
      params: {
        page: params.page,
        limit: params.limit
      },
      paginationOptions: {
        defaultPage: 1,
        defaultLimit: 10,
        maxLimit: 100
      }
    });

    // Transformar para o formato esperado
    return PaginationUtils.transformPaginationResult(
      result,
      'stores'
    );
  },

  async search(term: string, limit: number = 10) {
    return await db.store.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { cnpj: { contains: term } },
          { email: { contains: term, mode: 'insensitive' } }
        ]
      },
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            products: true
          }
        }
      }
    });
  },

  async getByOwner(ownerId: string) {
    return await db.store.findMany({
      where: { ownerId },
      orderBy: { id: 'desc' },
      include: {
        _count: {
          select: {
            products: true,
            users: true
          }
        }
      }
    });
  },

  async getActive() {
    return await db.store.findMany({
      where: { status: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        cnpj: true,
        city: true,
        state: true,
        _count: {
          select: {
            products: true
          }
        }
      }
    });
  },

  async getStats() {
    const [total, active, inactive, withProducts, withoutProducts] = await Promise.all([
      db.store.count(),
      db.store.count({ where: { status: true } }),
      db.store.count({ where: { status: false } }),
      db.store.count({
        where: {
          products: {
            some: {}
          }
        }
      }),
      db.store.count({
        where: {
          products: {
            none: {}
          }
        }
      })
    ]);

    const storesByState = await db.store.groupBy({
      by: ['state'],
      _count: { id: true },
      where: {
        state: { not: null }
      },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    });

    return {
      total,
      active,
      inactive,
      withProducts,
      withoutProducts,
      storesByState
    };
  },

  async getRecent(limit: number = 5) {
    return await db.store.findMany({
      take: limit,
      orderBy: { id: 'desc' },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            products: true
          }
        }
      }
    });
  },

  // === CONSULTAS PARA GERENCIAMENTO DE USUÁRIOS DA LOJA ===
  async getStoreUsers(storeId: string, params: {
    page?: number
    limit?: number
    search?: string
    role?: 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF'
  }) {
    // Verificar se a loja existe
    const store = await db.store.findUnique({
      where: { id: storeId }
    });

    if (!store) {
      throw new Error('Store not found');
    }

    // Construir filtros
    const where: any = {
      storeId
    };

    if (params.search) {
      where.user = {
        OR: [
          { name: { contains: params.search, mode: 'insensitive' } },
          { email: { contains: params.search, mode: 'insensitive' } }
        ]
      };
    }

    if (params.role) {
      where.role = params.role;
    }

    // Usar o util de paginação
    const result = await PaginationUtils.paginate(db, 'storeUser', {
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            lastLoginAt: true,
            createdAt: true
          }
        },
        store: {
          select: {
            id: true,
            name: true,
            cnpj: true
          }
        }
      },
      orderBy: { id: 'desc' },
      params: {
        page: params.page,
        limit: params.limit
      },
      paginationOptions: {
        defaultPage: 1,
        defaultLimit: 10,
        maxLimit: 100
      }
    });

    // Transformar para o formato esperado
    return PaginationUtils.transformPaginationResult(
      result,
      'storeUsers'
    );
  },

  async getStoreUser(storeId: string, userId: string) {
    const storeUser = await db.storeUser.findUnique({
      where: {
        storeId_userId: {
          storeId,
          userId
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            lastLoginAt: true,
            createdAt: true
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

    if (!storeUser) {
      throw new Error('User not found in this store');
    }

    return storeUser;
  },

  async getStoreUsersByRole(storeId: string, role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF') {
    return await db.storeUser.findMany({
      where: {
        storeId,
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
        }
      },
      orderBy: { id: 'desc' }
    });
  },

  async getStoreOwner(storeId: string) {
    const storeUser = await db.storeUser.findFirst({
      where: {
        storeId,
        role: 'OWNER'
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
        }
      }
    });

    if (!storeUser) {
      throw new Error('Store owner not found');
    }

    return storeUser;
  },

  async getStoreAdmins(storeId: string) {
    return await db.storeUser.findMany({
      where: {
        storeId,
        role: 'ADMIN'
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
        }
      },
      orderBy: { id: 'desc' }
    });
  },

  async getStoreManagers(storeId: string) {
    return await db.storeUser.findMany({
      where: {
        storeId,
        role: 'MANAGER'
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
        }
      },
      orderBy: { id: 'desc' }
    });
  },

  async getStoreStaff(storeId: string) {
    return await db.storeUser.findMany({
      where: {
        storeId,
        role: 'STAFF'
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
        }
      },
      orderBy: { id: 'desc' }
    });
  },

  async getStoreUserStats(storeId: string) {
    const [total, byRole, active, inactive] = await Promise.all([
      db.storeUser.count({
        where: { storeId }
      }),
      db.storeUser.groupBy({
        by: ['role'],
        where: { storeId },
        _count: { id: true }
      }),
      db.storeUser.count({
        where: {
          storeId,
          user: { status: true }
        }
      }),
      db.storeUser.count({
        where: {
          storeId,
          user: { status: false }
        }
      })
    ]);

    return {
      total,
      byRole,
      active,
      inactive
    };
  },

  async searchStoreUsers(storeId: string, searchTerm: string, limit: number = 10) {
    return await db.storeUser.findMany({
      where: {
        storeId,
        user: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } }
          ]
        }
      },
      take: limit,
      orderBy: { id: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            lastLoginAt: true
          }
        }
      }
    });
  }
};
