import { FastifyRequest, FastifyReply } from 'fastify';
import { Action, UserRole, StoreRole } from './authorization.middleware';

// ================================
// INTERFACES PARA PERMISSÕES GRANULARES
// ================================

// Interface para condições de permissão
export interface PermissionConditions {
  timeRange?: string; // '9-17' (horário comercial)
  dayOfWeek?: string; // '1-5' (segunda a sexta)
  dateRange?: { start: string; end: string };
  amountLimit?: number; // Limite de valor para operações
  custom?: string; // Expressão customizada: 'requestData.amount < 1000'
  ipWhitelist?: string[]; // IPs permitidos
  userAgent?: string; // User agent específico
}

// Interface para permissões customizadas do usuário
export interface UserPermission {
  id: string;
  userId: string;
  action: Action;
  resource?: string; // 'store:123', 'product:456', '*', 'category:789'
  storeId?: string;
  grant: boolean; // true = concede, false = nega
  conditions?: PermissionConditions;
  expiresAt?: Date;
  createdAt: Date;
  createdBy: string;
  reason?: string; // Motivo da permissão customizada
}

// Interface para permissões por loja
export interface StorePermission {
  id: string;
  userId: string;
  storeId: string;
  storeRole: StoreRole;
  permissions: Action[];
  conditions?: PermissionConditions;
  expiresAt?: Date;
  createdAt: Date;
  createdBy: string;
}

// Interface para contexto de permissão
export interface PermissionContext {
  userId: string;
  userRoles: string[];
  storeId?: string;
  storeRole?: StoreRole;
  customPermissions?: UserPermission[];
  storePermissions?: StorePermission[];
  requestTime?: Date;
  requestData?: {
    params?: any;
    query?: any;
    body?: any;
    ip?: string;
    userAgent?: string;
  };
}

// ================================
// PERMISSÕES BASE POR ROLE
// ================================

// Permissões padrão por role global
const BASE_ROLE_PERMISSIONS: Record<UserRole, Action[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(Action), // Pode fazer tudo
  [UserRole.ADMIN]: [
    // Gestão de usuários
    Action.CREATE_USER, Action.READ_USER, Action.UPDATE_USER, Action.DELETE_USER, Action.LIST_USERS,
    
    // Gestão de lojas
    Action.CREATE_STORE, Action.READ_STORE, Action.UPDATE_STORE, Action.DELETE_STORE, Action.LIST_STORES, Action.MANAGE_STORE_USERS,
    
    // Gestão de produtos
    Action.CREATE_PRODUCT, Action.READ_PRODUCT, Action.UPDATE_PRODUCT, Action.DELETE_PRODUCT, Action.LIST_PRODUCTS,
    
    // Gestão de categorias
    Action.CREATE_CATEGORY, Action.READ_CATEGORY, Action.UPDATE_CATEGORY, Action.DELETE_CATEGORY, Action.LIST_CATEGORIES,
    
    // Gestão de fornecedores
    Action.CREATE_SUPPLIER, Action.READ_SUPPLIER, Action.UPDATE_SUPPLIER, Action.DELETE_SUPPLIER, Action.LIST_SUPPLIERS,
    
    // Gestão de movimentações
    Action.CREATE_MOVEMENT, Action.READ_MOVEMENT, Action.UPDATE_MOVEMENT, Action.DELETE_MOVEMENT, Action.LIST_MOVEMENTS,
    
    // Sistema
    Action.VIEW_AUDIT_LOGS
  ],
  [UserRole.MANAGER]: [
    // Gestão de lojas (limitada)
    Action.READ_STORE, Action.LIST_STORES, Action.MANAGE_STORE_USERS,
    
    // Gestão de produtos
    Action.CREATE_PRODUCT, Action.READ_PRODUCT, Action.UPDATE_PRODUCT, Action.DELETE_PRODUCT, Action.LIST_PRODUCTS,
    
    // Gestão de categorias
    Action.CREATE_CATEGORY, Action.READ_CATEGORY, Action.UPDATE_CATEGORY, Action.DELETE_CATEGORY, Action.LIST_CATEGORIES,
    
    // Gestão de fornecedores
    Action.CREATE_SUPPLIER, Action.READ_SUPPLIER, Action.UPDATE_SUPPLIER, Action.DELETE_SUPPLIER, Action.LIST_SUPPLIERS,
    
    // Gestão de movimentações
    Action.CREATE_MOVEMENT, Action.READ_MOVEMENT, Action.UPDATE_MOVEMENT, Action.DELETE_MOVEMENT, Action.LIST_MOVEMENTS
  ],
  [UserRole.USER]: [
    // Acesso somente leitura
    Action.READ_STORE, Action.LIST_STORES,
    Action.READ_PRODUCT, Action.LIST_PRODUCTS,
    Action.READ_CATEGORY, Action.LIST_CATEGORIES,
    Action.READ_SUPPLIER, Action.LIST_SUPPLIERS,
    Action.READ_MOVEMENT, Action.LIST_MOVEMENTS
  ]
};

