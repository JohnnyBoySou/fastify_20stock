"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = AuthRoutes;
const auth_controller_1 = require("./auth.controller");
const auth_schema_1 = require("./auth.schema");
async function AuthRoutes(fastify) {
    // === AUTH ENDPOINTS ===
    // Register
    fastify.post('/signup', {
        schema: auth_schema_1.registerSchema,
        handler: auth_controller_1.AuthController.register
    });
    // Login
    fastify.post('/signin', {
        schema: auth_schema_1.loginSchema,
        handler: auth_controller_1.AuthController.login
    });
    // Forgot Password
    fastify.post('/forgot-password', {
        schema: auth_schema_1.forgotPasswordSchema,
        handler: auth_controller_1.AuthController.forgotPassword
    });
    // Verify Reset Code
    fastify.post('/verify-reset-code', {
        schema: auth_schema_1.verifyResetCodeSchema,
        handler: auth_controller_1.AuthController.verifyResetCode
    });
    // Reset Password
    fastify.post('/reset-password', {
        schema: auth_schema_1.resetPasswordSchema,
        handler: auth_controller_1.AuthController.resetPassword
    });
    // Verify Email
    fastify.post('/verify-email', {
        schema: auth_schema_1.verifyEmailSchema,
        handler: auth_controller_1.AuthController.verifyEmail
    });
    // Verify Email Code
    fastify.post('/verify-email-code', {
        schema: auth_schema_1.verifyEmailCodeSchema,
        handler: auth_controller_1.AuthController.verifyEmailCode
    });
    // Google Login
    fastify.post('/google', {
        schema: auth_schema_1.googleLoginSchema,
        handler: auth_controller_1.AuthController.googleLogin
    });
    // Resend Verification
    fastify.post('/resend-verification', {
        schema: auth_schema_1.resendVerificationSchema,
        handler: auth_controller_1.AuthController.resendVerification
    });
    // Refresh Token
    fastify.post('/refresh-token', {
        schema: auth_schema_1.refreshTokenSchema,
        handler: auth_controller_1.AuthController.refreshToken
    });
    // Logout
    fastify.post('/logout', {
        schema: auth_schema_1.logoutSchema,
        handler: auth_controller_1.AuthController.logout
    });
    // === USER PROFILE ===
    // Get Profile (requires authentication)
    fastify.get('/profile', {
        handler: auth_controller_1.AuthController.getProfile
    });
    // Update Profile (requires authentication)
    fastify.put('/profile', {
        schema: auth_schema_1.updateProfileSchema,
        handler: auth_controller_1.AuthController.updateProfile
    });
    // Get Profile Permissions (requires authentication)
    fastify.get('/profile/permissions', {
        schema: auth_schema_1.getProfilePermissionsSchema,
        handler: auth_controller_1.AuthController.getProfilePermissions
    });
    // === ADMIN ENDPOINTS ===
    // Get all active users
    fastify.get('/users/active', {
        handler: auth_controller_1.AuthController.getActive
    });
    // Get all verified users
    fastify.get('/users/verified', {
        handler: auth_controller_1.AuthController.getVerified
    });
    // Get all unverified users
    fastify.get('/users/unverified', {
        handler: auth_controller_1.AuthController.getUnverified
    });
    // Get user statistics
    fastify.get('/stats', {
        handler: auth_controller_1.AuthController.getStats
    });
    // Search users
    fastify.get('/search', {
        handler: auth_controller_1.AuthController.search
    });
    // Get users with pending email verification
    fastify.get('/users/pending-verification', {
        handler: auth_controller_1.AuthController.getPendingVerification
    });
    // Get users with pending password reset
    fastify.get('/users/pending-reset', {
        handler: auth_controller_1.AuthController.getPendingReset
    });
}
