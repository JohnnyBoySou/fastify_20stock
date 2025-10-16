import { FastifyRequest } from 'fastify';

// Interfaces para Customer
export interface CreateCustomerRequest extends FastifyRequest {
  body: {
    userId: string
    planId?: string
    status?: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'TRIAL'
    renewalDate?: string
    trialEndsAt?: string
  }
}

export interface UpdateCustomerRequest extends FastifyRequest {
  params: { id: string }
  body: {
    planId?: string
    status?: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'TRIAL'
    renewalDate?: string
    trialEndsAt?: string
  }
}

export interface GetCustomerRequest extends FastifyRequest {
  params: { id: string }
}

export interface ListCustomersRequest extends FastifyRequest {
  query: {
    page?: number
    limit?: number
    search?: string
    status?: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'TRIAL'
    planId?: string
  }
}

export interface DeleteCustomerRequest extends FastifyRequest {
  params: { id: string }
}

export interface UpdateCustomerPlanRequest extends FastifyRequest {
  params: { id: string }
  body: {
    planId: string
  }
}

export interface CancelCustomerRequest extends FastifyRequest {
  params: { id: string }
  body: {
    reason?: string
  }
}

export interface RenewCustomerRequest extends FastifyRequest {
  params: { id: string }
  body: {
    renewalDate?: string
  }
}

export interface StartTrialRequest extends FastifyRequest {
  params: { id: string }
  body: {
    trialDays: number
  }
}

export interface GetCustomerInvoicesRequest extends FastifyRequest {
  params: { id: string }
  query: {
    page?: number
    limit?: number
    status?: 'PENDING' | 'PAID' | 'FAILED'
  }
}

export interface GetSubscriptionStatusRequest extends FastifyRequest {
  params: { id: string }
}

export interface CustomerResponse {
  id: string
  userId: string
  planId?: string
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'TRIAL'
  renewalDate?: Date
  trialEndsAt?: Date
  createdAt: Date
  updatedAt: Date
  user?: {
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
    interval: 'MONTHLY' | 'YEARLY'
    features?: any
  }
  invoices?: Array<{
    id: string
    amount: number
    status: 'PENDING' | 'PAID' | 'FAILED'
    createdAt: Date
    paymentDate?: Date
  }>
}

export interface SubscriptionStatusResponse {
  customer: CustomerResponse
  subscription: {
    isActive: boolean
    isTrial: boolean
    daysRemaining?: number
    nextBillingDate?: Date
    canUpgrade: boolean
    canDowngrade: boolean
    canCancel: boolean
  }
  billing: {
    currentPlan?: {
      id: string
      name: string
      price: number
      interval: string
    }
    nextInvoice?: {
      amount: number
      dueDate: Date
    }
    lastPayment?: {
      amount: number
      date: Date
      status: string
    }
  }
}

export interface CustomerStatsResponse {
  total: number
  active: number
  inactive: number
  cancelled: number
  trial: number
  totalRevenue: number
  averageRevenuePerCustomer: number
  churnRate: number
  conversionRate: number
}

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CANCELLED = 'CANCELLED',
  TRIAL = 'TRIAL'
}