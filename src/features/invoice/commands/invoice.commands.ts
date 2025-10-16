import { db } from '@/plugins/prisma';
import { InvoiceStatus } from '../invoice.interfaces';

export const InvoiceCommands = {

  async create(data: {
    customerId: string
    amount: number
    status?: InvoiceStatus
    gatewayPaymentId?: string
    paymentDate?: Date
  }) {
    const { customerId, ...createData } = data;

    // Verificar se o customer existe
    const customer = await db.customer.findUnique({
      where: { id: customerId },
      include: {
        user: true,
        plan: true
      }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return await db.invoice.create({
      data: {
        ...createData,
        status: data.status || InvoiceStatus.PENDING,
        customer: { connect: { id: customerId } }
      },
      include: {
        customer: {
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
                interval: true
              }
            }
          }
        }
      }
    });
  },

  async update(id: string, data: {
    amount?: number
    status?: InvoiceStatus
    gatewayPaymentId?: string
    paymentDate?: Date
  }) {
    // Verificar se a fatura existe
    const existingInvoice = await db.invoice.findUnique({
      where: { id }
    });

    if (!existingInvoice) {
      throw new Error('Invoice not found');
    }

    return await db.invoice.update({
      where: { id },
      data: {
        ...data
      },
      include: {
        customer: {
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
                interval: true
              }
            }
          }
        }
      }
    });
  },

  async delete(id: string) {
    // Verificar se a fatura existe
    const invoice = await db.invoice.findUnique({
      where: { id }
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return await db.invoice.delete({
      where: { id }
    });
  },

  async updateStatus(id: string, status: InvoiceStatus, paymentDate?: Date, gatewayPaymentId?: string) {
    // Verificar se a fatura existe
    const invoice = await db.invoice.findUnique({
      where: { id }
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    const updateData: any = { status };

    if (status === InvoiceStatus.PAID) {
      updateData.paymentDate = paymentDate || new Date();
      if (gatewayPaymentId) {
        updateData.gatewayPaymentId = gatewayPaymentId;
      }
    }

    return await db.invoice.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
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
                interval: true
              }
            }
          }
        }
      }
    });
  },

  async retryPayment(id: string, gateway?: string, paymentMethod?: any) {
    // Verificar se a fatura existe
    const invoice = await db.invoice.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            user: true,
            plan: true
          }
        }
      }
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    if (invoice.status === InvoiceStatus.PAID) {
      throw new Error('Invoice is already paid');
    }

    // Aqui seria integrado com o gateway de pagamento
    // Por enquanto, vamos simular uma tentativa de pagamento
    try {
      // Simular processamento do pagamento
      // Em uma implementação real, isso seria uma chamada para o gateway
      const paymentSuccess = Math.random() > 0.3; // 70% de chance de sucesso

      if (paymentSuccess) {
        await db.invoice.update({
          where: { id },
          data: {
            status: InvoiceStatus.PAID,
            paymentDate: new Date(),
            gatewayPaymentId: `gateway_${Date.now()}`
          }
        });

        return {
          success: true,
          gatewayResponse: {
            paymentId: `gateway_${Date.now()}`,
            status: 'completed'
          }
        };
      } else {
        await db.invoice.update({
          where: { id },
          data: {
            status: InvoiceStatus.FAILED
          }
        });

        return {
          success: false,
          error: 'Payment failed'
        };
      }
    } catch (error) {
      await db.invoice.update({
        where: { id },
        data: {
          status: InvoiceStatus.FAILED
        }
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  async markAsPaid(id: string, gatewayPaymentId?: string) {
    return await this.updateStatus(id, InvoiceStatus.PAID, new Date(), gatewayPaymentId);
  },

  async markAsFailed(id: string) {
    return await this.updateStatus(id, InvoiceStatus.FAILED);
  },
}
