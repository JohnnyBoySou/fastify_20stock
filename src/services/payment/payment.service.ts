import { 
  PaymentGateway, 
  PaymentData, 
  PaymentResult, 
  PaymentStatus, 
  RefundData, 
  RefundResult, 
  WebhookResult,
  WebhookEventType 
} from './payment-gateway.interface';
import { AbacatePayService } from './abacate-pay.service';
import { StripeService } from './stripe.service';

// Instâncias dos gateways
const abacatePayInstance = new AbacatePayService();
const stripeInstance = new StripeService();

export const PaymentService = {
  gateways: {
    'abacate-pay': abacatePayInstance,
    stripe: stripeInstance,
  } as Record<string, PaymentGateway>,

  async processPayment(
    gatewayName: string, 
    data: PaymentData
  ): Promise<PaymentResult> {
    const gateway = this.gateways[gatewayName];
    if (!gateway) {
      throw new Error(`Gateway '${gatewayName}' not found`);
    }
    return gateway.createPayment(data);
  },

  async getPaymentStatus(gatewayName: string, paymentId: string): Promise<PaymentStatus> {
    const gateway = this.gateways[gatewayName];
    if (!gateway) {
      throw new Error(`Gateway '${gatewayName}' not found`);
    }
    try {
      return await gateway.getPaymentStatus(paymentId);
    } catch (error) {
      throw new Error(`Error getting payment status via ${gatewayName}: ${error}`);
    }
  },

  async cancelPayment(
    gatewayName: string, 
    paymentId: string
  ): Promise<void> {
    const gateway = this.gateways[gatewayName];
    
    if (!gateway) {
      throw new Error(`Gateway '${gatewayName}' not found`);
    }
    return gateway.cancelPayment(paymentId);
  },

  async refundPayment(
    gatewayName: string, 
    data: RefundData
  ): Promise<RefundResult> {
    const gateway = this.getGateway(gatewayName);
    
    if (!gateway) {
      return {
        success: false,
        error: `Gateway '${gatewayName}' not found`
      };
    }

    try {
      return await gateway.refundPayment(data);
    } catch (error) {
      console.error(`Error processing refund via ${gatewayName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  async handleWebhook(
    gatewayName: string, 
    payload: any, 
    signature?: string
  ): Promise<WebhookResult> {
    const gateway = this.getGateway(gatewayName);
    
    if (!gateway) {
      return {
        success: false,
        eventType: 'unknown',
        error: `Gateway '${gatewayName}' not found`
      };
    }

    try {
      return await gateway.handleWebhook(payload, signature);
    } catch (error) {
      console.error(`Error handling webhook for ${gatewayName}:`, error);
      return {
        success: false,
        eventType: 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  async retryFailedPayment(
    gatewayName: string, 
    data: PaymentData,
    maxRetries: number = 3
  ): Promise<PaymentResult> {
    let attempts = 0;
    let lastError: string | undefined;

    while (attempts < maxRetries) {
      attempts++;
      
      const result = await this.processPayment(gatewayName, data);
      
      if (result.success) {
        return result;
      }
      
      lastError = result.error;
      
      // Aguardar antes da próxima tentativa (exponential backoff)
      if (attempts < maxRetries) {
        const delay = Math.pow(2, attempts) * 1000; // 2s, 4s, 8s...
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return {
      success: false,
      status: 'failed',
      error: `Payment failed after ${maxRetries} attempts. Last error: ${lastError}`
    };
  },

  getGateway(gatewayName: string): PaymentGateway | undefined {
    return this.gateways[gatewayName];
  },

  getAvailableGateways(): Array<{ name: string; config: any }> {
    return Object.entries(this.gateways).map(([name, gateway]) => ({
      name,
      config: gateway.getConfig()
    }));
  },

  async getGatewayHealth(): Promise<Array<{ name: string; available: boolean; error?: string }>> {
    const healthChecks = await Promise.allSettled(
      Object.entries(this.gateways).map(async ([name, gateway]) => {
        try {
          const available = await gateway.isAvailable();
          return { name, available };
        } catch (error) {
          return { 
            name, 
            available: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      })
    );

    return healthChecks.map(result => 
      result.status === 'fulfilled' ? result.value : { 
        name: 'unknown', 
        available: false, 
        error: 'Health check failed' 
      }
    );
  },

  // Método para determinar o melhor gateway baseado nos dados do pagamento
  async selectBestGateway(data: PaymentData): Promise<string | null> {
    const availableGateways = await this.getGatewayHealth();
    const workingGateways = availableGateways.filter(g => g.available);

    if (workingGateways.length === 0) {
      return null;
    }

    // Lógica para selecionar o melhor gateway
    // Por exemplo, baseado na moeda, valor, localização, etc.
    
    if (data.currency === 'BRL') {
      // Para pagamentos em Real, preferir Abacate Pay
      const abacatePay = workingGateways.find(g => g.name === 'abacate-pay');
      if (abacatePay) {
        return 'abacate-pay';
      }
    }

    // Para outras moedas ou como fallback, usar Stripe
    const stripe = workingGateways.find(g => g.name === 'stripe');
    if (stripe) {
      return 'stripe';
    }

    // Como último recurso, usar Polar se disponível
    if (polar) {
      return 'polar';
    }

    // Se nenhum específico estiver disponível, usar o primeiro disponível
    return workingGateways[0]?.name || null;
  },

  // Método para processar pagamento com gateway automático
  async processPaymentAuto(data: PaymentData): Promise<PaymentResult & { gateway: string }> {
    const selectedGateway = await this.selectBestGateway(data);
    
    if (!selectedGateway) {
      return {
        success: false,
        status: 'failed',
        error: 'No payment gateways available',
        gateway: 'none'
      };
    }

    const result = await this.processPayment(selectedGateway, data);
    return {
      ...result,
      gateway: selectedGateway
    };
  },
}
