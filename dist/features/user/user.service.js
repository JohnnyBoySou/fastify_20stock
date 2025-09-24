import { fetchAuth } from "@/hooks/api";
const URI = "/users";
export const UserService = {
    // === CRUD BÁSICO ===
    create: (params) => fetchAuth(URI, { method: "POST", data: params }),
    list: (filters) => fetchAuth(URI, { method: "GET", params: filters }),
    get: (id) => fetchAuth(`${URI}/${id}`, { method: "GET" }),
    update: (id, params) => fetchAuth(`${URI}/${id}`, { method: "PUT", data: params }),
    delete: (id) => fetchAuth(`${URI}/${id}`, { method: "DELETE" }),
    // === CONSULTAS ESPECÍFICAS ===
    getByEmail: (email) => fetchAuth(`${URI}/email`, { method: "GET", params: { email } }),
    getByRole: (role) => fetchAuth(`${URI}/role/${role}`, { method: "GET" }),
    getActive: () => fetchAuth(`${URI}/active`, { method: "GET" }),
    getStats: () => fetchAuth(`${URI}/stats`, { method: "GET" }),
    search: (q, limit) => fetchAuth(`${URI}/search`, { method: "GET", params: { q, limit } }),
    // === GERENCIAMENTO DE EMAIL ===
    verifyEmail: (id) => fetchAuth(`${URI}/${id}/verify-email`, { method: "PATCH" }),
    resendVerificationEmail: (id) => fetchAuth(`${URI}/${id}/resend-verification`, { method: "POST" }),
    requestPasswordReset: (params) => fetchAuth(`${URI}/password-reset`, { method: "POST", data: params }),
    resetPassword: (token, newPassword) => fetchAuth(`${URI}/password-reset/${token}`, { method: "POST", data: { newPassword } }),
    // === GERENCIAMENTO DE LOGIN ===
    updateLastLogin: (id) => fetchAuth(`${URI}/${id}/last-login`, { method: "PATCH" }),
    getLoginHistory: (id, filters) => fetchAuth(`${URI}/${id}/login-history`, { method: "GET", params: filters }),
    // === PERFIL E CONFIGURAÇÕES ===
    getProfile: (id) => fetchAuth(`${URI}/${id}/profile`, { method: "GET" }),
    updateProfile: (id, data) => fetchAuth(`${URI}/${id}/profile`, { method: "PUT", data }),
    changePassword: (id, params) => fetchAuth(`${URI}/${id}/change-password`, { method: "POST", data: params }),
    // === ATIVIDADES E AUDITORIA ===
    getActivity: (id, filters) => fetchAuth(`${URI}/${id}/activity`, { method: "GET", params: filters }),
    getRecentActivity: (id, limit) => fetchAuth(`${URI}/${id}/recent-activity`, { method: "GET", params: { limit } }),
    // === RELATÓRIOS E ANÁLISES ===
    getAnalytics: (filters) => fetchAuth(`${URI}/analytics`, { method: "GET", params: filters }),
    getReport: (id, filters) => fetchAuth(`${URI}/${id}/report`, { method: "GET", params: filters }),
    // === OPERAÇÕES EM LOTE ===
    bulkOperation: (operation) => fetchAuth(`${URI}/bulk`, { method: "POST", data: operation }),
    bulkCreate: (users) => fetchAuth(`${URI}/bulk-create`, { method: "POST", data: { users } }),
    bulkUpdate: (updates) => fetchAuth(`${URI}/bulk-update`, { method: "POST", data: { updates } }),
    bulkDelete: (ids) => fetchAuth(`${URI}/bulk-delete`, { method: "POST", data: { ids } }),
    // === FUNÇÕES ESPECÍFICAS ===
    getInactive: (filters) => fetchAuth(`${URI}/inactive`, { method: "GET", params: filters }),
    getUnverified: (filters) => fetchAuth(`${URI}/unverified`, { method: "GET", params: filters }),
    getRecent: (limit) => fetchAuth(`${URI}/recent`, { method: "GET", params: { limit } }),
    // === GERENCIAMENTO DE ROLES ===
    addRole: (id, role) => fetchAuth(`${URI}/${id}/roles`, { method: "POST", data: { role } }),
    removeRole: (id, role) => fetchAuth(`${URI}/${id}/roles/${role}`, { method: "DELETE" }),
    updateRoles: (id, roles) => fetchAuth(`${URI}/${id}/roles`, { method: "PUT", data: { roles } }),
    getAvailableRoles: () => fetchAuth(`${URI}/available-roles`, { method: "GET" }),
    // === RELATÓRIOS ESPECÍFICOS ===
    getLoginReport: (filters) => fetchAuth(`${URI}/login-report`, { method: "GET", params: filters }),
    getActivityReport: (filters) => fetchAuth(`${URI}/activity-report`, { method: "GET", params: filters }),
    // === UTILITÁRIOS ===
    export: (filters) => fetchAuth(`${URI}/export`, { method: "POST", data: filters }),
    import: (file, options) => fetchAuth(`${URI}/import`, { method: "POST", data: { file, ...options } }),
    validate: (user) => fetchAuth(`${URI}/validate`, { method: "POST", data: user }),
    getRoles: () => fetchAuth(`${URI}/roles`, { method: "GET" }),
    checkEmailAvailability: (email) => fetchAuth(`${URI}/check-email`, { method: "POST", data: { email } }),
};
