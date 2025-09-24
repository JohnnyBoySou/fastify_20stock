import { ReportQueries } from './queries/report.queries'
import { ReportCommands } from './commands/report.commands'
import {
  DashboardStatsResponse,
  InventoryReportResponse,
  MovementReportResponse,
  FinancialReportResponse,
  CategoryReportResponse,
  SupplierReportResponse,
  UserActivityReportResponse,
  StockAlertReportResponse,
  ExportReportResponse,
  ReportFilters,
  PaginationOptions,
  SortOptions
} from './report.interfaces'

export class ReportService {
  constructor(
    private reportQueries: ReportQueries,
    private reportCommands: ReportCommands
  ) {}

  // ================================
  // DASHBOARD STATS
  // ================================

  async getDashboardStats(filters: ReportFilters): Promise<DashboardStatsResponse> {
    try {
      return await this.reportQueries.getDashboardStats(filters)
    } catch (error) {
      throw new Error(`Failed to get dashboard stats: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ================================
  // INVENTORY REPORT
  // ================================

  async getInventoryReport(
    filters: ReportFilters,
    pagination: PaginationOptions = { page: 1, limit: 20 },
    sort: SortOptions = { field: 'name', order: 'asc' }
  ): Promise<InventoryReportResponse> {
    try {
      return await this.reportQueries.getInventoryReport(filters, pagination, sort)
    } catch (error) {
      throw new Error(`Failed to get inventory report: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ================================
  // MOVEMENT REPORT
  // ================================

  async getMovementReport(
    filters: ReportFilters,
    pagination: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<MovementReportResponse> {
    try {
      return await this.reportQueries.getMovementReport(filters, pagination)
    } catch (error) {
      throw new Error(`Failed to get movement report: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ================================
  // FINANCIAL REPORT
  // ================================

  async getFinancialReport(filters: ReportFilters): Promise<FinancialReportResponse> {
    try {
      return await this.reportQueries.getFinancialReport(filters)
    } catch (error) {
      throw new Error(`Failed to get financial report: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ================================
  // CATEGORY REPORT
  // ================================

  async getCategoryReport(filters: ReportFilters): Promise<CategoryReportResponse> {
    try {
      return await this.reportQueries.getCategoryReport(filters)
    } catch (error) {
      throw new Error(`Failed to get category report: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ================================
  // SUPPLIER REPORT
  // ================================

  async getSupplierReport(filters: ReportFilters): Promise<SupplierReportResponse> {
    try {
      return await this.reportQueries.getSupplierReport(filters)
    } catch (error) {
      throw new Error(`Failed to get supplier report: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ================================
  // USER ACTIVITY REPORT
  // ================================

  async getUserActivityReport(
    filters: ReportFilters,
    pagination: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<UserActivityReportResponse> {
    try {
      return await this.reportQueries.getUserActivityReport(filters, pagination)
    } catch (error) {
      throw new Error(`Failed to get user activity report: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ================================
  // STOCK ALERT REPORT
  // ================================

  async getStockAlertReport(
    filters: ReportFilters,
    pagination: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<StockAlertReportResponse> {
    try {
      return await this.reportQueries.getStockAlertReport(filters, pagination)
    } catch (error) {
      throw new Error(`Failed to get stock alert report: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ================================
  // EXPORT REPORTS
  // ================================

  async exportReport(
    reportType: string,
    format: 'csv' | 'xlsx' | 'pdf',
    filters: ReportFilters
  ): Promise<ExportReportResponse> {
    try {
      // First, get the report data
      let reportData: any[] = []
      
      switch (reportType) {
        case 'inventory':
          const inventoryReport = await this.getInventoryReport(filters, { page: 1, limit: 10000 })
          reportData = inventoryReport.products
          break
        case 'movement':
          const movementReport = await this.getMovementReport(filters, { page: 1, limit: 10000 })
          reportData = movementReport.movements
          break
        case 'financial':
          const financialReport = await this.getFinancialReport(filters)
          reportData = financialReport.data
          break
        case 'category':
          const categoryReport = await this.getCategoryReport(filters)
          reportData = categoryReport.categories
          break
        case 'supplier':
          const supplierReport = await this.getSupplierReport(filters)
          reportData = supplierReport.suppliers
          break
        case 'user-activity':
          const userActivityReport = await this.getUserActivityReport(filters, { page: 1, limit: 10000 })
          reportData = userActivityReport.activities
          break
        case 'stock-alert':
          const stockAlertReport = await this.getStockAlertReport(filters, { page: 1, limit: 10000 })
          reportData = stockAlertReport.alerts
          break
        default:
          throw new Error(`Unsupported report type: ${reportType}`)
      }

      // Generate the export
      return await this.reportCommands.exportReport(reportType, format, filters)
    } catch (error) {
      throw new Error(`Failed to export report: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ================================
  // SCHEDULE REPORTS
  // ================================

  async scheduleReport(
    reportType: string,
    schedule: {
      frequency: 'daily' | 'weekly' | 'monthly'
      time: string
      dayOfWeek?: number
      dayOfMonth?: number
    },
    filters: ReportFilters,
    emailRecipients: string[]
  ): Promise<{ success: boolean; scheduleId: string }> {
    try {
      return await this.reportCommands.scheduleReport(reportType, schedule, filters, emailRecipients)
    } catch (error) {
      throw new Error(`Failed to schedule report: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async cancelScheduledReport(scheduleId: string): Promise<{ success: boolean }> {
    try {
      return await this.reportCommands.cancelScheduledReport(scheduleId)
    } catch (error) {
      throw new Error(`Failed to cancel scheduled report: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ================================
  // EMAIL REPORTS
  // ================================

  async sendReportViaEmail(
    reportType: string,
    format: 'csv' | 'xlsx' | 'pdf',
    data: any[],
    emailRecipients: string[],
    subject?: string,
    message?: string
  ): Promise<{ success: boolean; messageId: string }> {
    try {
      return await this.reportCommands.sendReportViaEmail(
        reportType,
        format,
        data,
        emailRecipients,
        subject,
        message
      )
    } catch (error) {
      throw new Error(`Failed to send report via email: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ================================
  // REPORT SUMMARY
  // ================================

  async generateReportSummary(
    reportType: string,
    data: any[],
    filters: ReportFilters
  ): Promise<{
    totalRecords: number
    dateRange: { start: string; end: string }
    filters: ReportFilters
    generatedAt: string
    summary: Record<string, any>
  }> {
    try {
      return await this.reportCommands.generateReportSummary(reportType, data, filters)
    } catch (error) {
      throw new Error(`Failed to generate report summary: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ================================
  // VALIDATION HELPERS
  // ================================

  validateReportFilters(filters: ReportFilters): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validate date range
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate)
      const endDate = new Date(filters.endDate)
      
      if (startDate > endDate) {
        errors.push('Start date cannot be after end date')
      }
      
      if (endDate > new Date()) {
        errors.push('End date cannot be in the future')
      }
    }

    // Validate pagination
    if (filters.page && filters.page < 1) {
      errors.push('Page must be greater than 0')
    }

    if (filters.limit && (filters.limit < 1 || filters.limit > 1000)) {
      errors.push('Limit must be between 1 and 1000')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // ================================
  // UTILITY METHODS
  // ================================

  async getAvailableReportTypes(): Promise<Array<{
    type: string
    name: string
    description: string
    supportedFormats: string[]
  }>> {
    return [
      {
        type: 'inventory',
        name: 'Relatório de Inventário',
        description: 'Relatório completo do inventário com produtos, estoques e alertas',
        supportedFormats: ['csv', 'xlsx', 'pdf']
      },
      {
        type: 'movement',
        name: 'Relatório de Movimentações',
        description: 'Relatório de todas as movimentações de estoque',
        supportedFormats: ['csv', 'xlsx', 'pdf']
      },
      {
        type: 'financial',
        name: 'Relatório Financeiro',
        description: 'Relatório financeiro com receitas, custos e lucros',
        supportedFormats: ['csv', 'xlsx', 'pdf']
      },
      {
        type: 'category',
        name: 'Relatório de Categorias',
        description: 'Relatório de categorias e seus produtos',
        supportedFormats: ['csv', 'xlsx', 'pdf']
      },
      {
        type: 'supplier',
        name: 'Relatório de Fornecedores',
        description: 'Relatório de fornecedores e suas estatísticas',
        supportedFormats: ['csv', 'xlsx', 'pdf']
      },
      {
        type: 'user-activity',
        name: 'Relatório de Atividade de Usuários',
        description: 'Relatório de atividades e auditoria de usuários',
        supportedFormats: ['csv', 'xlsx', 'pdf']
      },
      {
        type: 'stock-alert',
        name: 'Relatório de Alertas de Estoque',
        description: 'Relatório de produtos com alertas de estoque',
        supportedFormats: ['csv', 'xlsx', 'pdf']
      }
    ]
  }

  async getReportStatistics(): Promise<{
    totalReports: number
    reportsByType: Record<string, number>
    reportsByFormat: Record<string, number>
    lastGenerated: string | null
  }> {
    // This would typically query the database for actual statistics
    // For now, returning mock data
    return {
      totalReports: 0,
      reportsByType: {},
      reportsByFormat: {},
      lastGenerated: null
    }
  }
}
