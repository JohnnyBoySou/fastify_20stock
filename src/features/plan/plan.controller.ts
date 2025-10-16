import { FastifyRequest, FastifyReply } from 'fastify';
import { PlanCommands } from './commands/plan.commands';
import { PlanQueries } from './queries/plan.queries';
import {
  CreatePlanRequest,
  UpdatePlanRequest,
  GetPlanRequest,
  ListPlansRequest,
  DeletePlanRequest,
  UpdatePlanStatusRequest,
  ComparePlansRequest,
  GetPlanCustomersRequest
} from './plan.interfaces';

export const PlanController = {
  // === CRUD BÁSICO ===
  async create(request: CreatePlanRequest, reply: FastifyReply) {
    try {
      const { name, description, price, interval, features } = request.body;
      const result = await PlanCommands.create({
        name,
        description,
        price,
        interval,
        features
      });

      return reply.status(201).send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Plan with this name already exists') {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async get(request: GetPlanRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;

      const result = await PlanQueries.getById(id);

      if (!result) {
        return reply.status(404).send({
          error: 'Plan not found'
        });
      }

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

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

  async update(request: UpdatePlanRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const updateData = { ...request.body };

      const result = await PlanCommands.update(id, updateData);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Plan not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message === 'Plan with this name already exists') {
        return reply.status(400).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async delete(request: DeletePlanRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;


      await PlanCommands.delete(id);

      return reply.status(204).send();
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Plan not found') {
        return reply.status(404).send({
          error: error.message
        });
      }

      if (error.message.includes('Cannot delete plan') && error.message.includes('associated customers')) {
        return reply.status(400).send({
          error: error.message,
          suggestion: 'Use DELETE /plans/:id/force to delete the plan and remove all customer associations'
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async forceDelete(request: DeletePlanRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;

      await PlanCommands.forceDelete(id);

      return reply.status(204).send();
    } catch (error: any) {
      request.log.error(error);

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

  async list(request: ListPlansRequest, reply: FastifyReply) {
    try {
      const { page = 1, limit = 10, search, interval } = request.query;
      const result = await PlanQueries.list({
        page,
        limit,
        search,
        interval
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
  async getActive(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await PlanQueries.getActive();


      return reply.send({ plans: result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async compare(request: ComparePlansRequest, reply: FastifyReply) {
    try {
      const { planIds } = request.query;
      const result = await PlanQueries.compare(planIds);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'At least one plan ID is required for comparison') {
        return reply.status(400).send({
          error: error.message
        });
      }

      if (error.message === 'No plans found for comparison') {
        return reply.status(404).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getCustomers(request: GetPlanCustomersRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { page = 1, limit = 10, status } = request.query;

      const result = await PlanQueries.getCustomers(id, {
        page,
        limit,
        status
      });

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

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

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await PlanQueries.getStats();

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  // === FUNÇÕES ADICIONAIS (COMMANDS) ===
  async updateStatus(request: UpdatePlanStatusRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { active } = request.body;

      const result = await PlanCommands.updateStatus(id, active);

      return reply.send(result);
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Plan not found') {
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
