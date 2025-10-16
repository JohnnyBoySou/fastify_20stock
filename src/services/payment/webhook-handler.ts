import { PaymentService } from './payment.service';
import { WebhookEventType, WebhookEvent } from './payment-gateway.interface';

export class WebhookHandler {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  async processWebhook(
    gatewayName: string,
    payload: any,
    signature?: string
  ): Promise<{
    success: boolean;
    event?: WebhookEvent;
    error?: string;
  }> {
    try {
      // Processar webhook através do gateway
      const result = await this.paymentService.handleWebhook(
        gatewayName,
        payload,
        signature
      );

      if (!result.success) {
        return {
          success: false,
          error: result.error
        };
      }

      // Criar evento padronizado
      const webhookEvent: WebhookEvent = {
        id: payload.id || `webhook_${Date.now()}`,
        type: result.eventType as WebhookEventType,
        data: {
          paymentId: result.paymentId,
          invoiceId: result.invoiceId,
          customerId: result.customerId,
          amount: payload.data?.object?.amount || payload.data?.amount,
          currency: payload.data?.object?.currency || payload.data?.currency,
          status: result.status,
          metadata: payload.data?.object?.metadata || payload.data?.metadata
        },
        createdAt: new Date(),
        gateway: gatewayName
      };

      // Processar evento baseado no tipo
      await this.processEvent(webhookEvent);

      return {
        success: true,
        event: webhookEvent
      };
    } catch (error) {
      console.error('Error processing webhook:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async processEvent(event: WebhookEvent): Promise<void> {
    try {
      console.log(`Processing webhook event: ${event.type}`, event);

      switch (event.type) {
        case 'payment.completed':
          await this.handlePaymentCompleted(event);
          break;
        
        case 'payment.failed':
          await this.handlePaymentFailed(event);
          break;
        
        case 'payment.cancelled':
          await this.handlePaymentCancelled(event);
          break;
        
        case 'payment.refunded':
          await this.handlePaymentRefunded(event);
          break;
        
        case 'invoice.paid':
          await this.handleInvoicePaid(event);
          break;
        
        case 'invoice.failed':
          await this.handleInvoiceFailed(event);
          break;
        
        case 'subscription.created':
          await this.handleSubscriptionCreated(event);
          break;
        
        case 'subscription.updated':
          await this.handleSubscriptionUpdated(event);
          break;
        
        case 'subscription.cancelled':
          await this.handleSubscriptionCancelled(event);
          break;
        
        case 'subscription.renewed':
          await this.handleSubscriptionRenewed(event);
          break;
        
        default:
          console.log(`Unhandled webhook event type: ${event.type}`);
      }
    } catch (error) {
      console.error(`Error processing event ${event.type}:`, error);
      throw error;
    }
  }

  private async handlePaymentCompleted(event: WebhookEvent): Promise<void> {
    // Atualizar status da fatura para paga
    if (event.data.invoiceId) {
      // Aqui seria feita a atualização no banco de dados
      console.log(`Updating invoice ${event.data.invoiceId} to PAID`);
      
      // Em uma implementação real, aqui seria usado o InvoiceCommands
      // await invoiceCommands.markAsPaid(event.data.invoiceId, event.data.paymentId);
    }

    // Enviar email de confirmação
    if (event.data.customerId) {
      console.log(`Sending payment confirmation email to customer ${event.data.customerId}`);
      // await emailService.sendPaymentConfirmation(event.data.customerId, event.data);
    }
  }

  private async handlePaymentFailed(event: WebhookEvent): Promise<void> {
    // Atualizar status da fatura para falhada
    if (event.data.invoiceId) {
      console.log(`Updating invoice ${event.data.invoiceId} to FAILED`);
      // await invoiceCommands.markAsFailed(event.data.invoiceId);
    }

    // Enviar email de falha no pagamento
    if (event.data.customerId) {
      console.log(`Sending payment failed email to customer ${event.data.customerId}`);
      // await emailService.sendPaymentFailed(event.data.customerId, event.data);
    }

    // Tentar processar novamente após um delay (opcional)
    // await scheduleRetry(event.data.invoiceId);
  }

  private async handlePaymentCancelled(event: WebhookEvent): Promise<void> {
    // Atualizar status da fatura para cancelada
    if (event.data.invoiceId) {
      console.log(`Updating invoice ${event.data.invoiceId} to CANCELLED`);
      // await invoiceCommands.updateStatus(event.data.invoiceId, 'CANCELLED');
    }
  }

  private async handlePaymentRefunded(event: WebhookEvent): Promise<void> {
    // Processar reembolso
    if (event.data.invoiceId) {
      console.log(`Processing refund for invoice ${event.data.invoiceId}`);
      // await invoiceCommands.processRefund(event.data.invoiceId, event.data);
    }
  }

  private async handleInvoicePaid(event: WebhookEvent): Promise<void> {
    // Atualizar status da fatura e customer
    if (event.data.invoiceId) {
      console.log(`Invoice ${event.data.invoiceId} marked as paid`);
      // await invoiceCommands.markAsPaid(event.data.invoiceId);
    }

    if (event.data.customerId) {
      console.log(`Updating customer ${event.data.customerId} subscription status`);
      // await customerCommands.renewSubscription(event.data.customerId);
    }
  }

  private async handleInvoiceFailed(event: WebhookEvent): Promise<void> {
    // Processar falha na fatura
    if (event.data.invoiceId) {
      console.log(`Invoice ${event.data.invoiceId} failed`);
      // await invoiceCommands.markAsFailed(event.data.invoiceId);
    }
  }

  private async handleSubscriptionCreated(event: WebhookEvent): Promise<void> {
    // Processar criação de assinatura
    if (event.data.customerId) {
      console.log(`Subscription created for customer ${event.data.customerId}`);
      // await customerCommands.updateSubscriptionStatus(event.data.customerId, 'ACTIVE');
    }
  }

  private async handleSubscriptionUpdated(event: WebhookEvent): Promise<void> {
    // Processar atualização de assinatura
    if (event.data.customerId) {
      console.log(`Subscription updated for customer ${event.data.customerId}`);
      // await customerCommands.updateSubscriptionStatus(event.data.customerId, event.data.status);
    }
  }

  private async handleSubscriptionCancelled(event: WebhookEvent): Promise<void> {
    // Processar cancelamento de assinatura
    if (event.data.customerId) {
      console.log(`Subscription cancelled for customer ${event.data.customerId}`);
      // await customerCommands.cancelSubscription(event.data.customerId);
    }
  }

  private async handleSubscriptionRenewed(event: WebhookEvent): Promise<void> {
    // Processar renovação de assinatura
    if (event.data.customerId) {
      console.log(`Subscription renewed for customer ${event.data.customerId}`);
      // await customerCommands.renewSubscription(event.data.customerId);
    }
  }

  // Método para verificar a integridade do webhook
  async verifyWebhook(
    gatewayName: string,
    payload: any,
    signature: string
  ): Promise<boolean> {
    try {
      const result = await this.paymentService.handleWebhook(
        gatewayName,
        payload,
        signature
      );

      return result.success;
    } catch (error) {
      console.error('Error verifying webhook:', error);
      return false;
    }
  }

  // Método para listar todos os tipos de eventos suportados
  getSupportedEvents(): WebhookEventType[] {
    return [
      'payment.created',
      'payment.completed',
      'payment.failed',
      'payment.cancelled',
      'payment.refunded',
      'invoice.created',
      'invoice.paid',
      'invoice.failed',
      'subscription.created',
      'subscription.updated',
      'subscription.cancelled',
      'subscription.renewed'
    ];
  }
}
