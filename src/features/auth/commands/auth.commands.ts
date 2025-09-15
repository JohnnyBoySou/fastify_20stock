import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JWTPayload } from '../auth.interfaces';
import { prisma } from '../../../plugins/prisma';
import { AuthQueries } from '../queries/auth.queries';

export const AuthCommands = {
  async register(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const emailVerificationToken = AuthCommands.generateVerificationToken();

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerificationToken,
        emailVerified: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        createdAt: true
      }
    });

    // TODO: Send verification email
    // await this.emailService.sendVerificationEmail(email, emailVerificationToken, name)

    return user;
  },

  async login(data: { email: string; password: string }) {
    const { email, password } = data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email, status: true }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Get user's store (if exists)
    const store = await AuthQueries.getStoreByOwner(user.id);

    // Generate JWT token
    const token = AuthCommands.generateJWT({
      userId: user.id,
      email: user.email,
      roles: user.roles
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        lastLoginAt: new Date()
      },
      store: store || undefined,
      token
    };
  },

  async forgotPassword(email: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email, status: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate reset token
    const resetToken = AuthCommands.generateResetToken();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      }
    });

    // TODO: Send reset password email
    // await this.emailService.sendResetPasswordEmail(email, resetToken, user.name)

    return { message: 'Reset password email sent' };
  },

  async resetPassword(token: string, newPassword: string) {
    // Find user by reset token
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    return { message: 'Password reset successfully' };
  },

  async verifyEmail(token: string) {
    // Find user by verification token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerified: false
      }
    });

    if (!user) {
      throw new Error('Invalid verification token');
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null
      }
    });

    return { message: 'Email verified successfully' };
  },

  async resendVerification(email: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email, status: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.emailVerified) {
      throw new Error('Email already verified');
    }

    // Generate new verification token
    const emailVerificationToken = AuthCommands.generateVerificationToken();

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken
      }
    });

    // TODO: Send verification email
    // await this.emailService.sendVerificationEmail(email, emailVerificationToken, user.name)

    return { message: 'Verification email sent' };
  },

  async refreshToken(userId: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId, status: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate new JWT token
    const token = AuthCommands.generateJWT({
      userId: user.id,
      email: user.email,
      roles: user.roles
    });

    return { token, message: 'Token refreshed successfully' };
  },

  // Helper methods
  generateJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    return jwt.sign(payload, secret, { expiresIn: '7d' });
  },

  generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  },

  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  },

  // Verify JWT token
  verifyToken(token: string): JWTPayload {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    return jwt.verify(token, secret) as JWTPayload;
  },

  // Extract token from Authorization header
  extractToken(authHeader: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid authorization header');
    }
    return authHeader.substring(7);
  },

  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    const { name, email } = data;

    // Check if email is being changed and if it already exists
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: userId }
        }
      });

      if (existingUser) {
        throw new Error('Email already exists');
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) {
      updateData.email = email;
      updateData.emailVerified = false; // Reset verification when email changes
      updateData.emailVerificationToken = AuthCommands.generateVerificationToken();
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        status: true,
        roles: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // TODO: Send verification email if email was changed
    // if (email) {
    //   await this.emailService.sendVerificationEmail(email, user.emailVerificationToken, user.name)
    // }

    return user;
  }
};
