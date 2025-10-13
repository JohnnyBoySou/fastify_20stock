import { FastifyRequest } from 'fastify'

// Interfaces para Roadmap
export interface CreateRoadmapRequest extends FastifyRequest {
  body: any
}

export interface UpdateRoadmapRequest extends FastifyRequest {
  params: { id: string }
  body: any
}

export interface GetRoadmapRequest extends FastifyRequest {
  params: { id: string }
}

export interface ListRoadmapsRequest extends FastifyRequest {
  query: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }
}

export interface DeleteRoadmapRequest extends FastifyRequest {
  params: { id: string }
}