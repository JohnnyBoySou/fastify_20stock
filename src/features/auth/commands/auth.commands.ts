import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JWTPayload } from '../auth.interfaces';
import { db } from '@/plugins/prisma';

import { AuthQueries } from '../queries/auth.queries';
import { EmailService } from '@/services/email/email.service';

export const AuthCommands = {
  async register(data: { name: string; email: string; password: string; phone: string }) {
    const { name, email, password, phone } = data;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification code and token
    const emailVerificationCode = AuthCommands.generateVerificationCode();
    const emailVerificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const emailVerificationToken = AuthCommands.generateVerificationToken();

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        emailVerificationToken,
        emailVerificationCode,
        emailVerificationCodeExpires,
        emailVerified: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        emailVerified: true,
        createdAt: true
      }
    });

    // Send email verification with code
    try {
      await EmailService.sendEmailVerification({
        name,
        email,
        verificationCode: emailVerificationCode,
        expiresIn: '15 minutos'
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't fail registration if email fails
    }

    return user;
  },

  async login(data: { email: string; password: string }) {
    const { email, password } = data;

    // Find user
    const user = await db.user.findUnique({
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

    // Check if email is verified
    if (!user.emailVerified) {
      throw new Error('Email verification required');
    }

    // Update last login
    await db.user.update({
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
    const user = await db.user.findUnique({
      where: { email, status: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate reset code (6 digits)
    const resetCode = AuthCommands.generateVerificationCode();
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update user with reset code
    await db.user.update({
      where: { id: user.id },
      data: {
        resetPasswordCode: resetCode,
        resetPasswordExpires: resetExpires
      }
    });

    // Send reset password email with code
    try {
      await EmailService.sendPasswordResetEmail({
        name: user.name,
        email: user.email,
        resetCode: resetCode,
        expiresIn: '15 minutos'
      });
    } catch (error) {
      console.error('Failed to send reset password email:', error);
      // Don't fail the process if email fails
    }

    return { message: 'Reset password code sent to email' };
  },

  async verifyResetCode(email: string, code: string) {
    // Find user by email and reset code
    const user = await db.user.findFirst({
      where: {
        email,
        resetPasswordCode: code,
        resetPasswordExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      throw new Error('Invalid or expired reset code');
    }

    // Check if code is expired
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw new Error('Reset code expired');
    }

    return { message: 'Reset code verified successfully' };
  },

  async resetPassword(email: string, code: string, newPassword: string) {
    // Find user by email and reset code
    const user = await db.user.findFirst({
      where: {
        email,
        resetPasswordCode: code,
        resetPasswordExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      throw new Error('Invalid or expired reset code');
    }

    // Check if code is expired
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw new Error('Reset code expired');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and clear reset data
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordCode: null,
        resetPasswordExpires: null
      }
    });

    return { message: 'Password reset successfully' };
  },

  async verifyEmail(token: string) {
    // Find user by verification token
    const user = await db.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerified: false
      }
    });

    if (!user) {
      throw new Error('Invalid verification token');
    }

    // Update user as verified
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null
      }
    });

    return { message: 'Email verified successfully' };
  },

  async verifyEmailCode(email: string, code: string) {
    // Find user by email and verification code
    const user = await db.user.findFirst({
      where: {
        email,
        emailVerificationCode: code,
        emailVerificationCodeExpires: {
          gt: new Date()
        },
        emailVerified: false
      }
    });

    if (!user) {
      throw new Error('Invalid verification code');
    }

    // Check if code is expired
    if (user.emailVerificationCodeExpires && user.emailVerificationCodeExpires < new Date()) {
      throw new Error('Verification code expired');
    }

    // Update user as verified and clear verification data
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationCode: null,
        emailVerificationCodeExpires: null
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        createdAt: true
      }
    });

    return updatedUser;
  },

  async resendVerification(email: string) {
    // Find user
    const user = await db.user.findUnique({
      where: { email, status: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.emailVerified) {
      throw new Error('Email already verified');
    }

    // Generate new verification code and token
    const emailVerificationCode = AuthCommands.generateVerificationCode();
    const emailVerificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const emailVerificationToken = AuthCommands.generateVerificationToken();

    // Update user with new verification data
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerificationCode,
        emailVerificationCodeExpires,
        emailVerificationToken
      }
    });

    // Send new verification email with code
    try {
      await EmailService.sendEmailVerification({
        name: user.name,
        email: user.email,
        verificationCode: emailVerificationCode,
        expiresIn: '15 minutos'
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't fail the process if email fails
    }

    return { message: 'Verification email sent' };
  },

  async refreshToken(userId: string) {
    // Find user
    const user = await db.user.findUnique({
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

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
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
      const existingUser = await db.user.findFirst({
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
    const user = await db.user.update({
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
