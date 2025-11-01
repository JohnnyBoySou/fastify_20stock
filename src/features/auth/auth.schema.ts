import type { FastifySchema } from 'fastify'

// Register schema
export const registerSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        description: 'User full name',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
      },
      password: {
        type: 'string',
        minLength: 6,
        maxLength: 100,
        description: 'User password (minimum 6 characters)',
      },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            emailVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        message: { type: 'string' },
      },
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    409: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

// Login schema
export const loginSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
      },
      password: {
        type: 'string',
        description: 'User password',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            emailVerified: { type: 'boolean' },
            lastLoginAt: { type: 'string', format: 'date-time' },
          },
        },
        token: { type: 'string' },
        message: { type: 'string' },
      },
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    401: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

// Forgot Password schema
export const forgotPasswordSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

// Verify Reset Code schema
export const verifyResetCodeSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['email', 'code'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
      },
      code: {
        type: 'string',
        pattern: '^[0-9]{6}$',
        description: '6-digit reset code',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    401: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

// Reset Password schema
export const resetPasswordSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['email', 'code', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
      },
      code: {
        type: 'string',
        pattern: '^[0-9]{6}$',
        description: '6-digit reset code',
      },
      password: {
        type: 'string',
        minLength: 6,
        maxLength: 100,
        description: 'New password (minimum 6 characters)',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    401: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

// Verify Email schema
export const verifyEmailSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['token'],
    properties: {
      token: {
        type: 'string',
        description: 'Email verification token',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    401: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

// Verify Email Code schema
export const verifyEmailCodeSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['email', 'code'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
      },
      code: {
        type: 'string',
        pattern: '^[0-9]{6}$',
        description: '6-digit verification code',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            emailVerified: { type: 'boolean' },
          },
        },
      },
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    401: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

// Resend Verification schema
export const resendVerificationSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

// Refresh Token schema
export const refreshTokenSchema: FastifySchema = {
  headers: {
    type: 'object',
    properties: {
      authorization: {
        type: 'string',
        description: 'Bearer token',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        message: { type: 'string' },
      },
    },
    401: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

// Logout schema
export const logoutSchema: FastifySchema = {
  headers: {
    type: 'object',
    properties: {
      authorization: {
        type: 'string',
        description: 'Bearer token',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    401: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

// Update Profile schema
export const updateProfileSchema: FastifySchema = {
  headers: {
    type: 'object',
    properties: {
      authorization: {
        type: 'string',
        description: 'Bearer token',
      },
    },
  },
  body: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        description: 'User full name',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
      },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            emailVerified: { type: 'boolean' },
            status: { type: 'boolean' },
            roles: {
              type: 'array',
              items: { type: 'string' },
            },
            lastLoginAt: { type: ['string', 'null'], format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        message: { type: 'string' },
      },
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    401: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    409: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

// Google Login schema
export const googleLoginSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['id_token'],
    properties: {
      id_token: {
        type: 'string',
        description: 'Google ID token from client-side authentication',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            emailVerified: { type: 'boolean' },
            lastLoginAt: { type: ['string', 'null'], format: 'date-time' },
          },
        },
        store: {
          type: ['object', 'null'],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            cnpj: { type: 'string' },
            email: { type: ['string', 'null'] },
            phone: { type: ['string', 'null'] },
            status: { type: 'boolean' },
            cep: { type: ['string', 'null'] },
            city: { type: ['string', 'null'] },
            state: { type: ['string', 'null'] },
            address: { type: ['string', 'null'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        token: { type: 'string' },
        message: { type: 'string' },
      },
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    401: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

// Get Profile Permissions schema
export const getProfilePermissionsSchema: FastifySchema = {
  headers: {
    type: 'object',
    properties: {
      authorization: {
        type: 'string',
        description: 'Bearer token',
      },
    },
  },
  querystring: {
    type: 'object',
    properties: {
      storeId: {
        type: 'string',
        description: 'Store ID to filter permissions',
      },
      active: {
        type: 'boolean',
        description: 'Filter active permissions only',
      },
      page: {
        type: 'number',
        minimum: 1,
        default: 1,
        description: 'Page number for pagination',
      },
      limit: {
        type: 'number',
        minimum: 1,
        maximum: 100,
        default: 10,
        description: 'Number of items per page',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        userRoles: {
          type: 'array',
          items: { type: 'string' },
        },
        storeId: { type: ['string', 'null'] },
        effectivePermissions: {
          type: 'array',
          items: { type: 'string' },
        },
        customPermissions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              action: { type: 'string' },
              resource: { type: ['string', 'null'] },
              storeId: { type: ['string', 'null'] },
              grant: { type: 'boolean' },
              conditions: { type: ['object', 'null'] },
              expiresAt: { type: ['string', 'null'], format: 'date-time' },
              reason: { type: ['string', 'null'] },
              createdAt: { type: 'string', format: 'date-time' },
              createdBy: { type: 'string' },
              creator: {
                type: ['object', 'null'],
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                },
              },
            },
          },
        },
        storePermissions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              storeId: { type: 'string' },
              storeRole: { type: 'string' },
              permissions: {
                type: 'array',
                items: { type: 'string' },
              },
              conditions: { type: ['object', 'null'] },
              expiresAt: { type: ['string', 'null'], format: 'date-time' },
              createdAt: { type: 'string', format: 'date-time' },
              createdBy: { type: 'string' },
              store: {
                type: ['object', 'null'],
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                },
              },
              creator: {
                type: ['object', 'null'],
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                },
              },
            },
          },
        },
        pagination: {
          type: ['object', 'null'],
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            pages: { type: 'number' },
          },
        },
      },
    },
    401: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}
