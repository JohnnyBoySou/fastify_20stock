"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRoutes = ReportRoutes;
const report_controller_1 = require("./report.controller");
const report_schema_1 = require("./report.schema");
async function ReportRoutes(fastify) {
    // ================================
    // DASHBOARD STATS
    // ================================
    fastify.get('/dashboard/stats', {
        schema: report_schema_1.getDashboardStatsSchema,
        handler: report_controller_1.ReportController.getDashboardStats
    });
    // ================================
    // REPORT ENDPOINTS
    // ================================
    // Inventory Report
    fastify.get('/inventory', {
        schema: report_schema_1.getInventoryReportSchema,
        handler: report_controller_1.ReportController.getInventoryReport
    });
    // Movement Report
    fastify.get('/movements', {
        schema: report_schema_1.getMovementReportSchema,
        handler: report_controller_1.ReportController.getMovementReport
    });
    // Financial Report
    fastify.get('/financial', {
        schema: report_schema_1.getFinancialReportSchema,
        handler: report_controller_1.ReportController.getFinancialReport
    });
    // Category Report
    fastify.get('/categories', {
        schema: report_schema_1.getCategoryReportSchema,
        handler: report_controller_1.ReportController.getCategoryReport
    });
    // Supplier Report
    fastify.get('/suppliers', {
        schema: report_schema_1.getSupplierReportSchema,
        handler: report_controller_1.ReportController.getSupplierReport
    });
    // User Activity Report
    fastify.get('/user-activity', {
        schema: report_schema_1.getUserActivityReportSchema,
        handler: report_controller_1.ReportController.getUserActivityReport
    });
    // Stock Alert Report
    fastify.get('/stock-alerts', {
        schema: report_schema_1.getStockAlertReportSchema,
        handler: report_controller_1.ReportController.getStockAlertReport
    });
    // ================================
    // EXPORT ENDPOINTS
    // ================================
    // Export Report
    fastify.get('/export', {
        schema: report_schema_1.exportReportSchema,
        handler: report_controller_1.ReportController.exportReport
    });
    // ================================
    // SCHEDULE ENDPOINTS
    // ================================
    // Schedule Report
    fastify.post('/schedule', {
        schema: {
            description: 'Agendar relatório para geração automática',
            tags: ['Reports'],
            body: {
                type: 'object',
                required: ['reportType', 'schedule', 'filters', 'emailRecipients'],
                properties: {
                    reportType: {
                        type: 'string',
                        enum: ['inventory', 'movement', 'financial', 'category', 'supplier', 'user-activity', 'stock-alert']
                    },
                    schedule: {
                        type: 'object',
                        required: ['frequency', 'time'],
                        properties: {
                            frequency: {
                                type: 'string',
                                enum: ['daily', 'weekly', 'monthly']
                            },
                            time: {
                                type: 'string',
                                pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
                                description: 'Time in HH:MM format'
                            },
                            dayOfWeek: {
                                type: 'number',
                                minimum: 0,
                                maximum: 6,
                                description: 'Day of week (0-6) for weekly frequency'
                            },
                            dayOfMonth: {
                                type: 'number',
                                minimum: 1,
                                maximum: 31,
                                description: 'Day of month (1-31) for monthly frequency'
                            }
                        }
                    },
                    filters: {
                        type: 'object',
                        properties: {
                            storeId: { type: 'string' },
                            startDate: { type: 'string', format: 'date' },
                            endDate: { type: 'string', format: 'date' },
                            categoryId: { type: 'string' },
                            supplierId: { type: 'string' },
                            productId: { type: 'string' },
                            userId: { type: 'string' },
                            status: { type: 'string' },
                            type: { type: 'string' }
                        }
                    },
                    emailRecipients: {
                        type: 'array',
                        items: { type: 'string', format: 'email' },
                        minItems: 1
                    }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        scheduleId: { type: 'string' }
                    }
                }
            }
        },
        handler: report_controller_1.ReportController.scheduleReport
    });
    // Cancel Scheduled Report
    fastify.delete('/schedule/:scheduleId', {
        schema: {
            description: 'Cancelar relatório agendado',
            tags: ['Reports'],
            params: {
                type: 'object',
                properties: {
                    scheduleId: { type: 'string' }
                },
                required: ['scheduleId']
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' }
                    }
                }
            }
        },
        handler: report_controller_1.ReportController.cancelScheduledReport
    });
    // ================================
    // EMAIL ENDPOINTS
    // ================================
    // Send Report via Email
    fastify.post('/send-email', {
        schema: {
            description: 'Enviar relatório por email',
            tags: ['Reports'],
            body: {
                type: 'object',
                required: ['reportType', 'format', 'data', 'emailRecipients'],
                properties: {
                    reportType: {
                        type: 'string',
                        enum: ['inventory', 'movement', 'financial', 'category', 'supplier', 'user-activity', 'stock-alert']
                    },
                    format: {
                        type: 'string',
                        enum: ['csv', 'xlsx', 'pdf']
                    },
                    data: {
                        type: 'array',
                        items: { type: 'object' }
                    },
                    emailRecipients: {
                        type: 'array',
                        items: { type: 'string', format: 'email' },
                        minItems: 1
                    },
                    subject: {
                        type: 'string',
                        description: 'Email subject (optional)'
                    },
                    message: {
                        type: 'string',
                        description: 'Email message (optional)'
                    }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        messageId: { type: 'string' }
                    }
                }
            }
        },
        handler: report_controller_1.ReportController.sendReportViaEmail
    });
    // ================================
    // UTILITY ENDPOINTS
    // ================================
    // Get Available Report Types
    fastify.get('/types', {
        schema: {
            description: 'Obter tipos de relatórios disponíveis',
            tags: ['Reports'],
            response: {
                200: {
                    type: 'object',
                    properties: {
                        reportTypes: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                    name: { type: 'string' },
                                    description: { type: 'string' },
                                    supportedFormats: {
                                        type: 'array',
                                        items: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        handler: report_controller_1.ReportController.getAvailableReportTypes
    });
    // Get Report Statistics
    fastify.get('/statistics', {
        schema: {
            description: 'Obter estatísticas de relatórios',
            tags: ['Reports'],
            response: {
                200: {
                    type: 'object',
                    properties: {
                        totalReports: { type: 'number' },
                        reportsByType: { type: 'object' },
                        reportsByFormat: { type: 'object' },
                        lastGenerated: { type: 'string', nullable: true }
                    }
                }
            }
        },
        handler: report_controller_1.ReportController.getReportStatistics
    });
    // Validate Filters
    fastify.post('/validate-filters', {
        schema: {
            description: 'Validar filtros de relatório',
            tags: ['Reports'],
            body: {
                type: 'object',
                required: ['filters'],
                properties: {
                    filters: {
                        type: 'object',
                        properties: {
                            storeId: { type: 'string' },
                            startDate: { type: 'string', format: 'date' },
                            endDate: { type: 'string', format: 'date' },
                            categoryId: { type: 'string' },
                            supplierId: { type: 'string' },
                            productId: { type: 'string' },
                            userId: { type: 'string' },
                            status: { type: 'string' },
                            type: { type: 'string' },
                            page: { type: 'number', minimum: 1 },
                            limit: { type: 'number', minimum: 1, maximum: 1000 }
                        }
                    }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        isValid: { type: 'boolean' },
                        errors: {
                            type: 'array',
                            items: { type: 'string' }
                        }
                    }
                }
            }
        },
        handler: report_controller_1.ReportController.validateFilters
    });
    // ================================
    // DOWNLOAD ENDPOINTS
    // ================================
    // Download Report
    fastify.get('/download/:exportId', {
        schema: {
            description: 'Download de relatório exportado',
            tags: ['Reports'],
            params: {
                type: 'object',
                properties: {
                    exportId: { type: 'string' }
                },
                required: ['exportId']
            },
            response: {
                200: {
                    type: 'string',
                    description: 'File content'
                },
                500: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                }
            }
        },
        handler: async (request, reply) => {
            try {
                const { exportId } = request.params;
                // In a real implementation, you would:
                // 1. Look up the export record by ID
                // 2. Check if it's still valid (not expired)
                // 3. Generate or retrieve the file
                // 4. Stream it to the client
                // For now, return a placeholder response
                reply.type('application/json');
                return reply.send({
                    message: 'Download endpoint - implementation needed',
                    exportId,
                    note: 'This would return the actual file content'
                });
            }
            catch (error) {
                request.log.error(error);
                return reply.status(500).send({
                    error: 'Erro ao fazer download do relatório'
                });
            }
        }
    });
}
