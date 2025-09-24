import { fetchAuth } from "@/hooks/api";
const URI = "/permissions";
export const PermissionService = {
    // === GESTÃO DE PERMISSÕES CUSTOMIZADAS ===
    createUserPermission: (params) => fetchAuth(`${URI}/user`, { method: "POST", data: params }),
    getUserPermissions: (userId, filters) => fetchAuth(`${URI}/user/${userId}`, { method: "GET", params: filters }),
    updateUserPermission: (id, params) => fetchAuth(`${URI}/user/${id}`, { method: "PUT", data: params }),
    deleteUserPermission: (id) => fetchAuth(`${URI}/user/${id}`, { method: "DELETE" }),
    // === GESTÃO DE PERMISSÕES POR LOJA ===
    setStoreUserPermissions: (params) => fetchAuth(`${URI}/store`, { method: "POST", data: params }),
    getStoreUserPermissions: (storeId, filters) => fetchAuth(`${URI}/store/${storeId}`, { method: "GET", params: filters }),
    // === CONSULTAS E RELATÓRIOS ===
    getUserEffectivePermissions: (userId, storeId) => fetchAuth(`${URI}/effective/${userId}`, { method: "GET", params: { storeId } }),
    testPermission: (params) => fetchAuth(`${URI}/test`, { method: "POST", data: params }),
    getPermissionStats: () => fetchAuth(`${URI}/stats`, { method: "GET" }),
    // === BUSCA E FILTROS ===
    searchPermissions: (filters) => fetchAuth(`${URI}/search`, { method: "GET", params: filters }),
    getPermissionsByAction: (action, filters) => fetchAuth(`${URI}/action/${action}`, { method: "GET", params: filters }),
    getPermissionsByRole: (role, storeId) => fetchAuth(`${URI}/role/${role}`, { method: "GET", params: { storeId } }),
    // === OPERAÇÕES EM LOTE ===
    bulkCreateUserPermissions: (params) => fetchAuth(`${URI}/bulk-create`, { method: "POST", data: params }),
    bulkUpdateUserPermissions: (params) => fetchAuth(`${URI}/bulk-update`, { method: "POST", data: params }),
    bulkDeleteUserPermissions: (params) => fetchAuth(`${URI}/bulk-delete`, { method: "POST", data: params }),
    // === AUDITORIA ===
    getPermissionAuditLog: (permissionId, filters) => fetchAuth(`${URI}/audit/${permissionId}`, { method: "GET", params: filters }),
    getAuditLogs: (filters) => fetchAuth(`${URI}/audit`, { method: "GET", params: filters }),
    // === TEMPLATES DE PERMISSÃO ===
    createPermissionTemplate: (params) => fetchAuth(`${URI}/templates`, { method: "POST", data: params }),
    getPermissionTemplates: (filters) => fetchAuth(`${URI}/templates`, { method: "GET", params: filters }),
    getPermissionTemplate: (id) => fetchAuth(`${URI}/templates/${id}`, { method: "GET" }),
    updatePermissionTemplate: (id, params) => fetchAuth(`${URI}/templates/${id}`, { method: "PUT", data: params }),
    deletePermissionTemplate: (id) => fetchAuth(`${URI}/templates/${id}`, { method: "DELETE" }),
    applyPermissionTemplate: (params) => fetchAuth(`${URI}/templates/apply`, { method: "POST", data: params }),
    // === FUNÇÕES ESPECÍFICAS ===
    getExpiredPermissions: (filters) => fetchAuth(`${URI}/expired`, { method: "GET", params: filters }),
    getExpiringSoon: (days = 7, filters) => fetchAuth(`${URI}/expiring-soon`, { method: "GET", params: { days, ...filters } }),
    renewPermission: (id, expiresAt) => fetchAuth(`${URI}/${id}/renew`, { method: "PATCH", data: { expiresAt } }),
    revokePermission: (id, reason) => fetchAuth(`${URI}/${id}/revoke`, { method: "PATCH", data: { reason } }),
    // === RELATÓRIOS AVANÇADOS ===
    getPermissionMatrix: (storeId) => fetchAuth(`${URI}/matrix`, { method: "GET", params: { storeId } }),
    getPermissionUsage: (filters) => fetchAuth(`${URI}/usage`, { method: "GET", params: filters }),
    getPermissionConflicts: (userId, storeId) => fetchAuth(`${URI}/conflicts/${userId}`, { method: "GET", params: { storeId } }),
    // === UTILITÁRIOS ===
    exportPermissions: (filters) => fetchAuth(`${URI}/export`, { method: "POST", data: filters }),
    importPermissions: (file, options) => fetchAuth(`${URI}/import`, { method: "POST", data: { file, ...options } }),
    validatePermissions: (permissions) => fetchAuth(`${URI}/validate`, { method: "POST", data: { permissions } }),
};
