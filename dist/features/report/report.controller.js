import { ReportQueries } from './queries/report.queries';
import { ReportCommands } from './commands/report.commands';
export const ReportController = {
    // ================================
    // DASHBOARD STATS
    // ================================
    async getDashboardStats(request, reply) {
        try {
            const { storeId, period, startDate, endDate } = request.query;
            const filters = {
                storeId,
                startDate,
                endDate,
                period
            };
            const result = await ReportQueries.getDashboardStats(filters);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message.includes('Failed to get dashboard stats')) {
                return reply.status(500).send({
                    error: 'Erro ao obter estatísticas do dashboard'
                });
            }
            return reply.status(500).send({
                error: 'Erro interno do servidor'
            });
        }
    },
    // ================================
    // INVENTORY REPORT
    // ================================
    async getInventoryReport(request, reply) {
        try {
            const { storeId, categoryId, supplierId, status, lowStock, sortBy, sortOrder, page = 1, limit = 20 } = request.query;
            const filters = {
                storeId,
                categoryId,
                supplierId,
                status,
                lowStock
            };
            const pagination = { page, limit };
            const sort = { field: sortBy || 'name', order: sortOrder || 'asc' };
            const result = await ReportQueries.getInventoryReport(filters, pagination, sort);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message.includes('Failed to get inventory report')) {
                return reply.status(500).send({
                    error: 'Erro ao obter relatório de inventário'
                });
            }
            return reply.status(500).send({
                error: 'Erro interno do servidor'
            });
        }
    },
    // ================================
    // MOVEMENT REPORT
    // ================================
    async getMovementReport(request, reply) {
        try {
            const { storeId, productId, supplierId, type, startDate, endDate, page = 1, limit = 20 } = request.query;
            const filters = {
                storeId,
                productId,
                supplierId,
                type,
                startDate,
                endDate
            };
            const pagination = { page, limit };
            const result = await ReportQueries.getMovementReport(filters, pagination);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message.includes('Failed to get movement report')) {
                return reply.status(500).send({
                    error: 'Erro ao obter relatório de movimentações'
                });
            }
            return reply.status(500).send({
                error: 'Erro interno do servidor'
            });
        }
    },
    // ================================
    // FINANCIAL REPORT
    // ================================
    async getFinancialReport(request, reply) {
        try {
            const { storeId, startDate, endDate, groupBy } = request.query;
            const filters = {
                storeId,
                startDate,
                endDate,
                groupBy
            };
            const result = await ReportQueries.getFinancialReport(filters);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message.includes('Failed to get financial report')) {
                return reply.status(500).send({
                    error: 'Erro ao obter relatório financeiro'
                });
            }
            return reply.status(500).send({
                error: 'Erro interno do servidor'
            });
        }
    },
    // ================================
    // CATEGORY REPORT
    // ================================
    async getCategoryReport(request, reply) {
        try {
            const { storeId, startDate, endDate, includeSubcategories } = request.query;
            const filters = {
                storeId,
                startDate,
                endDate,
                includeSubcategories
            };
            const result = await ReportQueries.getCategoryReport(filters);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message.includes('Failed to get category report')) {
                return reply.status(500).send({
                    error: 'Erro ao obter relatório de categorias'
                });
            }
            return reply.status(500).send({
                error: 'Erro interno do servidor'
            });
        }
    },
    // ================================
    // SUPPLIER REPORT
    // ================================
    async getSupplierReport(request, reply) {
        try {
            const { storeId, startDate, endDate, status } = request.query;
            const filters = {
                storeId,
                startDate,
                endDate,
                status
            };
            const result = await ReportQueries.getSupplierReport(filters);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message.includes('Failed to get supplier report')) {
                return reply.status(500).send({
                    error: 'Erro ao obter relatório de fornecedores'
                });
            }
            return reply.status(500).send({
                error: 'Erro interno do servidor'
            });
        }
    },
    // ================================
    // USER ACTIVITY REPORT
    // ================================
    async getUserActivityReport(request, reply) {
        try {
            const { storeId, userId, startDate, endDate, action, page = 1, limit = 20 } = request.query;
            const filters = {
                storeId,
                userId,
                startDate,
                endDate,
                action
            };
            const pagination = { page, limit };
            const result = await ReportQueries.getUserActivityReport(filters, pagination);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message.includes('Failed to get user activity report')) {
                return reply.status(500).send({
                    error: 'Erro ao obter relatório de atividade de usuários'
                });
            }
            return reply.status(500).send({
                error: 'Erro interno do servidor'
            });
        }
    },
    // ================================
    // STOCK ALERT REPORT
    // ================================
    async getStockAlertReport(request, reply) {
        try {
            const { storeId, alertType, page = 1, limit = 20 } = request.query;
            const filters = {
                storeId,
                alertType
            };
            const pagination = { page, limit };
            const result = await ReportQueries.getStockAlertReport(filters, pagination);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message.includes('Failed to get stock alert report')) {
                return reply.status(500).send({
                    error: 'Erro ao obter relatório de alertas de estoque'
                });
            }
            return reply.status(500).send({
                error: 'Erro interno do servidor'
            });
        }
    },
    // ================================
    // EXPORT REPORTS
    // ================================
    async exportReport(request, reply) {
        try {
            const { reportType, format, storeId, startDate, endDate, filters } = request.query;
            const reportFilters = {
                storeId,
                startDate,
                endDate,
                ...(filters ? JSON.parse(filters) : {})
            };
            const result = await ReportCommands.exportReport(reportType, format, reportFilters);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message.includes('Failed to export report')) {
                return reply.status(500).send({
                    error: 'Erro ao exportar relatório'
                });
            }
            if (error.message.includes('Unsupported report type')) {
                return reply.status(400).send({
                    error: 'Tipo de relatório não suportado'
                });
            }
            return reply.status(500).send({
                error: 'Erro interno do servidor'
            });
        }
    },
    // ================================
    // SCHEDULE REPORTS
    // ================================
    async scheduleReport(request, reply) {
        try {
            const { reportType, schedule, filters, emailRecipients } = request.body;
            const result = await ReportCommands.scheduleReport(reportType, schedule, filters, emailRecipients);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message.includes('Failed to schedule report')) {
                return reply.status(500).send({
                    error: 'Erro ao agendar relatório'
                });
            }
            return reply.status(500).send({
                error: 'Erro interno do servidor'
            });
        }
    },
    async cancelScheduledReport(request, reply) {
        try {
            const { scheduleId } = request.params;
            const result = await ReportCommands.cancelScheduledReport(scheduleId);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message.includes('Failed to cancel scheduled report')) {
                return reply.status(500).send({
                    error: 'Erro ao cancelar relatório agendado'
                });
            }
            return reply.status(500).send({
                error: 'Erro interno do servidor'
            });
        }
    },
    // ================================
    // EMAIL REPORTS
    // ================================
    async sendReportViaEmail(request, reply) {
        try {
            const { reportType, format, data, emailRecipients, subject, message } = request.body;
            const result = await ReportCommands.sendReportViaEmail(reportType, format, data, emailRecipients, subject, message);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            if (error.message.includes('Failed to send report via email')) {
                return reply.status(500).send({
                    error: 'Erro ao enviar relatório por email'
                });
            }
            return reply.status(500).send({
                error: 'Erro interno do servidor'
            });
        }
    },
    // ================================
    // UTILITY ENDPOINTS
    // ================================
    async getAvailableReportTypes(request, reply) {
        try {
            const result = ReportCommands.getAvailableReportTypes();
            return reply.send({ reportTypes: result });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Erro interno do servidor'
            });
        }
    },
    async getReportStatistics(request, reply) {
        try {
            const result = ReportCommands.getReportStatistics();
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Erro interno do servidor'
            });
        }
    },
    // ================================
    // VALIDATION ENDPOINT
    // ================================
    async validateFilters(request, reply) {
        try {
            const { filters } = request.body;
            const result = ReportCommands.validateReportFilters(filters);
            return reply.send(result);
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Erro interno do servidor'
            });
        }
    }
};
