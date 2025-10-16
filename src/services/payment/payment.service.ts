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

export class PaymentService {
  private gateways: Map<string, PaymentGateway> = new Map();

  constructor() {
    // Inicializar gateways disponíveis
    this.initializeGateways();
  }

  private initializeGateways() {
    // Inicializar Abacate Pay
    try {
      const abacatePay = new AbacatePayService();
      this.gateways.set('abacate-pay', abacatePay);
    } catch (error) {
      console.error('Failed to initialize Abacate Pay:', error);
    }

    // Inicializar Stripe
    try {
      const stripe = new StripeService();
      this.gateways.set('stripe', stripe);
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
    }
  }

  async processPayment(
    gatewayName: string, 
    data: PaymentData
  ): Promise<PaymentResult> {
    const gateway = this.getGateway(gatewayName);
    
    if (!gateway) {
      return {
        success: false,
        status: 'failed',
        error: `Gateway '${gatewayName}' not found`
      };
    }

    try {
      // Verificar se o gateway está disponível
      const isAvailable = await gateway.isAvailable();
      if (!isAvailable) {
        return {
          success: false,
          status: 'failed',
          error: `Gateway '${gatewayName}' is not available`
        };
      }

      // Processar pagamento
      const result = await gateway.createPayment(data);
      
      // Log do resultado
      console.log(`Payment processed via ${gatewayName}:`, {
        success: result.success,
        paymentId: result.paymentId,
        status: result.status
      });

      return result;
    } catch (error) {
      console.error(`Error processing payment via ${gatewayName}:`, error);
      return {
        success: false,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getPaymentStatus(
    gatewayName: string, 
    paymentId: string
  ): Promise<PaymentStatus> {
    const gateway = this.getGateway(gatewayName);
    
    if (!gateway) {
      return {
        paymentId,
        status: 'failed',
        error: `Gateway '${gatewayName}' not found`
      };
    }

    try {
      return await gateway.getPaymentStatus(paymentId);
    } catch (error) {
      console.error(`Error getting payment status via ${gatewayName}:`, error);
      return {
        paymentId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async cancelPayment(
    gatewayName: string, 
    paymentId: string
  ): Promise<{ success: boolean; error?: string }> {
    const gateway = this.getGateway(gatewayName);
    
    if (!gateway) {
      return {
        success: false,
        error: `Gateway '${gatewayName}' not found`
      };
    }

    try {
      await gateway.cancelPayment(paymentId);
      return { success: true };
    } catch (error) {
      console.error(`Error cancelling payment via ${gatewayName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

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
  }

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
  }

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
  }

  getGateway(gatewayName: string): PaymentGateway | undefined {
    return this.gateways.get(gatewayName);
  }

  getAvailableGateways(): Array<{ name: string; config: any }> {
    return Array.from(this.gateways.entries()).map(([name, gateway]) => ({
      name,
      config: gateway.getConfig()
    }));
  }

  async getGatewayHealth(): Promise<Array<{ name: string; available: boolean; error?: string }>> {
    const healthChecks = await Promise.allSettled(
      Array.from(this.gateways.entries()).map(async ([name, gateway]) => {
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
  }

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

    // Se nenhum específico estiver disponível, usar o primeiro disponível
    return workingGateways[0]?.name || null;
  }

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
  }
}
