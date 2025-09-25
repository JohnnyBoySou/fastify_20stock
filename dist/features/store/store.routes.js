"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreRoutes = StoreRoutes;
const store_controller_1 = require("./store.controller");
const store_schema_1 = require("./store.schema");
async function StoreRoutes(fastify) {
    // CRUD básico
    fastify.post('/', {
        schema: store_schema_1.StoreSchemas.create,
        handler: store_controller_1.StoreController.create
    });
    fastify.get('/', {
        schema: store_schema_1.StoreSchemas.list,
        handler: store_controller_1.StoreController.list
    });
    fastify.get('/:id', {
        schema: store_schema_1.StoreSchemas.get,
        handler: store_controller_1.StoreController.get
    });
    fastify.put('/:id', {
        schema: store_schema_1.StoreSchemas.update,
        handler: store_controller_1.StoreController.update
    });
    fastify.delete('/:id', {
        schema: store_schema_1.StoreSchemas.delete,
        handler: store_controller_1.StoreController.delete
    });
    // Funções adicionais - Queries
    fastify.get('/cnpj/:cnpj', {
        schema: store_schema_1.StoreSchemas.getByCnpj,
        handler: store_controller_1.StoreController.getByCnpj
    });
    fastify.get('/owner/:ownerId', {
        schema: store_schema_1.StoreSchemas.getByOwner,
        handler: store_controller_1.StoreController.getByOwner
    });
    fastify.get('/active', {
        handler: store_controller_1.StoreController.getActive
    });
    fastify.get('/stats', {
        handler: store_controller_1.StoreController.getStats
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
        handler: store_controller_1.StoreController.search
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
        handler: store_controller_1.StoreController.getRecent
    });
    // Funções adicionais - Commands
    fastify.get('/verify-cnpj/:cnpj', {
        schema: store_schema_1.StoreSchemas.verifyCnpj,
        handler: store_controller_1.StoreController.verifyCnpj
    });
    fastify.patch('/:id/toggle-status', {
        schema: store_schema_1.StoreSchemas.toggleStatus,
        handler: store_controller_1.StoreController.toggleStatus
    });
}
