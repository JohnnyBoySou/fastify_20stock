import { FastifyInstance } from 'fastify';
import { StoreController } from './store.controller';
import {
  StoreSchemas
} from './store.schema';
import { authMiddleware } from '../../middlewares';

export async function StoreRoutes(fastify: FastifyInstance) {
  // CRUD básico
  fastify.post('/', {
    schema: StoreSchemas.create,
    preHandler: [authMiddleware],
    handler: StoreController.create
  });

  fastify.get('/', {
    schema: StoreSchemas.list,
    handler: StoreController.list
  });

  fastify.get('/:id', {
    schema: StoreSchemas.get,
    handler: StoreController.get
  });

  fastify.put('/:id', {
    schema: StoreSchemas.update,
    preHandler: [authMiddleware],
    handler: StoreController.update
  });

  fastify.delete('/:id', {
    schema: StoreSchemas.delete,
    preHandler: [authMiddleware],
    handler: StoreController.delete
  });

  // Funções adicionais - Queries
  fastify.get('/cnpj/:cnpj', {
    schema: StoreSchemas.getByCnpj,
    handler: StoreController.getByCnpj
  });

  fastify.get('/owner/:ownerId', {
    schema: StoreSchemas.getByOwner,
    handler: StoreController.getByOwner
  });

  fastify.get('/active', {
    handler: StoreController.getActive
  });

  fastify.get('/stats', {
    handler: StoreController.getStats
  });

  fastify.get('/search', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          q: { type: 'string' },
          limit: { type: 'number' }
        },
        required: ['q']
      }
    },
    handler: StoreController.search
  });

  fastify.get('/recent', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'number' }
        }
      }
    },
    handler: StoreController.getRecent
  });

  // Funções adicionais - Commands
  fastify.get('/verify-cnpj/:cnpj', {
    schema: StoreSchemas.verifyCnpj,
    preHandler: [authMiddleware],
    handler: StoreController.verifyCnpj
  });

  fastify.patch('/:id/toggle-status', {
    schema: StoreSchemas.toggleStatus,
    preHandler: [authMiddleware],
    handler: StoreController.toggleStatus
  });
}
