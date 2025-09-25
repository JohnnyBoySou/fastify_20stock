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
fastify.register(cors, {
  origin: true, // Permite todas as origens em desenvolvimento
  credentials: true, // Permite cookies e headers de autenticação
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
})

fastify.register(prismaPlugin)

//Conexão com o banco de dados
connectPrisma(fastify)

// Registrar rotas
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

try {
  fastify.listen({ port: 3000 })
  fastify.log.info(`Servidor rodando na porta ${3000}`)
  console.log(`✅ Servidor rodando na porta ${3000}`)
} catch (err) {
  fastify.log.error(err)
  console.log('❌ Falha ao iniciar o servidor:')
  console.error(err)
  process.exit(1)
}