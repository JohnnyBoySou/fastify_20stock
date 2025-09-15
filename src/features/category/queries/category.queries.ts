import { db } from '@/plugins/prisma';

export const CategoryQueries = {
  async getById(id: string) {
    return await db.category.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            description: true,
            code: true
          }
        },
        children: {
          select: {
            id: true,
            name: true,
            description: true,
            code: true,
            status: true,
            color: true,
            icon: true
          }
        },
        products: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true
          }
        },
        _count: {
          select: {
            children: true,
            products: true
          }
        }
      }
    });
  },

  async list(params: {
    page?: number
    limit?: number
    search?: string
    status?: boolean
    parentId?: string
  }) {
    const { page = 1, limit = 10, search, status, parentId } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status !== undefined) {
      where.status = status;
    }

    if (parentId !== undefined) {
      if (parentId === null) {
        where.parentId = null;
      } else {
        where.parentId = parentId;
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [items, total] = await Promise.all([
      db.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          parent: {
            select: {
              id: true,
              name: true,
              description: true,
              code: true
            }
          },
          children: {
            select: {
              id: true,
              name: true,
              description: true,
              code: true,
              status: true,
              color: true,
              icon: true
            }
          },
          products: {
            select: {
              id: true,
              name: true,
              description: true,
              status: true
            },
            take: 5
          },
          _count: {
            select: {
              children: true,
              products: true
            }
          }
        }
      }),
      db.category.count({ where })
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

  async search(term: string, limit: number = 10) {
    return await db.category.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
          { code: { contains: term, mode: 'insensitive' } }
        ]
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            description: true,
            code: true
          }
        },
        children: {
          select: {
            id: true,
            name: true,
            description: true,
            code: true,
            status: true,
            color: true,
            icon: true
          }
        },
        _count: {
          select: {
            children: true,
            products: true
          }
        }
      }
    });
  },

  async getActive() {
    return await db.category.findMany({
      where: { status: true },
      orderBy: { createdAt: 'desc' },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            description: true,
            code: true
          }
        },
        children: {
          select: {
            id: true,
            name: true,
            description: true,
            code: true,
            status: true,
            color: true,
            icon: true
          }
        },
        _count: {
          select: {
            children: true,
            products: true
          }
        }
      }
    });
  },

  async getStats() {
    const [total, active, inactive, withChildren, withoutChildren] = await Promise.all([
      db.category.count(),
      db.category.count({ where: { status: true } }),
      db.category.count({ where: { status: false } }),
      db.category.count({
        where: {
          children: { some: {} }
        }
      }),
      db.category.count({
        where: {
          children: { none: {} }
        }
      })
    ]);

    return {
      total,
      active,
      inactive,
      withChildren,
      withoutChildren
    };
  },

  async getRootCategories(status?: boolean) {
    const where: any = { parentId: null };

    if (status !== undefined) {
      where.status = status;
    }

    return await db.category.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        children: {
          select: {
            id: true,
            name: true,
            description: true,
            code: true,
            status: true,
            color: true,
            icon: true
          }
        },
        _count: {
          select: {
            children: true,
            products: true
          }
        }
      }
    });
  },

  async getChildren(parentId: string) {
    return await db.category.findMany({
      where: { parentId },
      orderBy: { createdAt: 'desc' },
      include: {
        children: {
          select: {
            id: true,
            name: true,
            description: true,
            code: true,
            status: true,
            color: true,
            icon: true
          }
        },
        products: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true
          },
          take: 5
        },
        _count: {
          select: {
            children: true,
            products: true
          }
        }
      }
    });
  },

  async getHierarchy() {
    const rootCategories = await CategoryQueries.getRootCategories();

    const buildHierarchy = async(categories: any[]) => {
      for (const category of categories) {
        category.children = await CategoryQueries.getChildren(category.id);
        if (category.children.length > 0) {
          await buildHierarchy(category.children);
        }
      }
    };

    await buildHierarchy(rootCategories);
    return rootCategories;
  },

  async getByCode(code: string) {
    return await db.category.findUnique({
      where: { code },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            description: true,
            code: true
          }
        },
        children: {
          select: {
            id: true,
            name: true,
            description: true,
            code: true,
            status: true,
            color: true,
            icon: true
          }
        },
        products: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true
          },
          take: 5
        },
        _count: {
          select: {
            children: true,
            products: true
          }
        }
      }
    });
  }
};
