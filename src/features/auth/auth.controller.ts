import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthCommands } from './commands/auth.commands';
import { AuthQueries } from './queries/auth.queries';
import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  VerifyEmailRequest,
  ResendVerificationRequest,
  VerifyEmailResponse,
  ResendVerificationResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  GetProfilePermissionsRequest,
  ProfilePermissionsResponse
} from './auth.interfaces';

export const AuthController = {
  // === AUTH CRUD ===
  async register(request: RegisterRequest, reply: FastifyReply): Promise<RegisterResponse> {
    try {
      const { name, email, password } = request.body;

      const user = await AuthCommands.register({
        name,
        email,
        password
      });

      return reply.status(201).send({
        user,
        message: 'User registered successfully. Please check your email for verification.'
      });
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'User already exists with this email') {
        return reply.status(409).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async login(request: LoginRequest, reply: FastifyReply): Promise<LoginResponse> {
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
    } catch (error: any) {
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

  async forgotPassword(request: ForgotPasswordRequest, reply: FastifyReply): Promise<ForgotPasswordResponse> {
    try {
      const { email } = request.body;

      await AuthCommands.forgotPassword(email);

      return reply.send({
        message: 'If the email exists, a reset password link has been sent.'
      });
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'User not found') {
        return reply.status(404).send({
          error: 'If the email exists, a reset password link has been sent.'
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async resetPassword(request: ResetPasswordRequest, reply: FastifyReply): Promise<ResetPasswordResponse> {
    try {
      const { token, password } = request.body;

      await AuthCommands.resetPassword(token, password);

      return reply.send({
        message: 'Password reset successfully'
      });
    } catch (error: any) {
      request.log.error(error);

      if (error.message === 'Invalid or expired reset token') {
        return reply.status(401).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async verifyEmail(request: VerifyEmailRequest, reply: FastifyReply): Promise<VerifyEmailResponse> {
    try {
      const { token } = request.body;

      await AuthCommands.verifyEmail(token);

      return reply.send({
        message: 'Email verified successfully'
      });
    } catch (error: any) {
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

  async resendVerification(request: ResendVerificationRequest, reply: FastifyReply): Promise<ResendVerificationResponse> {
    try {
      const { email } = request.body;

      await AuthCommands.resendVerification(email);

      return reply.send({
        message: 'Verification email sent successfully'
      });
    } catch (error: any) {
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

  async refreshToken(request: FastifyRequest, reply: FastifyReply) {
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
    } catch (error: any) {
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

  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      // In a real application, you might want to blacklist the token
      // For now, we'll just return a success message
      return reply.send({
        message: 'Logout successful'
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  // === QUERIES ===
  async getProfile(request: FastifyRequest<{ Headers: { authorization: string } }>, reply: FastifyReply) {
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
    } catch (error: any) {
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

  async updateProfile(request: UpdateProfileRequest, reply: FastifyReply): Promise<UpdateProfileResponse> {
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
    } catch (error: any) {
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

  async getProfilePermissions(request: GetProfilePermissionsRequest, reply: FastifyReply): Promise<ProfilePermissionsResponse> {
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
    } catch (error: any) {
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

  async getActive(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await AuthQueries.getActiveUsers();

      return reply.send({ users });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getVerified(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await AuthQueries.getVerifiedUsers();

      return reply.send({ users });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getUnverified(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await AuthQueries.getUnverifiedUsers();

      return reply.send({ users });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const stats = await AuthQueries.getUserStats();

      return reply.send(stats);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async search(request: FastifyRequest<{ Querystring: { q: string; limit?: number } }>, reply: FastifyReply) {
    try {
      const { q, limit = 10 } = request.query;

      const users = await AuthQueries.searchUsers(q, limit);

      return reply.send({ users });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getPendingVerification(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await AuthQueries.getUsersWithPendingVerification();

      return reply.send({ users });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  },

  async getPendingReset(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await AuthQueries.getUsersWithPendingReset();

      return reply.send({ users });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }
};
