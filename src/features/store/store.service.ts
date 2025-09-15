import { fetchAuth } from "@/hooks/api";
import axios from "axios";

export interface Owner {
    id: string;
    name: string;
    email: string;
}

export interface StoreCount {
    products: number;
    users: number;
}

export interface Store extends Record<string, unknown> {
    id: string;
    name: string;
    cnpj: string;
    email: string;
    phone: string;
    cep: string;
    city: string;
    state: string;
    address: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    owner: Owner;
    _count: StoreCount;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface StoreListResponse {
    stores: Store[];
    pagination: Pagination;
}

export interface StoreCreateRequest extends Record<string, unknown> {
    ownerId: string;
    name: string;
    cnpj: string;
    email: string;
    phone: string;
    cep: string;
    city: string;
    state: string;
    address: string;
    status: boolean;
}

export interface StoreUpdateRequest extends Record<string, unknown> {
    name?: string;
    cnpj?: string;
    email?: string;
    phone?: string;
    cep?: string;
    city?: string;
    state?: string;
    address?: string;
    status?: boolean;
}

export interface StoreUser {
    id: string;
    storeId: string;
    userId: string;
    role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF';
    user: {
        id: string;
        name: string;
        email: string;
        status: boolean;
        lastLoginAt?: string;
        createdAt?: string;
    };
    store: {
        id: string;
        name: string;
        cnpj: string;
    };
}

export interface StoreUserListResponse {
    storeUsers: StoreUser[];
    pagination: Pagination;
}

export interface StoreUserStats {
    total: number;
    byRole: Array<{
        role: string;
        _count: { id: number };
    }>;
    active: number;
    inactive: number;
}

export interface StoreStats {
    total: number;
    active: number;
    inactive: number;
    byState: Array<{
        state: string;
        _count: { id: number };
    }>;
}

export interface CnpjVerification {
    available: boolean;
    message: string;
}

export interface TransferOwnershipRequest {
    newOwnerId: string;
}

const URI = "/stores"

const getCep = async (cep: string) => {
    try {
        const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        return res.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const StoreService = {
    // === CRUD BÁSICO ===
    create: (params: StoreCreateRequest) => fetchAuth(URI, { method: "POST", data: params }),
    list: (params?: { page?: number; limit?: number; search?: string; status?: boolean; ownerId?: string }): Promise<StoreListResponse> => 
        fetchAuth(URI, { method: "GET", params }),
    single: (id: string): Promise<Store> => fetchAuth(`${URI}/${id}`, { method: "GET" }),
    update: (id: string, params: StoreUpdateRequest) => fetchAuth(`${URI}/${id}`, { method: "PUT", data: params }),
    delete: (id: string) => fetchAuth(`${URI}/${id}`, { method: "DELETE" }),

    // === CONSULTAS ESPECÍFICAS ===
    getByCnpj: (cnpj: string): Promise<Store> => fetchAuth(`${URI}/cnpj/${cnpj}`, { method: "GET" }),
    getByOwner: (ownerId: string): Promise<{ stores: Store[] }> => 
        fetchAuth(`${URI}/owner/${ownerId}`, { method: "GET" }),
    getActive: (): Promise<{ stores: Store[] }> => fetchAuth(`${URI}/active`, { method: "GET" }),
    getStats: (): Promise<StoreStats> => fetchAuth(`${URI}/stats`, { method: "GET" }),
    search: (q: string, limit?: number): Promise<{ stores: Store[] }> => 
        fetchAuth(`${URI}/search`, { method: "GET", params: { q, limit } }),
    getRecent: (limit?: number): Promise<{ stores: Store[] }> => 
        fetchAuth(`${URI}/recent`, { method: "GET", params: { limit } }),
    verifyCnpj: (cnpj: string): Promise<CnpjVerification> => 
        fetchAuth(`${URI}/verify-cnpj/${cnpj}`, { method: "GET" }),
    toggleStatus: (id: string): Promise<{ id: string; name: string; status: boolean; updatedAt: string }> => 
        fetchAuth(`${URI}/${id}/toggle-status`, { method: "PATCH" }),

    // === GERENCIAMENTO DE USUÁRIOS DA LOJA ===
    addUser: (storeId: string, userId: string, role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF'): Promise<StoreUser> => 
        fetchAuth(`${URI}/${storeId}/users`, { method: "POST", data: { userId, role } }),
    removeUser: (storeId: string, userId: string) => 
        fetchAuth(`${URI}/${storeId}/users/${userId}`, { method: "DELETE" }),
    listUsers: (storeId: string, params?: { page?: number; limit?: number; search?: string; role?: string }): Promise<StoreUserListResponse> => 
        fetchAuth(`${URI}/${storeId}/users`, { method: "GET", params }),
    updateUserRole: (storeId: string, userId: string, role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF'): Promise<StoreUser> => 
        fetchAuth(`${URI}/${storeId}/users/${userId}/role`, { method: "PATCH", data: { role } }),
    getStoreUser: (storeId: string, userId: string): Promise<StoreUser> => 
        fetchAuth(`${URI}/${storeId}/users/${userId}`, { method: "GET" }),
    getStoreOwner: (storeId: string): Promise<StoreUser> => 
        fetchAuth(`${URI}/${storeId}/owner`, { method: "GET" }),
    getStoreAdmins: (storeId: string): Promise<{ admins: StoreUser[] }> => 
        fetchAuth(`${URI}/${storeId}/admins`, { method: "GET" }),
    getStoreManagers: (storeId: string): Promise<{ managers: StoreUser[] }> => 
        fetchAuth(`${URI}/${storeId}/managers`, { method: "GET" }),
    getStoreStaff: (storeId: string): Promise<{ staff: StoreUser[] }> => 
        fetchAuth(`${URI}/${storeId}/staff`, { method: "GET" }),
    getStoreUserStats: (storeId: string): Promise<StoreUserStats> => 
        fetchAuth(`${URI}/${storeId}/users/stats`, { method: "GET" }),
    searchStoreUsers: (storeId: string, q: string, limit?: number): Promise<{ storeUsers: StoreUser[] }> => 
        fetchAuth(`${URI}/${storeId}/users/search`, { method: "GET", params: { q, limit } }),
    transferOwnership: (storeId: string, newOwnerId: string): Promise<Store> => 
        fetchAuth(`${URI}/${storeId}/transfer-ownership`, { method: "POST", data: { newOwnerId } }),

    // === UTILITÁRIOS ===
    getCep: (cep: string) => getCep(cep),
}