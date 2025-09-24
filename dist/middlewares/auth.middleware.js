import { AuthCommands } from '../features/auth/commands/auth.commands';
import { AuthQueries } from '../features/auth/queries/auth.queries';
export const authMiddleware = async (request, reply) => {
    try {
        // Get authorization header
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return reply.status(401).send({
                error: 'Authorization header required'
            });
        }
        // Extract token from header
        const token = AuthCommands.extractToken(authHeader);
        // Verify token
        const payload = AuthCommands.verifyToken(token);
        // Get user from database to ensure user still exists and is active
        const user = await AuthQueries.getUserProfile(payload.userId);
        if (!user || !user.status) {
            return reply.status(401).send({
                error: 'User not found or inactive'
            });
        }
        // Attach user and token to request
        request.user = user;
        request.token = token;
        // Continue to next middleware/handler
        return;
    }
    catch (error) {
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
export const optionalAuthMiddleware = async (request, reply) => {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            // No token provided, continue without user
            return;
        }
        const token = AuthCommands.extractToken(authHeader);
        const payload = AuthCommands.verifyToken(token);
        const user = await AuthQueries.getUserProfile(payload.userId);
        if (user && user.status) {
            request.user = user;
            request.token = token;
        }
        return;
    }
    catch (error) {
        // Log error but don't fail the request
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        request.log.warn(`Optional auth failed: ${errorMessage}`);
        return;
    }
};