// Permissões padrão por role de loja
const BASE_STORE_ROLE_PERMISSIONS: Record<StoreRole, Action[]> = {
  [StoreRole.OWNER]: [
    // Pode fazer tudo na loja
    Action.READ_STORE, Action.UPDATE_STORE, Action.MANAGE_STORE_USERS,
    Action.CREATE_PRODUCT, Action.READ_PRODUCT, Action.UPDATE_PRODUCT, Action.DELETE_PRODUCT, Action.LIST_PRODUCTS,
    Action.CREATE_CATEGORY, Action.READ_CATEGORY, Action.UPDATE_CATEGORY, Action.DELETE_CATEGORY, Action.LIST_CATEGORIES,
    Action.CREATE_SUPPLIER, Action.READ_SUPPLIER, Action.UPDATE_SUPPLIER, Action.DELETE_SUPPLIER, Action.LIST_SUPPLIERS,
    Action.CREATE_MOVEMENT, Action.READ_MOVEMENT, Action.UPDATE_MOVEMENT, Action.DELETE_MOVEMENT, Action.LIST_MOVEMENTS
  ],
  [StoreRole.ADMIN]: [
    // Gestão completa da loja (exceto transferir propriedade)
    Action.READ_STORE, Action.UPDATE_STORE, Action.MANAGE_STORE_USERS,
    Action.CREATE_PRODUCT, Action.READ_PRODUCT, Action.UPDATE_PRODUCT, Action.DELETE_PRODUCT, Action.LIST_PRODUCTS,
    Action.CREATE_CATEGORY, Action.READ_CATEGORY, Action.UPDATE_CATEGORY, Action.DELETE_CATEGORY, Action.LIST_CATEGORIES,
    Action.CREATE_SUPPLIER, Action.READ_SUPPLIER, Action.UPDATE_SUPPLIER, Action.DELETE_SUPPLIER, Action.LIST_SUPPLIERS,
    Action.CREATE_MOVEMENT, Action.READ_MOVEMENT, Action.UPDATE_MOVEMENT, Action.DELETE_MOVEMENT, Action.LIST_MOVEMENTS
  ],
  [StoreRole.MANAGER]: [
    // Gestão operacional
    Action.READ_STORE, Action.LIST_STORES,
    Action.CREATE_PRODUCT, Action.READ_PRODUCT, Action.UPDATE_PRODUCT, Action.DELETE_PRODUCT, Action.LIST_PRODUCTS,
    Action.CREATE_CATEGORY, Action.READ_CATEGORY, Action.UPDATE_CATEGORY, Action.DELETE_CATEGORY, Action.LIST_CATEGORIES,
    Action.CREATE_SUPPLIER, Action.READ_SUPPLIER, Action.UPDATE_SUPPLIER, Action.DELETE_SUPPLIER, Action.LIST_SUPPLIERS,
    Action.CREATE_MOVEMENT, Action.READ_MOVEMENT, Action.UPDATE_MOVEMENT, Action.DELETE_MOVEMENT, Action.LIST_MOVEMENTS
  ],
  [StoreRole.STAFF]: [
    // Operações básicas
    Action.READ_STORE, Action.LIST_STORES,
    Action.READ_PRODUCT, Action.LIST_PRODUCTS,
    Action.READ_CATEGORY, Action.LIST_CATEGORIES,
    Action.READ_SUPPLIER, Action.LIST_SUPPLIERS,
    Action.READ_MOVEMENT, Action.LIST_MOVEMENTS
  ]
};

