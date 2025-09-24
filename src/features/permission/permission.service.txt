import { fetchAuth } from "@/hooks/api";
import { Action, UserRole, StoreRole } from "@/middlewares/authorization.middleware";

// === INTERFACES PARA PERMISSIONS ===

export interface PermissionConditions {
  [key: string]: any;
}

export interface UserPermission {
  id: string;
  userId: string;
  action: Action;
  resource?: string;
  storeId?: string;
  grant: boolean;
  conditions?: PermissionConditions;
  expiresAt?: string;
  reason?: string;
  createdAt: string;
  createdBy: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  creator?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface StorePermission {
  id: string;
  userId: string;
  storeId: string;
  storeRole: StoreRole;
  permissions: Action[];
  conditions?: PermissionConditions;
  expiresAt?: string;
  createdAt: string;
  createdBy: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  store?: {
    id: string;
    name: string;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserPermissionListResponse {
  permissions: UserPermission[];
  pagination: Pagination;
}

export interface StorePermissionListResponse {
  permissions: StorePermission[];
  pagination: Pagination;
}

export interface CreateUserPermissionRequest {
  userId: string;
  action: Action;
  resource?: string;
  storeId?: string;
  grant: boolean;
  conditions?: PermissionConditions;
  expiresAt?: string;
  reason?: string;
}

export interface UpdateUserPermissionRequest {
  action?: Action;
  resource?: string;
  storeId?: string;
  grant?: boolean;
  conditions?: PermissionConditions;
  expiresAt?: string;
  reason?: string;
}

export interface SetStoreUserPermissionsRequest {
  userId: string;
  storeId: string;
  storeRole: StoreRole;
  permissions: Action[];
  conditions?: PermissionConditions;
  expiresAt?: string;
}

export interface EffectivePermissionsResponse {
  userId: string;
  userRoles: string[];
  storeId?: string;
  effectivePermissions: Action[];
  customPermissions: UserPermission[];
  storePermissions: StorePermission[];
}

export interface PermissionTestRequest {
  userId: string;
  action: Action;
  resource?: string;
  storeId?: string;
  context?: any;
}

export interface PermissionTestResponse {
  userId: string;
  action: Action;
  resource?: string;
  storeId?: string;
  result: {
    allowed: boolean;
    reason?: string;
    source?: string;
  };
  context: any;
}

export interface PermissionStatsResponse {
  userPermissions: {
    total: number;
    active: number;
    expired: number;
  };
  storePermissions: {
    total: number;
  };
  permissionsByAction: Array<{
    action: Action;
    count: number;
  }>;
  permissionsByRole: Array<{
    role: StoreRole;
    count: number;
  }>;
}

export interface PermissionFilters {
  userId?: string;
  storeId?: string;
  action?: Action;
  grant?: boolean;
  active?: boolean;
  role?: StoreRole;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BulkCreateUserPermissionsRequest {
  permissions: Array<{
    userId: string;
    action: Action;
    resource?: string;
    storeId?: string;
    grant: boolean;
    conditions?: PermissionConditions;
    expiresAt?: string;
    reason?: string;
  }>;
}

export interface BulkUpdateUserPermissionsRequest {
  updates: Array<{
    id: string;
    action?: Action;
    resource?: string;
    storeId?: string;
    grant?: boolean;
    conditions?: PermissionConditions;
    expiresAt?: string;
    reason?: string;
  }>;
}

export interface BulkDeleteUserPermissionsRequest {
  ids: string[];
}

export interface PermissionAuditLog {
  id: string;
  permissionId: string;
  action: 'created' | 'updated' | 'deleted' | 'expired';
  userId: string;
  changes?: Record<string, any>;
  reason?: string;
  createdAt: string;
  createdBy: string;
}

export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  permissions: Action[];
  conditions?: PermissionConditions;
  isDefault: boolean;
  createdAt: string;
  createdBy: string;
}

export interface CreatePermissionTemplateRequest {
  name: string;
  description: string;
  permissions: Action[];
  conditions?: PermissionConditions;
}

export interface ApplyPermissionTemplateRequest {
  userId: string;
  templateId: string;
  storeId?: string;
  expiresAt?: string;
}

const URI = "/permissions";

export const PermissionService = {
  // === GESTÃO DE PERMISSÕES CUSTOMIZADAS ===
  createUserPermission: (params: CreateUserPermissionRequest): Promise<{ message: string; permission: UserPermission }> => 
    fetchAuth(`${URI}/user`, { method: "POST", data: params }),
  
  getUserPermissions: (userId: string, filters?: {
    storeId?: string;
    action?: Action;
    active?: boolean;
    page?: number;
    limit?: number;
  }): Promise<UserPermissionListResponse> => 
    fetchAuth(`${URI}/user/${userId}`, { method: "GET", params: filters }),
  
  updateUserPermission: (id: string, params: UpdateUserPermissionRequest): Promise<{ message: string; permission: UserPermission }> => 
    fetchAuth(`${URI}/user/${id}`, { method: "PUT", data: params }),
  
  deleteUserPermission: (id: string): Promise<void> => 
    fetchAuth(`${URI}/user/${id}`, { method: "DELETE" }),

  // === GESTÃO DE PERMISSÕES POR LOJA ===
  setStoreUserPermissions: (params: SetStoreUserPermissionsRequest): Promise<{ message: string; permission: StorePermission }> => 
    fetchAuth(`${URI}/store`, { method: "POST", data: params }),
  
  getStoreUserPermissions: (storeId: string, filters?: {
    page?: number;
    limit?: number;
  }): Promise<StorePermissionListResponse> => 
    fetchAuth(`${URI}/store/${storeId}`, { method: "GET", params: filters }),

  // === CONSULTAS E RELATÓRIOS ===
  getUserEffectivePermissions: (userId: string, storeId?: string): Promise<EffectivePermissionsResponse> => 
    fetchAuth(`${URI}/effective/${userId}`, { method: "GET", params: { storeId } }),
  
  testPermission: (params: PermissionTestRequest): Promise<PermissionTestResponse> => 
    fetchAuth(`${URI}/test`, { method: "POST", data: params }),
  
  getPermissionStats: (): Promise<PermissionStatsResponse> => 
    fetchAuth(`${URI}/stats`, { method: "GET" }),

  // === BUSCA E FILTROS ===
  searchPermissions: (filters: PermissionFilters): Promise<UserPermissionListResponse> => 
    fetchAuth(`${URI}/search`, { method: "GET", params: filters }),
  
  getPermissionsByAction: (action: Action, filters?: {
    storeId?: string;
    page?: number;
    limit?: number;
  }): Promise<UserPermissionListResponse> => 
    fetchAuth(`${URI}/action/${action}`, { method: "GET", params: filters }),
  
  getPermissionsByRole: (role: StoreRole, storeId?: string): Promise<StorePermissionListResponse> => 
    fetchAuth(`${URI}/role/${role}`, { method: "GET", params: { storeId } }),

  // === OPERAÇÕES EM LOTE ===
  bulkCreateUserPermissions: (params: BulkCreateUserPermissionsRequest): Promise<{ 
    created: number; 
    errors: string[]; 
    permissions: UserPermission[] 
  }> => 
    fetchAuth(`${URI}/bulk-create`, { method: "POST", data: params }),
  
  bulkUpdateUserPermissions: (params: BulkUpdateUserPermissionsRequest): Promise<{ 
    updated: number; 
    errors: string[] 
  }> => 
    fetchAuth(`${URI}/bulk-update`, { method: "POST", data: params }),
  
  bulkDeleteUserPermissions: (params: BulkDeleteUserPermissionsRequest): Promise<{ 
    deleted: number; 
    errors: string[] 
  }> => 
    fetchAuth(`${URI}/bulk-delete`, { method: "POST", data: params }),

  // === AUDITORIA ===
  getPermissionAuditLog: (permissionId: string, filters?: {
    page?: number;
    limit?: number;
    action?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{ logs: PermissionAuditLog[]; pagination: Pagination }> => 
    fetchAuth(`${URI}/audit/${permissionId}`, { method: "GET", params: filters }),
  
  getAuditLogs: (filters?: {
    userId?: string;
    storeId?: string;
    action?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: PermissionAuditLog[]; pagination: Pagination }> => 
    fetchAuth(`${URI}/audit`, { method: "GET", params: filters }),

  // === TEMPLATES DE PERMISSÃO ===
  createPermissionTemplate: (params: CreatePermissionTemplateRequest): Promise<PermissionTemplate> => 
    fetchAuth(`${URI}/templates`, { method: "POST", data: params }),
  
  getPermissionTemplates: (filters?: {
    page?: number;
    limit?: number;
    isDefault?: boolean;
  }): Promise<{ templates: PermissionTemplate[]; pagination: Pagination }> => 
    fetchAuth(`${URI}/templates`, { method: "GET", params: filters }),
  
  getPermissionTemplate: (id: string): Promise<PermissionTemplate> => 
    fetchAuth(`${URI}/templates/${id}`, { method: "GET" }),
  
  updatePermissionTemplate: (id: string, params: Partial<CreatePermissionTemplateRequest>): Promise<PermissionTemplate> => 
    fetchAuth(`${URI}/templates/${id}`, { method: "PUT", data: params }),
  
  deletePermissionTemplate: (id: string): Promise<void> => 
    fetchAuth(`${URI}/templates/${id}`, { method: "DELETE" }),
  
  applyPermissionTemplate: (params: ApplyPermissionTemplateRequest): Promise<{ 
    message: string; 
    permissions: UserPermission[] 
  }> => 
    fetchAuth(`${URI}/templates/apply`, { method: "POST", data: params }),

  // === FUNÇÕES ESPECÍFICAS ===
  getExpiredPermissions: (filters?: {
    storeId?: string;
    page?: number;
    limit?: number;
  }): Promise<UserPermissionListResponse> => 
    fetchAuth(`${URI}/expired`, { method: "GET", params: filters }),
  
  getExpiringSoon: (days: number = 7, filters?: {
    storeId?: string;
    page?: number;
    limit?: number;
  }): Promise<UserPermissionListResponse> => 
    fetchAuth(`${URI}/expiring-soon`, { method: "GET", params: { days, ...filters } }),
  
  renewPermission: (id: string, expiresAt: string): Promise<UserPermission> => 
    fetchAuth(`${URI}/${id}/renew`, { method: "PATCH", data: { expiresAt } }),
  
  revokePermission: (id: string, reason?: string): Promise<{ message: string }> => 
    fetchAuth(`${URI}/${id}/revoke`, { method: "PATCH", data: { reason } }),

  // === RELATÓRIOS AVANÇADOS ===
  getPermissionMatrix: (storeId?: string): Promise<{
    users: Array<{
      id: string;
      name: string;
      email: string;
      permissions: Action[];
    }>;
    actions: Action[];
  }> => 
    fetchAuth(`${URI}/matrix`, { method: "GET", params: { storeId } }),
  
  getPermissionUsage: (filters?: {
    storeId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    mostUsed: Array<{ action: Action; count: number }>;
    leastUsed: Array<{ action: Action; count: number }>;
    unused: Action[];
  }> => 
    fetchAuth(`${URI}/usage`, { method: "GET", params: filters }),
  
  getPermissionConflicts: (userId: string, storeId?: string): Promise<{
    conflicts: Array<{
      type: 'grant_deny' | 'expired_active' | 'role_custom';
      permissions: Action[];
      description: string;
    }>;
  }> => 
    fetchAuth(`${URI}/conflicts/${userId}`, { method: "GET", params: { storeId } }),

  // === UTILITÁRIOS ===
  exportPermissions: (filters?: {
    storeId?: string;
    userId?: string;
    format?: 'csv' | 'xlsx' | 'json';
  }): Promise<{ downloadUrl: string }> => 
    fetchAuth(`${URI}/export`, { method: "POST", data: filters }),
  
  importPermissions: (file: File, options?: {
    updateExisting?: boolean;
    dryRun?: boolean;
  }): Promise<{
    imported: number;
    errors: string[];
    warnings: string[];
  }> => 
    fetchAuth(`${URI}/import`, { method: "POST", data: { file, ...options } }),
  
  validatePermissions: (permissions: Action[]): Promise<{
    valid: Action[];
    invalid: Array<{ action: Action; reason: string }>;
  }> => 
    fetchAuth(`${URI}/validate`, { method: "POST", data: { permissions } }),
};
