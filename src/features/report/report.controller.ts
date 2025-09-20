import { FastifyRequest, FastifyReply } from 'fastify'
import { ReportQueries } from './queries/report.queries'
import { ReportCommands } from './commands/report.commands'
import { ReportService } from './report.service'
import {
  GetDashboardStatsRequest,
  GetInventoryReportRequest,
  GetMovementReportRequest,
  GetFinancialReportRequest,
  GetCategoryReportRequest,
  GetSupplierReportRequest,
  GetUserActivityReportRequest,
  GetStockAlertReportRequest,
  ExportReportRequest
} from './report.interfaces'

export const ReportController = {
  // ================================
  // DASHBOARD STATS
  // ================================

  async getDashboardStats(request: GetDashboardStatsRequest, reply: FastifyReply) {
    try {
      const { storeId, period, startDate, endDate } = request.query
      const prisma = (request.server as any).prisma
      const reportQueries = new ReportQueries(prisma)
      const reportService = new ReportService(reportQueries, new ReportCommands(prisma))

      const filters = {
        storeId,
        startDate,
        endDate,
        period
      }

      const result = await reportService.getDashboardStats(filters)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message.includes('Failed to get dashboard stats')) {
        return reply.status(500).send({
          error: 'Erro ao obter estatísticas do dashboard'
        })
      }

      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  },

  // ================================
  // INVENTORY REPORT
  // ================================

  async getInventoryReport(request: GetInventoryReportRequest, reply: FastifyReply) {
    try {
      const { 
        storeId, 
        categoryId, 
        supplierId, 
        status, 
        lowStock, 
        sortBy, 
        sortOrder, 
        page = 1, 
        limit = 20 
      } = request.query
      
      const prisma = (request.server as any).prisma
      const reportQueries = new ReportQueries(prisma)
      const reportService = new ReportService(reportQueries, new ReportCommands(prisma))

      const filters = {
        storeId,
        categoryId,
        supplierId,
        status,
        lowStock
      }

      const pagination = { page, limit }
      const sort = { field: sortBy || 'name', order: sortOrder || 'asc' }

      const result = await reportService.getInventoryReport(filters, pagination, sort)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message.includes('Failed to get inventory report')) {
        return reply.status(500).send({
          error: 'Erro ao obter relatório de inventário'
        })
      }

      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  },

  // ================================
  // MOVEMENT REPORT
  // ================================

  async getMovementReport(request: GetMovementReportRequest, reply: FastifyReply) {
    try {
      const { 
        storeId, 
        productId, 
        supplierId, 
        type, 
        startDate, 
        endDate, 
        page = 1, 
        limit = 20 
      } = request.query
      
      const prisma = (request.server as any).prisma
      const reportQueries = new ReportQueries(prisma)
      const reportService = new ReportService(reportQueries, new ReportCommands(prisma))

      const filters = {
        storeId,
        productId,
        supplierId,
        type,
        startDate,
        endDate
      }

      const pagination = { page, limit }

      const result = await reportService.getMovementReport(filters, pagination)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message.includes('Failed to get movement report')) {
        return reply.status(500).send({
          error: 'Erro ao obter relatório de movimentações'
        })
      }

      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  },

  // ================================
  // FINANCIAL REPORT
  // ================================

  async getFinancialReport(request: GetFinancialReportRequest, reply: FastifyReply) {
    try {
      const { storeId, startDate, endDate, groupBy } = request.query
      
      const prisma = (request.server as any).prisma
      const reportQueries = new ReportQueries(prisma)
      const reportService = new ReportService(reportQueries, new ReportCommands(prisma))

      const filters = {
        storeId,
        startDate,
        endDate,
        groupBy
      }

      const result = await reportService.getFinancialReport(filters)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message.includes('Failed to get financial report')) {
        return reply.status(500).send({
          error: 'Erro ao obter relatório financeiro'
        })
      }

      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  },

  // ================================
  // CATEGORY REPORT
  // ================================

  async getCategoryReport(request: GetCategoryReportRequest, reply: FastifyReply) {
    try {
      const { storeId, startDate, endDate, includeSubcategories } = request.query
      
      const prisma = (request.server as any).prisma
      const reportQueries = new ReportQueries(prisma)
      const reportService = new ReportService(reportQueries, new ReportCommands(prisma))

      const filters = {
        storeId,
        startDate,
        endDate,
        includeSubcategories
      }

      const result = await reportService.getCategoryReport(filters)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message.includes('Failed to get category report')) {
        return reply.status(500).send({
          error: 'Erro ao obter relatório de categorias'
        })
      }

      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  },

  // ================================
  // SUPPLIER REPORT
  // ================================

  async getSupplierReport(request: GetSupplierReportRequest, reply: FastifyReply) {
    try {
      const { storeId, startDate, endDate, status } = request.query
      
      const prisma = (request.server as any).prisma
      const reportQueries = new ReportQueries(prisma)
      const reportService = new ReportService(reportQueries, new ReportCommands(prisma))

      const filters = {
        storeId,
        startDate,
        endDate,
        status
      }

      const result = await reportService.getSupplierReport(filters)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message.includes('Failed to get supplier report')) {
        return reply.status(500).send({
          error: 'Erro ao obter relatório de fornecedores'
        })
      }

      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  },

  // ================================
  // USER ACTIVITY REPORT
  // ================================

  async getUserActivityReport(request: GetUserActivityReportRequest, reply: FastifyReply) {
    try {
      const { 
        storeId, 
        userId, 
        startDate, 
        endDate, 
        action, 
        page = 1, 
        limit = 20 
      } = request.query
      
      const prisma = (request.server as any).prisma
      const reportQueries = new ReportQueries(prisma)
      const reportService = new ReportService(reportQueries, new ReportCommands(prisma))

      const filters = {
        storeId,
        userId,
        startDate,
        endDate,
        action
      }

      const pagination = { page, limit }

      const result = await reportService.getUserActivityReport(filters, pagination)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message.includes('Failed to get user activity report')) {
        return reply.status(500).send({
          error: 'Erro ao obter relatório de atividade de usuários'
        })
      }

      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  },

  // ================================
  // STOCK ALERT REPORT
  // ================================

  async getStockAlertReport(request: GetStockAlertReportRequest, reply: FastifyReply) {
    try {
      const { storeId, alertType, page = 1, limit = 20 } = request.query
      
      const prisma = (request.server as any).prisma
      const reportQueries = new ReportQueries(prisma)
      const reportService = new ReportService(reportQueries, new ReportCommands(prisma))

      const filters = {
        storeId,
        alertType
      }

      const pagination = { page, limit }

      const result = await reportService.getStockAlertReport(filters, pagination)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message.includes('Failed to get stock alert report')) {
        return reply.status(500).send({
          error: 'Erro ao obter relatório de alertas de estoque'
        })
      }

      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  },

  // ================================
  // EXPORT REPORTS
  // ================================

  async exportReport(request: ExportReportRequest, reply: FastifyReply) {
    try {
      const { reportType, format, storeId, startDate, endDate, filters } = request.query
      
      const prisma = (request.server as any).prisma
      const reportQueries = new ReportQueries(prisma)
      const reportService = new ReportService(reportQueries, new ReportCommands(prisma))

      const reportFilters = {
        storeId,
        startDate,
        endDate,
        ...(filters ? JSON.parse(filters) : {})
      }

      const result = await reportService.exportReport(reportType, format, reportFilters)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message.includes('Failed to export report')) {
        return reply.status(500).send({
          error: 'Erro ao exportar relatório'
        })
      }

      if (error.message.includes('Unsupported report type')) {
        return reply.status(400).send({
          error: 'Tipo de relatório não suportado'
        })
      }

      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  },

  // ================================
  // SCHEDULE REPORTS
  // ================================

  async scheduleReport(request: FastifyRequest<{
    Body: {
      reportType: string
      schedule: {
        frequency: 'daily' | 'weekly' | 'monthly'
        time: string
        dayOfWeek?: number
        dayOfMonth?: number
      }
      filters: any
      emailRecipients: string[]
    }
  }>, reply: FastifyReply) {
    try {
      const { reportType, schedule, filters, emailRecipients } = request.body
      
      const prisma = (request.server as any).prisma
      const reportQueries = new ReportQueries(prisma)
      const reportService = new ReportService(reportQueries, new ReportCommands(prisma))

      const result = await reportService.scheduleReport(reportType, schedule, filters, emailRecipients)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message.includes('Failed to schedule report')) {
        return reply.status(500).send({
          error: 'Erro ao agendar relatório'
        })
      }

      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  },

  async cancelScheduledReport(request: FastifyRequest<{
    Params: { scheduleId: string }
  }>, reply: FastifyReply) {
    try {
      const { scheduleId } = request.params
      
      const prisma = (request.server as any).prisma
      const reportQueries = new ReportQueries(prisma)
      const reportService = new ReportService(reportQueries, new ReportCommands(prisma))

      const result = await reportService.cancelScheduledReport(scheduleId)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message.includes('Failed to cancel scheduled report')) {
        return reply.status(500).send({
          error: 'Erro ao cancelar relatório agendado'
        })
      }

      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  },

  // ================================
  // EMAIL REPORTS
  // ================================

  async sendReportViaEmail(request: FastifyRequest<{
    Body: {
      reportType: string
      format: 'csv' | 'xlsx' | 'pdf'
      data: any[]
      emailRecipients: string[]
      subject?: string
      message?: string
    }
  }>, reply: FastifyReply) {
    try {
      const { reportType, format, data, emailRecipients, subject, message } = request.body
      
      const prisma = (request.server as any).prisma
      const reportQueries = new ReportQueries(prisma)
      const reportService = new ReportService(reportQueries, new ReportCommands(prisma))

      const result = await reportService.sendReportViaEmail(
        reportType,
        format,
        data,
        emailRecipients,
        subject,
        message
      )

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      
      if (error.message.includes('Failed to send report via email')) {
        return reply.status(500).send({
          error: 'Erro ao enviar relatório por email'
        })
      }

      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  },

  // ================================
  // UTILITY ENDPOINTS
  // ================================

  async getAvailableReportTypes(request: FastifyRequest, reply: FastifyReply) {
    try {
      const prisma = (request.server as any).prisma
      const reportQueries = new ReportQueries(prisma)
      const reportService = new ReportService(reportQueries, new ReportCommands(prisma))

      const result = await reportService.getAvailableReportTypes()

      return reply.send({ reportTypes: result })
    } catch (error: any) {
      request.log.error(error)
      
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  },

  async getReportStatistics(request: FastifyRequest, reply: FastifyReply) {
    try {
      const prisma = (request.server as any).prisma
      const reportQueries = new ReportQueries(prisma)
      const reportService = new ReportService(reportQueries, new ReportCommands(prisma))

      const result = await reportService.getReportStatistics()

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  },

  // ================================
  // VALIDATION ENDPOINT
  // ================================

  async validateFilters(request: FastifyRequest<{
    Body: {
      filters: any
    }
  }>, reply: FastifyReply) {
    try {
      const { filters } = request.body
      
      const prisma = (request.server as any).prisma
      const reportQueries = new ReportQueries(prisma)
      const reportService = new ReportService(reportQueries, new ReportCommands(prisma))

      const result = reportService.validateReportFilters(filters)

      return reply.send(result)
    } catch (error: any) {
      request.log.error(error)
      
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      })
    }
  }
}
