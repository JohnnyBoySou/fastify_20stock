import { prisma } from '@/plugins/prisma'
import type { AuthUser } from '../auth.interfaces'

export const AuthQueries = {
  async getById(id: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { id, status: true },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        status: true,
        
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  },

  async getByEmail(email: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { email, status: true },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        status: true,
        
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  },

  async getByResetToken(token: string): Promise<AuthUser | null> {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
        status: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  },

  async getByVerificationToken(token: string): Promise<AuthUser | null> {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerified: false,
        status: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        status: true,
        
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  },

  async getActiveUsers() {
    const users = await prisma.user.findMany({
      where: { status: true },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        status: true,
        
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return users
  },

  async getVerifiedUsers() {
    const users = await prisma.user.findMany({
      where: {
        status: true,
        emailVerified: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return users
  },

  async getUnverifiedUsers() {
    const users = await prisma.user.findMany({
      where: {
        status: true,
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return users
  },

  async getUserStats() {
    const [totalUsers, activeUsers, verifiedUsers, unverifiedUsers, recentLogins] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { status: true } }),
        this.prisma.user.count({
          where: {
            status: true,
            emailVerified: true,
          },
        }),
        this.prisma.user.count({
          where: {
            status: true,
            emailVerified: false,
          },
        }),
        this.prisma.user.count({
          where: {
            status: true,
            lastLoginAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        }),
      ])

    return {
      totalUsers,
      activeUsers,
      verifiedUsers,
      unverifiedUsers,
      recentLogins,
    }
  },

  async searchUsers(searchTerm: string, limit = 10) {
    const users = await prisma.user.findMany({
      where: {
        status: true,
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        status: true,
        
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return users
  },

  async getUsersWithPendingVerification() {
    const users = await prisma.user.findMany({
      where: {
        status: true,
        emailVerified: false,
        emailVerificationToken: {
          not: null,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        emailVerificationToken: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return users
  },

  async getUsersWithPendingReset() {
    const users = await prisma.user.findMany({
      where: {
        status: true,
        resetPasswordToken: {
          not: null,
        },
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        resetPasswordToken: true,
        resetPasswordExpires: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return users
  },

  // Verify if user exists by email
  async userExists(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email },
    })

    return count > 0
  },

  // Verify if email is already verified
  async isEmailVerified(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true },
    })

    return user?.emailVerified || false
  },

  // Get user profile for authenticated user
  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId, status: true },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        status: true,
        lastLoginAt: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  },

  async getUserPlan(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    return subscription || null
  },

  async getStoreByOwner(userId: string) {
    const store = await prisma.store.findFirst({
      where: {
        ownerId: userId,
        status: true,
      },
      select: {
        id: true,
        name: true,
        cnpj: true,
        email: true,
        phone: true,
        status: true,
        cep: true,
        city: true,
        state: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return store
  },

}
