import { FastifyInstance } from 'fastify';
import { InvoiceController } from './invoice.controller';
import { InvoiceSchemas } from './invoice.schema';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { storeContextMiddleware } from '../../middlewares/store-context.middleware';

export async function InvoiceRoutes(fastify: FastifyInstance) {
  // CRUD básico
  fastify.post('/', {
    schema: InvoiceSchemas.create,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: InvoiceController.create
  });

  fastify.get('/', {
    schema: InvoiceSchemas.list,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: InvoiceController.list
  });

  fastify.get('/:id', {
    schema: InvoiceSchemas.get,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: InvoiceController.get
  });

  fastify.put('/:id', {
    schema: InvoiceSchemas.update,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: InvoiceController.update
  });

  fastify.delete('/:id', {
    schema: InvoiceSchemas.delete,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: InvoiceController.delete
  });

  // Funções adicionais
  fastify.get('/customer/:customerId', {
    schema: InvoiceSchemas.getByCustomer,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: InvoiceController.getByCustomer
  });

  fastify.get('/pending', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: InvoiceController.getPending
  });

  fastify.get('/failed', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: InvoiceController.getFailed
  });

  fastify.get('/overdue', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: InvoiceController.getOverdue
  });

  fastify.get('/stats', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: InvoiceController.getStats
  });

  fastify.get('/revenue', {
    schema: InvoiceSchemas.getRevenue,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: InvoiceController.getRevenue
  });

  fastify.get('/:id/pdf', {
    schema: InvoiceSchemas.getPdf,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: InvoiceController.getPdf
  });

  // Funções de gerenciamento
  fastify.patch('/:id/status', {
    schema: InvoiceSchemas.updateStatus,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: InvoiceController.updateStatus
  });

  fastify.post('/:id/retry', {
    schema: InvoiceSchemas.retryPayment,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: InvoiceController.retryPayment
  });

  fastify.post('/:id/send-email', {
    schema: InvoiceSchemas.sendEmail,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: InvoiceController.sendEmail
  });

  fastify.patch('/:id/mark-paid', {
    schema: InvoiceSchemas.markAsPaid,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: InvoiceController.markAsPaid
  });

  fastify.patch('/:id/mark-failed', {
    schema: InvoiceSchemas.markAsFailed,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: InvoiceController.markAsFailed
  });
}
