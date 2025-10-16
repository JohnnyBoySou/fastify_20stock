import { db } from '@/plugins/prisma';

export const CustomerQueries = {
  async getById(id: string) {
    const customer = await db.customer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        plan: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            interval: true,
            features: true
          }
        },
        invoices: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
            paymentDate: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10 // Últimas 10 faturas
        }
      }
    });

    if (!customer) {
      return null;
    }

    return customer;
  },

  async getByUserId(userId: string) {
    const customer = await db.customer.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        plan: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            interval: true,
            features: true
          }
        },
        invoices: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
            paymentDate: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10 // Últimas 10 faturas
        }
      }
    });

    if (!customer) {
      return null;
    }

    return customer;
  },

  async list(params: {
    page?: number
    limit?: number
    search?: string
    status?: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'TRIAL'
    planId?: string
  }) {
    const { page = 1, limit = 10, search, status, planId } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (planId) {
      where.planId = planId;
    }

    if (search) {
      where.OR = [
        {
          user: {
            name: { contains: search, mode: 'insensitive' }
          }
        },
        {
          user: {
            email: { contains: search, mode: 'insensitive' }
          }
        },
        {
          plan: {
            name: { contains: search, mode: 'insensitive' }
          }
        }
      ];
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
              phone: true
            }
          },
          plan: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              interval: true,
              features: true
            }
          },
          invoices: {
            select: {
              id: true,
              amount: true,
              status: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 3 // Últimas 3 faturas
          }
        }
      }),
      db.customer.count({ where })
    ]);

    return {
      items: customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getInvoices(customerId: string, params: {
    page?: number
    limit?: number
    status?: 'PENDING' | 'PAID' | 'FAILED'
  }) {
    const { page = 1, limit = 10, status } = params;
    const skip = (page - 1) * limit;

    // Verificar se o customer existe
    const customer = await db.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const where: any = {
      customerId
    };

    if (status) {
      where.status = status;
    }

    const [invoices, total] = await Promise.all([
      db.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.invoice.count({ where })
    ]);

    return {
      customer: {
        id: customer.id,
        userId: customer.userId,
        status: customer.status
      },
      invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getSubscriptionStatus(customerId: string) {
    const customer = await db.customer.findUnique({
      where: { id: customerId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        plan: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            interval: true,
            features: true
          }
        },
        invoices: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
            paymentDate: true
          },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const isActive = customer.status === 'ACTIVE';
    const isTrial = customer.status === 'TRIAL';
    
    let daysRemaining: number | undefined;
    let nextBillingDate: Date | undefined;

    if (isTrial && customer.trialEndsAt) {
      const now = new Date();
      const diffTime = customer.trialEndsAt.getTime() - now.getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      nextBillingDate = customer.trialEndsAt;
    } else if (customer.renewalDate) {
      nextBillingDate = customer.renewalDate;
    }

    const canUpgrade = isActive && customer.plan !== null;
    const canDowngrade = isActive && customer.plan !== null;
    const canCancel = isActive || isTrial;

    // Buscar próxima fatura pendente
    const nextInvoice = await db.invoice.findFirst({
      where: {
        customerId,
        status: 'PENDING'
      },
      orderBy: { createdAt: 'desc' }
    });

    // Buscar último pagamento
    const lastPayment = await db.invoice.findFirst({
      where: {
        customerId,
        status: 'PAID'
      },
      orderBy: { paymentDate: 'desc' }
    });

    return {
      customer,
      subscription: {
        isActive,
        isTrial,
        daysRemaining,
        nextBillingDate,
        canUpgrade,
        canDowngrade,
        canCancel
      },
      billing: {
        currentPlan: customer.plan,
        nextInvoice: nextInvoice ? {
          amount: Number(nextInvoice.amount),
          dueDate: nextInvoice.createdAt
        } : undefined,
        lastPayment: lastPayment ? {
          amount: Number(lastPayment.amount),
          date: lastPayment.paymentDate!,
          status: lastPayment.status
        } : undefined
      }
    };
  },

  async getStats() {
    const [
      total,
      active,
      inactive,
      cancelled,
      trial
    ] = await Promise.all([
      db.customer.count(),
      db.customer.count({ where: { status: 'ACTIVE' } }),
      db.customer.count({ where: { status: 'INACTIVE' } }),
      db.customer.count({ where: { status: 'CANCELLED' } }),
      db.customer.count({ where: { status: 'TRIAL' } })
    ]);

    // Calcular receita total
    const revenueData = await db.invoice.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true }
    });

    const totalRevenue = revenueData._sum.amount ? Number(revenueData._sum.amount) : 0;
    const averageRevenuePerCustomer = total > 0 ? totalRevenue / total : 0;

    // Calcular taxa de churn (customers cancelados / total de customers que já foram ativos)
    const totalEverActive = await db.customer.count({
      where: {
        OR: [
          { status: 'ACTIVE' },
          { status: 'CANCELLED' }
        ]
      }
    });

    const churnRate = totalEverActive > 0 ? (cancelled / totalEverActive) * 100 : 0;

    // Calcular taxa de conversão (customers ativos / total de customers que já foram trial)
    const totalEverTrial = await db.customer.count({
      where: {
        OR: [
          { status: 'TRIAL' },
          { status: 'ACTIVE' },
          { status: 'CANCELLED' }
        ]
      }
    });

    const conversionRate = totalEverTrial > 0 ? (active / totalEverTrial) * 100 : 0;

    return {
      total,
      active,
      inactive,
      cancelled,
      trial,
      totalRevenue,
      averageRevenuePerCustomer,
      churnRate,
      conversionRate
    };
  },

  async getActive() {
    const customers = await db.customer.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        plan: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            interval: true,
            features: true
          }
        }
      }
    });

    return customers;
  },

  async getTrial() {
    const customers = await db.customer.findMany({
      where: { status: 'TRIAL' },
      orderBy: { trialEndsAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        plan: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            interval: true,
            features: true
          }
        }
      }
    });

    return customers;
  },

  async getCancelled() {
    const customers = await db.customer.findMany({
      where: { status: 'CANCELLED' },
      orderBy: { updatedAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        plan: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            interval: true,
            features: true
          }
        }
      }
    });

    return customers;
  },
}
