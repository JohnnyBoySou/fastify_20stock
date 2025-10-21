"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierRoutes = SupplierRoutes;
const supplier_controller_1 = require("./supplier.controller");
const supplier_schema_1 = require("./supplier.schema");
const supplier_responsible_routes_1 = require("./supplier-responsible.routes");
const auth_middleware_1 = require("@/middlewares/auth.middleware");
const store_context_middleware_1 = require("@/middlewares/store-context.middleware");
async function SupplierRoutes(fastify) {
    // Middlewares para todas as rotas
    fastify.addHook('preHandler', auth_middleware_1.authMiddleware);
    fastify.addHook('preHandler', store_context_middleware_1.storeContextMiddleware);
    // CRUD básico
    fastify.post('/', {
        schema: supplier_schema_1.SupplierSchemas.create,
        handler: supplier_controller_1.SupplierController.create
    });
    fastify.get('/', {
        schema: supplier_schema_1.SupplierSchemas.list,
        handler: supplier_controller_1.SupplierController.list
    });
    fastify.get('/:id', {
        schema: supplier_schema_1.SupplierSchemas.get,
        handler: supplier_controller_1.SupplierController.get
    });
    fastify.put('/:id', {
        schema: supplier_schema_1.SupplierSchemas.update,
        handler: supplier_controller_1.SupplierController.update
    });
    fastify.delete('/:id', {
        schema: supplier_schema_1.SupplierSchemas.delete,
        handler: supplier_controller_1.SupplierController.delete
    });
    // Funções adicionais
    fastify.get('/cnpj/:cnpj', {
        schema: supplier_schema_1.SupplierSchemas.getByCnpj,
        handler: supplier_controller_1.SupplierController.getByCnpj
    });
    fastify.get('/city/:city', {
        schema: supplier_schema_1.SupplierSchemas.getByCity,
        handler: supplier_controller_1.SupplierController.getByCity
    });
    fastify.get('/state/:state', {
        schema: supplier_schema_1.SupplierSchemas.getByState,
        handler: supplier_controller_1.SupplierController.getByState
    });
    fastify.get('/active', {
        handler: supplier_controller_1.SupplierController.getActive
    });
    fastify.get('/stats', {
        handler: supplier_controller_1.SupplierController.getStats
    });
    fastify.get('/search', {
        schema: supplier_schema_1.SupplierSchemas.search,
        handler: supplier_controller_1.SupplierController.search
    });
    fastify.get('/top', {
        handler: supplier_controller_1.SupplierController.getTopSuppliers
    });
    fastify.patch('/:id/toggle-status', {
        schema: supplier_schema_1.SupplierSchemas.get,
        handler: supplier_controller_1.SupplierController.toggleStatus
    });
    // Registrar rotas de responsáveis
    await fastify.register(supplier_responsible_routes_1.SupplierResponsibleRoutes);
}
