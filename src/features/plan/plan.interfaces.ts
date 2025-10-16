import { FastifyRequest } from 'fastify';

// Interfaces para Plan
export interface CreatePlanRequest extends FastifyRequest {
  body: {
    name: string
    description?: string
    price: number
    interval: 'MONTHLY' | 'YEARLY'
    features?: any
  }
}

export interface UpdatePlanRequest extends FastifyRequest {
  params: { id: string }
  body: {
    name?: string
    description?: string
    price?: number
    interval?: 'MONTHLY' | 'YEARLY'
    features?: any
  }
}

export interface GetPlanRequest extends FastifyRequest {
  params: { id: string }
}

export interface ListPlansRequest extends FastifyRequest {
  query: {
    page?: number
    limit?: number
    search?: string
    interval?: 'MONTHLY' | 'YEARLY'
  }
}

export interface DeletePlanRequest extends FastifyRequest {
  params: { id: string }
}

export interface UpdatePlanStatusRequest extends FastifyRequest {
  params: { id: string }
  body: {
    active: boolean
  }
}

export interface ComparePlansRequest extends FastifyRequest {
  query: {
    planIds: string[]
  }
}

export interface GetPlanCustomersRequest extends FastifyRequest {
  params: { id: string }
  query: {
    page?: number
    limit?: number
    status?: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'TRIAL'
  }
}

export interface PlanResponse {
  id: string
  name: string
  description?: string
  price: number
  interval: 'MONTHLY' | 'YEARLY'
  features?: any
  createdAt: Date
  updatedAt: Date
  customersCount?: number
}

export interface PlanComparisonResponse {
  plans: PlanResponse[]
  comparison: {
    priceRange: {
      min: number
      max: number
    }
    intervals: ('MONTHLY' | 'YEARLY')[]
    features: string[]
  }
}

export interface PlanStatsResponse {
  total: number
  active: number
  inactive: number
  monthlyPlans: number
  yearlyPlans: number
  totalRevenue: number
  averagePrice: number
}

export enum PlanInterval {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}
