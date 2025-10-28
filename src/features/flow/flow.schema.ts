import { Type } from '@sinclair/typebox';

// Schemas básicos
const FlowStatusSchema = Type.Union([
  Type.Literal('ACTIVE'),
  Type.Literal('INACTIVE'),
  Type.Literal('DRAFT')
]);

const FlowNodeSchema = Type.Object({
  id: Type.String(),
  type: Type.String(),
  position: Type.Object({
    x: Type.Number(),
    y: Type.Number()
  }),
  data: Type.Object({
    label: Type.String(),
    description: Type.Optional(Type.String()),
    color: Type.Optional(Type.String()),
    config: Type.Optional(Type.Any())
  })
});

const FlowEdgeSchema = Type.Object({
  id: Type.String(),
  source: Type.String(),
  target: Type.String(),
  animated: Type.Optional(Type.Boolean()),
  style: Type.Optional(Type.Any()),
  markerEnd: Type.Optional(Type.Any()),
  label: Type.Optional(Type.String())
});

// Create Flow Schema
export const createFlowSchema = {
  body: Type.Object({
    name: Type.String({ minLength: 1 }),
    description: Type.Optional(Type.String()),
    nodes: Type.Array(FlowNodeSchema),
    edges: Type.Array(FlowEdgeSchema),
    status: Type.Optional(FlowStatusSchema)
  }),
  response: {
    201: Type.Object({
      id: Type.String(),
      name: Type.String(),
      description: Type.Optional(Type.String()),
      nodes: Type.Array(FlowNodeSchema),
      edges: Type.Array(FlowEdgeSchema),
      status: FlowStatusSchema,
      storeId: Type.String(),
      createdBy: Type.String(),
      createdAt: Type.String(),
      updatedAt: Type.String()
    }),
    400: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
};

// Update Flow Schema
export const updateFlowSchema = {
  params: Type.Object({
    id: Type.String()
  }),
  body: Type.Object({
    name: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    nodes: Type.Optional(Type.Array(FlowNodeSchema)),
    edges: Type.Optional(Type.Array(FlowEdgeSchema)),
    status: Type.Optional(FlowStatusSchema)
  }),
  response: {
    200: Type.Object({
      id: Type.String(),
      name: Type.String(),
      description: Type.Optional(Type.String()),
      nodes: Type.Array(FlowNodeSchema),
      edges: Type.Array(FlowEdgeSchema),
      status: FlowStatusSchema,
      storeId: Type.String(),
      createdBy: Type.String(),
      createdAt: Type.String(),
      updatedAt: Type.String()
    }),
    404: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
};

// Get Flow Schema
export const getFlowSchema = {
  params: Type.Object({
    id: Type.String()
  }),
  response: {
    200: Type.Object({
      id: Type.String(),
      name: Type.String(),
      description: Type.Optional(Type.String()),
      nodes: Type.Array(FlowNodeSchema),
      edges: Type.Array(FlowEdgeSchema),
      status: FlowStatusSchema,
      storeId: Type.String(),
      createdBy: Type.String(),
      createdAt: Type.String(),
      updatedAt: Type.String()
    }),
    404: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
};

// Delete Flow Schema
export const deleteFlowSchema = {
  params: Type.Object({
    id: Type.String()
  }),
  response: {
    204: Type.Object({}),
    404: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
};

// List Flows Schema
export const listFlowsSchema = {
  querystring: Type.Object({
    page: Type.Optional(Type.Number({ minimum: 1 })),
    limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
    search: Type.Optional(Type.String()),
    status: Type.Optional(FlowStatusSchema)
  }),
  response: {
    200: Type.Object({
      flows: Type.Array(Type.Any()),
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

// Update Flow Status Schema
export const updateFlowStatusSchema = {
  params: Type.Object({
    id: Type.String()
  }),
  body: Type.Object({
    status: FlowStatusSchema
  }),
  response: {
    200: Type.Object({
      id: Type.String(),
      name: Type.String(),
      description: Type.Optional(Type.String()),
      nodes: Type.Array(FlowNodeSchema),
      edges: Type.Array(FlowEdgeSchema),
      status: FlowStatusSchema,
      storeId: Type.String(),
      createdBy: Type.String(),
      createdAt: Type.String(),
      updatedAt: Type.String()
    }),
    404: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
};

// Duplicate Flow Schema
export const duplicateFlowSchema = {
  params: Type.Object({
    id: Type.String()
  }),
  body: Type.Optional(Type.Object({
    name: Type.Optional(Type.String())
  })),
  response: {
    201: Type.Object({
      id: Type.String(),
      name: Type.String(),
      description: Type.Optional(Type.String()),
      nodes: Type.Array(FlowNodeSchema),
      edges: Type.Array(FlowEdgeSchema),
      status: FlowStatusSchema,
      storeId: Type.String(),
      createdBy: Type.String(),
      createdAt: Type.String(),
      updatedAt: Type.String()
    }),
    404: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
};

// Test Flow Schema
export const testFlowSchema = {
  params: Type.Object({
    id: Type.String()
  }),
  body: Type.Object({
    triggerData: Type.Any()
  }),
  response: {
    200: Type.Object({
      executionId: Type.String(),
      status: Type.String(),
      executionLog: Type.Array(Type.Any())
    }),
    404: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
};


export const FlowSchemas = {
  create: createFlowSchema,
  update: updateFlowSchema,
  get: getFlowSchema,
  delete: deleteFlowSchema,
  list: listFlowsSchema,
  updateStatus: updateFlowStatusSchema,
  duplicate: duplicateFlowSchema,
  test: testFlowSchema
}