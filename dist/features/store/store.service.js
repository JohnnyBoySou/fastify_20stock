import { fetchAuth } from "@/hooks/api";
import axios from "axios";
const URI = "/stores";
const getCep = async (cep) => {
    try {
        const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        return res.data;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
export const StoreService = {
    // === CRUD BÁSICO ===
    create: (params) => fetchAuth(URI, { method: "POST", data: params }),
    list: (params) => fetchAuth(URI, { method: "GET", params }),
    single: (id) => fetchAuth(`${URI}/${id}`, { method: "GET" }),
    update: (id, params) => fetchAuth(`${URI}/${id}`, { method: "PUT", data: params }),
    delete: (id) => fetchAuth(`${URI}/${id}`, { method: "DELETE" }),
    // === CONSULTAS ESPECÍFICAS ===
    getByCnpj: (cnpj) => fetchAuth(`${URI}/cnpj/${cnpj}`, { method: "GET" }),
    getByOwner: (ownerId) => fetchAuth(`${URI}/owner/${ownerId}`, { method: "GET" }),
    getActive: () => fetchAuth(`${URI}/active`, { method: "GET" }),
    getStats: () => fetchAuth(`${URI}/stats`, { method: "GET" }),
    search: (q, limit) => fetchAuth(`${URI}/search`, { method: "GET", params: { q, limit } }),
    getRecent: (limit) => fetchAuth(`${URI}/recent`, { method: "GET", params: { limit } }),
    verifyCnpj: (cnpj) => fetchAuth(`${URI}/verify-cnpj/${cnpj}`, { method: "GET" }),
    toggleStatus: (id) => fetchAuth(`${URI}/${id}/toggle-status`, { method: "PATCH" }),
    // === GERENCIAMENTO DE USUÁRIOS DA LOJA ===
    addUser: (storeId, userId, role) => fetchAuth(`${URI}/${storeId}/users`, { method: "POST", data: { userId, role } }),
    removeUser: (storeId, userId) => fetchAuth(`${URI}/${storeId}/users/${userId}`, { method: "DELETE" }),
    listUsers: (storeId, params) => fetchAuth(`${URI}/${storeId}/users`, { method: "GET", params }),
    updateUserRole: (storeId, userId, role) => fetchAuth(`${URI}/${storeId}/users/${userId}/role`, { method: "PATCH", data: { role } }),
    getStoreUser: (storeId, userId) => fetchAuth(`${URI}/${storeId}/users/${userId}`, { method: "GET" }),
    getStoreOwner: (storeId) => fetchAuth(`${URI}/${storeId}/owner`, { method: "GET" }),
    getStoreAdmins: (storeId) => fetchAuth(`${URI}/${storeId}/admins`, { method: "GET" }),
    getStoreManagers: (storeId) => fetchAuth(`${URI}/${storeId}/managers`, { method: "GET" }),
    getStoreStaff: (storeId) => fetchAuth(`${URI}/${storeId}/staff`, { method: "GET" }),
    getStoreUserStats: (storeId) => fetchAuth(`${URI}/${storeId}/users/stats`, { method: "GET" }),
    searchStoreUsers: (storeId, q, limit) => fetchAuth(`${URI}/${storeId}/users/search`, { method: "GET", params: { q, limit } }),
    transferOwnership: (storeId, newOwnerId) => fetchAuth(`${URI}/${storeId}/transfer-ownership`, { method: "POST", data: { newOwnerId } }),
    // === UTILITÁRIOS ===
    getCep: (cep) => getCep(cep),
};
