"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryQueries = void 0;
const prisma_1 = require("../../../plugins/prisma");
exports.CategoryQueries = {
    async getById(id) {
        return await prisma_1.db.category.findUnique({
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
                        product: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                status: true
                            }
                        }
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
    async list(params) {
        const { page = 1, limit = 10, search, status, parentId } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (status !== undefined) {
            where.status = status;
        }
        if (parentId !== undefined) {
            if (parentId === null) {
                where.parentId = null;
            }
            else {
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
            prisma_1.db.category.findMany({
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
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                    status: true
                                }
                            }
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
            prisma_1.db.category.count({ where })
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
    async search(term, limit = 10) {
        return await prisma_1.db.category.findMany({
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
        return await prisma_1.db.category.findMany({
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
            prisma_1.db.category.count(),
            prisma_1.db.category.count({ where: { status: true } }),
            prisma_1.db.category.count({ where: { status: false } }),
            prisma_1.db.category.count({
                where: {
                    children: { some: {} }
                }
            }),
            prisma_1.db.category.count({
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
    async getRootCategories(status) {
        const where = { parentId: null };
        if (status !== undefined) {
            where.status = status;
        }
        return await prisma_1.db.category.findMany({
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
    async getChildren(parentId) {
        return await prisma_1.db.category.findMany({
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
                        product: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                status: true
                            }
                        }
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
        const rootCategories = await exports.CategoryQueries.getRootCategories();
        const buildHierarchy = async (categories) => {
            for (const category of categories) {
                category.children = await exports.CategoryQueries.getChildren(category.id);
                if (category.children.length > 0) {
                    await buildHierarchy(category.children);
                }
            }
        };
        await buildHierarchy(rootCategories);
        return rootCategories;
    },
    async getByCode(code) {
        return await prisma_1.db.category.findUnique({
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
                        product: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                status: true
                            }
                        }
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
