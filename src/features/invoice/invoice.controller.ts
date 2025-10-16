import { FastifyRequest, FastifyReply } from 'fastify';
import { InvoiceCommands } from './commands/invoice.commands';
import { InvoiceQueries } from './queries/invoice.queries';
import {
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  GetInvoiceRequest,
  ListInvoicesRequest,
  DeleteInvoiceRequest,
  UpdateInvoiceStatusRequest,
  RetryPaymentRequest,
  SendInvoiceEmailRequest,
  GetInvoicePdfRequest,
  GetCustomerInvoicesRequest
} from './invoice.interfaces';

export const InvoiceController = {
  // === CRUD BÁSICO ===
  async create(request: CreateInvoiceRequest, reply: FastifyReply) {
    try {
      const { customerId, amount, status, gatewayPaymentId, paymentDate } = request.body;

      const result = await InvoiceCommands.create({
        customerId,
        amount,
        status,
        gatewayPaymentId,
        paymentDate: paymentDate ? new Date(paymentDate) : undefined
      });

      return reply.status(201).send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Customer not found') {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async get(request: GetInvoiceRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;

      const result = await InvoiceQueries.getById(id);

      if (!result) {
        return reply.status(404).send({
          error: 'Invoice not found'
        });
      }

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Invoice not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async update(request: UpdateInvoiceRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const updateData = { ...request.body };

      // Converter string de data para Date object
      if (updateData.paymentDate) {
        updateData.paymentDate = new Date(updateData.paymentDate) as any;
      }

      const result = await InvoiceCommands.update(id, updateData as any);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Invoice not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async delete(request: DeleteInvoiceRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;

      await InvoiceCommands.delete(id);

      return reply.status(204).send();
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Invoice not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async list(request: ListInvoicesRequest, reply: FastifyReply) {
    try {
      const { page = 1, limit = 10, customerId, status, startDate, endDate } = request.query;
      const result = await InvoiceQueries.list({
        page,
        limit,
        customerId,
        status,
        startDate,
        endDate
      });

      return reply.send(result);

    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  // === FUNÇÕES ADICIONAIS (QUERIES) ===
  async getByCustomer(request: GetCustomerInvoicesRequest, reply: FastifyReply) {
    try {
      const { customerId } = request.params;
      const { page = 1, limit = 10, status } = request.query;
      const result = await InvoiceQueries.getByCustomer(customerId, {
        page,
        limit,
        status
      });

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Customer not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getPending(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await InvoiceQueries.getPending();


      return reply.send({ invoices: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getFailed(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await InvoiceQueries.getFailed();

      return reply.send({ invoices: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await InvoiceQueries.getStats();

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getPdf(request: GetInvoicePdfRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const result = await InvoiceQueries.generatePdf(id);


      if (!result.success) {
        return reply.status(400).send({
          error: 'Failed to generate PDF'
        });
      }

      // Em uma implementação real, aqui seria retornado o arquivo PDF
      // Por enquanto, retornamos os dados formatados
      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Invoice not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getOverdue(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await InvoiceQueries.getOverdueInvoices();

      return reply.send({ invoices: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getRevenue(request: FastifyRequest<{ 
    Querystring: { 
      startDate?: string
      endDate?: string
    }
  }>, reply: FastifyReply) {
    try {
      const { startDate, endDate } = request.query;

      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 dias atrás
      const end = endDate ? new Date(endDate) : new Date();

      const result = await InvoiceQueries.getRevenueByPeriod(start, end);

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  // === FUNÇÕES ADICIONAIS (COMMANDS) ===
  async updateStatus(request: UpdateInvoiceStatusRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { status, paymentDate, gatewayPaymentId } = request.body;

      const result = await InvoiceCommands.updateStatus(
        id, 
        status, 
        paymentDate ? new Date(paymentDate) : undefined,
        gatewayPaymentId
      );

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Invoice not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async retryPayment(request: RetryPaymentRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { gateway, paymentMethod } = request.body;

      const retryResult = await InvoiceCommands.retryPayment(id, gateway, paymentMethod);
      const invoice = await InvoiceQueries.getById(id);

      return reply.send({
        invoice,
        retryResult
      });
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Invoice not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Invoice is already paid') {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async sendEmail(request: SendInvoiceEmailRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { email, includePdf } = request.body;

      const invoice = await InvoiceQueries.getById(id);

      if (!invoice) {
        return reply.status(404).send({
          error: 'Invoice not found'
        });
      }

      // Aqui seria integrado com o serviço de email
      // Por enquanto, simulamos o envio
      const emailResult = {
        success: true,
        messageId: `email_${Date.now()}`
      };

      return reply.send({
        invoice,
        emailResult
      });
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Invoice not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async markAsPaid(request: FastifyRequest<{ Params: { id: string }; Body: { gatewayPaymentId?: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { gatewayPaymentId } = request.body;

      const result = await InvoiceCommands.markAsPaid(id, gatewayPaymentId);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Invoice not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async markAsFailed(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;

      const result = await InvoiceCommands.markAsFailed(id);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Invoice not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }
};
