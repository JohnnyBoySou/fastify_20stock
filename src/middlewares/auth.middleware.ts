/**
 * ================================
 * MIDDLEWARE DE AUTENTICAÇÃO
 * ================================
 * 
 * Este middleware verifica e valida tokens JWT nas requisições.
 * Retorna o usuário autenticado.
 * 
 */

import type { FastifyReply, FastifyRequest } from 'fastify'
import type { JWTPayload } from '../features/auth/auth.interfaces'
import { AuthCommands } from '../features/auth/commands/auth.commands'
import { AuthQueries } from '../features/auth/queries/auth.queries'

export const Auth = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const header = request.headers.authorization

    if (!header) {
      return reply.status(401).send({
        error: 'Authorization header required',
      })
    }

    const token = AuthCommands.extractToken(header)
    const payload: JWTPayload = AuthCommands.verifyToken(token)
    const user = await AuthQueries.getUserProfile(payload.userId)

    if (!user || !user.status) {
      return reply.status(401).send({
        error: 'User not found or inactive',
      })
    }

    request.user = user

    return
  } catch (error: unknown) {
    request.log.error(error)

    if (error instanceof Error && error.message === 'Invalid authorization header') {
      return reply.status(401).send({
        error: 'Invalid authorization header format',
      })
    }

    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return reply.status(401).send({
        error: 'Invalid token',
      })
    }

    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return reply.status(401).send({
        error: 'Token expired',
      })
    }

    return reply.status(500).send({
      error: 'Internal server error',
    })
  }
}
