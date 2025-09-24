import { fetchAuth } from "@/hooks/api";
const URI = "/products";
export const ProductService = {
    // === CRUD BÁSICO ===
    create: (params) => fetchAuth(URI, { method: "POST", data: params }),
    list: (params) => fetchAuth(URI, { method: "GET", params }),
    get: (id) => fetchAuth(`${URI}/${id}`, { method: "GET" }),
    update: (id, params) => fetchAuth(`${URI}/${id}`, { method: "PUT", data: params }),
    delete: (id) => fetchAuth(`${URI}/${id}`, { method: "DELETE" }),
    // === CONSULTAS ESPECÍFICAS ===
    getActive: () => fetchAuth(`${URI}/active`, { method: "GET" }),
    getStats: () => fetchAuth(`${URI}/stats`, { method: "GET" }),
    search: (q, limit) => fetchAuth(`${URI}/search`, { method: "GET", params: { q, limit } }),
    getByCategory: (categoryId) => fetchAuth(`${URI}/category/${categoryId}`, { method: "GET" }),
    getBySupplier: (supplierId) => fetchAuth(`${URI}/supplier/${supplierId}`, { method: "GET" }),
    getByStore: (storeId) => fetchAuth(`${URI}/store/${storeId}`, { method: "GET" }),
    // === GERENCIAMENTO DE STATUS ===
    updateStatus: (id, status) => fetchAuth(`${URI}/${id}/status`, { method: "PATCH", data: { status } }),
    // === GERENCIAMENTO DE ESTOQUE ===
    getStock: (id) => fetchAuth(`${URI}/${id}/stock`, { method: "GET" }),
    updateStock: (id, params) => fetchAuth(`${URI}/${id}/stock`, { method: "PATCH", data: params }),
    getStockHistory: (id, limit) => fetchAuth(`${URI}/${id}/stock/history`, { method: "GET", params: { limit } }),
    getLowStock: (storeId) => fetchAuth(`${URI}/low-stock`, { method: "GET", params: { storeId } }),
    // === MOVIMENTAÇÕES DE ESTOQUE ===
    getMovements: (id, params) => fetchAuth(`${URI}/${id}/movements`, { method: "GET", params }),
    createMovement: (id, params) => fetchAuth(`${URI}/${id}/movements`, { method: "POST", data: params }),
    // === ANÁLISES E RELATÓRIOS ===
    getAnalytics: (id) => fetchAuth(`${URI}/${id}/analytics`, { method: "GET" }),
    getRecent: (limit) => fetchAuth(`${URI}/recent`, { method: "GET", params: { limit } }),
    // === VALIDAÇÕES ===
    verifySku: (id, sku) => fetchAuth(`${URI}/${id}/verify-sku`, { method: "POST", data: { sku } }),
    // === FUNÇÕES DE BUSCA AVANÇADA ===
    getByPriceRange: (minPrice, maxPrice, storeId) => fetchAuth(`${URI}/price-range`, { method: "GET", params: { minPrice, maxPrice, storeId } }),
    getByStockStatus: (status, storeId) => fetchAuth(`${URI}/stock-status`, { method: "GET", params: { status, storeId } }),
    getExpiringSoon: (days = 30, storeId) => fetchAuth(`${URI}/expiring-soon`, { method: "GET", params: { days, storeId } }),
    // === RELATÓRIOS DE PERFORMANCE ===
    getTopSelling: (storeId, limit) => fetchAuth(`${URI}/top-selling`, { method: "GET", params: { storeId, limit } }),
    getSlowMoving: (storeId, days) => fetchAuth(`${URI}/slow-moving`, { method: "GET", params: { storeId, days } }),
    getZeroStock: (storeId) => fetchAuth(`${URI}/zero-stock`, { method: "GET", params: { storeId } }),
    // === UTILITÁRIOS ===
    bulkUpdate: (updates) => fetchAuth(`${URI}/bulk-update`, { method: "POST", data: { updates } }),
    bulkDelete: (ids) => fetchAuth(`${URI}/bulk-delete`, { method: "POST", data: { ids } }),
    export: (filters) => fetchAuth(`${URI}/export`, { method: "POST", data: filters }),
};
