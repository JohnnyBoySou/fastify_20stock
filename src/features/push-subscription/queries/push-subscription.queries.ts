export class PushSubscriptionQueries {
  constructor(private prisma: any) {}

  async getById(id: string, userId: string) {
    const subscription = await this.prisma.pushSubscription.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!subscription) {
      throw new Error('Push subscription not found')
    }

    return subscription
  }

  async listByUser(userId: string) {
    return await this.prisma.pushSubscription.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async list(page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      this.prisma.pushSubscription.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.pushSubscription.count(),
    ])

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
}
