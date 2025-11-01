import type { FastifyReply, FastifyRequest } from 'fastify'
import { PushSubscriptionCommands } from './commands/push-subscription.commands'
import {
  type CreatePushSubscriptionRequest,
  type DeletePushSubscriptionRequest,
  GetPushSubscriptionRequest,
  type GetUserSubscriptionsRequest,
  type ListPushSubscriptionsRequest,
} from './push-subscription.interfaces'
import { PushSubscriptionQueries } from './queries/push-subscription.queries'

export const PushSubscriptionController = {
  async create(request: CreatePushSubscriptionRequest, reply: FastifyReply) {
    try {
      const { endpoint, keys, userAgent, deviceInfo } = request.body
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          error: 'User not authenticated',
        })
      }

      const prisma = (request.server as any).prisma
      const commands = new PushSubscriptionCommands(prisma)

      const result = await commands.create(
        {
          endpoint,
          keys,
          userAgent,
          deviceInfo,
        },
        userId
      )

      return reply.status(201).send(result)
    } catch (error: any) {
      request.log.error(error)

      if (error.message === 'Push subscription not found') {
        return reply.status(404).send({
          error: error.message,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  },

  async delete(request: DeletePushSubscriptionRequest, reply: FastifyReply) {
    try {
      const { id } = request.params
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          error: 'User not authenticated',
        })
      }

      const prisma = (request.server as any).prisma
      const commands = new PushSubscriptionCommands(prisma)

      await commands.delete(id, userId)

      return reply.status(204).send()
    } catch (error: any) {
      request.log.error(error)

      if (error.message === 'Push subscription not found') {
        return reply.status(404).send({
          error: error.message,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  },

  async listByUser(request: GetUserSubscriptionsRequest, reply: FastifyReply) {
    try {
      const { userId } = request.params
      const currentUserId = request.user?.id

      if (!currentUserId || currentUserId !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
        })
      }

      const prisma = (request.server as any).prisma
      const queries = new PushSubscriptionQueries(prisma)

      const result = await queries.listByUser(userId)

      return reply.send({ subscriptions: result })
    } catch (error: any) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  },

  async list(request: ListPushSubscriptionsRequest, reply: FastifyReply) {
    try {
      const { page = 1, limit = 10 } = request.query
      const prisma = (request.server as any).prisma
      const queries = new PushSubscriptionQueries(prisma)

      const result = await queries.list(page, limit)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  },

  async getVapidKey(request: FastifyRequest, reply: FastifyReply) {
    try {
      const fastify = request.server as any
      const publicKey = fastify.getVapidPublicKey()

      return reply.send({
        publicKey,
      })
    } catch (error: any) {
      request.log.error(error)
      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  },
}
