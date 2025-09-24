import { fetchAuth } from "@/hooks/api";
const URI = "/suppliers";
export const SupplierService = {
    // === CRUD BÁSICO ===
    create: (params) => fetchAuth(URI, { method: "POST", data: params }),
    list: (filters) => fetchAuth(URI, { method: "GET", params: filters }),
    get: (id) => fetchAuth(`${URI}/${id}`, { method: "GET" }),
    update: (id, params) => fetchAuth(`${URI}/${id}`, { method: "PUT", data: params }),
    delete: (id) => fetchAuth(`${URI}/${id}`, { method: "DELETE" }),
    // === CONSULTAS ESPECÍFICAS ===
    getByCnpj: (cnpj) => fetchAuth(`${URI}/cnpj/${cnpj}`, { method: "GET" }),
    getByCity: (city) => fetchAuth(`${URI}/city/${city}`, { method: "GET" }),
    getByState: (state) => fetchAuth(`${URI}/state/${state}`, { method: "GET" }),
    getActive: () => fetchAuth(`${URI}/active`, { method: "GET" }),
    getStats: () => fetchAuth(`${URI}/stats`, { method: "GET" }),
    search: (q, limit) => fetchAuth(`${URI}/search`, { method: "GET", params: { q, limit } }),
    getTopSuppliers: (limit) => fetchAuth(`${URI}/top`, { method: "GET", params: { limit } }),
    // === GERENCIAMENTO DE STATUS ===
    toggleStatus: (id) => fetchAuth(`${URI}/${id}/toggle-status`, { method: "PATCH" }),
    // === VALIDAÇÕES ===
    verifyCnpj: (cnpj) => fetchAuth(`${URI}/verify-cnpj/${cnpj}`, { method: "GET" }),
    validateCnpj: (cnpj) => fetchAuth(`${URI}/validate-cnpj`, { method: "POST", data: { cnpj } }),
    // === BUSCA AVANÇADA ===
    getByLocation: (state, city) => fetchAuth(`${URI}/location`, { method: "GET", params: { state, city } }),
    getWithProducts: (filters) => fetchAuth(`${URI}/with-products`, { method: "GET", params: filters }),
    getWithoutProducts: (filters) => fetchAuth(`${URI}/without-products`, { method: "GET", params: filters }),
    // === RELATÓRIOS E ANÁLISES ===
    getAnalytics: (filters) => fetchAuth(`${URI}/analytics`, { method: "GET", params: filters }),
    getReport: (id, filters) => fetchAuth(`${URI}/${id}/report`, { method: "GET", params: filters }),
    getGeographicDistribution: () => fetchAuth(`${URI}/geographic-distribution`, { method: "GET" }),
    // === PRODUTOS E MOVIMENTAÇÕES ===
    getProducts: (id, filters) => fetchAuth(`${URI}/${id}/products`, { method: "GET", params: filters }),
    getMovements: (id, filters) => fetchAuth(`${URI}/${id}/movements`, { method: "GET", params: filters }),
    getRecentMovements: (id, limit) => fetchAuth(`${URI}/${id}/recent-movements`, { method: "GET", params: { limit } }),
    // === OPERAÇÕES EM LOTE ===
    bulkCreate: (suppliers) => fetchAuth(`${URI}/bulk-create`, { method: "POST", data: { suppliers } }),
    bulkUpdate: (updates) => fetchAuth(`${URI}/bulk-update`, { method: "POST", data: { updates } }),
    bulkDelete: (ids) => fetchAuth(`${URI}/bulk-delete`, { method: "POST", data: { ids } }),
    bulkToggleStatus: (ids, status) => fetchAuth(`${URI}/bulk-toggle-status`, { method: "POST", data: { ids, status } }),
    // === FUNÇÕES ESPECÍFICAS ===
    getRecent: (limit) => fetchAuth(`${URI}/recent`, { method: "GET", params: { limit } }),
    getInactive: (filters) => fetchAuth(`${URI}/inactive`, { method: "GET", params: filters }),
    getByProductCount: (minProducts, maxProducts) => fetchAuth(`${URI}/by-product-count`, { method: "GET", params: { minProducts, maxProducts } }),
    // === RELATÓRIOS ESPECÍFICOS ===
    getPerformanceReport: (filters) => fetchAuth(`${URI}/performance-report`, { method: "GET", params: filters }),
    getFinancialReport: (id, filters) => fetchAuth(`${URI}/${id}/financial-report`, { method: "GET", params: filters }),
    // === UTILITÁRIOS ===
    export: (filters) => fetchAuth(`${URI}/export`, { method: "POST", data: filters }),
    import: (file, options) => fetchAuth(`${URI}/import`, { method: "POST", data: { file, ...options } }),
    validate: (supplier) => fetchAuth(`${URI}/validate`, { method: "POST", data: supplier }),
    getStates: () => fetchAuth(`${URI}/states`, { method: "GET" }),
    getCities: (state) => fetchAuth(`${URI}/cities`, { method: "GET", params: { state } }),
};
