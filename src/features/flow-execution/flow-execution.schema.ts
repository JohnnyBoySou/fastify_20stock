import { Type } from '@sinclair/typebox';

// Schemas básicos
const FlowExecutionStatusSchema = Type.Union([
  Type.Literal('SUCCESS'),
  Type.Literal('FAILED'),
  Type.Literal('RUNNING'),
  Type.Literal('CANCELLED')
]);

// Get Flow Execution Schema
export const getFlowExecutionSchema = {
  params: Type.Object({
    id: Type.String()
  }),
  response: {
    200: Type.Object({
      id: Type.String(),
      flowId: Type.String(),
      status: FlowExecutionStatusSchema,
      triggerType: Type.String(),
      triggerData: Type.Any(),
      executionLog: Type.Array(Type.Any()),
      error: Type.Optional(Type.String()),
      startedAt: Type.String(),
      completedAt: Type.Optional(Type.String()),
      duration: Type.Optional(Type.Number())
    }),
    404: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
};

// List Flow Executions Schema
export const listFlowExecutionsSchema = {
  querystring: Type.Object({
    page: Type.Optional(Type.Number({ minimum: 1 })),
    limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
    flowId: Type.Optional(Type.String()),
    status: Type.Optional(FlowExecutionStatusSchema),
    triggerType: Type.Optional(Type.String()),
    startDate: Type.Optional(Type.String()),
    endDate: Type.Optional(Type.String())
  }),
  response: {
    200: Type.Object({
      executions: Type.Array(Type.Any()),
      pagination: Type.Object({
        page: Type.Number(),
        limit: Type.Number(),
        total: Type.Number(),
        totalPages: Type.Number()
      })
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
};

// Get By Flow Schema
export const getByFlowSchema = {
  params: Type.Object({
    flowId: Type.String()
  }),
  querystring: Type.Object({
    page: Type.Optional(Type.Number({ minimum: 1 })),
    limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
    status: Type.Optional(FlowExecutionStatusSchema)
  }),
  response: {
    200: Type.Object({
      executions: Type.Array(Type.Any()),
      pagination: Type.Object({
        page: Type.Number(),
        limit: Type.Number(),
        total: Type.Number(),
        totalPages: Type.Number()
      })
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
};

// Get Stats Schema
export const getStatsSchema = {
  params: Type.Object({
    flowId: Type.String()
  }),
  response: {
    200: Type.Object({
      total: Type.Number(),
      byStatus: Type.Object({
        success: Type.Number(),
        failed: Type.Number(),
        running: Type.Number(),
        cancelled: Type.Number()
      }),
      byTrigger: Type.Record(Type.String(), Type.Number()),
      averageDuration: Type.Number(),
      lastExecution: Type.Optional(Type.Any())
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
};

// Cancel Execution Schema
export const cancelExecutionSchema = {
  params: Type.Object({
    id: Type.String()
  }),
  response: {
    200: Type.Object({
      id: Type.String(),
      status: FlowExecutionStatusSchema,
      cancelledAt: Type.String()
    }),
    404: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
};

export const FlowExecutionSchemas = {
  get: getFlowExecutionSchema,
  list: listFlowExecutionsSchema,
  getByFlow: getByFlowSchema,
  getStats: getStatsSchema,
  cancel: cancelExecutionSchema
};

