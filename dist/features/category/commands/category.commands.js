import { db } from '../../../plugins/prisma';
export const CategoryCommands = {
    async create(data) {
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
                    include: {
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
    async update(id, data) {
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
                    include: {
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
    async delete(id) {
        return await db.category.delete({
            where: { id }
        });
    },
    async updateStatus(id, status) {
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
                    include: {
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
    async moveToParent(id, parentId) {
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
