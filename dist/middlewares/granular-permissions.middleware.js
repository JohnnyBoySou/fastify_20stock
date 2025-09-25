"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireTimeBasedPermission = exports.requireResourcePermission = exports.requireGranularPermission = exports.GranularPermissionService = void 0;
const authorization_middleware_1 = require("./authorization.middleware");
// ================================
// PERMISSÕES BASE POR ROLE
// ================================
// Permissões padrão por role global
const BASE_ROLE_PERMISSIONS = {
    [authorization_middleware_1.UserRole.SUPER_ADMIN]: Object.values(authorization_middleware_1.Action), // Pode fazer tudo
    [authorization_middleware_1.UserRole.ADMIN]: [
        // Gestão de usuários
        authorization_middleware_1.Action.CREATE_USER, authorization_middleware_1.Action.READ_USER, authorization_middleware_1.Action.UPDATE_USER, authorization_middleware_1.Action.DELETE_USER, authorization_middleware_1.Action.LIST_USERS,
        // Gestão de lojas
        authorization_middleware_1.Action.CREATE_STORE, authorization_middleware_1.Action.READ_STORE, authorization_middleware_1.Action.UPDATE_STORE, authorization_middleware_1.Action.DELETE_STORE, authorization_middleware_1.Action.LIST_STORES, authorization_middleware_1.Action.MANAGE_STORE_USERS,
        // Gestão de produtos
        authorization_middleware_1.Action.CREATE_PRODUCT, authorization_middleware_1.Action.READ_PRODUCT, authorization_middleware_1.Action.UPDATE_PRODUCT, authorization_middleware_1.Action.DELETE_PRODUCT, authorization_middleware_1.Action.LIST_PRODUCTS,
        // Gestão de categorias
        authorization_middleware_1.Action.CREATE_CATEGORY, authorization_middleware_1.Action.READ_CATEGORY, authorization_middleware_1.Action.UPDATE_CATEGORY, authorization_middleware_1.Action.DELETE_CATEGORY, authorization_middleware_1.Action.LIST_CATEGORIES,
        // Gestão de fornecedores
        authorization_middleware_1.Action.CREATE_SUPPLIER, authorization_middleware_1.Action.READ_SUPPLIER, authorization_middleware_1.Action.UPDATE_SUPPLIER, authorization_middleware_1.Action.DELETE_SUPPLIER, authorization_middleware_1.Action.LIST_SUPPLIERS,
        // Gestão de movimentações
        authorization_middleware_1.Action.CREATE_MOVEMENT, authorization_middleware_1.Action.READ_MOVEMENT, authorization_middleware_1.Action.UPDATE_MOVEMENT, authorization_middleware_1.Action.DELETE_MOVEMENT, authorization_middleware_1.Action.LIST_MOVEMENTS,
        // Sistema
        authorization_middleware_1.Action.VIEW_AUDIT_LOGS
    ],
    [authorization_middleware_1.UserRole.MANAGER]: [
        // Gestão de lojas (limitada)
        authorization_middleware_1.Action.READ_STORE, authorization_middleware_1.Action.LIST_STORES, authorization_middleware_1.Action.MANAGE_STORE_USERS,
        // Gestão de produtos
        authorization_middleware_1.Action.CREATE_PRODUCT, authorization_middleware_1.Action.READ_PRODUCT, authorization_middleware_1.Action.UPDATE_PRODUCT, authorization_middleware_1.Action.DELETE_PRODUCT, authorization_middleware_1.Action.LIST_PRODUCTS,
        // Gestão de categorias
        authorization_middleware_1.Action.CREATE_CATEGORY, authorization_middleware_1.Action.READ_CATEGORY, authorization_middleware_1.Action.UPDATE_CATEGORY, authorization_middleware_1.Action.DELETE_CATEGORY, authorization_middleware_1.Action.LIST_CATEGORIES,
        // Gestão de fornecedores
        authorization_middleware_1.Action.CREATE_SUPPLIER, authorization_middleware_1.Action.READ_SUPPLIER, authorization_middleware_1.Action.UPDATE_SUPPLIER, authorization_middleware_1.Action.DELETE_SUPPLIER, authorization_middleware_1.Action.LIST_SUPPLIERS,
        // Gestão de movimentações
        authorization_middleware_1.Action.CREATE_MOVEMENT, authorization_middleware_1.Action.READ_MOVEMENT, authorization_middleware_1.Action.UPDATE_MOVEMENT, authorization_middleware_1.Action.DELETE_MOVEMENT, authorization_middleware_1.Action.LIST_MOVEMENTS
    ],
    [authorization_middleware_1.UserRole.USER]: [
        // Acesso somente leitura
        authorization_middleware_1.Action.READ_STORE, authorization_middleware_1.Action.LIST_STORES,
        authorization_middleware_1.Action.READ_PRODUCT, authorization_middleware_1.Action.LIST_PRODUCTS,
        authorization_middleware_1.Action.READ_CATEGORY, authorization_middleware_1.Action.LIST_CATEGORIES,
        authorization_middleware_1.Action.READ_SUPPLIER, authorization_middleware_1.Action.LIST_SUPPLIERS,
        authorization_middleware_1.Action.READ_MOVEMENT, authorization_middleware_1.Action.LIST_MOVEMENTS
    ]
};
// Permissões padrão por role de loja
const BASE_STORE_ROLE_PERMISSIONS = {
    [authorization_middleware_1.StoreRole.OWNER]: [
        // Pode fazer tudo na loja
        authorization_middleware_1.Action.READ_STORE, authorization_middleware_1.Action.UPDATE_STORE, authorization_middleware_1.Action.MANAGE_STORE_USERS,
        authorization_middleware_1.Action.CREATE_PRODUCT, authorization_middleware_1.Action.READ_PRODUCT, authorization_middleware_1.Action.UPDATE_PRODUCT, authorization_middleware_1.Action.DELETE_PRODUCT, authorization_middleware_1.Action.LIST_PRODUCTS,
        authorization_middleware_1.Action.CREATE_CATEGORY, authorization_middleware_1.Action.READ_CATEGORY, authorization_middleware_1.Action.UPDATE_CATEGORY, authorization_middleware_1.Action.DELETE_CATEGORY, authorization_middleware_1.Action.LIST_CATEGORIES,
        authorization_middleware_1.Action.CREATE_SUPPLIER, authorization_middleware_1.Action.READ_SUPPLIER, authorization_middleware_1.Action.UPDATE_SUPPLIER, authorization_middleware_1.Action.DELETE_SUPPLIER, authorization_middleware_1.Action.LIST_SUPPLIERS,
        authorization_middleware_1.Action.CREATE_MOVEMENT, authorization_middleware_1.Action.READ_MOVEMENT, authorization_middleware_1.Action.UPDATE_MOVEMENT, authorization_middleware_1.Action.DELETE_MOVEMENT, authorization_middleware_1.Action.LIST_MOVEMENTS
    ],
    [authorization_middleware_1.StoreRole.ADMIN]: [
        // Gestão completa da loja (exceto transferir propriedade)
        authorization_middleware_1.Action.READ_STORE, authorization_middleware_1.Action.UPDATE_STORE, authorization_middleware_1.Action.MANAGE_STORE_USERS,
        authorization_middleware_1.Action.CREATE_PRODUCT, authorization_middleware_1.Action.READ_PRODUCT, authorization_middleware_1.Action.UPDATE_PRODUCT, authorization_middleware_1.Action.DELETE_PRODUCT, authorization_middleware_1.Action.LIST_PRODUCTS,
        authorization_middleware_1.Action.CREATE_CATEGORY, authorization_middleware_1.Action.READ_CATEGORY, authorization_middleware_1.Action.UPDATE_CATEGORY, authorization_middleware_1.Action.DELETE_CATEGORY, authorization_middleware_1.Action.LIST_CATEGORIES,
        authorization_middleware_1.Action.CREATE_SUPPLIER, authorization_middleware_1.Action.READ_SUPPLIER, authorization_middleware_1.Action.UPDATE_SUPPLIER, authorization_middleware_1.Action.DELETE_SUPPLIER, authorization_middleware_1.Action.LIST_SUPPLIERS,
        authorization_middleware_1.Action.CREATE_MOVEMENT, authorization_middleware_1.Action.READ_MOVEMENT, authorization_middleware_1.Action.UPDATE_MOVEMENT, authorization_middleware_1.Action.DELETE_MOVEMENT, authorization_middleware_1.Action.LIST_MOVEMENTS
    ],
    [authorization_middleware_1.StoreRole.MANAGER]: [
        // Gestão operacional
        authorization_middleware_1.Action.READ_STORE, authorization_middleware_1.Action.LIST_STORES,
        authorization_middleware_1.Action.CREATE_PRODUCT, authorization_middleware_1.Action.READ_PRODUCT, authorization_middleware_1.Action.UPDATE_PRODUCT, authorization_middleware_1.Action.DELETE_PRODUCT, authorization_middleware_1.Action.LIST_PRODUCTS,
        authorization_middleware_1.Action.CREATE_CATEGORY, authorization_middleware_1.Action.READ_CATEGORY, authorization_middleware_1.Action.UPDATE_CATEGORY, authorization_middleware_1.Action.DELETE_CATEGORY, authorization_middleware_1.Action.LIST_CATEGORIES,
        authorization_middleware_1.Action.CREATE_SUPPLIER, authorization_middleware_1.Action.READ_SUPPLIER, authorization_middleware_1.Action.UPDATE_SUPPLIER, authorization_middleware_1.Action.DELETE_SUPPLIER, authorization_middleware_1.Action.LIST_SUPPLIERS,
        authorization_middleware_1.Action.CREATE_MOVEMENT, authorization_middleware_1.Action.READ_MOVEMENT, authorization_middleware_1.Action.UPDATE_MOVEMENT, authorization_middleware_1.Action.DELETE_MOVEMENT, authorization_middleware_1.Action.LIST_MOVEMENTS
    ],
    [authorization_middleware_1.StoreRole.STAFF]: [
        // Operações básicas
        authorization_middleware_1.Action.READ_STORE, authorization_middleware_1.Action.LIST_STORES,
        authorization_middleware_1.Action.READ_PRODUCT, authorization_middleware_1.Action.LIST_PRODUCTS,
        authorization_middleware_1.Action.READ_CATEGORY, authorization_middleware_1.Action.LIST_CATEGORIES,
        authorization_middleware_1.Action.READ_SUPPLIER, authorization_middleware_1.Action.LIST_SUPPLIERS,
        authorization_middleware_1.Action.READ_MOVEMENT, authorization_middleware_1.Action.LIST_MOVEMENTS
    ]
};
// ================================
// SERVIÇO DE PERMISSÕES GRANULARES
// ================================
class GranularPermissionService {
    // Verifica se usuário tem permissão considerando todas as camadas
    static async hasPermission(context, action, resource) {
        try {
            // 1. SUPER_ADMIN sempre pode
            if (context.userRoles.includes(authorization_middleware_1.UserRole.SUPER_ADMIN)) {
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
        }
        catch (error) {
            console.error('Error checking granular permission:', error);
            return { allowed: false, reason: 'Permission check error' };
        }
    }
    // Verifica permissões customizadas do usuário
    static checkCustomPermissions(context, action, resource) {
        if (!context.customPermissions)
            return null;
        const now = context.requestTime || new Date();
        // Buscar permissões que se aplicam
        const applicablePermissions = context.customPermissions.filter(permission => {
            // Verificar se a ação corresponde
            if (permission.action !== action)
                return false;
            // Verificar se o recurso corresponde
            if (permission.resource && resource) {
                if (permission.resource !== '*' && permission.resource !== resource)
                    return false;
            }
            // Verificar se a loja corresponde
            if (permission.storeId && context.storeId && permission.storeId !== context.storeId)
                return false;
            // Verificar se não expirou
            if (permission.expiresAt && permission.expiresAt < now)
                return false;
            // Verificar condições
            if (!this.checkConditions(permission.conditions, context))
                return false;
            return true;
        });
        if (applicablePermissions.length === 0)
            return null;
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
    static checkStorePermissions(context, action) {
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
    static checkGlobalRolePermissions(context, action) {
        for (const role of context.userRoles) {
            const userRole = role;
            const rolePermissions = BASE_ROLE_PERMISSIONS[userRole] || [];
            if (rolePermissions.includes(action)) {
                return { allowed: true, reason: `Allowed by global role: ${userRole}` };
            }
        }
        return { allowed: false, reason: 'No global role has this permission' };
    }
    // Verifica condições de permissão
    static checkConditions(conditions, context) {
        if (!conditions)
            return true;
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
            }
            catch (error) {
                console.error('Error evaluating custom condition:', error);
                return false;
            }
        }
        return true;
    }
    // Verifica se usuário tem qualquer uma das permissões
    static async hasAnyPermission(context, actions, resource) {
        for (const action of actions) {
            const result = await this.hasPermission(context, action, resource);
            if (result.allowed) {
                return result;
            }
        }
        return { allowed: false, reason: 'None of the required permissions found' };
    }
    // Verifica se usuário tem todas as permissões
    static async hasAllPermissions(context, actions, resource) {
        for (const action of actions) {
            const result = await this.hasPermission(context, action, resource);
            if (!result.allowed) {
                return { allowed: false, reason: `Missing permission: ${action} - ${result.reason}` };
            }
        }
        return { allowed: true, reason: 'All permissions granted' };
    }
    // Obtém todas as permissões efetivas do usuário
    static async getUserEffectivePermissions(context) {
        const effectivePermissions = new Set();
        // Adicionar permissões dos roles globais
        for (const role of context.userRoles) {
            const userRole = role;
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
                if (permission.expiresAt && permission.expiresAt < now)
                    return;
                // Verificar condições
                if (!this.checkConditions(permission.conditions, context))
                    return;
                if (permission.grant) {
                    effectivePermissions.add(permission.action);
                }
                else {
                    effectivePermissions.delete(permission.action);
                }
            });
        }
        return Array.from(effectivePermissions);
    }
}
exports.GranularPermissionService = GranularPermissionService;
// ================================
// MIDDLEWARES GRANULARES
// ================================
// Middleware para permissão granular
const requireGranularPermission = (action, resource, options) => {
    return async (request, reply) => {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    error: 'Authentication required'
                });
            }
            // Construir contexto de permissão
            const context = {
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
            }
            else {
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
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    };
};
exports.requireGranularPermission = requireGranularPermission;
// Middleware para permissão por recurso específico
const requireResourcePermission = (action, resourceExtractor) => {
    return async (request, reply) => {
        try {
            const resource = resourceExtractor(request);
            return (0, exports.requireGranularPermission)(action, resource)(request, reply);
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    };
};
exports.requireResourcePermission = requireResourcePermission;
// Middleware para permissão baseada em tempo
const requireTimeBasedPermission = (action, timeConditions) => {
    return async (request, reply) => {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    error: 'Authentication required'
                });
            }
            const context = {
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
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    };
};
exports.requireTimeBasedPermission = requireTimeBasedPermission;
// Função auxiliar para obter permissões customizadas do usuário
async function getUserCustomPermissions(userId) {
    // TODO: Implementar busca no banco de dados
    // Por enquanto, retorna array vazio
    return [];
}
