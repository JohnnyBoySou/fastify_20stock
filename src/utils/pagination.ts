export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface PaginationOptions {
  defaultPage?: number
  defaultLimit?: number
  maxLimit?: number
}

/**
 * Utilitário para paginação de dados com Prisma
 */
export const PaginationUtils = {
  /**
   * Normaliza os parâmetros de paginação
   */
  normalizeParams(
    params: PaginationParams,
    options: PaginationOptions = {}
  ): {
    page: number
    limit: number
    skip: number
  } {
    const { defaultPage = 1, defaultLimit = 10, maxLimit = 100 } = options

    const page = Math.max(1, params.page || defaultPage)
    const limit = Math.min(maxLimit, Math.max(1, params.limit || defaultLimit))
    const skip = (page - 1) * limit

    return { page, limit, skip }
  },

  /**
   * Cria o objeto de paginação com metadados
   */
  createPaginationMeta(page: number, limit: number, total: number) {
    const totalPages = Math.ceil(total / limit)

    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }
  },

  /**
   * Executa uma consulta paginada com Prisma
   */
  async paginate<T>(
    prisma: any,
    model: string,
    options: {
      where?: any
      select?: any
      include?: any
      orderBy?: any
      params?: PaginationParams
      paginationOptions?: PaginationOptions
    }
  ): Promise<PaginationResult<T>> {
    const {
      where = {},
      select,
      include,
      orderBy = { createdAt: 'desc' },
      params = {},
      paginationOptions = {},
    } = options

    const { page, limit, skip } = this.normalizeParams(params, paginationOptions)

    // Construir query base
    const queryOptions: any = {
      where,
      skip,
      take: limit,
      orderBy,
    }

    if (select) {
      queryOptions.select = select
    }

    if (include) {
      queryOptions.include = include
    }

    // Executar consultas em paralelo
    const [data, total] = await Promise.all([
      prisma[model].findMany(queryOptions),
      prisma[model].count({ where }),
    ])

    return {
      data,
      pagination: this.createPaginationMeta(page, limit, total),
    }
  },

  /**
   * Cria um helper para queries específicas com paginação
   */
  createPaginatedQuery<T>(
    model: string,
    defaultOptions: {
      select?: any
      include?: any
      orderBy?: any
      paginationOptions?: PaginationOptions
    } = {}
  ) {
    return async (
      prisma: any,
      params: PaginationParams & { where?: any }
    ): Promise<PaginationResult<T>> => {
      const { where, ...paginationParams } = params

      return this.paginate(prisma, model, {
        ...defaultOptions,
        where: where || {},
        params: paginationParams,
      })
    }
  },

  /**
   * Utilitário para transformar dados paginados em formato específico
   */
  transformPaginationResult<T, R = T>(
    result: PaginationResult<T>,
    dataKey: string,
    transformer?: (item: T) => R
  ): any {
    const transformedData = transformer
      ? result.data.map(transformer)
      : (result.data as unknown as R[])

    return {
      [dataKey]: transformedData,
      pagination: result.pagination,
    }
  },
}

/**
 * Função helper para criar queries paginadas rapidamente
 */
export function createPaginatedQuery<T>(
  model: string,
  options: {
    select?: any
    include?: any
    orderBy?: any
    defaultLimit?: number
    maxLimit?: number
  } = {}
) {
  const {
    select,
    include,
    orderBy = { createdAt: 'desc' },
    defaultLimit = 10,
    maxLimit = 100,
  } = options

  return async (
    prisma: any,
    params: PaginationParams & { where?: any }
  ): Promise<PaginationResult<T>> => {
    return PaginationUtils.paginate(prisma, model, {
      where: params.where || {},
      select,
      include,
      orderBy,
      params: {
        page: params.page,
        limit: params.limit,
      },
      paginationOptions: {
        defaultLimit,
        maxLimit,
      },
    })
  }
}

/**
 * Tipos de resposta padronizados para APIs
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface PaginatedListResponse<T> {
  [key: string]:
    | T[]
    | {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
      }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
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
