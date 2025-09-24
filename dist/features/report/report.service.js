export class ReportService {
    reportQueries;
    reportCommands;
    constructor(reportQueries, reportCommands) {
        this.reportQueries = reportQueries;
        this.reportCommands = reportCommands;
    }
    // ================================
    // DASHBOARD STATS
    // ================================
    async getDashboardStats(filters) {
        try {
            return await this.reportQueries.getDashboardStats(filters);
        }
        catch (error) {
            throw new Error(`Failed to get dashboard stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // ================================
    // INVENTORY REPORT
    // ================================
    async getInventoryReport(filters, pagination = { page: 1, limit: 20 }, sort = { field: 'name', order: 'asc' }) {
        try {
            return await this.reportQueries.getInventoryReport(filters, pagination, sort);
        }
        catch (error) {
            throw new Error(`Failed to get inventory report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // ================================
    // MOVEMENT REPORT
    // ================================
    async getMovementReport(filters, pagination = { page: 1, limit: 20 }) {
        try {
            return await this.reportQueries.getMovementReport(filters, pagination);
        }
        catch (error) {
            throw new Error(`Failed to get movement report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // ================================
    // FINANCIAL REPORT
    // ================================
    async getFinancialReport(filters) {
        try {
            return await this.reportQueries.getFinancialReport(filters);
        }
        catch (error) {
            throw new Error(`Failed to get financial report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // ================================
    // CATEGORY REPORT
    // ================================
    async getCategoryReport(filters) {
        try {
            return await this.reportQueries.getCategoryReport(filters);
        }
        catch (error) {
            throw new Error(`Failed to get category report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // ================================
    // SUPPLIER REPORT
    // ================================
    async getSupplierReport(filters) {
        try {
            return await this.reportQueries.getSupplierReport(filters);
        }
        catch (error) {
            throw new Error(`Failed to get supplier report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // ================================
    // USER ACTIVITY REPORT
    // ================================
    async getUserActivityReport(filters, pagination = { page: 1, limit: 20 }) {
        try {
            return await this.reportQueries.getUserActivityReport(filters, pagination);
        }
        catch (error) {
            throw new Error(`Failed to get user activity report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // ================================
    // STOCK ALERT REPORT
    // ================================
    async getStockAlertReport(filters, pagination = { page: 1, limit: 20 }) {
        try {
            return await this.reportQueries.getStockAlertReport(filters, pagination);
        }
        catch (error) {
            throw new Error(`Failed to get stock alert report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // ================================
    // EXPORT REPORTS
    // ================================
    async exportReport(reportType, format, filters) {
        try {
            // First, get the report data
            let reportData = [];
            switch (reportType) {
                case 'inventory':
                    const inventoryReport = await this.getInventoryReport(filters, { page: 1, limit: 10000 });
                    reportData = inventoryReport.products;
                    break;
                case 'movement':
                    const movementReport = await this.getMovementReport(filters, { page: 1, limit: 10000 });
                    reportData = movementReport.movements;
                    break;
                case 'financial':
                    const financialReport = await this.getFinancialReport(filters);
                    reportData = financialReport.data;
                    break;
                case 'category':
                    const categoryReport = await this.getCategoryReport(filters);
                    reportData = categoryReport.categories;
                    break;
                case 'supplier':
                    const supplierReport = await this.getSupplierReport(filters);
                    reportData = supplierReport.suppliers;
                    break;
                case 'user-activity':
                    const userActivityReport = await this.getUserActivityReport(filters, { page: 1, limit: 10000 });
                    reportData = userActivityReport.activities;
                    break;
                case 'stock-alert':
                    const stockAlertReport = await this.getStockAlertReport(filters, { page: 1, limit: 10000 });
                    reportData = stockAlertReport.alerts;
                    break;
                default:
                    throw new Error(`Unsupported report type: ${reportType}`);
            }
            // Generate the export
            return await this.reportCommands.exportReport(reportType, format, filters);
        }
        catch (error) {
            throw new Error(`Failed to export report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // ================================
    // SCHEDULE REPORTS
    // ================================
    async scheduleReport(reportType, schedule, filters, emailRecipients) {
        try {
            return await this.reportCommands.scheduleReport(reportType, schedule, filters, emailRecipients);
        }
        catch (error) {
            throw new Error(`Failed to schedule report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async cancelScheduledReport(scheduleId) {
        try {
            return await this.reportCommands.cancelScheduledReport(scheduleId);
        }
        catch (error) {
            throw new Error(`Failed to cancel scheduled report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // ================================
    // EMAIL REPORTS
    // ================================
    async sendReportViaEmail(reportType, format, data, emailRecipients, subject, message) {
        try {
            return await this.reportCommands.sendReportViaEmail(reportType, format, data, emailRecipients, subject, message);
        }
        catch (error) {
            throw new Error(`Failed to send report via email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // ================================
    // REPORT SUMMARY
    // ================================
    async generateReportSummary(reportType, data, filters) {
        try {
            return await this.reportCommands.generateReportSummary(reportType, data, filters);
        }
        catch (error) {
            throw new Error(`Failed to generate report summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // ================================
    // VALIDATION HELPERS
    // ================================
    validateReportFilters(filters) {
        const errors = [];
        // Validate date range
        if (filters.startDate && filters.endDate) {
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            if (startDate > endDate) {
                errors.push('Start date cannot be after end date');
            }
            if (endDate > new Date()) {
                errors.push('End date cannot be in the future');
            }
        }
        // Validate pagination
        if (filters.page && filters.page < 1) {
            errors.push('Page must be greater than 0');
        }
        if (filters.limit && (filters.limit < 1 || filters.limit > 1000)) {
            errors.push('Limit must be between 1 and 1000');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    // ================================
    // UTILITY METHODS
    // ================================
    async getAvailableReportTypes() {
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
        ];
    }
    async getReportStatistics() {
        // This would typically query the database for actual statistics
        // For now, returning mock data
        return {
            totalReports: 0,
            reportsByType: {},
            reportsByFormat: {},
            lastGenerated: null
        };
    }
}
