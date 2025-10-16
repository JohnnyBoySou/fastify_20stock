import { FastifyRequest, FastifyReply } from 'fastify';
import { WebhookService } from './webhook.service';
import {
  WebhookRequest,
  WebhookLogRequest
} from './webhook.interfaces';

export const WebhookController = {
  async processAbacatePay(request: WebhookRequest, reply: FastifyReply) {
    try {
      const { payload } = request.body;
      const signature = request.headers['x-abacate-signature'] || request.headers['x-signature'];
      const webhookService = new WebhookService();

      const result = await webhookService.processWebhook(
        'abacate-pay',
        payload,
        signature
      );

      if (!result.success) {
        return reply.status(400).send({
          error: result.error
        });
      }

      return reply.status(200).send({
        success: true,
        eventId: result.eventId,
        eventType: result.eventType,
        gateway: 'abacate-pay',
        processedAt: new Date()
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async processStripe(request: WebhookRequest, reply: FastifyReply) {
    try {
      const payload = request.body;
      const signature = request.headers['stripe-signature'];
      const webhookService = new WebhookService();

      const result = await webhookService.processWebhook(
        'stripe',
        payload,
        signature
      );

      if (!result.success) {
        return reply.status(400).send({
          error: result.error
        });
      }

      return reply.status(200).send({
        success: true,
        eventId: result.eventId,
        eventType: result.eventType,
        gateway: 'stripe',
        processedAt: new Date()
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async processGeneric(request: WebhookRequest, reply: FastifyReply) {
    try {
      const { gateway } = request.params;
      const payload = request.body;
      const signature = request.headers['x-signature'] || request.headers['x-hub-signature'];
      const webhookService = new WebhookService();

      const result = await webhookService.processWebhook(
        gateway,
        payload,
        signature
      );

      if (!result.success) {
        return reply.status(400).send({
          error: result.error
        });
      }

      return reply.status(200).send({
        success: true,
        eventId: result.eventId,
        eventType: result.eventType,
        gateway,
        processedAt: new Date()
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getLogs(request: WebhookLogRequest, reply: FastifyReply) {
    try {
      const { page = 1, limit = 10, gateway, eventType, success, startDate, endDate } = request.query;
      const webhookService = new WebhookService();

      const result = await webhookService.getWebhookLogs({
        page,
        limit,
        gateway,
        eventType,
        success,
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

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const webhookService = new WebhookService();

      const result = await webhookService.getWebhookStats();

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getHealth(request: FastifyRequest, reply: FastifyReply) {
    try {
      const webhookService = new WebhookService();

      const result = await webhookService.getWebhookHealth();

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getSupportedEvents(request: FastifyRequest, reply: FastifyReply) {
    try {
      const webhookService = new WebhookService();

      const result = await webhookService.getSupportedEvents();

      return reply.send({
        events: result
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async retryFailed(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const webhookService = new WebhookService();

      const result = await webhookService.retryFailedWebhook(id);

      if (!result.success) {
        return reply.status(400).send({
          error: result.error
        });
      }

      return reply.send({
        success: true,
        message: 'Webhook retry initiated'
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async deleteLog(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const webhookService = new WebhookService();

      const result = await webhookService.deleteWebhookLog(id);

      if (!result.success) {
        return reply.status(400).send({
          error: result.error
        });
      }

      return reply.status(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }
};
