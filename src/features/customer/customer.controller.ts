import { FastifyRequest, FastifyReply } from 'fastify';
import { CustomerCommands } from './commands/customer.commands';
import { CustomerQueries } from './queries/customer.queries';
import {
  CreateCustomerRequest,
  UpdateCustomerRequest,
  GetCustomerRequest,
  ListCustomersRequest,
  DeleteCustomerRequest,
  UpdateCustomerPlanRequest,
  CancelCustomerRequest,
  RenewCustomerRequest,
  StartTrialRequest,
  GetCustomerInvoicesRequest,
  GetSubscriptionStatusRequest,
  CustomerStatus
} from './customer.interfaces';

export const CustomerController = {
  // === CRUD BÁSICO ===
  async create(request: CreateCustomerRequest, reply: FastifyReply) {
    try {
      const { userId, planId, status, renewalDate, trialEndsAt } = request.body;
      
      const result = await CustomerCommands.create({
        userId,
        planId,
        status: status as unknown as CustomerStatus,
        renewalDate: renewalDate ? new Date(renewalDate) : undefined,
        trialEndsAt: trialEndsAt ? new Date(trialEndsAt) : undefined
      });

      return reply.status(201).send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'User not found') {
        return reply.status(400).send({
          error: error.message
        });
      }

      if (error.message === 'User is already a customer') {
        return reply.status(400).send({
          error: error.message
        });
      }

      if (error.message === 'Plan not found') {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async get(request: GetCustomerRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;

      const result = await CustomerQueries.getById(id);

      if (!result) {
        return reply.status(404).send({
          error: 'Customer not found'
        });
      }

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

  async update(request: UpdateCustomerRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const updateData = { ...request.body };

      // Converter strings de data para Date objects
      if (updateData.renewalDate) {
        updateData.renewalDate = new Date(updateData.renewalDate) as any;
      }
      if (updateData.trialEndsAt) {
        updateData.trialEndsAt = new Date(updateData.trialEndsAt) as any;
      }

      const result = await CustomerCommands.update(id, updateData as any);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Customer not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Plan not found') {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async delete(request: DeleteCustomerRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;

      await CustomerCommands.delete(id);

      return reply.status(204).send();
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Customer not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message.includes('Cannot delete customer') && error.message.includes('associated invoices')) {
        return reply.status(400).send({
          error: error.message,
          suggestion: 'Use DELETE /customers/:id/force to delete the customer and all associated invoices'
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async forceDelete(request: DeleteCustomerRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;

      await CustomerCommands.forceDelete(id);

      return reply.status(204).send();
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

  async list(request: ListCustomersRequest, reply: FastifyReply) {
    try {
      const { page = 1, limit = 10, search, status, planId } = request.query;
      const result = await CustomerQueries.list({
        page,
        limit,
        search,
        status,
        planId
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
  async getByUserId(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) {
    try {
      const { userId } = request.params;

      const result = await CustomerQueries.getByUserId(userId);

      if (!result) {
        return reply.status(404).send({
          error: 'Customer not found'
        });
      }

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getActive(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await CustomerQueries.getActive();


      return reply.send({ customers: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getTrial(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await CustomerQueries.getTrial();

      return reply.send({ customers: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getCancelled(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await CustomerQueries.getCancelled();

      return reply.send({ customers: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    try {

      const result = await CustomerQueries.getStats();

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getInvoices(request: GetCustomerInvoicesRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { page = 1, limit = 10, status } = request.query;

      const result = await CustomerQueries.getInvoices(id, {
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

  async getSubscriptionStatus(request: GetSubscriptionStatusRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;  

      const result = await CustomerQueries.getSubscriptionStatus(id);

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

  // === FUNÇÕES ADICIONAIS (COMMANDS) ===
  async updatePlan(request: UpdateCustomerPlanRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { planId } = request.body;

      const result = await CustomerCommands.updatePlan(id, planId);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Customer not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Plan not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async cancel(request: CancelCustomerRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { reason } = request.body;

      const result = await CustomerCommands.cancelSubscription(id, reason);

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

  async renew(request: RenewCustomerRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { renewalDate } = request.body;

      const result = await CustomerCommands.renewSubscription(
        id, 
        renewalDate ? new Date(renewalDate) as any : undefined
      );

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Customer not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Customer has no active plan') {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async startTrial(request: StartTrialRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { trialDays } = request.body;

      const result = await CustomerCommands.startTrial(id, trialDays);

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

  async updateStatus(request: FastifyRequest<{ Params: { id: string }; Body: { status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'TRIAL' } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { status } = request.body;

      const result = await CustomerCommands.updateStatus(id, status as unknown as CustomerStatus);

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
  }
};
