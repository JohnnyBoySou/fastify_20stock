import { FastifyInstance } from 'fastify';
import { ChatController } from './chat.controller';
import { ChatSchemas } from './chat.schema';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { storeContextMiddleware } from '@/middlewares/store-context.middleware';

export async function ChatRoutes(fastify: FastifyInstance) {
  // === ENVIO DE MENSAGENS ===
  fastify.post('/messages', {
    schema: ChatSchemas.sendMessage,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: ChatController.sendMessage
  });

  fastify.post('/sessions/:sessionId/messages', {
    schema: ChatSchemas.sendMessage,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: ChatController.sendMessageToSession
  });

  // === HISTÓRICO DE CHAT ===
  fastify.get('/messages', {
    schema: ChatSchemas.getHistory,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: ChatController.getHistory
  });

  // === HISTÓRICO TRADICIONAL (compatibilidade) ===
  fastify.get('/messages/traditional', {
    schema: ChatSchemas.getHistory,
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: ChatController.getHistoryTraditional
  });

  // === MENSAGEM ESPECÍFICA ===
  fastify.get('/messages/:id', {
    preHandler: [authMiddleware],
    handler: ChatController.getMessage
  });

  // === SESSÕES DE CHAT ===
  fastify.get('/sessions', {
    preHandler: [authMiddleware, storeContextMiddleware],
    handler: ChatController.getSessions
  });

  fastify.get('/sessions/:sessionId', {
    schema: ChatSchemas.getSession,
    preHandler: [authMiddleware],
    handler: ChatController.getSession
  });

  fastify.get('/sessions/:sessionId/messages', {
    preHandler: [authMiddleware],
    handler: ChatController.getSessionMessages
  });

  fastify.put('/sessions/:sessionId/title', {
    preHandler: [authMiddleware],
    handler: ChatController.updateSessionTitle
  });

  fastify.patch('/sessions/:sessionId/title/intelligent', {
    preHandler: [authMiddleware],
    handler: ChatController.updateSessionTitleIntelligent
  });

  fastify.delete('/sessions/:sessionId', {
    schema: ChatSchemas.deleteSession,
    preHandler: [authMiddleware],
    handler: ChatController.deleteSession
  });

  // === TOOLBOX ===
  fastify.get('/toolbox', {
    schema: ChatSchemas.getToolbox,
    preHandler: [authMiddleware],
    handler: ChatController.getToolbox
  });

  // === EXECUÇÃO DE COMANDOS ===
  fastify.post('/execute', {
    preHandler: [authMiddleware],
    handler: ChatController.executeCommand
  });

  // === ANÁLISE E ESTATÍSTICAS ===
  fastify.get('/analytics', {
    schema: ChatSchemas.getAnalytics,
    preHandler: [authMiddleware],
    handler: ChatController.getAnalytics
  });

  // === BUSCA ===
  fastify.get('/search', {
    preHandler: [authMiddleware],
    handler: ChatController.search
  });

  // === OPERAÇÕES DE LIMPEZA ===
  fastify.delete('/cleanup/sessions', {
    preHandler: [authMiddleware],
    handler: ChatController.cleanupOldSessions
  });

  fastify.delete('/cleanup/messages', {
    preHandler: [authMiddleware],
    handler: ChatController.cleanupOldMessages
  });
}