// ================================
// SERVIÇO DE PERMISSÕES GRANULARES
// ================================

export class GranularPermissionService {
  // Verifica se usuário tem permissão considerando todas as camadas
  static async hasPermission(
    context: PermissionContext,
    action: Action,
    resource?: string
  ): Promise<{ allowed: boolean; reason?: string; source?: string }> {
    try {
      // 1. SUPER_ADMIN sempre pode
      if (context.userRoles.includes(UserRole.SUPER_ADMIN)) {
        return { allowed: true, source: 'super_admin' };
      }

      // 2. Verificar permissões customizadas (maior prioridade)
      if (context.customPermissions) {
        const customResult = this.checkCustomPermissions(context, action, resource);
        if (customResult !== null) {
          return customResult;
        }
      }

      // 3. Verificar permissões da loja
      if (context.storeId && context.storeRole) {
        const storeResult = this.checkStorePermissions(context, action);
        if (storeResult.allowed) {
          return { ...storeResult, source: 'store_role' };
        }
      }

      // 4. Verificar permissões base do role global
      const globalResult = this.checkGlobalRolePermissions(context, action);
      if (globalResult.allowed) {
        return { ...globalResult, source: 'global_role' };
      }

      return { allowed: false, reason: 'No permission found' };
    } catch (error) {
      console.error('Error checking granular permission:', error);
      return { allowed: false, reason: 'Permission check error' };
    }
  }

  // Verifica permissões customizadas do usuário
  private static checkCustomPermissions(
    context: PermissionContext,
    action: Action,
    resource?: string
  ): { allowed: boolean; reason?: string; source?: string } | null {
    if (!context.customPermissions) return null;

    const now = context.requestTime || new Date();
    
    // Buscar permissões que se aplicam
    const applicablePermissions = context.customPermissions.filter(permission => {
      // Verificar se a ação corresponde
      if (permission.action !== action) return false;
      
      // Verificar se o recurso corresponde
      if (permission.resource && resource) {
        if (permission.resource !== '*' && permission.resource !== resource) return false;
      }
      
      // Verificar se a loja corresponde
      if (permission.storeId && context.storeId && permission.storeId !== context.storeId) return false;
      
      // Verificar se não expirou
      if (permission.expiresAt && permission.expiresAt < now) return false;
      
      // Verificar condições
      if (!this.checkConditions(permission.conditions, context)) return false;
      
      return true;
    });

    if (applicablePermissions.length === 0) return null;

    // Verificar se há alguma permissão que nega (negação tem prioridade)
    const denyPermission = applicablePermissions.find(p => !p.grant);
    if (denyPermission) {
      return { 
        allowed: false, 
        reason: `Permission denied by custom rule: ${denyPermission.reason || 'No reason provided'}`,
        source: 'custom_deny'
      };
    }

    // Verificar se há alguma permissão que concede
    const grantPermission = applicablePermissions.find(p => p.grant);
    if (grantPermission) {
      return { 
        allowed: true, 
        reason: `Permission granted by custom rule: ${grantPermission.reason || 'No reason provided'}`,
        source: 'custom_grant'
      };
    }

    return null;
  }

  // Verifica permissões da loja
  private static checkStorePermissions(
    context: PermissionContext,
    action: Action
  ): { allowed: boolean; reason?: string } {
    if (!context.storeRole) {
      return { allowed: false, reason: 'No store role defined' };
    }

    const storePermissions = BASE_STORE_ROLE_PERMISSIONS[context.storeRole] || [];
    
    if (storePermissions.includes(action)) {
      return { allowed: true, reason: `Allowed by store role: ${context.storeRole}` };
    }

    return { allowed: false, reason: `Store role ${context.storeRole} does not have permission for ${action}` };
  }

