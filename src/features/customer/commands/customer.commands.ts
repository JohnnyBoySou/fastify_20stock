import { db } from '@/plugins/prisma'; 
import { CustomerStatus} from '../customer.interfaces'

export const CustomerCommands = {

  async create(data: {
    userId: string
    planId?: string
    status?: CustomerStatus
    renewalDate?: Date
    trialEndsAt?: Date
  }) {
    const { planId, ...createData } = data;

    // Verificar se o usuário existe
    const user = await db.user.findUnique({
      where: { id: data.userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verificar se o usuário já é um customer
    const existingCustomer = await db.customer.findUnique({
      where: { userId: data.userId }
    });

    if (existingCustomer) {
      throw new Error('User is already a customer');
    }

    // Verificar se o plano existe (se fornecido)
    if (planId) {
      const plan = await db.plan.findUnique({
        where: { id: planId }
      });

      if (!plan) {
        throw new Error('Plan not found');
      }
    }

    return await db.customer.create({
      data: {
        user: { connect: { id: data.userId } },
        status: data.status || CustomerStatus.ACTIVE,
        renewalDate: data.renewalDate,
        trialEndsAt: data.trialEndsAt,
        ...(planId && { plan: { connect: { id: planId } } })
      },
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
  },

  async update(id: string, data: {
    planId?: string
    status?: CustomerStatus
    renewalDate?: Date
    trialEndsAt?: Date
  }) {
    const { planId, ...updateData } = data;

    // Verificar se o customer existe
    const existingCustomer = await db.customer.findUnique({
      where: { id }
    });

    if (!existingCustomer) {
      throw new Error('Customer not found');
    }

    // Verificar se o plano existe (se fornecido)
    if (planId) {
      const plan = await db.plan.findUnique({
        where: { id: planId }
      });

      if (!plan) {
        throw new Error('Plan not found');
      }
    }

    return await db.customer.update({
      where: { id },
      data: {
        ...updateData,
        ...(planId && { plan: { connect: { id: planId } } })
      },
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
  },

  async delete(id: string) {
    // Verificar se o customer existe
    const customer = await db.customer.findUnique({
      where: { id },
      include: {
        invoices: {
          select: { id: true }
        }
      }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Verificar se existem faturas associadas
    if (customer.invoices.length > 0) {
      throw new Error(`Cannot delete customer. It has ${customer.invoices.length} associated invoices. Please delete the invoices first or use force delete.`);
    }

    return await db.customer.delete({
      where: { id }
    });
  },

  async forceDelete(id: string) {
    // Verificar se o customer existe
    const customer = await db.customer.findUnique({
      where: { id }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Exclusão em cascata - primeiro excluir faturas, depois o customer
    await db.invoice.deleteMany({
      where: { customerId: id }
    });

    return await db.customer.delete({
      where: { id }
    });
  },

  async updatePlan(customerId: string, planId: string) {
    // Verificar se o customer existe
    const customer = await db.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Verificar se o plano existe
    const plan = await db.plan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      throw new Error('Plan not found');
    }

    return await db.customer.update({
      where: { id: customerId },
      data: {
        plan: { connect: { id: planId } },
        renewalDate: new Date(Date.now() + (plan.interval === 'MONTHLY' ? 30 : 365) * 24 * 60 * 60 * 1000)
      },
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
  },

  async cancelSubscription(customerId: string, reason?: string) {
    // Verificar se o customer existe
    const customer = await db.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return await db.customer.update({
      where: { id: customerId },
      data: {
        status: CustomerStatus.CANCELLED,
        renewalDate: null
      },
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
  },

  async renewSubscription(customerId: string, renewalDate?: Date) {
    // Verificar se o customer existe
    const customer = await db.customer.findUnique({
      where: { id: customerId },
      include: {
        plan: true
      }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    if (!customer.plan) {
      throw new Error('Customer has no active plan');
    }

    // Calcular nova data de renovação se não fornecida
    const newRenewalDate = renewalDate || new Date(Date.now() + (customer.plan.interval === 'MONTHLY' ? 30 : 365) * 24 * 60 * 60 * 1000);

    return await db.customer.update({
      where: { id: customerId },
      data: {
        status: CustomerStatus.ACTIVE,
        renewalDate: newRenewalDate
      },
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
  },

  async startTrial(customerId: string, trialDays: number) {
    // Verificar se o customer existe
    const customer = await db.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const trialEndsAt = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000);

    return await db.customer.update({
      where: { id: customerId },
      data: {
        status: CustomerStatus.TRIAL,
        trialEndsAt,
        renewalDate: trialEndsAt
      },
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
  },

  async updateStatus(customerId: string, status: CustomerStatus) {
    // Verificar se o customer existe
    const customer = await db.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return await db.customer.update({
      where: { id: customerId },
      data: { status },
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
  },
}
