import { FastifyRequest } from 'fastify';

export interface PushSubscriptionBody {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent?: string;
  deviceInfo?: any;
}

export interface CreatePushSubscriptionRequest extends FastifyRequest<{
  Body: PushSubscriptionBody;
}> {}

export interface DeletePushSubscriptionRequest extends FastifyRequest<{
  Params: {
    id: string;
  };
}> {}

export interface GetPushSubscriptionRequest extends FastifyRequest<{
  Params: {
    id: string;
  };
}> {}

export interface ListPushSubscriptionsRequest extends FastifyRequest<{
  Querystring: {
    page?: number;
    limit?: number;
  };
}> {}

export interface GetUserSubscriptionsRequest extends FastifyRequest<{
  Params: {
    userId: string;
  };
}> {}

