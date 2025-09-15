import { FastifyInstance } from 'fastify';
import { SupplierController } from './supplier.controller';
import { SupplierSchemas } from './supplier.schema';
import { authMiddleware, requirePermission, } from '@/middlewares';
import { Action, } from '@/middlewares/authorization.middleware';

export async function supplierRoutesWithMiddleware(fastify: FastifyInstance) {
    // POST /suppliers - Criar fornecedor (requer permissão)
    fastify.post('/', {
        schema: SupplierSchemas.create,
        preHandler: [
            authMiddleware,
            requirePermission(Action.CREATE_SUPPLIER)
        ],
        handler: SupplierController.create
    });

    // GET /suppliers - Listar fornecedores (requer permissão)
    fastify.get('/', {
        schema: SupplierSchemas.list,
        preHandler: [
            authMiddleware,
            requirePermission(Action.READ_SUPPLIER)
        ],
        handler: SupplierController.list
    });

    // GET /suppliers/:id - Buscar fornecedor por ID (requer permissão)
    fastify.get('/:id', {
        schema: SupplierSchemas.get,
        preHandler: [
            authMiddleware,
            requirePermission(Action.READ_SUPPLIER)
        ],
        handler: SupplierController.get
    });

    // PUT /suppliers/:id - Atualizar fornecedor (requer permissão)
    fastify.put('/:id', {
        schema: SupplierSchemas.update,
        preHandler: [
            authMiddleware,
            requirePermission(Action.UPDATE_SUPPLIER)
        ],
        handler: SupplierController.update
    });

    // DELETE /suppliers/:id - Deletar fornecedor (requer permissão)
    fastify.delete('/:id', {
        schema: SupplierSchemas.delete,
        preHandler: [
            authMiddleware,
            requirePermission(Action.DELETE_SUPPLIER)
        ],
        handler: SupplierController.delete
    });

    // PATCH /suppliers/:id/toggle-status - Alternar status do fornecedor (requer permissão)
    fastify.patch('/:id/toggle-status', {
        preHandler: [
            authMiddleware,
            requirePermission(Action.UPDATE_SUPPLIER)
        ],
        handler: SupplierController.toggleStatus
    });

    // GET /suppliers/cnpj/:cnpj - Buscar fornecedor por CNPJ (requer permissão)
    fastify.get('/cnpj/:cnpj', {
        schema: SupplierSchemas.getByCnpj,
        preHandler: [
            authMiddleware,
            requirePermission(Action.READ_SUPPLIER)
        ],
        handler: SupplierController.getByCnpj
    });

    // GET /suppliers/city/:city - Buscar fornecedores por cidade (requer permissão)
    fastify.get('/city/:city', {
        schema: SupplierSchemas.getByCity,
        preHandler: [
            authMiddleware,
            requirePermission(Action.READ_SUPPLIER)
        ],
        handler: SupplierController.getByCity
    });

    // GET /suppliers/state/:state - Buscar fornecedores por estado (requer permissão)
    fastify.get('/state/:state', {
        schema: SupplierSchemas.getByState,
        preHandler: [
            authMiddleware,
            requirePermission(Action.READ_SUPPLIER)
        ],
        handler: SupplierController.getByState
    });

    // GET /suppliers/active - Listar fornecedores ativos (requer permissão)
    fastify.get('/active', {
        preHandler: [
            authMiddleware,
            requirePermission(Action.READ_SUPPLIER)
        ],
        handler: SupplierController.getActive
    });

    // GET /suppliers/top - Listar top fornecedores (requer permissão)
    fastify.get('/top', {
        preHandler: [
            authMiddleware,
            requirePermission(Action.READ_SUPPLIER)
        ],
        handler: SupplierController.getTopSuppliers
    });

    // GET /suppliers/search - Buscar fornecedores (requer permissão)
    fastify.get('/search', {
        schema: SupplierSchemas.search,
        preHandler: [
            authMiddleware,
            requirePermission(Action.READ_SUPPLIER)
        ],
        handler: SupplierController.search
    });

    // GET /suppliers/stats - Estatísticas dos fornecedores (requer permissão)
    fastify.get('/stats', {
        preHandler: [
            authMiddleware,
            requirePermission(Action.READ_SUPPLIER)
        ],
        handler: SupplierController.getStats
    });
}
