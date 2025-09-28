import { FastifyRequest } from 'fastify';

export interface CreateStoreRequest extends FastifyRequest {
  body: {
    name: string
    cnpj: string
    email?: string
    phone?: string
    cep?: string
    city?: string
    state?: string
    address?: string
    status?: boolean
  }
}

export interface UpdateStoreRequest extends FastifyRequest {
  params: { id: string }
  body: {
    name?: string
    cnpj?: string
    email?: string
    phone?: string
    cep?: string
    city?: string
    state?: string
    address?: string
    status?: boolean
  }
}

export interface GetStoreRequest extends FastifyRequest {
  params: { id: string }
}

export interface DeleteStoreRequest extends FastifyRequest {
  params: { id: string }
}

export interface ListStoresRequest extends FastifyRequest {
  query: {
    page?: number
    limit?: number
    search?: string
    status?: boolean
    ownerId?: string
  }
}

export interface GetStoreByCnpjRequest extends FastifyRequest {
  params: { cnpj: string }
}

export interface GetStoresByOwnerRequest extends FastifyRequest {
  params: { ownerId: string }
}

// === INTERFACES PARA GERENCIAMENTO DE USUÁRIOS DA LOJA ===

export interface AddUserToStoreRequest extends FastifyRequest {
  params: { id: string }
  body: {
    userId: string
    role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF'
  }
}

export interface RemoveUserFromStoreRequest extends FastifyRequest {
  params: { 
    id: string
    userId: string
  }
}

export interface UpdateUserRoleRequest extends FastifyRequest {
  params: { 
    id: string
    userId: string
  }
  body: {
    role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF'
  }
}

export interface ListStoreUsersRequest extends FastifyRequest {
  params: { id: string }
  query: {
    page?: number
    limit?: number
    search?: string
    role?: 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF'
  }
}

export interface GetStoreUserRequest extends FastifyRequest {
  params: { 
    id: string
    userId: string
  }
}
