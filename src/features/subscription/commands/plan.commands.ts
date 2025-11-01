import { db } from '@/plugins/prisma'
import type { PlanInterval } from '../plan.interfaces'

export const PlanCommands = {
  async create(data: {
    name: string
    description?: string
    price: number
    interval: PlanInterval
    features?: any
  }) {
    // Verificar se já existe um plano com o mesmo nome
    const existingPlan = await db.plan.findFirst({
      where: { name: data.name },
    })

    if (existingPlan) {
      throw new Error('Plan with this name already exists')
    }

    return await db.plan.create({
      data: {
        ...data,
        interval: data.interval,
      },
      include: {
        customers: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
    })
  },

  async update(
    id: string,
    data: {
      name?: string
      description?: string
      price?: number
      interval?: PlanInterval
      features?: any
    }
  ) {
    // Verificar se o plano existe
    const existingPlan = await db.plan.findUnique({
      where: { id },
    })

    if (!existingPlan) {
      throw new Error('Plan not found')
    }

    // Se o nome está sendo alterado, verificar se já existe outro plano com esse nome
    if (data.name && data.name !== existingPlan.name) {
      const planWithSameName = await db.plan.findFirst({
        where: {
          name: data.name,
          id: { not: id },
        },
      })

      if (planWithSameName) {
        throw new Error('Plan with this name already exists')
      }
    }

    return await db.plan.update({
      where: { id },
      data: {
        ...data,
        ...(data.interval && { interval: data.interval as PlanInterval }),
      },
      include: {
        customers: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
    })
  },

  async delete(id: string) {
    // Verificar se o plano existe
    const plan = await db.plan.findUnique({
      where: { id },
      include: {
        customers: {
          select: { id: true },
        },
      },
    })

    if (!plan) {
      throw new Error('Plan not found')
    }

    // Verificar se existem customers associados
    if (plan.customers.length > 0) {
      throw new Error(
        `Cannot delete plan. It has ${plan.customers.length} associated customers. Please reassign or delete the customers first.`
      )
    }

    return await db.plan.delete({
      where: { id },
    })
  },

  async forceDelete(id: string) {
    // Verificar se o plano existe
    const plan = await db.plan.findUnique({
      where: { id },
    })

    if (!plan) {
      throw new Error('Plan not found')
    }

    // Primeiro, remover a associação de todos os customers
    await db.customer.updateMany({
      where: { planId: id },
      data: { planId: null },
    })

    return await db.plan.delete({
      where: { id },
    })
  },

  async updateStatus(id: string, active: boolean) {
    // Verificar se o plano existe
    const plan = await db.plan.findUnique({
      where: { id },
    })

    if (!plan) {
      throw new Error('Plan not found')
    }

    // Para simplificar, vamos assumir que não há campo 'active' no modelo Plan
    // Se necessário, pode ser adicionado ao schema Prisma
    return await db.plan.update({
      where: { id },
      data: {
        // Se houvesse um campo active, seria:
        // active: active
      },
      include: {
        customers: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
    })
  },
}
