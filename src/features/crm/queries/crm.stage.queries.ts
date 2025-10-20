import { db } from '@/plugins/prisma'

export const CrmStageQueries = {
  async getById(id: string, storeId: string) {
    return await db.crmStage.findFirst({
      where: {
        id,
        storeId
      },
      include: {
        _count: {
          select: { clients: true }
        }
      }
    })
  },

  async list(storeId: string,) {
    return await db.crmStage.findMany({
      where: { storeId },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { clients: true }
        }
      }
    })
  },

  async getNextOrder(storeId: string) {
    const lastStage = await db.crmStage.findFirst({
      where: { storeId },
      orderBy: { order: 'desc' }
    })

    return lastStage ? lastStage.order + 1 : 1
  },

  async getStats(storeId: string) {
    const [totalStages, stagesWithClients] = await Promise.all([
      db.crmStage.count({
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

    const totalClients = stagesWithClients.reduce((sum, stage) => sum + stage._count.clients, 0)

    return {
      totalStages,
      totalClients,
      stagesWithClients: stagesWithClients.map(stage => ({
        id: stage.id,
        name: stage.name,
        color: stage.color,
        order: stage.order,
        clientsCount: stage._count.clients
      }))
    }
  }
}