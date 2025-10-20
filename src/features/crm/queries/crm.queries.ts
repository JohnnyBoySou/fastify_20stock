import { db } from '@/plugins/prisma'

export const CrmQueries = {
  async getById(id: string, storeId: string) {
    return await db.crmClient.findFirst({
      where: {
        id,
        storeId
      },
      include: {
        stage: true
      }
    })
  },

  async list(params: {
    page?: number
    limit?: number
    search?: string
    stageId?: string
  }, storeId: string) {
    const { page = 1, limit = 10, search, stageId } = params
    const skip = (page - 1) * limit

    const where: any = {
      storeId
    }

    if (stageId) {
      where.stageId = stageId
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { cpfCnpj: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [items, total] = await Promise.all([
      db.crmClient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          stage: true
        }
      }),
      db.crmClient.count({ where })
    ])

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  },

  async listGroupedByStage(storeId: string) {
    // Buscar todos os stages da store ordenados
    const stages = await db.crmStage.findMany({
      where: { storeId },
      orderBy: { order: 'asc' },
      include: {
        clients: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    // Buscar clientes sem stage
    const clientsWithoutStage = await db.crmClient.findMany({
      where: {
        storeId,
        stageId: null
      },
      orderBy: { createdAt: 'desc' }
    })

    // Adicionar stage virtual para clientes sem stage
    const stagesWithClients = [
      ...stages,
      {
        id: null,
        name: 'Sem Stage',
        color: '#6B7280',
        order: -1,
        clients: clientsWithoutStage
      }
    ]

    return {
      stages: stagesWithClients,
      totalClients: await db.crmClient.count({
        where: { storeId }
      })
    }
  },

  async search(term: string, limit: number = 10, storeId: string) {
    return await db.crmClient.findMany({
      where: {
        storeId,
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { email: { contains: term, mode: 'insensitive' } },
          { phone: { contains: term, mode: 'insensitive' } },
          { cpfCnpj: { contains: term, mode: 'insensitive' } },
          { company: { contains: term, mode: 'insensitive' } },
          { notes: { contains: term, mode: 'insensitive' } }
        ]
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        stage: true
      }
    })
  },

  async getStats(storeId: string) {
    const [totalClients, clientsByStage] = await Promise.all([
      db.crmClient.count({
        where: { storeId }
      }),
        db.crmStage.findMany({
        where: { storeId },
        include: {
          _count: {
            select: { clients: true }
          }
        },
        orderBy: { order: 'asc' }
      })
    ])

    const clientsWithoutStage = await db.crmClient.count({
      where: {
        storeId,
        stageId: null
      }
    })

    return {
      totalClients,
      clientsByStage: clientsByStage.map(stage => ({
        stageId: stage.id,
        stageName: stage.name,
        clientsCount: stage._count.clients
      })),
      clientsWithoutStage: clientsWithoutStage
    }
  }
}