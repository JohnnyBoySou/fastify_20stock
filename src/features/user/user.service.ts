import { fetchAuth } from "@/hooks/api";

// === INTERFACES PARA USER ===

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  status: boolean;
  emailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  _count?: {
    stores: number;
    permissions: number;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserListResponse {
  users: User[];
  pagination: Pagination;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  roles?: string[];
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  name?: string;
  roles?: string[];
  status?: boolean;
  emailVerified?: boolean;
}

export interface UserStatsResponse {
  total: number;
  active: number;
  inactive: number;
  emailVerified: number;
  emailUnverified: number;
  byRole: Array<{
    role: string;
    _count: { id: number };
  }>;
  recentLogins: number;
  newUsers: number;
}

export interface UserAnalytics {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    averageLoginsPerUser: number;
  };
  trends: {
    daily: Array<{
      date: string;
      newUsers: number;
      activeUsers: number;
      logins: number;
    }>;
    weekly: Array<{
      week: string;
      newUsers: number;
      activeUsers: number;
      logins: number;
    }>;
    monthly: Array<{
      month: string;
      newUsers: number;
      activeUsers: number;
      logins: number;
    }>;
  };
  topUsers: Array<{
    userId: string;
    name: string;
    email: string;
    logins: number;
    lastLogin: string;
  }>;
  roleDistribution: Array<{
    role: string;
    count: number;
    percentage: number;
  }>;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
  emailVerified?: boolean;
  role?: string;
  lastLoginFrom?: string;
  lastLoginTo?: string;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EmailVerification {
  verified: boolean;
  verifiedAt?: string;
  message: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
  resetToken?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  roles: string[];
  status: boolean;
  emailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  stores: Array<{
    id: string;
    name: string;
    role: string;
    joinedAt: string;
  }>;
  permissions: Array<{
    id: string;
    action: string;
    resource?: string;
    storeId?: string;
    grant: boolean;
    expiresAt?: string;
  }>;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  resource?: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UserReport {
  user: User;
  summary: {
    totalStores: number;
    totalPermissions: number;
    totalLogins: number;
    lastActivity: string;
    averageSessionDuration: number;
  };
  recentActivity: UserActivity[];
  storeMemberships: Array<{
    store: {
      id: string;
      name: string;
      cnpj: string;
    };
    role: string;
    joinedAt: string;
    lastActivity: string;
  }>;
  monthlyActivity: Array<{
    month: string;
    logins: number;
    actions: number;
    stores: number;
  }>;
}

export interface BulkUserOperation {
  userIds: string[];
  operation: 'activate' | 'deactivate' | 'verifyEmail' | 'delete' | 'changeRole';
  data?: {
    roles?: string[];
    reason?: string;
  };
}

export interface BulkUserResponse {
  success: number;
  failed: number;
  results: Array<{
    userId: string;
    success: boolean;
    error?: string;
  }>;
}

const URI = "/users";

export const UserService = {
  // === CRUD BÁSICO ===
  create: (params: CreateUserRequest): Promise<User> => 
    fetchAuth(URI, { method: "POST", data: params }),
  
  list: (filters?: UserFilters): Promise<UserListResponse> => 
    fetchAuth(URI, { method: "GET", params: filters }),
  
  get: (id: string): Promise<User> => 
    fetchAuth(`${URI}/${id}`, { method: "GET" }),
  
  update: (id: string, params: UpdateUserRequest): Promise<User> => 
    fetchAuth(`${URI}/${id}`, { method: "PUT", data: params }),
  
  delete: (id: string): Promise<void> => 
    fetchAuth(`${URI}/${id}`, { method: "DELETE" }),

  // === CONSULTAS ESPECÍFICAS ===
  getByEmail: (email: string): Promise<User> => 
    fetchAuth(`${URI}/email`, { method: "GET", params: { email } }),
  
  getByRole: (role: string): Promise<{ users: User[] }> => 
    fetchAuth(`${URI}/role/${role}`, { method: "GET" }),
  
  getActive: (): Promise<{ users: User[] }> => 
    fetchAuth(`${URI}/active`, { method: "GET" }),
  
  getStats: (): Promise<UserStatsResponse> => 
    fetchAuth(`${URI}/stats`, { method: "GET" }),
  
  search: (q: string, limit?: number): Promise<{ users: User[] }> => 
    fetchAuth(`${URI}/search`, { method: "GET", params: { q, limit } }),

  // === GERENCIAMENTO DE EMAIL ===
  verifyEmail: (id: string): Promise<User> => 
    fetchAuth(`${URI}/${id}/verify-email`, { method: "PATCH" }),
  
  resendVerificationEmail: (id: string): Promise<{ message: string }> => 
    fetchAuth(`${URI}/${id}/resend-verification`, { method: "POST" }),
  
  requestPasswordReset: (params: PasswordResetRequest): Promise<PasswordResetResponse> => 
    fetchAuth(`${URI}/password-reset`, { method: "POST", data: params }),
  
  resetPassword: (token: string, newPassword: string): Promise<{ message: string }> => 
    fetchAuth(`${URI}/password-reset/${token}`, { method: "POST", data: { newPassword } }),

  // === GERENCIAMENTO DE LOGIN ===
  updateLastLogin: (id: string): Promise<{ success: boolean }> => 
    fetchAuth(`${URI}/${id}/last-login`, { method: "PATCH" }),
  
  getLoginHistory: (id: string, filters?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    logins: Array<{
      id: string;
      ipAddress?: string;
      userAgent?: string;
      createdAt: string;
    }>;
    pagination: Pagination;
  }> => 
    fetchAuth(`${URI}/${id}/login-history`, { method: "GET", params: filters }),

  // === PERFIL E CONFIGURAÇÕES ===
  getProfile: (id: string): Promise<UserProfile> => 
    fetchAuth(`${URI}/${id}/profile`, { method: "GET" }),
  
  updateProfile: (id: string, data: {
    name?: string;
    email?: string;
  }): Promise<UserProfile> => 
    fetchAuth(`${URI}/${id}/profile`, { method: "PUT", data }),
  
  changePassword: (id: string, params: ChangePasswordRequest): Promise<{ message: string }> => 
    fetchAuth(`${URI}/${id}/change-password`, { method: "POST", data: params }),

  // === ATIVIDADES E AUDITORIA ===
  getActivity: (id: string, filters?: {
    page?: number;
    limit?: number;
    action?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    activities: UserActivity[];
    pagination: Pagination;
  }> => 
    fetchAuth(`${URI}/${id}/activity`, { method: "GET", params: filters }),
  
  getRecentActivity: (id: string, limit?: number): Promise<{ activities: UserActivity[] }> => 
    fetchAuth(`${URI}/${id}/recent-activity`, { method: "GET", params: { limit } }),

  // === RELATÓRIOS E ANÁLISES ===
  getAnalytics: (filters?: {
    startDate?: string;
    endDate?: string;
    role?: string;
  }): Promise<UserAnalytics> => 
    fetchAuth(`${URI}/analytics`, { method: "GET", params: filters }),
  
  getReport: (id: string, filters?: {
    startDate?: string;
    endDate?: string;
    includeActivity?: boolean;
    includeStores?: boolean;
  }): Promise<UserReport> => 
    fetchAuth(`${URI}/${id}/report`, { method: "GET", params: filters }),

  // === OPERAÇÕES EM LOTE ===
  bulkOperation: (operation: BulkUserOperation): Promise<BulkUserResponse> => 
    fetchAuth(`${URI}/bulk`, { method: "POST", data: operation }),
  
  bulkCreate: (users: CreateUserRequest[]): Promise<{
    created: number;
    errors: string[];
    users: User[];
  }> => 
    fetchAuth(`${URI}/bulk-create`, { method: "POST", data: { users } }),
  
  bulkUpdate: (updates: Array<{ id: string; data: UpdateUserRequest }>): Promise<{
    updated: number;
    errors: string[];
  }> => 
    fetchAuth(`${URI}/bulk-update`, { method: "POST", data: { updates } }),
  
  bulkDelete: (ids: string[]): Promise<{
    deleted: number;
    errors: string[];
  }> => 
    fetchAuth(`${URI}/bulk-delete`, { method: "POST", data: { ids } }),

  // === FUNÇÕES ESPECÍFICAS ===
  getInactive: (filters?: {
    page?: number;
    limit?: number;
    daysSinceLastLogin?: number;
  }): Promise<UserListResponse> => 
    fetchAuth(`${URI}/inactive`, { method: "GET", params: filters }),
  
  getUnverified: (filters?: {
    page?: number;
    limit?: number;
    daysSinceCreation?: number;
  }): Promise<UserListResponse> => 
    fetchAuth(`${URI}/unverified`, { method: "GET", params: filters }),
  
  getRecent: (limit?: number): Promise<{ users: User[] }> => 
    fetchAuth(`${URI}/recent`, { method: "GET", params: { limit } }),

  // === GERENCIAMENTO DE ROLES ===
  addRole: (id: string, role: string): Promise<User> => 
    fetchAuth(`${URI}/${id}/roles`, { method: "POST", data: { role } }),
  
  removeRole: (id: string, role: string): Promise<User> => 
    fetchAuth(`${URI}/${id}/roles/${role}`, { method: "DELETE" }),
  
  updateRoles: (id: string, roles: string[]): Promise<User> => 
    fetchAuth(`${URI}/${id}/roles`, { method: "PUT", data: { roles } }),
  
  getAvailableRoles: (): Promise<Array<{
    role: string;
    description: string;
    permissions: string[];
  }>> => 
    fetchAuth(`${URI}/available-roles`, { method: "GET" }),

  // === RELATÓRIOS ESPECÍFICOS ===
  getLoginReport: (filters?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<{
    summary: {
      totalLogins: number;
      uniqueUsers: number;
      averageLoginsPerUser: number;
    };
    data: Array<{
      period: string;
      logins: number;
      uniqueUsers: number;
    }>;
  }> => 
    fetchAuth(`${URI}/login-report`, { method: "GET", params: filters }),
  
  getActivityReport: (filters?: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    action?: string;
  }): Promise<{
    summary: {
      totalActivities: number;
      uniqueUsers: number;
      topActions: Array<{
        action: string;
        count: number;
      }>;
    };
    data: Array<{
      date: string;
      activities: number;
      uniqueUsers: number;
    }>;
  }> => 
    fetchAuth(`${URI}/activity-report`, { method: "GET", params: filters }),

  // === UTILITÁRIOS ===
  export: (filters?: UserFilters): Promise<{ downloadUrl: string }> => 
    fetchAuth(`${URI}/export`, { method: "POST", data: filters }),
  
  import: (file: File, options?: {
    updateExisting?: boolean;
    dryRun?: boolean;
  }): Promise<{
    imported: number;
    errors: string[];
    warnings: string[];
  }> => 
    fetchAuth(`${URI}/import`, { method: "POST", data: { file, ...options } }),
  
  validate: (user: CreateUserRequest): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> => 
    fetchAuth(`${URI}/validate`, { method: "POST", data: user }),
  
  getRoles: (): Promise<Array<{
    role: string;
    count: number;
  }>> => 
    fetchAuth(`${URI}/roles`, { method: "GET" }),
  
  checkEmailAvailability: (email: string): Promise<{
    available: boolean;
    message: string;
  }> => 
    fetchAuth(`${URI}/check-email`, { method: "POST", data: { email } }),
};
