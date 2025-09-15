import { db } from '@/plugins/prisma';

export const CategoryCommands = {
  async create(data: {
    name: string
    description?: string
    code?: string
    status?: boolean
    color?: string
    icon?: string
    parentId?: string
  }) {
    return await db.category.create({
      data: {
        ...data,
        status: data.status ?? true
      },
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
  },

  async update(id: string, data: {
    name?: string
    description?: string
    code?: string
    status?: boolean
    color?: string
    icon?: string
    parentId?: string
  }) {
    return await db.category.update({
      where: { id },
      data,
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
  },

  async delete(id: string) {
    return await db.category.delete({
      where: { id }
    });
  },

  async updateStatus(id: string, status: boolean) {
    return await db.category.update({
      where: { id },
      data: { status },
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
  },

  async moveToParent(id: string, parentId: string | null) {
    return await db.category.update({
      where: { id },
      data: { parentId },
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
  }
};
