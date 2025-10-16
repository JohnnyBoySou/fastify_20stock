import { PaymentService } from './payment.service';
import { WebhookEventType, WebhookEvent } from './payment-gateway.interface';

export const WebhookHandler = {

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
      const result = await PaymentService.handleWebhook(
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
      await WebhookHandler.processEvent(webhookEvent);

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
  },

  async processEvent(event: WebhookEvent): Promise<void> {
    try {
      console.log(`Processing webhook event: ${event.type}`, event);

      switch (event.type) {
        case 'payment.completed':
          await WebhookHandler.handlePaymentCompleted(event);
          break;
        
        case 'payment.failed':
          await WebhookHandler.handlePaymentFailed(event);
          break;
        
        case 'payment.cancelled':
          await WebhookHandler.handlePaymentCancelled(event);
          break;
        
        case 'payment.refunded':
          await WebhookHandler.handlePaymentRefunded(event);
          break;
        
        case 'invoice.paid':
          await WebhookHandler.handleInvoicePaid(event);
          break;
        
        case 'invoice.failed':
          await WebhookHandler.handleInvoiceFailed(event);
          break;
        
        case 'subscription.created':
          await WebhookHandler.handleSubscriptionCreated(event);
          break;
        
        case 'subscription.updated':
          await WebhookHandler.handleSubscriptionUpdated(event);
          break;
        
        case 'subscription.cancelled':
          await WebhookHandler.handleSubscriptionCancelled(event);
          break;
        
        case 'subscription.renewed':
          await WebhookHandler.handleSubscriptionRenewed(event);
          break;
        
        default:
          console.log(`Unhandled webhook event type: ${event.type}`);
      }
    } catch (error) {
      console.error(`Error processing event ${event.type}:`, error);
      throw error;
    }
  },

  async handlePaymentCompleted(event: WebhookEvent): Promise<void> {
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
  },

  async handlePaymentFailed(event: WebhookEvent): Promise<void> {
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
  },

  async handlePaymentCancelled(event: WebhookEvent): Promise<void> {
    // Atualizar status da fatura para cancelada
    if (event.data.invoiceId) {
      console.log(`Updating invoice ${event.data.invoiceId} to CANCELLED`);
      // await invoiceCommands.updateStatus(event.data.invoiceId, 'CANCELLED');
    }
  },

  async handlePaymentRefunded(event: WebhookEvent): Promise<void> {
    // Processar reembolso
    if (event.data.invoiceId) {
      console.log(`Processing refund for invoice ${event.data.invoiceId}`);
      // await invoiceCommands.processRefund(event.data.invoiceId, event.data);
    }
  },

  async handleInvoicePaid(event: WebhookEvent): Promise<void> {
    // Atualizar status da fatura e customer
    if (event.data.invoiceId) {
      console.log(`Invoice ${event.data.invoiceId} marked as paid`);
      // await invoiceCommands.markAsPaid(event.data.invoiceId);
    }

    if (event.data.customerId) {
      console.log(`Updating customer ${event.data.customerId} subscription status`);
      // await customerCommands.renewSubscription(event.data.customerId);
    }
  },

  async handleInvoiceFailed(event: WebhookEvent): Promise<void> {
    // Processar falha na fatura
    if (event.data.invoiceId) {
      console.log(`Invoice ${event.data.invoiceId} failed`);
      // await invoiceCommands.markAsFailed(event.data.invoiceId);
    }
  },    

  async handleSubscriptionCreated(event: WebhookEvent): Promise<void> {
    // Processar criação de assinatura
    if (event.data.customerId) {
      console.log(`Subscription created for customer ${event.data.customerId}`);
      // await customerCommands.updateSubscriptionStatus(event.data.customerId, 'ACTIVE');
    }
  },

  async handleSubscriptionUpdated(event: WebhookEvent): Promise<void> {
    // Processar atualização de assinatura
    if (event.data.customerId) {
      console.log(`Subscription updated for customer ${event.data.customerId}`);
      // await customerCommands.updateSubscriptionStatus(event.data.customerId, event.data.status);
    }
  },  

  async handleSubscriptionCancelled(event: WebhookEvent): Promise<void> {
    // Processar cancelamento de assinatura
    if (event.data.customerId) {
      console.log(`Subscription cancelled for customer ${event.data.customerId}`);
      // await customerCommands.cancelSubscription(event.data.customerId);
    }
  },

  async handleSubscriptionRenewed(event: WebhookEvent): Promise<void> {
    // Processar renovação de assinatura
    if (event.data.customerId) {
      console.log(`Subscription renewed for customer ${event.data.customerId}`);
      // await customerCommands.renewSubscription(event.data.customerId);
    }
  },

  // Método para verificar a integridade do webhook
  async verifyWebhook(
    gatewayName: string,
    payload: any,
    signature: string
  ): Promise<boolean> {
    try {
      const result = await PaymentService.handleWebhook(
        gatewayName,
        payload,
        signature
      );

      return result.success;
    } catch (error) {
      console.error('Error verifying webhook:', error);
      return false;
    }
  },

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
  },
}
