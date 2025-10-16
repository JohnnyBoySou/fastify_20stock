import { WebhookHandler } from '../../services/payment/webhook-handler';
import { PaymentService } from '../../services/payment/payment.service';
import { WebhookEventType } from '../../services/payment/payment-gateway.interface';

export class WebhookService {
  private webhookHandler: WebhookHandler;
  private paymentService: PaymentService;

  constructor() {
    this.webhookHandler = new WebhookHandler();
    this.paymentService = new PaymentService();
  }

  async processWebhook(
    gateway: string,
    payload: any,
    signature?: string
  ): Promise<{
    success: boolean;
    eventId?: string;
    eventType?: string;
    error?: string;
  }> {
    try {
      // Validar gateway
      const availableGateways = this.paymentService.getAvailableGateways();
      const gatewayExists = availableGateways.some(g => g.name === gateway);
      
      if (!gatewayExists) {
        return {
          success: false,
          error: `Gateway '${gateway}' not supported`
        };
      }

      // Processar webhook
      const result = await this.webhookHandler.processWebhook(
        gateway,
        payload,
        signature
      );

      // Log do webhook (em uma implementação real, isso seria salvo no banco)
      await this.logWebhook({
        gateway,
        eventType: result.event?.type || 'unknown',
        eventId: result.event?.id,
        success: result.success,
        payload,
        response: result.event,
        error: result.error,
        processedAt: new Date()
      });

      return {
        success: result.success,
        eventId: result.event?.id,
        eventType: result.event?.type,
        error: result.error
      };
    } catch (error) {
      // Log do erro
      await this.logWebhook({
        gateway,
        eventType: 'error',
        success: false,
        payload,
        error: error instanceof Error ? error.message : 'Unknown error',
        processedAt: new Date()
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async verifyWebhook(
    gateway: string,
    payload: any,
    signature: string
  ): Promise<boolean> {
    try {
      return await this.webhookHandler.verifyWebhook(
        gateway,
        payload,
        signature
      );
    } catch (error) {
      console.error('Error verifying webhook:', error);
      return false;
    }
  }

  async getWebhookLogs(params: {
    page?: number
    limit?: number
    gateway?: string
    eventType?: string
    success?: boolean
    startDate?: string
    endDate?: string
  }) {
    // Em uma implementação real, isso seria buscado do banco de dados
    // Por enquanto, retornamos dados simulados
    
    const mockLogs = [
      {
        id: 'log_1',
        gateway: 'stripe',
        eventType: 'payment.completed',
        eventId: 'evt_123',
        success: true,
        payload: { type: 'payment_intent.succeeded' },
        processedAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutos atrás
        createdAt: new Date(Date.now() - 1000 * 60 * 5)
      },
      {
        id: 'log_2',
        gateway: 'abacate-pay',
        eventType: 'payment.failed',
        eventId: 'evt_456',
        success: false,
        payload: { type: 'payment_failed' },
        error: 'Payment declined',
        processedAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutos atrás
        createdAt: new Date(Date.now() - 1000 * 60 * 10)
      }
    ];

    // Aplicar filtros
    let filteredLogs = mockLogs;

    if (params.gateway) {
      filteredLogs = filteredLogs.filter(log => log.gateway === params.gateway);
    }

    if (params.eventType) {
      filteredLogs = filteredLogs.filter(log => log.eventType === params.eventType);
    }

    if (params.success !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.success === params.success);
    }

    if (params.startDate) {
      const startDate = new Date(params.startDate);
      filteredLogs = filteredLogs.filter(log => log.processedAt >= startDate);
    }

    if (params.endDate) {
      const endDate = new Date(params.endDate);
      filteredLogs = filteredLogs.filter(log => log.processedAt <= endDate);
    }

    // Paginação
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const items = filteredLogs.slice(skip, skip + limit);
    const total = filteredLogs.length;

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getWebhookStats() {
    // Em uma implementação real, isso seria calculado do banco de dados
    const mockStats = {
      total: 150,
      successful: 142,
      failed: 8,
      byGateway: {
        'stripe': {
          total: 100,
          successful: 95,
          failed: 5
        },
        'abacate-pay': {
          total: 50,
          successful: 47,
          failed: 3
        }
      },
      byEventType: {
        'payment.completed': 95,
        'payment.failed': 8,
        'payment.cancelled': 2,
        'invoice.paid': 45,
        'invoice.failed': 3
      },
      last24Hours: {
        total: 25,
        successful: 24,
        failed: 1
      }
    };

    return mockStats;
  }

  async getWebhookHealth() {
    try {
      const gatewayHealth = await this.paymentService.getGatewayHealth();
      
      const gateways = gatewayHealth.map(gateway => ({
        name: gateway.name,
        available: gateway.available,
        lastWebhook: new Date(Date.now() - Math.random() * 1000 * 60 * 60), // Mock
        errorRate: Math.random() * 5 // Mock: 0-5% error rate
      }));

      const availableGateways = gateways.filter(g => g.available).length;
      const totalGateways = gateways.length;

      return {
        gateways,
        overall: {
          available: availableGateways > 0,
          totalGateways,
          availableGateways
        }
      };
    } catch (error) {
      console.error('Error getting webhook health:', error);
      return {
        gateways: [],
        overall: {
          available: false,
          totalGateways: 0,
          availableGateways: 0
        }
      };
    }
  }

  async getSupportedEvents(): Promise<WebhookEventType[]> {
    return this.webhookHandler.getSupportedEvents();
  }

  async retryFailedWebhook(webhookId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Em uma implementação real, aqui seria buscado o webhook falhado do banco
      // e tentado processar novamente
      console.log(`Retrying failed webhook: ${webhookId}`);
      
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async deleteWebhookLog(webhookId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Em uma implementação real, aqui seria deletado o log do banco
      console.log(`Deleting webhook log: ${webhookId}`);
      
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async logWebhook(data: {
    gateway: string
    eventType: string
    eventId?: string
    success: boolean
    payload: any
    response?: any
    error?: string
    processedAt: Date
  }): Promise<void> {
    // Em uma implementação real, isso seria salvo no banco de dados
    console.log('Webhook logged:', {
      ...data,
      id: `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    });
  }
}
