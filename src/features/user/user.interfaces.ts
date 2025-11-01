import type { FastifyRequest } from 'fastify'

export interface CreateUserRequest extends FastifyRequest {
  body: {
    email: string
    password: string
    name: string
    roles?: string[]
  }
}

export interface GetUserRequest extends FastifyRequest {
  params: {
    id: string
  }
}

export interface UpdateUserRequest extends FastifyRequest {
  params: {
    id: string
  }
  body: {
    email?: string
    password?: string
    name?: string
    roles?: string[]
    status?: boolean
    emailVerified?: boolean
  }
}

export interface DeleteUserRequest extends FastifyRequest {
  params: {
    id: string
  }
}

export interface ListUsersRequest extends FastifyRequest {
  query: {
    page?: number
    limit?: number
    search?: string
    status?: boolean
  }
}
