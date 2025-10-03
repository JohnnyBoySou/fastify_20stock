"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportCommands = void 0;
const prisma_1 = require("@/plugins/prisma");
exports.ReportCommands = {
    // ================================
    // EXPORT REPORTS
    // ================================
    async exportReport(reportType, format, filters) {
        try {
            // Generate unique filename
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `${reportType}-report-${timestamp}.${format}`;
            // Create export record in database
            const exportRecord = await prisma_1.db.auditLog.create({
                data: {
                    entity: 'REPORT',
                    entityId: `export-${Date.now()}`,
                    action: 'CREATE',
                    before: null,
                    after: {
                        reportType,
                        format,
                        filters,
                        filename,
                        generatedAt: new Date().toISOString()
                    }
                }
            });
            // Generate download URL (in a real implementation, this would be a signed URL)
            const downloadUrl = `/api/reports/download/${exportRecord.id}`;
            // Set expiration time (24 hours from now)
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
            return {
                success: true,
                downloadUrl,
                filename,
                format,
                generatedAt: new Date().toISOString(),
                expiresAt: expiresAt.toISOString()
            };
        }
        catch (error) {
            throw new Error(`Failed to export report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    // ================================
    // GENERATE CSV REPORT
    // ================================
    async generateCsvReport(reportType, data, columns) {
        try {
            // Create CSV header
            const header = columns.join(',');
            // Create CSV rows
            const rows = data.map(item => {
                return columns.map(column => {
                    const value = exports.ReportCommands.getNestedValue(item, column);
                    // Escape CSV values
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value || '';
                }).join(',');
            });
            // Combine header and rows
            return [header, ...rows].join('\n');
        }
        catch (error) {
            throw new Error(`Failed to generate CSV report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    // ================================
    // GENERATE EXCEL REPORT
    // ================================
    async generateExcelReport(reportType, data, columns) {
        try {
            // In a real implementation, you would use a library like 'xlsx' or 'exceljs'
            // For now, we'll return a mock buffer
            const workbook = {
                SheetNames: [reportType],
                Sheets: {
                    [reportType]: {
                        '!ref': 'A1',
                        A1: { v: 'Report Generated', t: 's' },
                        A2: { v: new Date().toISOString(), t: 's' }
                    }
                }
            };
            // Convert to buffer (mock implementation)
            return Buffer.from(JSON.stringify(workbook));
        }
        catch (error) {
            throw new Error(`Failed to generate Excel report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    // ================================
    // GENERATE PDF REPORT
    // ================================
    async generatePdfReport(reportType, data, columns) {
        try {
            // In a real implementation, you would use a library like 'puppeteer' or 'pdfkit'
            // For now, we'll return a mock buffer
            const pdfContent = {
                title: `${reportType} Report`,
                generatedAt: new Date().toISOString(),
                totalRecords: data.length,
                columns: columns.map(col => col.label),
                data: data.slice(0, 10) // Limit for demo
            };
            // Convert to buffer (mock implementation)
            return Buffer.from(JSON.stringify(pdfContent));
        }
        catch (error) {
            throw new Error(`Failed to generate PDF report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    // ================================
    // SCHEDULE REPORT
    // ================================
    async scheduleReport(reportType, schedule, filters, emailRecipients) {
        try {
            // Create scheduled report record
            const scheduledReport = await prisma_1.db.auditLog.create({
                data: {
                    entity: 'REPORT',
                    entityId: `schedule-${Date.now()}`,
                    action: 'CREATE',
                    before: null,
                    after: {
                        reportType,
                        schedule,
                        filters,
                        emailRecipients,
                        isActive: true,
                        createdAt: new Date().toISOString()
                    }
                }
            });
            return {
                success: true,
                scheduleId: scheduledReport.id
            };
        }
        catch (error) {
            throw new Error(`Failed to schedule report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    // ================================
    // CANCEL SCHEDULED REPORT
    // ================================
    async cancelScheduledReport(scheduleId) {
        try {
            // Update scheduled report to inactive
            await prisma_1.db.auditLog.update({
                where: { id: scheduleId },
                data: {
                    after: {
                        ...(await prisma_1.db.auditLog.findUnique({
                            where: { id: scheduleId },
                            select: { after: true }
                        }))?.after,
                        isActive: false,
                        cancelledAt: new Date().toISOString()
                    }
                }
            });
            return { success: true };
        }
        catch (error) {
            throw new Error(`Failed to cancel scheduled report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    // ================================
    // SEND REPORT VIA EMAIL
    // ================================
    async sendReportViaEmail(reportType, format, data, emailRecipients, subject, message) {
        try {
            // Generate report content
            let reportContent;
            let filename;
            switch (format) {
                case 'csv':
                    const columns = exports.ReportCommands.getDefaultColumns(reportType);
                    reportContent = await exports.ReportCommands.generateCsvReport(reportType, data, columns);
                    filename = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
                    break;
                case 'xlsx':
                    const excelColumns = exports.ReportCommands.getDefaultExcelColumns(reportType);
                    reportContent = await exports.ReportCommands.generateExcelReport(reportType, data, excelColumns);
                    filename = `${reportType}-report-${new Date().toISOString().split('T')[0]}.xlsx`;
                    break;
                case 'pdf':
                    const pdfColumns = exports.ReportCommands.getDefaultPdfColumns(reportType);
                    reportContent = await exports.ReportCommands.generatePdfReport(reportType, data, pdfColumns);
                    filename = `${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf`;
                    break;
                default:
                    throw new Error(`Unsupported format: ${format}`);
            }
            // In a real implementation, you would send the email here
            // For now, we'll just log the action
            const emailLog = await prisma_1.db.auditLog.create({
                data: {
                    entity: 'REPORT',
                    entityId: `email-${Date.now()}`,
                    action: 'CREATE',
                    before: null,
                    after: {
                        reportType,
                        format,
                        recipients: emailRecipients,
                        subject: subject || `${reportType} Report`,
                        message: message || 'Please find the attached report.',
                        filename,
                        sentAt: new Date().toISOString()
                    }
                }
            });
            return {
                success: true,
                messageId: emailLog.id
            };
        }
        catch (error) {
            throw new Error(`Failed to send report via email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    // ================================
    // GENERATE REPORT SUMMARY
    // ================================
    async generateReportSummary(reportType, data, filters) {
        try {
            const summary = {};
            // Generate summary based on report type
            switch (reportType) {
                case 'inventory':
                    summary.totalValue = data.reduce((sum, item) => sum + (item.totalValue || 0), 0);
                    summary.lowStockItems = data.filter(item => item.alertLevel === 'low').length;
                    summary.outOfStockItems = data.filter(item => item.alertLevel === 'out').length;
                    break;
                case 'movement':
                    summary.totalMovements = data.length;
                    summary.totalValue = data.reduce((sum, item) => sum + (item.totalValue || 0), 0);
                    summary.entries = data.filter(item => item.type === 'ENTRADA').length;
                    summary.exits = data.filter(item => item.type === 'SAIDA').length;
                    summary.losses = data.filter(item => item.type === 'PERDA').length;
                    break;
                case 'financial':
                    summary.totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
                    summary.totalCosts = data.reduce((sum, item) => sum + (item.costs || 0), 0);
                    summary.grossProfit = summary.totalRevenue - summary.totalCosts;
                    summary.profitMargin = summary.totalRevenue > 0 ? (summary.grossProfit / summary.totalRevenue) * 100 : 0;
                    break;
                default:
                    summary.totalRecords = data.length;
            }
            return {
                totalRecords: data.length,
                dateRange: {
                    start: filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    end: filters.endDate || new Date().toISOString().split('T')[0]
                },
                filters,
                generatedAt: new Date().toISOString(),
                summary
            };
        }
        catch (error) {
            throw new Error(`Failed to generate report summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    // ================================
    // HELPER METHODS
    // ================================
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    },
    getDefaultColumns(reportType) {
        const columnMap = {
            inventory: ['id', 'name', 'description', 'category.name', 'supplier.corporateName', 'currentStock', 'stockMin', 'stockMax', 'unitPrice', 'totalValue', 'status', 'alertLevel'],
            movement: ['id', 'type', 'quantity', 'price', 'totalValue', 'batch', 'expiration', 'note', 'product.name', 'supplier.corporateName', 'user.name', 'createdAt'],
            financial: ['period', 'revenue', 'costs', 'profit', 'movements'],
            category: ['id', 'name', 'description', 'code', 'stats.totalProducts', 'stats.totalValue', 'stats.averagePrice', 'stats.movements'],
            supplier: ['id', 'corporateName', 'tradeName', 'cnpj', 'status', 'stats.totalProducts', 'stats.totalValue', 'stats.totalMovements', 'stats.averageOrderValue'],
            'user-activity': ['id', 'entity', 'entityId', 'action', 'user.name', 'user.email', 'createdAt'],
            'stock-alert': ['id', 'productName', 'currentStock', 'stockMin', 'stockMax', 'alertType', 'severity', 'unitPrice', 'totalValue', 'category.name', 'supplier.corporateName']
        };
        return columnMap[reportType] || ['id', 'name', 'createdAt'];
    },
    getDefaultExcelColumns(reportType) {
        const columnMap = {
            inventory: [
                { key: 'id', label: 'ID', type: 'string' },
                { key: 'name', label: 'Nome', type: 'string' },
                { key: 'description', label: 'Descrição', type: 'string' },
                { key: 'category.name', label: 'Categoria', type: 'string' },
                { key: 'supplier.corporateName', label: 'Fornecedor', type: 'string' },
                { key: 'currentStock', label: 'Estoque Atual', type: 'number' },
                { key: 'stockMin', label: 'Estoque Mínimo', type: 'number' },
                { key: 'stockMax', label: 'Estoque Máximo', type: 'number' },
                { key: 'unitPrice', label: 'Preço Unitário', type: 'number' },
                { key: 'totalValue', label: 'Valor Total', type: 'number' },
                { key: 'status', label: 'Status', type: 'string' },
                { key: 'alertLevel', label: 'Nível de Alerta', type: 'string' }
            ],
            movement: [
                { key: 'id', label: 'ID', type: 'string' },
                { key: 'type', label: 'Tipo', type: 'string' },
                { key: 'quantity', label: 'Quantidade', type: 'number' },
                { key: 'price', label: 'Preço', type: 'number' },
                { key: 'totalValue', label: 'Valor Total', type: 'number' },
                { key: 'batch', label: 'Lote', type: 'string' },
                { key: 'expiration', label: 'Validade', type: 'date' },
                { key: 'note', label: 'Observação', type: 'string' },
                { key: 'product.name', label: 'Produto', type: 'string' },
                { key: 'supplier.corporateName', label: 'Fornecedor', type: 'string' },
                { key: 'user.name', label: 'Usuário', type: 'string' },
                { key: 'createdAt', label: 'Data', type: 'date' }
            ]
        };
        return columnMap[reportType] || [
            { key: 'id', label: 'ID', type: 'string' },
            { key: 'name', label: 'Nome', type: 'string' },
            { key: 'createdAt', label: 'Data de Criação', type: 'date' }
        ];
    },
    getDefaultPdfColumns(reportType) {
        const columnMap = {
            inventory: [
                { key: 'name', label: 'Produto', width: 30 },
                { key: 'category.name', label: 'Categoria', width: 20 },
                { key: 'currentStock', label: 'Estoque', width: 15 },
                { key: 'unitPrice', label: 'Preço', width: 15 },
                { key: 'totalValue', label: 'Valor Total', width: 20 }
            ],
            movement: [
                { key: 'product.name', label: 'Produto', width: 25 },
                { key: 'type', label: 'Tipo', width: 15 },
                { key: 'quantity', label: 'Quantidade', width: 15 },
                { key: 'totalValue', label: 'Valor', width: 15 },
                { key: 'user.name', label: 'Usuário', width: 15 },
                { key: 'createdAt', label: 'Data', width: 15 }
            ]
        };
        return columnMap[reportType] || [
            { key: 'name', label: 'Nome', width: 50 },
            { key: 'createdAt', label: 'Data', width: 50 }
        ];
    },
    // ================================
    // VALIDATION METHODS
    // ================================
    validateReportFilters(filters) {
        const errors = [];
        // Basic validation logic
        if (filters.startDate && filters.endDate) {
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            if (startDate > endDate) {
                errors.push('Start date cannot be after end date');
            }
        }
        if (filters.storeId && typeof filters.storeId !== 'string') {
            errors.push('Store ID must be a string');
        }
        return {
            valid: errors.length === 0,
            errors
        };
    },
    getAvailableReportTypes() {
        return [
            'inventory',
            'movement',
            'financial',
            'category',
            'supplier',
            'user-activity',
            'stock-alert'
        ];
    },
    getReportStatistics() {
        return {
            totalReports: 0, // This would be calculated from actual data
            availableTypes: exports.ReportCommands.getAvailableReportTypes()
        };
    }
};
