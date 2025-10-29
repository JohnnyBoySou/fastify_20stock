import { PushSubscriptionBody } from '../push-subscription.interfaces';

export class PushSubscriptionCommands {
  constructor(private prisma: any) {}

  async create(data: PushSubscriptionBody, userId: string) {
    // Verificar se já existe esta subscription para o usuário
    const existing = await this.prisma.pushSubscription.findFirst({
      where: {
        userId,
        endpoint: data.endpoint
      }
    });

    if (existing) {
      // Atualizar subscription existente
      return await this.prisma.pushSubscription.update({
        where: { id: existing.id },
        data: {
          endpoint: data.endpoint,
          p256dh: data.keys.p256dh,
          auth: data.keys.auth,
          userAgent: data.userAgent,
          deviceInfo: data.deviceInfo,
          updatedAt: new Date()
        }
      });
    }

    // Criar nova subscription
    return await this.prisma.pushSubscription.create({
      data: {
        userId,
        endpoint: data.endpoint,
        p256dh: data.keys.p256dh,
        auth: data.keys.auth,
        userAgent: data.userAgent,
        deviceInfo: data.deviceInfo
      }
    });
  }

  async delete(id: string, userId: string) {
    // Verificar se a subscription pertence ao usuário
    const subscription = await this.prisma.pushSubscription.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!subscription) {
      throw new Error('Push subscription not found');
    }

    return await this.prisma.pushSubscription.delete({
      where: { id }
    });
  }

  async deleteByEndpoint(endpoint: string, userId: string) {
    return await this.prisma.pushSubscription.deleteMany({
      where: {
        endpoint,
        userId
      }
    });
  }

  async deleteByUser(userId: string) {
    return await this.prisma.pushSubscription.deleteMany({
      where: {
        userId
      }
    });
  }
}

