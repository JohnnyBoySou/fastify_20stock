import { db } from '@/plugins/prisma'

export const PlanQueries = {
  async getById(id: string) {
    const plan = await db.plan.findUnique({
      where: { id },
      include: {
        customers: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!plan) {
      return null
    }

    return {
      ...plan,
      customersCount: plan.customers.length,
    }
  },

  async list(params: {
    page?: number
    limit?: number
    search?: string
    interval?: 'MONTHLY' | 'YEARLY'
  }) {
    const { page = 1, limit = 10, search, interval } = params
    const skip = (page - 1) * limit

    const where: any = {}

    if (interval) {
      where.interval = interval
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [plans, total] = await Promise.all([
      db.plan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          customers: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      }),
      db.plan.count({ where }),
    ])

    const itemsWithCount = plans.map((plan) => ({
      ...plan,
      customersCount: plan.customers.length,
    }))

    return {
      items: itemsWithCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  },

  async getActive() {
    const plans = await db.plan.findMany({
      orderBy: { name: 'asc' },
      include: {
        customers: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    })

    return plans.map((plan) => ({
      ...plan,
      customersCount: plan.customers.length,
    }))
  },

  async compare(planIds: string[]) {
    if (!planIds || planIds.length === 0) {
      throw new Error('At least one plan ID is required for comparison')
    }

    const plans = await db.plan.findMany({
      where: { id: { in: planIds } },
      orderBy: { price: 'asc' },
      include: {
        customers: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    })

    if (plans.length === 0) {
      throw new Error('No plans found for comparison')
    }

    const prices = plans.map((plan) => Number(plan.price))
    const intervals = [...new Set(plans.map((plan) => plan.interval))]

    // Extrair features únicas de todos os planos
    const allFeatures = new Set<string>()
    plans.forEach((plan) => {
      if (plan.features && typeof plan.features === 'object') {
        Object.keys(plan.features).forEach((key) => allFeatures.add(key))
      }
    })

    const plansWithCount = plans.map((plan) => ({
      ...plan,
      customersCount: plan.customers.length,
    }))

    return {
      plans: plansWithCount,
      comparison: {
        priceRange: {
          min: Math.min(...prices),
          max: Math.max(...prices),
        },
        intervals: intervals as ('MONTHLY' | 'YEARLY')[],
        features: Array.from(allFeatures),
      },
    }
  },

  async getCustomers(
    planId: string,
    params: {
      page?: number
      limit?: number
      status?: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'TRIAL'
    }
  ) {
    const { page = 1, limit = 10, status } = params
    const skip = (page - 1) * limit

    // Verificar se o plano existe
    const plan = await db.plan.findUnique({
      where: { id: planId },
    })

    if (!plan) {
      throw new Error('Plan not found')
    }

    const where: any = {
      planId,
    }

    if (status) {
      where.status = status
    }

    const [customers, total] = await Promise.all([
      db.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          plan: {
            select: {
              id: true,
              name: true,
              price: true,
              interval: true,
            },
          },
          invoices: {
            select: {
              id: true,
              amount: true,
              status: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 5, // Últimas 5 faturas
          },
        },
      }),
      db.customer.count({ where }),
    ])

    return {
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        interval: plan.interval,
      },
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  },

  async getStats() {
    const [total, monthlyPlans, yearlyPlans, totalCustomers, revenueData] = await Promise.all([
      db.plan.count(),
      db.plan.count({ where: { interval: 'MONTHLY' } }),
      db.plan.count({ where: { interval: 'YEARLY' } }),
      db.customer.count({
        where: { status: 'ACTIVE' },
      }),
      db.invoice.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
        _avg: { amount: true },
      }),
    ])

    // Calcular receita total por plano
    const planRevenue = await db.plan.findMany({
      include: {
        customers: {
          where: { status: 'ACTIVE' },
          include: {
            invoices: {
              where: { status: 'PAID' },
              select: { amount: true },
            },
          },
        },
      },
    })

    let totalRevenue = 0
    planRevenue.forEach((plan) => {
      plan.customers.forEach((customer) => {
        customer.invoices.forEach((invoice) => {
          totalRevenue += Number(invoice.amount)
        })
      })
    })

    return {
      total,
      active: total, // Assumindo que todos os planos são ativos
      inactive: 0,
      monthlyPlans,
      yearlyPlans,
      totalCustomers,
      totalRevenue,
      averagePrice: revenueData._avg.amount ? Number(revenueData._avg.amount) : 0,
    }
  },
}
