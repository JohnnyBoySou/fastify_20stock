import { FastifyInstance } from 'fastify';
import { ChatRoutes } from '@/features/chat/chat.routes';

export async function ChatService(fastify: FastifyInstance) {
  // Registrar as rotas do chat
  await fastify.register(ChatRoutes, { prefix: '/chat' });
}