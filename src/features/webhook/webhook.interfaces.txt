import { FastifyRequest } from 'fastify';

// Interfaces para Webhook
export interface WebhookRequest extends FastifyRequest {
  params: { gateway: string }
  body: any
  headers: {
    'stripe-signature'?: string
    'x-abacate-signature'?: string
    'x-signature'?: string
    'x-hub-signature'?: string
    [key: string]: any
  }
}

export interface WebhookLogRequest extends FastifyRequest {
  query: {
    page?: number
    limit?: number
    gateway?: string
    eventType?: string
    success?: boolean
    startDate?: string
    endDate?: string
  }
}

export interface WebhookResponse {
  success: boolean
  eventId?: string
  eventType?: string
  gateway?: string
  processedAt?: Date
  error?: string
}

export interface WebhookLogResponse {
  id: string
  gateway: string
  eventType: string
  eventId?: string
  success: boolean
  payload: any
  response?: any
  error?: string
  processedAt: Date
  createdAt: Date
}

export interface WebhookStatsResponse {
  total: number
  successful: number
  failed: number
  byGateway: Record<string, {
    total: number
    successful: number
    failed: number
  }>
  byEventType: Record<string, number>
  last24Hours: {
    total: number
    successful: number
    failed: number
  }
}

export interface WebhookHealthResponse {
  gateways: Array<{
    name: string
    available: boolean
    lastWebhook?: Date
    errorRate?: number
  }>
  overall: {
    available: boolean
    totalGateways: number
    availableGateways: number
  }
}
