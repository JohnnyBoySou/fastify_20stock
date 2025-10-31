import Fastify from 'fastify'
import cors from '@fastify/cors'
import path from 'node:path'

// Plugins
import { prismaPlugin, connectPrisma } from './plugins/prisma'
import { pushPlugin } from './plugins/push'

// Bootstrap UI
import { bootstrapUI } from './utils/bootstrap'

// Features (rotas)
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
import { RoadmapRoutes } from '@/features/roadmap/roadmap.routes'
import { UploadRoutes } from '@/features/upload/upload.route'
import { QuoteRoutes } from '@/features/quote/quote.routes'
import { PlanRoutes } from '@/features/plan/plan.routes'
import { CustomerRoutes } from '@/features/customer/customer.routes'
import { InvoiceRoutes } from '@/features/invoice/invoice.routes'
import { CrmRoutes } from '@/features/crm/crm.routes'
import { UserPreferencesRoutes } from '@/features/user-preferences/user-preferences.routes'
import { FlowRoutes } from '@/features/flow/flow.routes'
import { FlowExecutionRoutes } from '@/features/flow-execution/flow-execution.routes'
import { PushSubscriptionRoutes } from '@/features/push-subscription/push-subscription.routes'
import { PolarRoutes } from '@/features/polar/polar.routes'
import { ProfileRoutes } from '@/features/profile/profile.routes'


const fastify = Fastify({
  logger: false, // Desabilitado - usando bootstrap UI para feedback visual
  requestTimeout: 60000, // 30 segundos para timeout de requisições
  keepAliveTimeout: 5000, // 5 segundos para keep-alive
  bodyLimit: 1048576, // 1MB para limite do body
  routerOptions: {
    maxParamLength: 200 // Limite de caracteres para parâmetros de rota
  }
})

// Healthcheck route (registrada antes do bootstrap)
fastify.get('/health', async (request, reply) => {
  try {
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

const PORT = Number(process.env.PORT) || 3000
const HOST = '0.0.0.0'

// Graceful shutdown
const closeGracefully = async (signal: string) => {
  console.log(`\n⚠️  Recebido sinal ${signal}, encerrando servidor...`)
  
  try {
    await fastify.close()
    console.log('✅ Servidor encerrado com sucesso')
    process.exit(0)
  } catch (err) {
    console.error('❌ Erro ao encerrar servidor:', err)
    process.exit(1)
  }
}

// Handlers para sinais de encerramento
process.on('SIGINT', () => closeGracefully('SIGINT'))
process.on('SIGTERM', () => closeGracefully('SIGTERM'))

// Handler para erros não tratados
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  bootstrapUI.showError('Uncaught Exception', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
  bootstrapUI.showError('Unhandled Rejection', reason)
  process.exit(1)
})

// Função principal de inicialização
async function startServer() {
  // Passos de bootstrap
  const success = await bootstrapUI.run([
    {
      name: 'Conectando ao banco de dados',
      action: async () => {
        await connectPrisma(fastify)
      }
    },
    {
      name: 'Registrando plugins',
      action: async () => {
        await fastify.register(prismaPlugin)
        await fastify.register(pushPlugin)
      }
    },
    {
      name: 'Configurando CORS',
      action: async () => {
        await fastify.register(cors, {
          origin: true,
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        })
      }
    },
    {
      name: 'Registrando raw body parser',
      action: async () => {
        await fastify.register(require('fastify-raw-body'), {
          field: 'rawBody',
          global: true,
          encoding: 'utf8',
          runFirst: true
        })
      }
    },
    {
      name: 'Configurando arquivos estáticos',
      action: async () => {
        await fastify.register(require('@fastify/static'), {
          root: path.join(process.cwd(), 'src', 'uploads'),
          prefix: '/uploads/',
          decorateReply: false
        })
      }
    },
    {
      name: 'Registrando rotas',
      action: async () => {
        await fastify.register(AuthRoutes, { prefix: '/auth' })
        await fastify.register(UserRoutes, { prefix: '/users' })
        await fastify.register(ProductRoutes, { prefix: '/products' })
        await fastify.register(SupplierRoutes, { prefix: '/suppliers' })
        await fastify.register(StoreRoutes, { prefix: '/stores' })
        await fastify.register(CategoryRoutes, { prefix: '/categories' })
        await fastify.register(MovementRoutes, { prefix: '/movements' })
        await fastify.register(PermissionRoutes, { prefix: '/permissions' })
        await fastify.register(ReportRoutes, { prefix: '/reports' })
        await fastify.register(NotificationRoutes, { prefix: '/notifications' })
        await fastify.register(ChatRoutes, { prefix: '/chat' })
        await fastify.register(RoadmapRoutes, { prefix: '/roadmaps' })
        await fastify.register(UploadRoutes, { prefix: '/uploads' })
        await fastify.register(QuoteRoutes, { prefix: '/quotes' })
        await fastify.register(PlanRoutes, { prefix: '/plans' })
        await fastify.register(CustomerRoutes, { prefix: '/customers' })
        await fastify.register(InvoiceRoutes, { prefix: '/invoices' })
        await fastify.register(CrmRoutes, { prefix: '/crm' })
        await fastify.register(UserPreferencesRoutes, { prefix: '/preferences' })
        await fastify.register(FlowRoutes, { prefix: '' })
        await fastify.register(FlowExecutionRoutes, { prefix: '' })
        await fastify.register(PushSubscriptionRoutes, { prefix: '/push-subscriptions' })
        await fastify.register(PolarRoutes, { prefix: '/polar' })
        await fastify.register(ProfileRoutes, { prefix: '/profile' })
      }
    },
    {
      name: 'Iniciando servidor',
      action: async () => {
        await fastify.listen({ port: PORT, host: HOST })
      }
    }
  ])

  if (!success) {
    bootstrapUI.showError('Falha ao inicializar o servidor')
    process.exit(1)
  }

  // Mostrar informações do servidor
  bootstrapUI.showServerInfo(fastify, PORT, HOST)
}

// Iniciar o servidor
startServer().catch((err) => {
  console.error('Erro fatal ao iniciar o servidor:', err)
  bootstrapUI.showError('Erro fatal ao iniciar o servidor', err)
  process.exit(1)
})