  // Verifica permissões do role global
  private static checkGlobalRolePermissions(
    context: PermissionContext,
    action: Action
  ): { allowed: boolean; reason?: string } {
    for (const role of context.userRoles) {
      const userRole = role as UserRole;
      const rolePermissions = BASE_ROLE_PERMISSIONS[userRole] || [];
      
      if (rolePermissions.includes(action)) {
        return { allowed: true, reason: `Allowed by global role: ${userRole}` };
      }
    }

    return { allowed: false, reason: 'No global role has this permission' };
  }

  // Verifica condições de permissão
  private static checkConditions(
    conditions: PermissionConditions | undefined,
    context: PermissionContext
  ): boolean {
    if (!conditions) return true;

    const now = context.requestTime || new Date();
    const requestData = context.requestData || {};

    // Verificar horário
    if (conditions.timeRange) {
      const [start, end] = conditions.timeRange.split('-').map(Number);
      const currentHour = now.getHours();
      if (currentHour < start || currentHour > end) {
        return false;
      }
    }

    // Verificar dia da semana
    if (conditions.dayOfWeek) {
      const [start, end] = conditions.dayOfWeek.split('-').map(Number);
      const currentDay = now.getDay();
      if (currentDay < start || currentDay > end) {
        return false;
      }
    }

    // Verificar intervalo de datas
    if (conditions.dateRange) {
      const { start, end } = conditions.dateRange;
      if (now < new Date(start) || now > new Date(end)) {
        return false;
      }
    }

    // Verificar limite de valor
    if (conditions.amountLimit && requestData.body?.amount) {
      if (requestData.body.amount > conditions.amountLimit) {
        return false;
      }
    }

    // Verificar IP
    if (conditions.ipWhitelist && requestData.ip) {
      if (!conditions.ipWhitelist.includes(requestData.ip)) {
        return false;
      }
    }

    // Verificar User Agent
    if (conditions.userAgent && requestData.userAgent) {
      if (!requestData.userAgent.includes(conditions.userAgent)) {
        return false;
      }
    }

    // Verificar condição customizada
    if (conditions.custom) {
      try {
        const expression = conditions.custom.replace(/requestData\.(\w+)/g, (match, key) => {
          return requestData[key] || 'undefined';
        });
        return eval(expression);
      } catch (error) {
        console.error('Error evaluating custom condition:', error);
        return false;
      }
    }

    return true;
  }

  // Verifica se usuário tem qualquer uma das permissões
  static async hasAnyPermission(
    context: PermissionContext,
    actions: Action[],
    resource?: string
  ): Promise<{ allowed: boolean; reason?: string; source?: string }> {
    for (const action of actions) {
      const result = await this.hasPermission(context, action, resource);
      if (result.allowed) {
        return result;
      }
    }
    return { allowed: false, reason: 'None of the required permissions found' };
  }

  // Verifica se usuário tem todas as permissões
  static async hasAllPermissions(
    context: PermissionContext,
    actions: Action[],
    resource?: string
  ): Promise<{ allowed: boolean; reason?: string; source?: string }> {
    for (const action of actions) {
      const result = await this.hasPermission(context, action, resource);
      if (!result.allowed) {
        return { allowed: false, reason: `Missing permission: ${action} - ${result.reason}` };
      }
    }
    return { allowed: true, reason: 'All permissions granted' };
  }

  // Obtém todas as permissões efetivas do usuário
  static async getUserEffectivePermissions(
    context: PermissionContext
  ): Promise<Action[]> {
    const effectivePermissions = new Set<Action>();

    // Adicionar permissões dos roles globais
    for (const role of context.userRoles) {
      const userRole = role as UserRole;
      const rolePermissions = BASE_ROLE_PERMISSIONS[userRole] || [];
      rolePermissions.forEach(permission => effectivePermissions.add(permission));
    }

    // Adicionar permissões do role da loja
    if (context.storeRole) {
      const storePermissions = BASE_STORE_ROLE_PERMISSIONS[context.storeRole] || [];
      storePermissions.forEach(permission => effectivePermissions.add(permission));
    }

    // Aplicar permissões customizadas
    if (context.customPermissions) {
      const now = context.requestTime || new Date();
      
      context.customPermissions.forEach(permission => {
        // Verificar se não expirou
        if (permission.expiresAt && permission.expiresAt < now) return;
        
        // Verificar condições
        if (!this.checkConditions(permission.conditions, context)) return;
        
        if (permission.grant) {
          effectivePermissions.add(permission.action);
        } else {
          effectivePermissions.delete(permission.action);
        }
      });
    }

    return Array.from(effectivePermissions);
  }
}

