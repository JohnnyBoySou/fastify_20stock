import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthCommands } from '../features/auth/commands/auth.commands';
import { AuthQueries } from '../features/auth/queries/auth.queries';
import { JWTPayload, AuthUser } from '../features/auth/auth.interfaces';

// Extend FastifyRequest to include user information
declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser;
    token?: string;
  }
}

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // Get authorization header
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply.status(401).send({
        error: 'Authorization header required'
      });
    }

    const token = AuthCommands.extractToken(authHeader);

    const payload: JWTPayload = AuthCommands.verifyToken(token);
    const user = await AuthQueries.getUserProfile(payload.userId);

    if (!user || !user.status) {
      return reply.status(401).send({
        error: 'User not found or inactive'
      });
    }

    request.user = user;
    request.token = token;

    return;
  } catch (error: any) {
    request.log.error(error);

    if (error.message === 'Invalid authorization header') {
      return reply.status(401).send({
        error: 'Invalid authorization header format'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return reply.status(401).send({
        error: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return reply.status(401).send({
        error: 'Token expired'
      });
    }

    return reply.status(500).send({
      error: 'Internal server error'
    });
  }
};

// Optional auth middleware - doesn't fail if no token
export const optionalAuthMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      // No token provided, continue without user
      return;
    }

    const token = AuthCommands.extractToken(authHeader);
    const payload: JWTPayload = AuthCommands.verifyToken(token);

    const user = await AuthQueries.getUserProfile(payload.userId);

    if (user && user.status) {
      request.user = user;
      request.token = token;
    }

    return;
  } catch (error: unknown) {
    // Log error but don't fail the request
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    request.log.warn(`Optional auth failed: ${errorMessage}`);
    return;
  }
};
