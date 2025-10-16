import { FastifySchema } from 'fastify';

export const createCustomerSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['userId'],
    properties: {
      userId: { type: 'string', minLength: 1 },
      planId: { type: 'string' },
      status: { 
        type: 'string', 
        enum: ['ACTIVE', 'INACTIVE', 'CANCELLED', 'TRIAL'],
        default: 'ACTIVE'
      },
      renewalDate: { type: 'string', format: 'date-time' },
      trialEndsAt: { type: 'string', format: 'date-time' }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        planId: { type: 'string', nullable: true },
        status: { type: 'string' },
        renewalDate: { type: 'string', format: 'date-time', nullable: true },
        trialEndsAt: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
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
            interval: { type: 'string' },
            features: { type: 'object', nullable: true }
          }
        }
      }
    }
  }
};

export const updateCustomerSchema: FastifySchema = {
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
      planId: { type: 'string' },
      status: { 
        type: 'string', 
        enum: ['ACTIVE', 'INACTIVE', 'CANCELLED', 'TRIAL']
      },
      renewalDate: { type: 'string', format: 'date-time' },
      trialEndsAt: { type: 'string', format: 'date-time' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        planId: { type: 'string', nullable: true },
        status: { type: 'string' },
        renewalDate: { type: 'string', format: 'date-time', nullable: true },
        trialEndsAt: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
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
            interval: { type: 'string' },
            features: { type: 'object', nullable: true }
          }
        }
      }
    }
  }
};

export const getCustomerSchema: FastifySchema = {
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
        userId: { type: 'string' },
        planId: { type: 'string', nullable: true },
        status: { type: 'string' },
        renewalDate: { type: 'string', format: 'date-time', nullable: true },
        trialEndsAt: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
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
            interval: { type: 'string' },
            features: { type: 'object', nullable: true }
          }
        },
        invoices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              amount: { type: 'number' },
              status: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              paymentDate: { type: 'string', format: 'date-time', nullable: true }
            }
          }
        }
      }
    }
  }
};

export const listCustomersSchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'number', minimum: 1, default: 1 },
      limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
      search: { type: 'string' },
      status: { 
        type: 'string', 
        enum: ['ACTIVE', 'INACTIVE', 'CANCELLED', 'TRIAL'] 
      },
      planId: { type: 'string' }
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
              userId: { type: 'string' },
              planId: { type: 'string', nullable: true },
              status: { type: 'string' },
              renewalDate: { type: 'string', format: 'date-time', nullable: true },
              trialEndsAt: { type: 'string', format: 'date-time', nullable: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
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
                  interval: { type: 'string' },
                  features: { type: 'object', nullable: true }
                }
              },
              invoices: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    amount: { type: 'number' },
                    status: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' }
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

export const deleteCustomerSchema: FastifySchema = {
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

export const updateCustomerPlanSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  },
  body: {
    type: 'object',
    required: ['planId'],
    properties: {
      planId: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        planId: { type: 'string', nullable: true },
        status: { type: 'string' },
        renewalDate: { type: 'string', format: 'date-time', nullable: true },
        trialEndsAt: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
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
            interval: { type: 'string' },
            features: { type: 'object', nullable: true }
          }
        }
      }
    }
  }
};

export const cancelCustomerSchema: FastifySchema = {
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
      reason: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        planId: { type: 'string', nullable: true },
        status: { type: 'string' },
        renewalDate: { type: 'string', format: 'date-time', nullable: true },
        trialEndsAt: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  }
};

export const renewCustomerSchema: FastifySchema = {
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
      renewalDate: { type: 'string', format: 'date-time' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        planId: { type: 'string', nullable: true },
        status: { type: 'string' },
        renewalDate: { type: 'string', format: 'date-time', nullable: true },
        trialEndsAt: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  }
};

export const startTrialSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  },
  body: {
    type: 'object',
    required: ['trialDays'],
    properties: {
      trialDays: { type: 'number', minimum: 1, maximum: 365 }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        planId: { type: 'string', nullable: true },
        status: { type: 'string' },
        renewalDate: { type: 'string', format: 'date-time', nullable: true },
        trialEndsAt: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  }
};

export const getCustomerInvoicesSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
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

export const getSubscriptionStatusSchema: FastifySchema = {
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
        customer: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            planId: { type: 'string', nullable: true },
            status: { type: 'string' },
            renewalDate: { type: 'string', format: 'date-time', nullable: true },
            trialEndsAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        subscription: {
          type: 'object',
          properties: {
            isActive: { type: 'boolean' },
            isTrial: { type: 'boolean' },
            daysRemaining: { type: 'number', nullable: true },
            nextBillingDate: { type: 'string', format: 'date-time', nullable: true },
            canUpgrade: { type: 'boolean' },
            canDowngrade: { type: 'boolean' },
            canCancel: { type: 'boolean' }
          }
        },
        billing: {
          type: 'object',
          properties: {
            currentPlan: {
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                price: { type: 'number' },
                interval: { type: 'string' }
              }
            },
            nextInvoice: {
              type: 'object',
              nullable: true,
              properties: {
                amount: { type: 'number' },
                dueDate: { type: 'string', format: 'date-time' }
              }
            },
            lastPayment: {
              type: 'object',
              nullable: true,
              properties: {
                amount: { type: 'number' },
                date: { type: 'string', format: 'date-time' },
                status: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
};

export const getCustomerStatsSchema: FastifySchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        active: { type: 'number' },
        inactive: { type: 'number' },
        cancelled: { type: 'number' },
        trial: { type: 'number' },
        totalRevenue: { type: 'number' },
        averageRevenuePerCustomer: { type: 'number' },
        churnRate: { type: 'number' },
        conversionRate: { type: 'number' }
      }
    }
  }
};

export const updateCustomerStatusSchema: FastifySchema = {
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
        enum: ['ACTIVE', 'INACTIVE', 'CANCELLED', 'TRIAL']
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        planId: { type: 'string', nullable: true },
        status: { type: 'string' },
        renewalDate: { type: 'string', format: 'date-time', nullable: true },
        trialEndsAt: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  }
};

export const CustomerSchemas = {
  create: createCustomerSchema,
  update: updateCustomerSchema,
  get: getCustomerSchema,
  delete: deleteCustomerSchema,
  list: listCustomersSchema,
  updatePlan: updateCustomerPlanSchema,
  cancel: cancelCustomerSchema,
  renew: renewCustomerSchema,
  startTrial: startTrialSchema,
  getInvoices: getCustomerInvoicesSchema,
  getSubscriptionStatus: getSubscriptionStatusSchema,
  getStats: getCustomerStatsSchema,
  updateStatus: updateCustomerStatusSchema
};
