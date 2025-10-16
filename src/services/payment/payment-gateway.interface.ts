// Interface comum para todos os gateways de pagamento
export interface PaymentData {
  amount: number
  currency?: string
  customerId: string
  invoiceId: string
  description?: string
  metadata?: Record<string, any>
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  status: 'pending' | 'completed' | 'failed'
  gatewayResponse?: any
  error?: string
}

export interface PaymentStatus {
  paymentId: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  amount?: number
  currency?: string
  gatewayResponse?: any
  error?: string
}

export interface RefundData {
  paymentId: string
  amount?: number // Se não especificado, reembolsa o valor total
  reason?: string
}

export interface RefundResult {
  success: boolean
  refundId?: string
  amount?: number
  gatewayResponse?: any
  error?: string
}

export interface WebhookResult {
  success: boolean
  eventType: string
  paymentId?: string
  invoiceId?: string
  customerId?: string
  status?: string
  gatewayResponse?: any
  error?: string
}

// Interface principal que todos os gateways devem implementar
export interface PaymentGateway {
  // Criar um pagamento
  createPayment(data: PaymentData): Promise<PaymentResult>
  
  // Verificar status de um pagamento
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>
  
  // Cancelar um pagamento
  cancelPayment(paymentId: string): Promise<void>
  
  // Processar reembolso
  refundPayment(data: RefundData): Promise<RefundResult>
  
  // Processar webhook
  handleWebhook(payload: any, signature?: string): Promise<WebhookResult>
  
  // Verificar se o gateway está disponível
  isAvailable(): Promise<boolean>
  
  // Obter configurações do gateway
  getConfig(): GatewayConfig
}

export interface GatewayConfig {
  name: string
  version: string
  supportedCurrencies: string[]
  supportedMethods: string[]
  webhookUrl?: string
  apiKey?: string
  secretKey?: string
  environment: 'sandbox' | 'production'
}

// Tipos de eventos de webhook comuns
export type WebhookEventType = 
  | 'payment.created'
  | 'payment.completed'
  | 'payment.failed'
  | 'payment.cancelled'
  | 'payment.refunded'
  | 'invoice.created'
  | 'invoice.paid'
  | 'invoice.failed'
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.cancelled'
  | 'subscription.renewed'

export interface WebhookEvent {
  id: string
  type: WebhookEventType
  data: {
    paymentId?: string
    invoiceId?: string
    customerId?: string
    amount?: number
    currency?: string
    status?: string
    metadata?: Record<string, any>
  }
  createdAt: Date
  gateway: string
}
