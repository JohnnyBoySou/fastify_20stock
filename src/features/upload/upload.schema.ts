import { Type } from '@sinclair/typebox'

// === SCHEMAS DE VALIDAÇÃO ===

// Schema para criar upload
export const createUploadSchema = {
  description: 'Create a new media upload record',
  tags: ['Upload'],
  body: Type.Object({
    name: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
    type: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
    size: Type.Optional(Type.Number({ minimum: 0 }))
  }),
  response: {
    201: Type.Object({
      id: Type.String(),
      url: Type.String(),
      name: Type.Union([Type.String(), Type.Null()]),
      type: Type.Union([Type.String(), Type.Null()]),
      size: Type.Union([Type.Number(), Type.Null()]),
      createdAt: Type.String({ format: 'date-time' }),
      updatedAt: Type.String({ format: 'date-time' })
    }),
    400: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
}

// Schema para atualizar upload
export const updateUploadSchema = {
  description: 'Update upload by ID',
  tags: ['Upload'],
  params: Type.Object({
    id: Type.String({ minLength: 1 })
  }),
  body: Type.Object({
    name: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
    type: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
    size: Type.Optional(Type.Number({ minimum: 0 }))
  }),
  response: {
    200: Type.Object({
      id: Type.String(),
      url: Type.String(),
      name: Type.Union([Type.String(), Type.Null()]),
      type: Type.Union([Type.String(), Type.Null()]),
      size: Type.Union([Type.Number(), Type.Null()]),
      createdAt: Type.String({ format: 'date-time' }),
      updatedAt: Type.String({ format: 'date-time' })
    }),
    404: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
}

// Schema para obter upload por ID
export const getUploadSchema = {
  description: 'Get upload by ID',
  tags: ['Upload'],
  params: Type.Object({
    id: Type.String({ minLength: 1 })
  }),
  response: {
    200: Type.Object({
      id: Type.String(),
      url: Type.String(),
      name: Type.Union([Type.String(), Type.Null()]),
      type: Type.Union([Type.String(), Type.Null()]),
      size: Type.Union([Type.Number(), Type.Null()]),
      createdAt: Type.String({ format: 'date-time' }),
      updatedAt: Type.String({ format: 'date-time' })
    }),
    404: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
}

// Schema para listar uploads
export const listUploadsSchema = {
  description: 'List uploads with pagination and filters',
  tags: ['Upload'],
  querystring: Type.Object({
    page: Type.Optional(Type.Number({ minimum: 1, default: 1 })),
    limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100, default: 10 })),
    search: Type.Optional(Type.String()),
    type: Type.Optional(Type.String()),
    entityType: Type.Optional(Type.Union([
      Type.Literal('product'),
      Type.Literal('supplier'),
      Type.Literal('user'),
      Type.Literal('store')
    ])),
    entityId: Type.Optional(Type.String())
  }),
  response: {
    200: Type.Object({
      uploads: Type.Array(Type.Object({
        id: Type.String(),
        url: Type.String(),
        name: Type.Union([Type.String(), Type.Null()]),
        type: Type.Union([Type.String(), Type.Null()]),
        size: Type.Union([Type.Number(), Type.Null()]),
        createdAt: Type.String({ format: 'date-time' }),
        updatedAt: Type.String({ format: 'date-time' })
      })),
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
}

// Schema para deletar upload
export const deleteUploadSchema = {
  description: 'Delete upload by ID',
  tags: ['Upload'],
  params: Type.Object({
    id: Type.String({ minLength: 1 })
  }),
  response: {
    204: Type.Null(),
    404: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
}

// Schema para anexar mídia a uma entidade
export const attachMediaSchema = {
  description: 'Attach media to an entity',
  tags: ['Upload'],
  params: Type.Object({
    id: Type.String({ minLength: 1 })
  }),
  body: Type.Object({
    entityType: Type.Union([
      Type.Literal('product'),
      Type.Literal('supplier'),
      Type.Literal('user'),
      Type.Literal('store')
    ]),
    entityId: Type.String({ minLength: 1 }),
    isPrimary: Type.Optional(Type.Boolean({ default: false }))
  }),
  response: {
    200: Type.Object({
      id: Type.String(),
      mediaId: Type.String(),
      entityType: Type.String(),
      entityId: Type.String(),
      isPrimary: Type.Union([Type.Boolean(), Type.Null()]),
      createdAt: Type.String({ format: 'date-time' })
    }),
    400: Type.Object({
      error: Type.String()
    }),
    404: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
}

// Schema para desanexar mídia de uma entidade
export const detachMediaSchema = {
  description: 'Detach media from an entity',
  tags: ['Upload'],
  params: Type.Object({
    id: Type.String({ minLength: 1 })
  }),
  body: Type.Object({
    entityType: Type.Union([
      Type.Literal('product'),
      Type.Literal('supplier'),
      Type.Literal('user'),
      Type.Literal('store')
    ]),
    entityId: Type.String({ minLength: 1 })
  }),
  response: {
    200: Type.Object({
      success: Type.Boolean()
    }),
    404: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
}

// Schema para obter mídias de uma entidade
export const getEntityMediaSchema = {
  description: 'Get media attached to an entity',
  tags: ['Upload'],
  params: Type.Object({
    entityType: Type.Union([
      Type.Literal('product'),
      Type.Literal('supplier'),
      Type.Literal('user'),
      Type.Literal('store')
    ]),
    entityId: Type.String({ minLength: 1 })
  }),
  response: {
    200: Type.Object({
      media: Type.Array(Type.Object({
        id: Type.String(),
        mediaId: Type.String(),
        entityType: Type.String(),
        entityId: Type.String(),
        isPrimary: Type.Union([Type.Boolean(), Type.Null()]),
        createdAt: Type.String({ format: 'date-time' }),
        media: Type.Object({
          id: Type.String(),
          url: Type.String(),
          name: Type.Union([Type.String(), Type.Null()]),
          type: Type.Union([Type.String(), Type.Null()]),
          size: Type.Union([Type.Number(), Type.Null()])
        })
      }))
    }),
    404: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
}

// Schema para definir mídia principal
export const setPrimaryMediaSchema = {
  description: 'Set media as primary for an entity',
  tags: ['Upload'],
  params: Type.Object({
    id: Type.String({ minLength: 1 })
  }),
  body: Type.Object({
    entityType: Type.Union([
      Type.Literal('product'),
      Type.Literal('supplier'),
      Type.Literal('user'),
      Type.Literal('store')
    ]),
    entityId: Type.String({ minLength: 1 })
  }),
  response: {
    200: Type.Object({
      success: Type.Boolean()
    }),
    404: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
}

// Schema para buscar por tipo
export const getByTypeSchema = {
  description: 'Get uploads by type',
  tags: ['Upload'],
  params: Type.Object({
    type: Type.String({ minLength: 1 })
  }),
  response: {
    200: Type.Object({
      uploads: Type.Array(Type.Object({
        id: Type.String(),
        url: Type.String(),
        name: Type.Union([Type.String(), Type.Null()]),
        type: Type.Union([Type.String(), Type.Null()]),
        size: Type.Union([Type.Number(), Type.Null()]),
        createdAt: Type.String({ format: 'date-time' }),
        updatedAt: Type.String({ format: 'date-time' })
      }))
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
}

// Schema para buscar recentes
export const getRecentSchema = {
  description: 'Get recent uploads',
  tags: ['Upload'],
  querystring: Type.Object({
    limit: Type.Optional(Type.Number({ minimum: 1, maximum: 50, default: 10 }))
  }),
  response: {
    200: Type.Object({
      uploads: Type.Array(Type.Object({
        id: Type.String(),
        url: Type.String(),
        name: Type.Union([Type.String(), Type.Null()]),
        type: Type.Union([Type.String(), Type.Null()]),
        size: Type.Union([Type.Number(), Type.Null()]),
        createdAt: Type.String({ format: 'date-time' }),
        updatedAt: Type.String({ format: 'date-time' })
      }))
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
}

// Schema para estatísticas
export const getStatsSchema = {
  description: 'Get upload statistics',
  tags: ['Upload'],
  response: {
    200: Type.Object({
      total: Type.Number(),
      byType: Type.Record(Type.String(), Type.Number()),
      totalSize: Type.Number(),
      recentCount: Type.Number()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
}

// Schema para busca
export const searchSchema = {
  description: 'Search uploads',
  tags: ['Upload'],
  querystring: Type.Object({
    q: Type.String({ minLength: 1 }),
    limit: Type.Optional(Type.Number({ minimum: 1, maximum: 50, default: 10 }))
  }),
  response: {
    200: Type.Object({
      uploads: Type.Array(Type.Object({
        id: Type.String(),
        url: Type.String(),
        name: Type.Union([Type.String(), Type.Null()]),
        type: Type.Union([Type.String(), Type.Null()]),
        size: Type.Union([Type.Number(), Type.Null()]),
        createdAt: Type.String({ format: 'date-time' }),
        updatedAt: Type.String({ format: 'date-time' })
      }))
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
}

// Schema para uso da mídia
export const getMediaUsageSchema = {
  description: 'Get media usage information',
  tags: ['Upload'],
  params: Type.Object({
    id: Type.String({ minLength: 1 })
  }),
  response: {
    200: Type.Object({
      usage: Type.Array(Type.Object({
        entityType: Type.String(),
        entityId: Type.String(),
        isPrimary: Type.Union([Type.Boolean(), Type.Null()]),
        createdAt: Type.String({ format: 'date-time' })
      }))
    }),
    404: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
}

// Schema para mídias não utilizadas
export const getUnusedMediaSchema = {
  description: 'Get unused media',
  tags: ['Upload'],
  querystring: Type.Object({
    limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100, default: 20 }))
  }),
  response: {
    200: Type.Object({
      uploads: Type.Array(Type.Object({
        id: Type.String(),
        url: Type.String(),
        name: Type.Union([Type.String(), Type.Null()]),
        type: Type.Union([Type.String(), Type.Null()]),
        size: Type.Union([Type.Number(), Type.Null()]),
        createdAt: Type.String({ format: 'date-time' }),
        updatedAt: Type.String({ format: 'date-time' })
      }))
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
}

// Schema para mídia principal
export const getPrimaryMediaSchema = {
  description: 'Get primary media for an entity',
  tags: ['Upload'],
  params: Type.Object({
    entityType: Type.Union([
      Type.Literal('product'),
      Type.Literal('supplier'),
      Type.Literal('user'),
      Type.Literal('store')
    ]),
    entityId: Type.String({ minLength: 1 })
  }),
  response: {
    200: Type.Object({
      media: Type.Object({
        id: Type.String(),
        url: Type.String(),
        name: Type.Union([Type.String(), Type.Null()]),
        type: Type.Union([Type.String(), Type.Null()]),
        size: Type.Union([Type.Number(), Type.Null()])
      })
    }),
    404: Type.Object({
      error: Type.String()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
}

// Schema para deletar em lote
export const bulkDeleteSchema = {
  description: 'Delete multiple uploads',
  tags: ['Upload'],
  body: Type.Object({
    ids: Type.Array(Type.String({ minLength: 1 }), { minItems: 1 })
  }),
  response: {
    200: Type.Object({
      deleted: Type.Number(),
      failed: Type.Number()
    }),
    500: Type.Object({
      error: Type.String()
    })
  }
}