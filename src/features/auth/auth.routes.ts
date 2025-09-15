import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  refreshTokenSchema,
  logoutSchema,
  updateProfileSchema,
  getProfilePermissionsSchema
} from './auth.schema';

export async function AuthRoutes(fastify: FastifyInstance) {
  // === AUTH ENDPOINTS ===

  // Register
  fastify.post('/register', {
    schema: registerSchema,
    handler: AuthController.register
  });

  // Login
  fastify.post('/login', {
    schema: loginSchema,
    handler: AuthController.login
  });

  // Forgot Password
  fastify.post('/forgot-password', {
    schema: forgotPasswordSchema,
    handler: AuthController.forgotPassword
  });

  // Reset Password
  fastify.post('/reset-password', {
    schema: resetPasswordSchema,
    handler: AuthController.resetPassword
  });

  // Verify Email
  fastify.post('/verify-email', {
    schema: verifyEmailSchema,
    handler: AuthController.verifyEmail
  });

  // Resend Verification
  fastify.post('/resend-verification', {
    schema: resendVerificationSchema,
    handler: AuthController.resendVerification
  });

  // Refresh Token
  fastify.post('/refresh-token', {
    schema: refreshTokenSchema,
    handler: AuthController.refreshToken
  });

  // Logout
  fastify.post('/logout', {
    schema: logoutSchema,
    handler: AuthController.logout
  });

  // === USER PROFILE ===

  // Get Profile (requires authentication)
  fastify.get('/profile', {
    handler: AuthController.getProfile
  });

  // Update Profile (requires authentication)
  fastify.put('/profile', {
    schema: updateProfileSchema,
    handler: AuthController.updateProfile
  });

  // Get Profile Permissions (requires authentication)
  fastify.get('/profile/permissions', {
    schema: getProfilePermissionsSchema,
    handler: AuthController.getProfilePermissions
  });

  // === ADMIN ENDPOINTS ===

  // Get all active users
  fastify.get('/users/active', {
    handler: AuthController.getActive
  });

  // Get all verified users
  fastify.get('/users/verified', {
    handler: AuthController.getVerified
  });

  // Get all unverified users
  fastify.get('/users/unverified', {
    handler: AuthController.getUnverified
  });

  // Get user statistics
  fastify.get('/stats', {
    handler: AuthController.getStats
  });

  // Search users
  fastify.get('/search', {
    handler: AuthController.search
  });

  // Get users with pending email verification
  fastify.get('/users/pending-verification', {
    handler: AuthController.getPendingVerification
  });

  // Get users with pending password reset
  fastify.get('/users/pending-reset', {
    handler: AuthController.getPendingReset
  });
}
