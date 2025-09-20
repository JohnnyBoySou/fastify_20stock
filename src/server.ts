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

const fastify = Fastify({
  logger: true
})

//Plugins
await fastify.register(cors, {
  origin: true, // Permite todas as origens em desenvolvimento
  credentials: true, // Permite cookies e headers de autenticação
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
})

await fastify.register(prismaPlugin)

//Conexão com o banco de dados
await connectPrisma(fastify)

// Registrar rotas
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

try {
  await fastify.listen({ port: 3000 })
  fastify.log.info(`Servidor rodando na porta ${3000}`)
  console.log(`✅ Servidor rodando na porta ${3000}`)
} catch (err) {
  fastify.log.error(err)
  console.log('❌ Falha ao iniciar o servidor:')
  console.error(err)
  process.exit(1)
}