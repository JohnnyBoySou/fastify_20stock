import { type Action, type StoreRole, UserRole } from '@/middlewares/authorization.middleware'
import type { PermissionConditions } from '@/middlewares/granular-permissions.middleware'
import type { FastifyRequest } from 'fastify'

// ================================
// INTERFACES PARA PERMISSÕES CUSTOMIZADAS
// ================================

export interface CreateUserPermissionRequest extends FastifyRequest {
  Body: {
    userId: string
    action: Action
    resource?: string
    storeId?: string
    grant: boolean
    conditions?: PermissionConditions
    expiresAt?: string
    reason?: string
  }
}

export interface GetUserPermissionsRequest extends FastifyRequest {
  Params: { userId: string }
  Querystring: {
    storeId?: string
    action?: Action
    active?: boolean
    page?: number
    limit?: number
  }
}

export interface UpdateUserPermissionRequest extends FastifyRequest {
  Params: { id: string }
  Body: {
    action?: Action
    resource?: string
    storeId?: string
    grant?: boolean
    conditions?: PermissionConditions
    expiresAt?: string
    reason?: string
  }
}

export interface DeleteUserPermissionRequest extends FastifyRequest {
  Params: { id: string }
}

// ================================
// INTERFACES PARA PERMISSÕES DE LOJA
// ================================

export interface SetStoreUserPermissionsRequest extends FastifyRequest {
  Body: {
    userId: string
    storeId: string
    storeRole: StoreRole
    permissions: Action[]
    conditions?: PermissionConditions
    expiresAt?: string
  }
}

export interface GetStoreUserPermissionsRequest extends FastifyRequest {
  Params: { storeId: string }
  Querystring: {
    page?: number
    limit?: number
  }
}

// ================================
// INTERFACES PARA CONSULTAS
// ================================

export interface GetUserEffectivePermissionsRequest extends FastifyRequest {
  Params: { userId: string }
  Querystring: { storeId?: string }
}

export interface TestPermissionRequest extends FastifyRequest {
  Body: {
    userId: string
    action: Action
    resource?: string
    storeId?: string
    context?: any
  }
}

// ================================
// INTERFACES DE RESPOSTA
// ================================

export interface UserPermissionResponse {
  id: string
  userId: string
  action: Action
  resource?: string
  storeId?: string
  grant: boolean
  conditions?: PermissionConditions
  expiresAt?: Date
  reason?: string
  createdAt: Date
  createdBy: string
  user?: {
    id: string
    name: string
    email: string
  }
  creator?: {
    id: string
    name: string
    email: string
  }
}

export interface StorePermissionResponse {
  id: string
  userId: string
  storeId: string
  storeRole: StoreRole
  permissions: Action[]
  conditions?: PermissionConditions
  expiresAt?: Date
  createdAt: Date
  createdBy: string
  user?: {
    id: string
    name: string
    email: string
  }
  store?: {
    id: string
    name: string
  }
}

export interface EffectivePermissionsResponse {
  userId: string
  userRoles: string[]
  storeId?: string
  effectivePermissions: Action[]
  customPermissions: UserPermissionResponse[]
  storePermissions: StorePermissionResponse[]
}

export interface PermissionTestResponse {
  userId: string
  action: Action
  resource?: string
  storeId?: string
  result: {
    allowed: boolean
    reason?: string
    source?: string
  }
  context: any
}

export interface PermissionStatsResponse {
  userPermissions: {
    total: number
    active: number
    expired: number
  }
  storePermissions: {
    total: number
  }
  permissionsByAction: Array<{
    action: Action
    count: number
  }>
  permissionsByRole: Array<{
    role: StoreRole
    count: number
  }>
}

// ================================
// INTERFACES PARA PAGINAÇÃO
// ================================

export interface PaginatedUserPermissionsResponse {
  permissions: UserPermissionResponse[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface PaginatedStorePermissionsResponse {
  permissions: StorePermissionResponse[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// ================================
// INTERFACES PARA FILTROS
// ================================

export interface PermissionFilters {
  userId?: string
  storeId?: string
  action?: Action
  grant?: boolean
  active?: boolean
  role?: StoreRole
  dateFrom?: string
  dateTo?: string
}

export interface PermissionSearchRequest extends FastifyRequest {
  Querystring: PermissionFilters & {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }
}

// ================================
// INTERFACES PARA BULK OPERATIONS
// ================================

export interface BulkCreateUserPermissionsRequest extends FastifyRequest {
  Body: {
    permissions: Array<{
      userId: string
      action: Action
      resource?: string
      storeId?: string
      grant: boolean
      conditions?: PermissionConditions
      expiresAt?: string
      reason?: string
    }>
  }
}

export interface BulkUpdateUserPermissionsRequest extends FastifyRequest {
  Body: {
    updates: Array<{
      id: string
      action?: Action
      resource?: string
      storeId?: string
      grant?: boolean
      conditions?: PermissionConditions
      expiresAt?: string
      reason?: string
    }>
  }
}

export interface BulkDeleteUserPermissionsRequest extends FastifyRequest {
  Body: {
    ids: string[]
  }
}

// ================================
// INTERFACES PARA AUDITORIA
// ================================

export interface PermissionAuditLogResponse {
  id: string
  permissionId: string
  action: 'created' | 'updated' | 'deleted' | 'expired'
  userId: string
  changes?: Record<string, any>
  reason?: string
  createdAt: Date
  createdBy: string
}

export interface GetPermissionAuditLogRequest extends FastifyRequest {
  Params: { permissionId: string }
  Querystring: {
    page?: number
    limit?: number
    action?: string
    dateFrom?: string
    dateTo?: string
  }
}

// ================================
// INTERFACES PARA TEMPLATES
// ================================

export interface PermissionTemplate {
  id: string
  name: string
  description: string
  permissions: Action[]
  conditions?: PermissionConditions
  isDefault: boolean
  createdAt: Date
  createdBy: string
}

export interface CreatePermissionTemplateRequest extends FastifyRequest {
  Body: {
    name: string
    description: string
    permissions: Action[]
    conditions?: PermissionConditions
  }
}

export interface ApplyPermissionTemplateRequest extends FastifyRequest {
  Body: {
    userId: string
    templateId: string
    storeId?: string
    expiresAt?: string
  }
}
