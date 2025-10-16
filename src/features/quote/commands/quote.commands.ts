import { db } from '@/plugins/prisma';
import { MovementCommands } from '../../movement/commands/movement.commands';
import { QuoteStatus, PaymentType } from '../quote.interfaces';

export class QuoteCommands {
  constructor(private prisma: any) {}

  async create(data: {
    userId: string
    title: string
    description?: string
    paymentType: PaymentType
    paymentTerms?: string
    paymentDueDays?: number
    expiresAt?: string
    observations?: string
    discount?: number
    interest?: number
    items: Array<{
      productId: string
      quantity: number
      unitPrice: number
      discount?: number
      note?: string
    }>
    installments?: Array<{
      number: number
      dueDate: string
      amount: number
      interest?: number
    }>
  }) {
    const { items, installments, ...quoteData } = data;

    // Verificar se os produtos existem
    const productIds = items.map(item => item.productId);
    const existingProducts = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true }
    });

    if (existingProducts.length !== productIds.length) {
      const foundIds = existingProducts.map(p => p.id);
      const notFoundIds = productIds.filter(id => !foundIds.includes(id));
      throw new Error(`Products not found: ${notFoundIds.join(', ')}`);
    }

    // Calcular subtotal dos items
    let subtotal = 0;
    const itemsWithSubtotal = items.map(item => {
      const itemSubtotal = (item.quantity * item.unitPrice) - (item.discount || 0);
      subtotal += itemSubtotal;
      return {
        ...item,
        subtotal: itemSubtotal
      };
    });

    // Calcular total final
    const total = subtotal - (quoteData.discount || 0) + (quoteData.interest || 0);

    // Criar quote com items e installments
    const quote = await this.prisma.quote.create({
      data: {
        ...quoteData,
        subtotal,
        total,
        expiresAt: quoteData.expiresAt ? new Date(quoteData.expiresAt) : null,
        items: {
          create: itemsWithSubtotal.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
            discount: item.discount,
            note: item.note
          }))
        },
        ...(installments && installments.length > 0 && {
          installments: {
            create: installments.map(installment => ({
              number: installment.number,
              dueDate: new Date(installment.dueDate),
              amount: installment.amount,
              interest: installment.interest
            }))
          }
        })
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                unitOfMeasure: true,
                referencePrice: true
              }
            }
          }
        },
        installments: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return quote;
  }

  async update(id: string, data: {
    title?: string
    description?: string
    paymentType?: PaymentType
    paymentTerms?: string
    paymentDueDays?: number
    expiresAt?: string
    observations?: string
    discount?: number
    interest?: number
    items?: Array<{
      id?: string
      productId: string
      quantity: number
      unitPrice: number
      discount?: number
      note?: string
    }>
    installments?: Array<{
      id?: string
      number: number
      dueDate: string
      amount: number
      interest?: number
    }>
  }) {
    // Verificar se o quote existe e está em DRAFT
    const existingQuote = await this.prisma.quote.findUnique({
      where: { id },
      include: { items: true, installments: true }
    });

    if (!existingQuote) {
      throw new Error('Quote not found');
    }

    if (existingQuote.status !== 'DRAFT') {
      throw new Error('Only DRAFT quotes can be updated');
    }

    const { items, installments, ...updateData } = data;

    // Se items foram fornecidos, recalcular totais
    let subtotal = existingQuote.subtotal;
    let total = existingQuote.total;

    if (items) {
      // Verificar se os produtos existem
      const productIds = items.map(item => item.productId);
      const existingProducts = await this.prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true }
      });

      if (existingProducts.length !== productIds.length) {
        const foundIds = existingProducts.map(p => p.id);
        const notFoundIds = productIds.filter(id => !foundIds.includes(id));
        throw new Error(`Products not found: ${notFoundIds.join(', ')}`);
      }

      // Calcular novo subtotal
      subtotal = 0;
      const itemsWithSubtotal = items.map(item => {
        const itemSubtotal = (item.quantity * item.unitPrice) - (item.discount || 0);
        subtotal += itemSubtotal;
        return {
          ...item,
          subtotal: itemSubtotal
        };
      });

      // Calcular novo total
      total = subtotal - (updateData.discount || existingQuote.discount || 0) + (updateData.interest || existingQuote.interest || 0);
    }

    // Atualizar quote
    const quote = await this.prisma.quote.update({
      where: { id },
      data: {
        ...updateData,
        subtotal,
        total,
        expiresAt: updateData.expiresAt ? new Date(updateData.expiresAt) : undefined,
        ...(items && {
          items: {
            deleteMany: {},
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: (item.quantity * item.unitPrice) - (item.discount || 0),
              discount: item.discount,
              note: item.note
            }))
          }
        }),
        ...(installments && {
          installments: {
            deleteMany: {},
            create: installments.map(installment => ({
              number: installment.number,
              dueDate: new Date(installment.dueDate),
              amount: installment.amount,
              interest: installment.interest
            }))
          }
        })
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                unitOfMeasure: true,
                referencePrice: true
              }
            }
          }
        },
        installments: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return quote;
  }

  async delete(id: string) {
    // Verificar se o quote existe
    const quote = await this.prisma.quote.findUnique({
      where: { id }
    });

    if (!quote) {
      throw new Error('Quote not found');
    }

    // Apenas quotes DRAFT ou CANCELED podem ser deletados
    if (quote.status !== 'DRAFT' && quote.status !== 'CANCELED') {
      throw new Error('Only DRAFT or CANCELED quotes can be deleted');
    }

    return await this.prisma.quote.delete({
      where: { id }
    });
  }

  async updateStatus(id: string, status: QuoteStatus) {
    const quote = await this.prisma.quote.findUnique({
      where: { id }
    });

    if (!quote) {
      throw new Error('Quote not found');
    }

    return await this.prisma.quote.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                unitOfMeasure: true,
                referencePrice: true
              }
            }
          }
        },
        installments: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async approve(publicId: string, authCode: string) {
    // Buscar quote por publicId e authCode
    const quote = await this.prisma.quote.findFirst({
      where: {
        publicId,
        authCode,
        status: { in: ['PUBLISHED', 'SENT', 'VIEWED'] }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                storeId: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!quote) {
      throw new Error('Quote not found or not available for approval');
    }

    // Verificar se não expirou
    if (quote.expiresAt && new Date() > quote.expiresAt) {
      throw new Error('Quote has expired');
    }

    // Converter para movimentações
    const movements = await this.convertToMovements(quote.id);

    // Atualizar status para APPROVED
    await this.prisma.quote.update({
      where: { id: quote.id },
      data: { status: 'APPROVED' }
    });

    return {
      quote: {
        ...quote,
        status: 'APPROVED' as QuoteStatus
      },
      movements
    };
  }

  async reject(publicId: string, authCode: string, reason?: string) {
    // Buscar quote por publicId e authCode
    const quote = await this.prisma.quote.findFirst({
      where: {
        publicId,
        authCode,
        status: { in: ['PUBLISHED', 'SENT', 'VIEWED'] }
      }
    });

    if (!quote) {
      throw new Error('Quote not found or not available for rejection');
    }

    // Atualizar status para REJECTED
    const updatedQuote = await this.prisma.quote.update({
      where: { id: quote.id },
      data: { 
        status: 'REJECTED',
        observations: reason ? `${quote.observations || ''}\nRejection reason: ${reason}`.trim() : quote.observations
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                unitOfMeasure: true,
                referencePrice: true
              }
            }
          }
        },
        installments: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return updatedQuote;
  }

  async convertToMovements(quoteId: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                storeId: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!quote) {
      throw new Error('Quote not found');
    }

    // Verificar se pode ser convertido
    if (!['PUBLISHED', 'SENT', 'VIEWED', 'APPROVED'].includes(quote.status)) {
      throw new Error('Quote cannot be converted to movements');
    }

    // Criar movimentações para cada item
    const movements = [];

    for (const item of quote.items) {
      try {
        const movement = await MovementCommands.create({
          type: 'SAIDA',
          quantity: item.quantity,
          storeId: item.product.storeId,
          productId: item.productId,
          note: `Quote conversion - ${quote.title} (Item: ${item.product.name})`,
          userId: quote.userId
        });

        movements.push(movement);
      } catch (error) {
        console.error(`Error creating movement for item ${item.id}:`, error);
        throw new Error(`Failed to create movement for product ${item.product.name}`);
      }
    }

    // Atualizar status do quote para CONVERTED
    await this.prisma.quote.update({
      where: { id: quoteId },
      data: { status: 'CONVERTED' }
    });

    return movements;
  }

  async publish(id: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id }
    });

    if (!quote) {
      throw new Error('Quote not found');
    }

    if (quote.status !== 'DRAFT') {
      throw new Error('Only DRAFT quotes can be published');
    }

    return await this.prisma.quote.update({
      where: { id },
      data: { status: 'PUBLISHED' },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                unitOfMeasure: true,
                referencePrice: true
              }
            }
          }
        },
        installments: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async send(id: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id }
    });

    if (!quote) {
      throw new Error('Quote not found');
    }

    if (quote.status !== 'PUBLISHED') {
      throw new Error('Only PUBLISHED quotes can be sent');
    }

    return await this.prisma.quote.update({
      where: { id },
      data: { status: 'SENT' },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                unitOfMeasure: true,
                referencePrice: true
              }
            }
          }
        },
        installments: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }
}
