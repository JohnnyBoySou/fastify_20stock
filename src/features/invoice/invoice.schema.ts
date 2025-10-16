import { FastifySchema } from 'fastify';

export const createInvoiceSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['customerId', 'amount'],
    properties: {
      customerId: { type: 'string', minLength: 1 },
      amount: { type: 'number', minimum: 0.01 },
      status: { 
        type: 'string', 
        enum: ['PENDING', 'PAID', 'FAILED'],
        default: 'PENDING'
      },
      gatewayPaymentId: { type: 'string' },
      paymentDate: { type: 'string', format: 'date-time' }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        customerId: { type: 'string' },
        amount: { type: 'number' },
        status: { type: 'string' },
        gatewayPaymentId: { type: 'string', nullable: true },
        paymentDate: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        customer: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            status: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string', nullable: true }
              }
            },
            plan: {
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string', nullable: true },
                price: { type: 'number' },
                interval: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
};

export const updateInvoiceSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  },
  body: {
    type: 'object',
    properties: {
      amount: { type: 'number', minimum: 0.01 },
      status: { 
        type: 'string', 
        enum: ['PENDING', 'PAID', 'FAILED']
      },
      gatewayPaymentId: { type: 'string' },
      paymentDate: { type: 'string', format: 'date-time' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        customerId: { type: 'string' },
        amount: { type: 'number' },
        status: { type: 'string' },
        gatewayPaymentId: { type: 'string', nullable: true },
        paymentDate: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        customer: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            status: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string', nullable: true }
              }
            },
            plan: {
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string', nullable: true },
                price: { type: 'number' },
                interval: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
};

export const getInvoiceSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        customerId: { type: 'string' },
        amount: { type: 'number' },
        status: { type: 'string' },
        gatewayPaymentId: { type: 'string', nullable: true },
        paymentDate: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        customer: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            status: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string', nullable: true }
              }
            },
            plan: {
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string', nullable: true },
                price: { type: 'number' },
                interval: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
};

export const listInvoicesSchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'number', minimum: 1, default: 1 },
      limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
      customerId: { type: 'string' },
      status: { 
        type: 'string', 
        enum: ['PENDING', 'PAID', 'FAILED'] 
      },
      startDate: { type: 'string', format: 'date' },
      endDate: { type: 'string', format: 'date' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              customerId: { type: 'string' },
              amount: { type: 'number' },
              status: { type: 'string' },
              gatewayPaymentId: { type: 'string', nullable: true },
              paymentDate: { type: 'string', format: 'date-time', nullable: true },
              createdAt: { type: 'string', format: 'date-time' },
              customer: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  status: { type: 'string' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      email: { type: 'string' },
                      phone: { type: 'string', nullable: true }
                    }
                  },
                  plan: {
                    type: 'object',
                    nullable: true,
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      description: { type: 'string', nullable: true },
                      price: { type: 'number' },
                      interval: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' }
          }
        }
      }
    }
  }
};

export const deleteInvoiceSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  },
  response: {
    204: { type: 'null' }
  }
};

export const updateInvoiceStatusSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  },
  body: {
    type: 'object',
    required: ['status'],
    properties: {
      status: { 
        type: 'string', 
        enum: ['PENDING', 'PAID', 'FAILED']
      },
      paymentDate: { type: 'string', format: 'date-time' },
      gatewayPaymentId: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        customerId: { type: 'string' },
        amount: { type: 'number' },
        status: { type: 'string' },
        gatewayPaymentId: { type: 'string', nullable: true },
        paymentDate: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        customer: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            status: { type: 'string' }
          }
        }
      }
    }
  }
};

export const retryPaymentSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  },
  body: {
    type: 'object',
    properties: {
      gateway: { type: 'string' },
      paymentMethod: { type: 'object' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        invoice: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            customerId: { type: 'string' },
            amount: { type: 'number' },
            status: { type: 'string' },
            gatewayPaymentId: { type: 'string', nullable: true },
            paymentDate: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        retryResult: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            gatewayResponse: { type: 'object', nullable: true },
            error: { type: 'string', nullable: true }
          }
        }
      }
    }
  }
};

export const getInvoicePdfSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        pdfData: { type: 'object' },
        message: { type: 'string' }
      }
    }
  }
};

export const sendInvoiceEmailSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  },
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      includePdf: { type: 'boolean', default: false }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        invoice: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            customerId: { type: 'string' },
            amount: { type: 'number' },
            status: { type: 'string' }
          }
        },
        emailResult: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            messageId: { type: 'string', nullable: true },
            error: { type: 'string', nullable: true }
          }
        }
      }
    }
  }
};

export const getCustomerInvoicesSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['customerId'],
    properties: {
      customerId: { type: 'string' }
    }
  },
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'number', minimum: 1, default: 1 },
      limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
      status: { 
        type: 'string', 
        enum: ['PENDING', 'PAID', 'FAILED'] 
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        customer: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            status: { type: 'string' }
          }
        },
        invoices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              customerId: { type: 'string' },
              amount: { type: 'number' },
              status: { type: 'string' },
              gatewayPaymentId: { type: 'string', nullable: true },
              paymentDate: { type: 'string', format: 'date-time', nullable: true },
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' }
          }
        }
      }
    }
  }
};

export const getInvoiceStatsSchema: FastifySchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        pending: { type: 'number' },
        paid: { type: 'number' },
        failed: { type: 'number' },
        totalAmount: { type: 'number' },
        totalPaid: { type: 'number' },
        totalPending: { type: 'number' },
        totalFailed: { type: 'number' },
        averageAmount: { type: 'number' },
        conversionRate: { type: 'number' }
      }
    }
  }
};

export const getOverdueInvoicesSchema: FastifySchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        invoices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              customerId: { type: 'string' },
              amount: { type: 'number' },
              status: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              customer: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      email: { type: 'string' },
                      phone: { type: 'string', nullable: true }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export const getRevenueSchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      startDate: { type: 'string', format: 'date' },
      endDate: { type: 'string', format: 'date' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        totalRevenue: { type: 'number' },
        invoiceCount: { type: 'number' },
        revenueByPlan: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              plan: { type: 'object' },
              revenue: { type: 'number' },
              count: { type: 'number' }
            }
          }
        }
      }
    }
  }
};

export const markAsPaidSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  },
  body: {
    type: 'object',
    properties: {
      gatewayPaymentId: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        customerId: { type: 'string' },
        amount: { type: 'number' },
        status: { type: 'string' },
        gatewayPaymentId: { type: 'string', nullable: true },
        paymentDate: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' }
      }
    }
  }
};

export const markAsFailedSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        customerId: { type: 'string' },
        amount: { type: 'number' },
        status: { type: 'string' },
        gatewayPaymentId: { type: 'string', nullable: true },
        paymentDate: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' }
      }
    }
  }
};

export const InvoiceSchemas = {
  create: createInvoiceSchema,
  update: updateInvoiceSchema,
  get: getInvoiceSchema,
  delete: deleteInvoiceSchema,
  list: listInvoicesSchema,
  updateStatus: updateInvoiceStatusSchema,
  retryPayment: retryPaymentSchema,
  getPdf: getInvoicePdfSchema,
  sendEmail: sendInvoiceEmailSchema,
  getByCustomer: getCustomerInvoicesSchema,
  getStats: getInvoiceStatsSchema,
  getOverdue: getOverdueInvoicesSchema,
  getRevenue: getRevenueSchema,
  markAsPaid: markAsPaidSchema,
  markAsFailed: markAsFailedSchema
};