// ================================
// MIDDLEWARES GRANULARES
// ================================

// Middleware para permissão granular
export const requireGranularPermission = (
  action: Action,
  resource?: string,
  options?: {
    requireAll?: boolean;
    additionalActions?: Action[];
    storeRole?: StoreRole[];
    customContext?: (request: FastifyRequest) => Partial<PermissionContext>;
  }
) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send({
          error: 'Authentication required'
        });
      }

      // Construir contexto de permissão
      const context: PermissionContext = {
        userId: request.user.id,
        userRoles: request.user.roles,
        storeId: request.store?.id,
        storeRole: request.storeRole,
        requestTime: new Date(),
        requestData: {
          params: request.params,
          query: request.query,
          body: request.body,
          ip: request.ip,
          userAgent: request.headers['user-agent']
        },
        ...(options?.customContext?.(request) || {})
      };

      // Carregar permissões customizadas se não fornecidas
      if (!context.customPermissions) {
        context.customPermissions = await getUserCustomPermissions(context.userId);
      }

      // Verificar role da loja se necessário
      if (options?.storeRole && context.storeRole) {
        if (!options.storeRole.includes(context.storeRole)) {
          return reply.status(403).send({
            error: 'Insufficient store role',
            required: options.storeRole,
            current: context.storeRole
          });
        }
      }

      // Verificar permissões
      const actionsToCheck = [action, ...(options?.additionalActions || [])];
      let result;

      if (options?.requireAll) {
        result = await GranularPermissionService.hasAllPermissions(context, actionsToCheck, resource);
      } else {
        result = await GranularPermissionService.hasAnyPermission(context, actionsToCheck, resource);
      }

      if (!result.allowed) {
        return reply.status(403).send({
          error: 'Insufficient permissions',
          required: actionsToCheck,
          resource,
          reason: result.reason,
          source: result.source,
          current: context.userRoles
        });
      }

      return;
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  };
}

// Middleware para permissão por recurso específico
export const requireResourcePermission = (
  action: Action,
  resourceExtractor: (request: FastifyRequest) => string
) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const resource = resourceExtractor(request);
      return requireGranularPermission(action, resource)(request, reply);
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  };
}

// Middleware para permissão baseada em tempo
export const requireTimeBasedPermission = (
  action: Action,
  timeConditions: PermissionConditions
) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send({
          error: 'Authentication required'
        });
      }

      const context: PermissionContext = {
        userId: request.user.id,
        userRoles: request.user.roles,
        storeId: request.store?.id,
        storeRole: request.storeRole,
        requestTime: new Date(),
        requestData: {
          params: request.params,
          query: request.query,
          body: request.body,
          ip: request.ip,
          userAgent: request.headers['user-agent']
        },
        customPermissions: [{
          id: 'temp-time-based',
          userId: request.user.id,
          action,
          grant: true,
          conditions: timeConditions,
          createdAt: new Date(),
          createdBy: 'system'
        }]
      };

      const result = await GranularPermissionService.hasPermission(context, action);

      if (!result.allowed) {
        return reply.status(403).send({
          error: 'Permission denied for current time/conditions',
          reason: result.reason,
          conditions: timeConditions,
          currentTime: new Date().toISOString()
        });
      }

      return;
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  };
}

// Função auxiliar para obter permissões customizadas do usuário
async function getUserCustomPermissions(userId: string): Promise<UserPermission[]> {
  // TODO: Implementar busca no banco de dados
  // Por enquanto, retorna array vazio
  return [];
}
