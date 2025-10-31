import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@/plugins/prisma';

// Extend FastifyRequest to include store information
declare module 'fastify' {
  interface FastifyRequest {
    store?: {
      id: string;
      name: string;
    };
  }
}

// Função auxiliar para obter a loja do usuário autenticado
const getUserStore = async (userId: string) => {
  const ownedStore = await db.store.findFirst({
    where: { ownerId: userId },
    select: { id: true, name: true }
  });

  if (ownedStore) {
    return ownedStore;
  }

  const storeUser = await db.storeUser.findFirst({
    where: { userId },
    include: {
      store: {
        select: { id: true, name: true }
      }
    }
  });

  if (storeUser) {
    return storeUser.store;
  }

  return null;
};

export const storeContextMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  try {

    // Verificar se o usuário está autenticado
    if (!request.user?.id) {
      return reply.status(401).send({
        error: 'User not authenticated'
      });
    }

    const userStore = await getUserStore(request.user.id);

    if (!userStore) {
      return reply.status(400).send({
        error: 'User has no associated store. Please create a store or provide storeId in request.'
      });
    }

    request.store = userStore;

    if (request.body && typeof request.body === 'object' && !('storeId' in request.body)) {
      (request.body as any).storeId = userStore.id;
    }

    return;
  } catch (error: any) {
    request.log.error(error);
    return reply.status(500).send({
      error: 'Internal server error'
    });
  }
};

// Middleware opcional - não falha se não encontrar store
export const optionalStoreContextMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // Verificar se o usuário está autenticado
    if (!request.user?.id) {
      return reply.status(401).send({
        error: 'User not authenticated'
      });
    }

    // Obter a store do usuário
    const userStore = await getUserStore(request.user.id);

    if (userStore) {
      // Adicionar a store ao request
      request.store = userStore;

      // Se storeId não foi fornecido no body, adicionar automaticamente
      if (request.body && typeof request.body === 'object' && !('storeId' in request.body)) {
        (request.body as any).storeId = userStore.id;
      }
    }

    // Continuar para o próximo middleware/handler (mesmo sem store)
    return;
  } catch (error: any) {
    request.log.error(error);
    return reply.status(500).send({
      error: 'Internal server error'
    });
  }
};
