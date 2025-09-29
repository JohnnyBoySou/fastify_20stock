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
  console.log('getUserStore: Searching for store for user:', userId);
  
  // Primeiro, verificar se o usuário é dono de alguma loja
  console.log('getUserStore: Checking owned stores...');
  const ownedStore = await db.store.findFirst({
    where: { ownerId: userId },
    select: { id: true, name: true }
  });

  if (ownedStore) {
    console.log('getUserStore: Found owned store:', ownedStore);
    return ownedStore;
  }

  // Se não for dono, verificar se tem acesso a alguma loja como usuário
  console.log('getUserStore: Checking store user access...');
  const storeUser = await db.storeUser.findFirst({
    where: { userId },
    include: {
      store: {
        select: { id: true, name: true }
      }
    }
  });

  if (storeUser) {
    console.log('getUserStore: Found store user access:', storeUser);
    return storeUser.store;
  }

  console.log('getUserStore: No store found for user');
  return null;
};

export const storeContextMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    console.log('StoreContextMiddleware: Starting...');
    
    // Verificar se o usuário está autenticado
    if (!request.user?.id) {
      console.log('StoreContextMiddleware: User not authenticated');
      return reply.status(401).send({
        error: 'User not authenticated'
      });
    }

    console.log('StoreContextMiddleware: User authenticated:', request.user.id);

    // Obter a store do usuário
    console.log('StoreContextMiddleware: Getting store for user...');
    const userStore = await getUserStore(request.user.id);

    if (!userStore) {
      console.log('StoreContextMiddleware: User has no associated store');
      return reply.status(400).send({
        error: 'User has no associated store. Please create a store or provide storeId in request.'
      });
    }

    console.log('StoreContextMiddleware: Found user store:', userStore);

    // Adicionar a store ao request
    request.store = userStore;

    // Se storeId não foi fornecido no body, adicionar automaticamente
    if (request.body && typeof request.body === 'object' && !('storeId' in request.body)) {
      console.log('StoreContextMiddleware: Adding storeId to request body');
      (request.body as any).storeId = userStore.id;
    }

    console.log('StoreContextMiddleware: Completed successfully');
    // Continuar para o próximo middleware/handler
    return;
  } catch (error: any) {
    console.log('StoreContextMiddleware: Error:', error);
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
