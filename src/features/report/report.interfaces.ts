import { FastifyRequest } from 'fastify'

// ================================
// INTERFACES DE REQUEST
// ================================

export interface GetDashboardStatsRequest extends FastifyRequest {
  query: {
    storeId?: string
    period?: 'day' | 'week' | 'month' | 'year'
    startDate?: string
    endDate?: string
  }
}

export interface GetInventoryReportRequest extends FastifyRequest {
  query: {
    storeId?: string
    categoryId?: string
    supplierId?: string
    status?: 'all' | 'active' | 'inactive'
    lowStock?: boolean
    sortBy?: 'name' | 'stock' | 'value' | 'category'
    sortOrder?: 'asc' | 'desc'
    page?: number
    limit?: number
  }
}

export interface GetMovementReportRequest extends FastifyRequest {
  query: {
    storeId?: string
    productId?: string
    supplierId?: string
    type?: 'ENTRADA' | 'SAIDA' | 'PERDA'
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }
}

export interface GetFinancialReportRequest extends FastifyRequest {
  query: {
    storeId?: string
    startDate?: string
    endDate?: string
    groupBy?: 'day' | 'week' | 'month' | 'year'
  }
}

export interface GetCategoryReportRequest extends FastifyRequest {
  query: {
    storeId?: string
    startDate?: string
    endDate?: string
    includeSubcategories?: boolean
  }
}

export interface GetSupplierReportRequest extends FastifyRequest {
  query: {
    storeId?: string
    startDate?: string
    endDate?: string
    status?: 'all' | 'active' | 'inactive'
  }
}

export interface GetUserActivityReportRequest extends FastifyRequest {
  query: {
    storeId?: string
    userId?: string
    startDate?: string
    endDate?: string
    action?: 'CREATE' | 'UPDATE' | 'DELETE'
    page?: number
    limit?: number
  }
}

export interface GetStockAlertReportRequest extends FastifyRequest {
  query: {
    storeId?: string
    alertType?: 'low' | 'high' | 'expired' | 'all'
    page?: number
    limit?: number
  }
}

export interface ExportReportRequest extends FastifyRequest {
  query: {
    reportType: 'inventory' | 'movement' | 'financial' | 'category' | 'supplier' | 'user-activity' | 'stock-alert'
    format: 'csv' | 'xlsx' | 'pdf'
    storeId?: string
    startDate?: string
    endDate?: string
    filters?: string // JSON string with additional filters
  }
}

// ================================
// INTERFACES DE RESPONSE
// ================================

export interface DashboardStatsResponse {
  overview: {
    totalProducts: number
    totalCategories: number
    totalSuppliers: number
    totalStores: number
    totalUsers: number
  }
  inventory: {
    totalValue: number
    lowStockItems: number
    outOfStockItems: number
    averageStockValue: number
  }
  movements: {
    totalMovements: number
    entries: number
    exits: number
    losses: number
    totalValue: number
  }
  recentActivity: {
    lastMovements: Array<{
      id: string
      type: string
      productName: string
      quantity: number
      createdAt: string
    }>
    recentProducts: Array<{
      id: string
      name: string
      createdAt: string
    }>
  }
  charts: {
    movementsByType: Array<{
      type: string
      count: number
      value: number
    }>
    topProducts: Array<{
      productId: string
      productName: string
      movements: number
      value: number
    }>
    movementsByDay: Array<{
      date: string
      entries: number
      exits: number
      losses: number
    }>
  }
}

