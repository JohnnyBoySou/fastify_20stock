import { PrismaClient } from '../generated/prisma'
import { AuthUser } from '../features/auth/auth.interfaces'
import { StoreRole } from '../middlewares/authorization.middleware'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }

  interface FastifyRequest {
    user?: AuthUser
    token?: string
    storeRole?: StoreRole
    store?: {
      id: string
      name: string
      ownerId: string
    }
  }
}
