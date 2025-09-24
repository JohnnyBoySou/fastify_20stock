import { AuthCommands } from './commands/auth.commands';
import { AuthQueries } from './queries/auth.queries';
export const AuthController = {
    // === AUTH CRUD ===
    async register(request, reply) {
        try {
            const { name, email, password, phone } = request.body;
            const user = await AuthCommands.register({
                name,
                email,
                phone,
                password
            });
            return reply.status(201).send({
                user,
                message: 'Usuário registrado com sucesso. Verifique seu email para o código de confirmação de 6 dígitos.'
            });
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'User already exists with this email') {
                return reply.status(409).send({
                    error: "Já existe um usuário com este email"
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async login(request, reply) {
        try {
            const { email, password } = request.body;
            const result = await AuthCommands.login({
                email,
                password
            });
            return reply.send({
                user: result.user,
                store: result.store,
                token: result.token,
                message: 'Login successful'
            });
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Invalid credentials') {
                return reply.status(401).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async forgotPassword(request, reply) {
        try {
            const { email } = request.body;
            await AuthCommands.forgotPassword(email);
            return reply.send({
                message: 'If the email exists, a reset password code has been sent.'
            });
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'User not found') {
                return reply.status(404).send({
                    error: 'If the email exists, a reset password code has been sent.'
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async verifyResetCode(request, reply) {
        try {
            const { email, code } = request.body;
            await AuthCommands.verifyResetCode(email, code);
            return reply.send({
                message: 'Reset code verified successfully'
            });
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Invalid or expired reset code') {
                return reply.status(401).send({
                    error: error.message
                });
            }
            if (error.message === 'Reset code expired') {
                return reply.status(401).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async resetPassword(request, reply) {
        try {
            const { email, code, password } = request.body;
            await AuthCommands.resetPassword(email, code, password);
            return reply.send({
                message: 'Password reset successfully'
            });
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Invalid or expired reset code') {
                return reply.status(401).send({
                    error: error.message
                });
            }
            if (error.message === 'Reset code expired') {
                return reply.status(401).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async verifyEmail(request, reply) {
        try {
            const { token } = request.body;
            await AuthCommands.verifyEmail(token);
            return reply.send({
                message: 'Email verified successfully'
            });
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Invalid verification token') {
                return reply.status(401).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async verifyEmailCode(request, reply) {
        try {
            const { email, code } = request.body;
            const user = await AuthCommands.verifyEmailCode(email, code);
            return reply.send({
                message: 'Email verified successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    emailVerified: user.emailVerified
                }
            });
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Invalid verification code' || error.message === 'Verification code expired') {
                return reply.status(401).send({
                    error: error.message
                });
            }
            if (error.message === 'User not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async resendVerification(request, reply) {
        try {
            const { email } = request.body;
            await AuthCommands.resendVerification(email);
            return reply.send({
                message: 'Verification email sent successfully'
            });
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'User not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            if (error.message === 'Email already verified') {
                return reply.status(400).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async refreshToken(request, reply) {
        try {
            const authHeader = request.headers.authorization;
            if (!authHeader) {
                return reply.status(401).send({
                    error: 'Authorization header required'
                });
            }
            const token = AuthCommands.extractToken(authHeader);
            const payload = AuthCommands.verifyToken(token);
            const result = await AuthCommands.refreshToken(payload.userId);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Invalid authorization header' || error.message === 'User not found') {
                return reply.status(401).send({
                    error: 'Invalid token'
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async logout(request, reply) {
        try {
            // In a real application, you might want to blacklist the token
            // For now, we'll just return a success message
            return reply.send({
                message: 'Logout successful'
            });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    // === QUERIES ===
    async getProfile(request, reply) {
        try {
            const authHeader = request.headers.authorization;
            if (!authHeader) {
                return reply.status(401).send({
                    error: 'Authorization header required'
                });
            }
            const token = AuthCommands.extractToken(authHeader);
            const payload = AuthCommands.verifyToken(token);
            const user = await AuthQueries.getUserProfile(payload.userId);
            return reply.send({ user });
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Invalid authorization header' || error.message === 'User not found') {
                return reply.status(401).send({
                    error: 'Invalid token'
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async updateProfile(request, reply) {
        try {
            const authHeader = request.headers.authorization;
            if (!authHeader) {
                return reply.status(401).send({
                    error: 'Authorization header required'
                });
            }
            const token = AuthCommands.extractToken(authHeader);
            const payload = AuthCommands.verifyToken(token);
            const { name, email } = request.body;
            // Validate that at least one field is provided
            if (!name && !email) {
                return reply.status(400).send({
                    error: 'At least one field (name or email) must be provided'
                });
            }
            const user = await AuthCommands.updateProfile(payload.userId, { name, email });
            return reply.send({
                user,
                message: 'Profile updated successfully'
            });
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Invalid authorization header') {
                return reply.status(401).send({
                    error: 'Invalid token'
                });
            }
            if (error.message === 'Email already exists') {
                return reply.status(409).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getProfilePermissions(request, reply) {
        try {
            const authHeader = request.headers.authorization;
            if (!authHeader) {
                return reply.status(401).send({
                    error: 'Authorization header required'
                });
            }
            const token = AuthCommands.extractToken(authHeader);
            const payload = AuthCommands.verifyToken(token);
            const { storeId, active, page, limit } = request.query;
            const permissions = await AuthQueries.getProfilePermissions(payload.userId, {
                storeId,
                active,
                page,
                limit
            });
            return reply.send(permissions);
        }
        catch (error) {
            request.log.error(error);
            if (error.message === 'Invalid authorization header') {
                return reply.status(401).send({
                    error: 'Invalid token'
                });
            }
            if (error.message === 'User not found') {
                return reply.status(404).send({
                    error: error.message
                });
            }
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getActive(request, reply) {
        try {
            const users = await AuthQueries.getActiveUsers();
            return reply.send({ users });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getVerified(request, reply) {
        try {
            const users = await AuthQueries.getVerifiedUsers();
            return reply.send({ users });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getUnverified(request, reply) {
        try {
            const users = await AuthQueries.getUnverifiedUsers();
            return reply.send({ users });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getStats(request, reply) {
        try {
            const stats = await AuthQueries.getUserStats();
            return reply.send(stats);
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async search(request, reply) {
        try {
            const { q, limit = 10 } = request.query;
            const users = await AuthQueries.searchUsers(q, limit);
            return reply.send({ users });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getPendingVerification(request, reply) {
        try {
            const users = await AuthQueries.getUsersWithPendingVerification();
            return reply.send({ users });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    },
    async getPendingReset(request, reply) {
        try {
            const users = await AuthQueries.getUsersWithPendingReset();
            return reply.send({ users });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    }
};