export interface InventoryReportResponse {
  products: Array<{
    id: string
    name: string
    description?: string
    category?: {
      id: string
      name: string
    }
    supplier?: {
      id: string
      corporateName: string
    }
    currentStock: number
    stockMin: number
    stockMax: number
    unitPrice: number
    totalValue: number
    status: boolean
    alertLevel: 'normal' | 'low' | 'high' | 'out'
    lastMovement?: string
  }>
  summary: {
    totalProducts: number
    totalValue: number
    lowStockCount: number
    outOfStockCount: number
    averageStockValue: number
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface MovementReportResponse {
  movements: Array<{
    id: string
    type: string
    quantity: number
    price?: number
    totalValue?: number
    batch?: string
    expiration?: string
    note?: string
    balanceAfter?: number
    product: {
      id: string
      name: string
      unitOfMeasure: string
    }
    supplier?: {
      id: string
      corporateName: string
    }
    user?: {
      id: string
      name: string
    }
    createdAt: string
  }>
  summary: {
    totalMovements: number
    totalEntries: number
    totalExits: number
    totalLosses: number
    totalValue: number
    averageValue: number
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface FinancialReportResponse {
  period: {
    startDate: string
    endDate: string
    groupBy: string
  }
  summary: {
    totalRevenue: number
    totalCosts: number
    grossProfit: number
    profitMargin: number
    totalMovements: number
  }
  data: Array<{
    period: string
    revenue: number
    costs: number
    profit: number
    movements: number
  }>
  breakdown: {
    byProduct: Array<{
      productId: string
      productName: string
      revenue: number
      costs: number
      profit: number
      movements: number
    }>
    byCategory: Array<{
      categoryId: string
      categoryName: string
      revenue: number
      costs: number
      profit: number
      movements: number
    }>
    bySupplier: Array<{
      supplierId: string
      supplierName: string
      revenue: number
      costs: number
      profit: number
      movements: number
    }>
  }
}

export interface CategoryReportResponse {
  categories: Array<{
    id: string
    name: string
    description?: string
    code?: string
    color?: string
    icon?: string
    parentId?: string
    parent?: {
      id: string
      name: string
    }
    children?: Array<{
      id: string
      name: string
    }>
    stats: {
      totalProducts: number
      totalValue: number
      averagePrice: number
      movements: number
      lastMovement?: string
    }
  }>
  summary: {
    totalCategories: number
    totalProducts: number
    totalValue: number
    averageProductsPerCategory: number
  }
}

export interface SupplierReportResponse {
  suppliers: Array<{
    id: string
    corporateName: string
    tradeName?: string
    cnpj: string
    status: boolean
    address?: {
      cep?: string
      city?: string
      state?: string
      address?: string
    }
    stats: {
      totalProducts: number
      totalValue: number
      totalMovements: number
      lastMovement?: string
      averageOrderValue: number
    }
    responsibles: Array<{
      id: string
      name: string
      phone?: string
      email?: string
    }>
  }>
  summary: {
    totalSuppliers: number
    activeSuppliers: number
    totalProducts: number
    totalValue: number
    averageProductsPerSupplier: number
  }
}

export interface UserActivityReportResponse {
  activities: Array<{
    id: string
    entity: string
    entityId: string
    action: string
    before?: any
    after?: any
    user: {
      id: string
      name: string
      email: string
    }
    createdAt: string
  }>
  summary: {
    totalActivities: number
    uniqueUsers: number
    mostActiveUser: {
      id: string
      name: string
      activities: number
    }
    activitiesByType: Array<{
      action: string
      count: number
    }>
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface StockAlertReportResponse {
  alerts: Array<{
    id: string
    productId: string
    productName: string
    currentStock: number
    stockMin: number
    stockMax: number
    alertType: 'low' | 'high' | 'expired' | 'out'
    severity: 'low' | 'medium' | 'high' | 'critical'
    unitPrice: number
    totalValue: number
    lastMovement?: string
    category?: {
      id: string
      name: string
    }
    supplier?: {
      id: string
      corporateName: string
    }
  }>
  summary: {
    totalAlerts: number
    lowStockAlerts: number
    highStockAlerts: number
    expiredAlerts: number
    outOfStockAlerts: number
    totalValue: number
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ExportReportResponse {
  success: boolean
  downloadUrl?: string
  filename: string
  format: string
  generatedAt: string
  expiresAt: string
}

// ================================
// INTERFACES DE FILTROS
// ================================

export interface ReportFilters {
  storeId?: string
  startDate?: string
  endDate?: string
  categoryId?: string
  supplierId?: string
  productId?: string
  userId?: string
  status?: string
  type?: string
  [key: string]: any
}

export interface PaginationOptions {
  page: number
  limit: number
}

export interface SortOptions {
  field: string
  order: 'asc' | 'desc'
}

// ================================
// INTERFACES DE DADOS
// ================================

export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }>
}

export interface TimeSeriesData {
  date: string
  value: number
  label?: string
}

export interface ComparisonData {
  current: number
  previous: number
  change: number
  changePercentage: number
}
