import { PaginationUtils } from '../../../utils/pagination';
import { db } from '../../../plugins/prisma';
export const UserQueries = {
    async getById(id) {
        const user = await db.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                roles: true,
                status: true,
                emailVerified: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
    async getByEmail(email) {
        const user = await db.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                roles: true,
                status: true,
                emailVerified: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return user;
    },
    async getByEmailWithPassword(email) {
        const user = await db.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                name: true,
                roles: true,
                status: true,
                emailVerified: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return user;
    },
    async list(filters) {
        // Construir filtros
        const where = {};
        if (filters.search) {
            where.OR = [
                { email: { contains: filters.search, mode: 'insensitive' } },
                { name: { contains: filters.search, mode: 'insensitive' } }
            ];
        }
        if (filters.status !== undefined) {
            where.status = filters.status;
        }
        if (filters.roles && filters.roles.length > 0) {
            where.roles = {
                hasSome: filters.roles
            };
        }
        // Usar o util de paginação
        const result = await PaginationUtils.paginate(db, 'user', {
            where,
            select: {
                id: true,
                email: true,
                name: true,
                roles: true,
                status: true,
                emailVerified: true,
                lastLoginAt: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            params: {
                page: filters.page,
                limit: filters.limit
            },
            paginationOptions: {
                defaultPage: 1,
                defaultLimit: 10,
                maxLimit: 100
            }
        });
        // Transformar para o formato esperado
        return PaginationUtils.transformPaginationResult(result, 'users');
    },
    async getByRole(role) {
        const users = await db.user.findMany({
            where: {
                roles: {
                    has: role
                },
                status: true
            },
            select: {
                id: true,
                email: true,
                name: true,
                roles: true,
                status: true,
                emailVerified: true,
                lastLoginAt: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return users;
    },
    async getActive() {
        const users = await db.user.findMany({
            where: { status: true },
            select: {
                id: true,
                email: true,
                name: true,
                roles: true,
                emailVerified: true,
                lastLoginAt: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return users;
    },
    async getStats() {
        const [total, active, inactive, verified, unverified] = await Promise.all([
            db.user.count(),
            db.user.count({ where: { status: true } }),
            db.user.count({ where: { status: false } }),
            db.user.count({ where: { emailVerified: true } }),
            db.user.count({ where: { emailVerified: false } })
        ]);
        return {
            total,
            active,
            inactive,
            verified,
            unverified
        };
    },
    async checkEmailExists(email) {
        const user = await db.user.findUnique({
            where: { email },
            select: { id: true }
        });
        return !!user;
    },
    async search(searchTerm, limit = 10) {
        const users = await db.user.findMany({
            where: {
                OR: [
                    { email: { contains: searchTerm, mode: 'insensitive' } },
                    { name: { contains: searchTerm, mode: 'insensitive' } }
                ],
                status: true
            },
            select: {
                id: true,
                email: true,
                name: true,
                roles: true,
                emailVerified: true
            },
            take: limit,
            orderBy: { name: 'asc' }
        });
        return users;
    }
};
