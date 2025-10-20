//import '../src/plugins/tracing';
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { prismaPlugin, connectPrisma } from './plugins/prisma'

import { UserRoutes } from '@/features/user/user.routes'
import { AuthRoutes } from '@/features/auth/auth.routes'
import { ProductRoutes } from '@/features/product/product.routes'
import { SupplierRoutes } from '@/features/supplier/supplier.routes'
import { StoreRoutes } from '@/features/store/store.routes'
import { CategoryRoutes } from '@/features/category/category.routes'
import { MovementRoutes } from '@/features/movement/movement.routes'
import { PermissionRoutes } from '@/features/permission/permission.routes'
import { ReportRoutes } from '@/features/report/report.routes'
import { NotificationRoutes } from '@/features/notification/notification.routes'
import { ChatRoutes } from '@/features/chat/chat.routes'
import { queryRAG } from './services/llm/rag'
import { authMiddleware, storeContextMiddleware } from './middlewares'
import { RoadmapRoutes } from '@/features/roadmap/roadmap.routes'
import { UploadRoutes } from '@/features/upload/upload.route'
import { QuoteRoutes } from '@/features/quote/quote.routes'
import { PlanRoutes } from '@/features/plan/plan.routes'
import { CustomerRoutes } from '@/features/customer/customer.routes'
import { InvoiceRoutes } from '@/features/invoice/invoice.routes'
import { WebhookRoutes } from '@/features/webhook/webhook.routes'
import { CrmRoutes } from '@/features/crm/crm.routes'
import { UserPreferencesRoutes } from '@/features/user-preferences/user-preferences.routes'

const fastify = Fastify({
  logger: true,
  requestTimeout: 60000, // 30 segundos para timeout de requisições
  keepAliveTimeout: 5000, // 5 segundos para keep-alive
  bodyLimit: 1048576, // 1MB para limite do body
  maxParamLength: 200 // Limite de caracteres para parâmetros de rota
})

//Plugins
fastify.register(cors, {
  origin: true, // Permite todas as origens em desenvolvimento
  credentials: true, // Permite cookies e headers de autenticação
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
})

fastify.register(prismaPlugin)

// Registrar plugin para servir arquivos estáticos de upload
fastify.register(require('@fastify/static'), {
  root: require('path').join(process.cwd(), 'src', 'uploads'),
  prefix: '/uploads/',
  decorateReply: false
})

//Conexão com o banco de dados
connectPrisma(fastify)

// Healthcheck route
fastify.get('/health', async (request, reply) => {
  try {
    // Verificar conexão com o banco de dados
    const prisma = (request.server as any).prisma
    await prisma.$queryRaw`SELECT 1`

    return reply.send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected'
    })
  } catch (error) {
    request.log.error(error)
    return reply.status(503).send({
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'disconnected',
      error: 'Database connection failed'
    })
  }
})

// Registrar rotas

fastify.get('/llm/rag', {
  preHandler: [authMiddleware, storeContextMiddleware]
}, async (request, reply) => {
  try {
    const productId = "cmg4ixgh90005e8vgqdn5k6qz"; // ID do produto para teste
    const query = "Qual a última movimentação de entrada do produto?";
    const response = await queryRAG(productId, query);
    return reply.send(response);
  } catch (error) {
    console.error('Error in RAG:', error);
    return reply.status(500).send({ error: 'RAG processing failed' });
  }
})

fastify.register(AuthRoutes, { prefix: '/auth' })
fastify.register(UserRoutes, { prefix: '/users' })
fastify.register(ProductRoutes, { prefix: '/products' })
fastify.register(SupplierRoutes, { prefix: '/suppliers' })
fastify.register(StoreRoutes, { prefix: '/stores' })
fastify.register(CategoryRoutes, { prefix: '/categories' })
fastify.register(MovementRoutes, { prefix: '/movements' })
fastify.register(PermissionRoutes, { prefix: '/permissions' })
fastify.register(ReportRoutes, { prefix: '/reports' })
fastify.register(NotificationRoutes, { prefix: '/notifications' })
fastify.register(ChatRoutes, { prefix: '/chat' })
fastify.register(RoadmapRoutes, { prefix: '/roadmaps' })
fastify.register(UploadRoutes, { prefix: '/uploads' })
fastify.register(QuoteRoutes, { prefix: '/quotes' })
fastify.register(PlanRoutes, { prefix: '/plans' })
fastify.register(CustomerRoutes, { prefix: '/customers' })
fastify.register(InvoiceRoutes, { prefix: '/invoices' })
fastify.register(WebhookRoutes, { prefix: '/webhooks' })
fastify.register(CrmRoutes, { prefix: '/crm' })
fastify.register(UserPreferencesRoutes, { prefix: '/preferences' })

const PORT = Number(process.env.PORT) || 3000
const HOST = '0.0.0.0'

fastify.listen({ port: PORT, host: HOST })
  .then(() => {
    fastify.log.info(`🚀 Servidor rodando na porta ${PORT}`)
    console.log(`✅ Servidor rodando em http://${HOST}:${PORT}`)
  })
  .catch((err) => {
    fastify.log.error(err)
    console.error('❌ Falha ao iniciar o servidor:', err)
    process.exit(1)
  })