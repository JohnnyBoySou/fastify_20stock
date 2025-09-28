import { FastifyInstance } from 'fastify';
import { SupplierResponsibleController } from './supplier-responsible.controller';
import { SupplierResponsibleSchemas } from './supplier-responsible.schema';
import { authMiddleware } from '../../middlewares/auth.middleware';

export async function SupplierResponsibleRoutes(fastify: FastifyInstance) {
  // CRUD básico
  fastify.post('/:supplierId/responsibles', {
    schema: SupplierResponsibleSchemas.create,
    preHandler: [authMiddleware],
    handler: SupplierResponsibleController.create
  });

  fastify.get('/:supplierId/responsibles', {
    schema: SupplierResponsibleSchemas.list,
    handler: SupplierResponsibleController.list
  });

  fastify.get('/:supplierId/responsibles/:responsibleId', {
    schema: SupplierResponsibleSchemas.get,
    handler: SupplierResponsibleController.get
  });

  fastify.put('/:supplierId/responsibles/:responsibleId', {
    schema: SupplierResponsibleSchemas.update,
    preHandler: [authMiddleware],
    handler: SupplierResponsibleController.update
  });

  fastify.delete('/:supplierId/responsibles/:responsibleId', {
    schema: SupplierResponsibleSchemas.delete,
    preHandler: [authMiddleware],
    handler: SupplierResponsibleController.delete
  });

  // Funções adicionais
  fastify.get('/:supplierId/responsibles/email/:email', {
    schema: SupplierResponsibleSchemas.getByEmail,
    handler: SupplierResponsibleController.getByEmail
  });

  fastify.get('/:supplierId/responsibles/cpf/:cpf', {
    schema: SupplierResponsibleSchemas.getByCpf,
    handler: SupplierResponsibleController.getByCpf
  });

  fastify.get('/:supplierId/responsibles/active', {
    handler: SupplierResponsibleController.getActive
  });

  fastify.get('/:supplierId/responsibles/stats', {
    handler: SupplierResponsibleController.getStats
  });

  fastify.get('/:supplierId/responsibles/search', {
    handler: SupplierResponsibleController.search
  });

  fastify.get('/:supplierId/responsibles/recent', {
    handler: SupplierResponsibleController.getRecent
  });

  // Funções de comando
  fastify.patch('/:supplierId/responsibles/:responsibleId/toggle-status', {
    preHandler: [authMiddleware],
    handler: SupplierResponsibleController.toggleStatus
  });

  fastify.post('/:supplierId/responsibles/bulk', {
    preHandler: [authMiddleware],
    handler: SupplierResponsibleController.bulkCreate
  });
}
