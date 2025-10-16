import { FastifyInstance } from 'fastify';
import { InvoiceController } from './invoice.controller';
import { InvoiceSchemas } from './invoice.schema';
import { authMiddleware } from '../../middlewares/auth.middleware';

export async function InvoiceRoutes(fastify: FastifyInstance) {
  // CRUD básico
  fastify.post('/', {
    schema: InvoiceSchemas.create,
    preHandler: [authMiddleware],
    handler: InvoiceController.create
  });

  fastify.get('/', {
    schema: InvoiceSchemas.list,
    preHandler: [authMiddleware],
    handler: InvoiceController.list
  });

  fastify.get('/:id', {
    schema: InvoiceSchemas.get,
    handler: InvoiceController.get
  });

  fastify.put('/:id', {
    schema: InvoiceSchemas.update,
    preHandler: [authMiddleware],
    handler: InvoiceController.update
  });

  fastify.delete('/:id', {
    schema: InvoiceSchemas.delete,
    preHandler: [authMiddleware],
    handler: InvoiceController.delete
  });

  // Funções adicionais
  fastify.get('/customer/:customerId', {
    schema: InvoiceSchemas.getByCustomer,
    handler: InvoiceController.getByCustomer
  });

  fastify.get('/pending', {
    preHandler: [authMiddleware],
    handler: InvoiceController.getPending
  });

  fastify.get('/failed', {
    preHandler: [authMiddleware],
    handler: InvoiceController.getFailed
  });

  fastify.get('/overdue', {
    preHandler: [authMiddleware],
    handler: InvoiceController.getOverdue
  });

  fastify.get('/stats', {
    preHandler: [authMiddleware],
    handler: InvoiceController.getStats
  });

  fastify.get('/revenue', {
    schema: InvoiceSchemas.getRevenue,
    preHandler: [authMiddleware],
    handler: InvoiceController.getRevenue
  });

  fastify.get('/:id/pdf', {
    schema: InvoiceSchemas.getPdf,
    handler: InvoiceController.getPdf
  });

  // Funções de gerenciamento
  fastify.patch('/:id/status', {
    schema: InvoiceSchemas.updateStatus,
    preHandler: [authMiddleware],
    handler: InvoiceController.updateStatus
  });

  fastify.post('/:id/retry', {
    schema: InvoiceSchemas.retryPayment,
    preHandler: [authMiddleware],
    handler: InvoiceController.retryPayment
  });

  fastify.post('/:id/send-email', {
    schema: InvoiceSchemas.sendEmail,
    preHandler: [authMiddleware],
    handler: InvoiceController.sendEmail
  });

  fastify.patch('/:id/mark-paid', {
    schema: InvoiceSchemas.markAsPaid,
    preHandler: [authMiddleware],
    handler: InvoiceController.markAsPaid
  });

  fastify.patch('/:id/mark-failed', {
    schema: InvoiceSchemas.markAsFailed,
    preHandler: [authMiddleware],
    handler: InvoiceController.markAsFailed
  });
}
