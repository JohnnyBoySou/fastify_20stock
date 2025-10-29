import { FastifyRequest } from "fastify";

export interface PolarEvent {
    type: string;
    data: any;
  }

export interface ListPolarRequest extends FastifyRequest {
    query: {
        page?: number;
        limit?: number;
    }
  }

export interface CreateCheckoutRequest extends FastifyRequest {
    body: {
        productId: string;
    }
}