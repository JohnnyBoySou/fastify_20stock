import { fetchAuth } from "@/hooks/api";
const URI = "/movements";
export const MovementService = {
    // === CRUD BÁSICO ===
    create: (params) => fetchAuth(URI, { method: "POST", data: params }),
    list: (filters) => fetchAuth(URI, { method: "GET", params: filters }),
    get: (id) => fetchAuth(`${URI}/${id}`, { method: "GET" }),
    update: (id, params) => fetchAuth(`${URI}/${id}`, { method: "PUT", data: params }),
    delete: (id) => fetchAuth(`${URI}/${id}`, { method: "DELETE" }),
    // === CONSULTAS POR ENTIDADE ===
    getByStore: (storeId, filters) => fetchAuth(`${URI}/store/${storeId}`, { method: "GET", params: filters }),
    getByProduct: (productId, filters) => fetchAuth(`${URI}/product/${productId}`, { method: "GET", params: filters }),
    getBySupplier: (supplierId, filters) => fetchAuth(`${URI}/supplier/${supplierId}`, { method: "GET", params: filters }),
    // === HISTÓRICO DE ESTOQUE ===
    getStockHistory: (productId, storeId, filters) => fetchAuth(`${URI}/stock-history/${productId}/${storeId}`, { method: "GET", params: filters }),
    getCurrentStock: (productId, storeId) => fetchAuth(`${URI}/current-stock/${productId}/${storeId}`, { method: "GET" }),
    // === RELATÓRIOS E ESTATÍSTICAS ===
    getStats: () => fetchAuth(`${URI}/stats`, { method: "GET" }),
    search: (q, limit) => fetchAuth(`${URI}/search`, { method: "GET", params: { q, limit } }),
    getLowStockProducts: (storeId) => fetchAuth(`${URI}/low-stock`, { method: "GET", params: { storeId } }),
    // === COMANDOS ESPECIAIS ===
    recalculateStock: (productId, storeId) => fetchAuth(`${URI}/recalculate-stock/${productId}/${storeId}`, { method: "POST" }),
    // === RELATÓRIOS AVANÇADOS ===
    getReport: (filters) => fetchAuth(`${URI}/report`, { method: "GET", params: filters }),
    getAnalytics: (filters) => fetchAuth(`${URI}/analytics`, { method: "GET", params: filters }),
    // === OPERAÇÕES EM LOTE ===
    createBulk: (params) => fetchAuth(`${URI}/bulk`, { method: "POST", data: params }),
    updateBulk: (updates) => fetchAuth(`${URI}/bulk-update`, { method: "POST", data: { updates } }),
    deleteBulk: (ids) => fetchAuth(`${URI}/bulk-delete`, { method: "POST", data: { ids } }),
    // === VERIFICAÇÃO E CANCELAMENTO ===
    verify: (id, params) => fetchAuth(`${URI}/${id}/verify`, { method: "PATCH", data: params }),
    cancel: (id, params) => fetchAuth(`${URI}/${id}/cancel`, { method: "PATCH", data: params }),
    getVerifiedMovements: (filters) => fetchAuth(`${URI}/verified`, { method: "GET", params: filters }),
    getCancelledMovements: (filters) => fetchAuth(`${URI}/cancelled`, { method: "GET", params: filters }),
    // === FUNÇÕES ESPECÍFICAS ===
    getByType: (type, filters) => fetchAuth(`${URI}/type/${type}`, { method: "GET", params: filters }),
    getByDateRange: (startDate, endDate, filters) => fetchAuth(`${URI}/date-range`, { method: "GET", params: { startDate, endDate, ...filters } }),
    getRecent: (limit, storeId) => fetchAuth(`${URI}/recent`, { method: "GET", params: { limit, storeId } }),
    getPendingVerification: (storeId) => fetchAuth(`${URI}/pending-verification`, { method: "GET", params: { storeId } }),
    // === RELATÓRIOS ESPECÍFICOS ===
    getInventoryReport: (storeId, date) => fetchAuth(`${URI}/inventory-report`, { method: "GET", params: { storeId, date } }),
    getSupplierReport: (supplierId, filters) => fetchAuth(`${URI}/supplier-report`, { method: "GET", params: { supplierId, ...filters } }),
    getProductReport: (productId, filters) => fetchAuth(`${URI}/product-report`, { method: "GET", params: { productId, ...filters } }),
    // === UTILITÁRIOS ===
    export: (filters) => fetchAuth(`${URI}/export`, { method: "POST", data: filters }),
    import: (file, options) => fetchAuth(`${URI}/import`, { method: "POST", data: { file, ...options } }),
    validate: (movement) => fetchAuth(`${URI}/validate`, { method: "POST", data: movement }),
    getMovementTypes: () => fetchAuth(`${URI}/types`, { method: "GET" }),
};
