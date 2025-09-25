"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierResponsibleRoutes = SupplierResponsibleRoutes;
const supplier_responsible_controller_1 = require("./supplier-responsible.controller");
const supplier_responsible_schema_1 = require("./supplier-responsible.schema");
async function SupplierResponsibleRoutes(fastify) {
    // CRUD básico
    fastify.post('/:supplierId/responsibles', {
        schema: supplier_responsible_schema_1.SupplierResponsibleSchemas.create,
        handler: supplier_responsible_controller_1.SupplierResponsibleController.create
    });
    fastify.get('/:supplierId/responsibles', {
        schema: supplier_responsible_schema_1.SupplierResponsibleSchemas.list,
        handler: supplier_responsible_controller_1.SupplierResponsibleController.list
    });
    fastify.get('/:supplierId/responsibles/:responsibleId', {
        schema: supplier_responsible_schema_1.SupplierResponsibleSchemas.get,
        handler: supplier_responsible_controller_1.SupplierResponsibleController.get
    });
    fastify.put('/:supplierId/responsibles/:responsibleId', {
        schema: supplier_responsible_schema_1.SupplierResponsibleSchemas.update,
        handler: supplier_responsible_controller_1.SupplierResponsibleController.update
    });
    fastify.delete('/:supplierId/responsibles/:responsibleId', {
        schema: supplier_responsible_schema_1.SupplierResponsibleSchemas.delete,
        handler: supplier_responsible_controller_1.SupplierResponsibleController.delete
    });
    // Funções adicionais
    fastify.get('/:supplierId/responsibles/email/:email', {
        schema: supplier_responsible_schema_1.SupplierResponsibleSchemas.getByEmail,
        handler: supplier_responsible_controller_1.SupplierResponsibleController.getByEmail
    });
    fastify.get('/:supplierId/responsibles/cpf/:cpf', {
        schema: supplier_responsible_schema_1.SupplierResponsibleSchemas.getByCpf,
        handler: supplier_responsible_controller_1.SupplierResponsibleController.getByCpf
    });
    fastify.get('/:supplierId/responsibles/active', {
        handler: supplier_responsible_controller_1.SupplierResponsibleController.getActive
    });
    fastify.get('/:supplierId/responsibles/stats', {
        handler: supplier_responsible_controller_1.SupplierResponsibleController.getStats
    });
    fastify.get('/:supplierId/responsibles/search', {
        handler: supplier_responsible_controller_1.SupplierResponsibleController.search
    });
    fastify.get('/:supplierId/responsibles/recent', {
        handler: supplier_responsible_controller_1.SupplierResponsibleController.getRecent
    });
    // Funções de comando
    fastify.patch('/:supplierId/responsibles/:responsibleId/toggle-status', {
        handler: supplier_responsible_controller_1.SupplierResponsibleController.toggleStatus
    });
    fastify.post('/:supplierId/responsibles/bulk', {
        handler: supplier_responsible_controller_1.SupplierResponsibleController.bulkCreate
    });
}
