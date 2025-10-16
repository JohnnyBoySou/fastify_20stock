import { FastifyRequest } from 'fastify';

// Interfaces para Invoice
export interface CreateInvoiceRequest extends FastifyRequest {
  body: {
    customerId: string
    amount: number
    status?: 'PENDING' | 'PAID' | 'FAILED'
    gatewayPaymentId?: string
    paymentDate?: string
  }
}

export interface UpdateInvoiceRequest extends FastifyRequest {
  params: { id: string }
  body: {
    amount?: number
    status?: 'PENDING' | 'PAID' | 'FAILED'
    gatewayPaymentId?: string
    paymentDate?: string
  }
}

export interface GetInvoiceRequest extends FastifyRequest {
  params: { id: string }
}

export interface ListInvoicesRequest extends FastifyRequest {
  query: {
    page?: number
    limit?: number
    customerId?: string
    status?: 'PENDING' | 'PAID' | 'FAILED'
    startDate?: string
    endDate?: string
  }
}

export interface DeleteInvoiceRequest extends FastifyRequest {
  params: { id: string }
}

export interface UpdateInvoiceStatusRequest extends FastifyRequest {
  params: { id: string }
  body: {
    status: 'PENDING' | 'PAID' | 'FAILED'
    paymentDate?: string
    gatewayPaymentId?: string
  }
}

export interface RetryPaymentRequest extends FastifyRequest {
  params: { id: string }
  body: {
    gateway?: string
    paymentMethod?: any
  }
}

export interface SendInvoiceEmailRequest extends FastifyRequest {
  params: { id: string }
  body: {
    email?: string
    includePdf?: boolean
  }
}

export interface GetInvoicePdfRequest extends FastifyRequest {
  params: { id: string }
}

export interface GetCustomerInvoicesRequest extends FastifyRequest {
  params: { customerId: string }
  query: {
    page?: number
    limit?: number
    status?: 'PENDING' | 'PAID' | 'FAILED'
  }
}

export interface InvoiceResponse {
  id: string
  customerId: string
  amount: number
  status: 'PENDING' | 'PAID' | 'FAILED'
  gatewayPaymentId?: string
  paymentDate?: Date
  createdAt: Date
  customer?: {
    id: string
    userId: string
    status: string
    user: {
      id: string
      name: string
      email: string
      phone?: string
    }
    plan?: {
      id: string
      name: string
      description?: string
      price: number
      interval: string
    }
  }
}

export interface InvoiceStatsResponse {
  total: number
  pending: number
  paid: number
  failed: number
  totalAmount: number
  totalPaid: number
  totalPending: number
  totalFailed: number
  averageAmount: number
  conversionRate: number
}

export interface PaymentRetryResponse {
  invoice: InvoiceResponse
  retryResult: {
    success: boolean
    gatewayResponse?: any
    error?: string
  }
}

export interface EmailSendResponse {
  invoice: InvoiceResponse
  emailResult: {
    success: boolean
    messageId?: string
    error?: string
  }
}
