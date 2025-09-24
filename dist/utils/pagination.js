/**
 * Utilitário para paginação de dados com Prisma
 */
export const PaginationUtils = {
    /**
     * Normaliza os parâmetros de paginação
     */
    normalizeParams(params, options = {}) {
        const { defaultPage = 1, defaultLimit = 10, maxLimit = 100 } = options;
        const page = Math.max(1, params.page || defaultPage);
        const limit = Math.min(maxLimit, Math.max(1, params.limit || defaultLimit));
        const skip = (page - 1) * limit;
        return { page, limit, skip };
    },
    /**
     * Cria o objeto de paginação com metadados
     */
    createPaginationMeta(page, limit, total) {
        const totalPages = Math.ceil(total / limit);
        return {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        };
    },
    /**
     * Executa uma consulta paginada com Prisma
     */
    async paginate(prisma, model, options) {
        const { where = {}, select, include, orderBy = { createdAt: 'desc' }, params = {}, paginationOptions = {} } = options;
        const { page, limit, skip } = this.normalizeParams(params, paginationOptions);
        // Construir query base
        const queryOptions = {
            where,
            skip,
            take: limit,
            orderBy
        };
        if (select) {
            queryOptions.select = select;
        }
        if (include) {
            queryOptions.include = include;
        }
        // Executar consultas em paralelo
        const [data, total] = await Promise.all([
            prisma[model].findMany(queryOptions),
            prisma[model].count({ where })
        ]);
        return {
            data,
            pagination: this.createPaginationMeta(page, limit, total)
        };
    },
    /**
     * Cria um helper para queries específicas com paginação
     */
    createPaginatedQuery(model, defaultOptions = {}) {
        return async (prisma, params) => {
            const { where, ...paginationParams } = params;
            return this.paginate(prisma, model, {
                ...defaultOptions,
                where: where || {},
                params: paginationParams
            });
        };
    },
    /**
     * Utilitário para transformar dados paginados em formato específico
     */
    transformPaginationResult(result, dataKey, transformer) {
        const transformedData = transformer
            ? result.data.map(transformer)
            : result.data;
        return {
            [dataKey]: transformedData,
            pagination: result.pagination
        };
    }
};
/**
 * Função helper para criar queries paginadas rapidamente
 */
export function createPaginatedQuery(model, options = {}) {
    const { select, include, orderBy = { createdAt: 'desc' }, defaultLimit = 10, maxLimit = 100 } = options;
    return async (prisma, params) => {
        return PaginationUtils.paginate(prisma, model, {
            where: params.where || {},
            select,
            include,
            orderBy,
            params: {
                page: params.page,
                limit: params.limit
            },
            paginationOptions: {
                defaultLimit,
                maxLimit
            }
        });
    };
}
/**
 * Exemplos de uso:
 *
 * // Uso básico
 * const result = await PaginationUtils.paginate(prisma, 'user', {
 *   where: { status: true },
 *   params: { page: 1, limit: 10 }
 * })
 *
 * // Com transformação
 * const result = await PaginationUtils.paginate(prisma, 'store', {
 *   where: { status: true },
 *   include: { owner: true },
 *   params: { page: 1, limit: 10 }
 * })
 *
 * const formatted = PaginationUtils.transformPaginationResult(result, 'stores')
 *
 * // Query helper
 * const getUserList = createPaginatedQuery('user', {
 *   select: { id: true, name: true, email: true },
 *   defaultLimit: 20
 * })
 *
 * const users = await getUserList(prisma, {
 *   page: 1,
 *   limit: 10,
 *   where: { status: true }
 * })
 */
