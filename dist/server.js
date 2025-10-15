"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import '../src/plugins/tracing';
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const prisma_1 = require("./plugins/prisma");
const user_routes_1 = require("./features/user/user.routes");
const auth_routes_1 = require("./features/auth/auth.routes");
const product_routes_1 = require("./features/product/product.routes");
const supplier_routes_1 = require("./features/supplier/supplier.routes");
const store_routes_1 = require("./features/store/store.routes");
const category_routes_1 = require("./features/category/category.routes");
const movement_routes_1 = require("./features/movement/movement.routes");
const permission_routes_1 = require("./features/permission/permission.routes");
const report_routes_1 = require("./features/report/report.routes");
const notification_routes_1 = require("./features/notification/notification.routes");
const chat_routes_1 = require("./features/chat/chat.routes");
const rag_1 = require("./services/llm/rag");
const middlewares_1 = require("./middlewares");
const roadmap_routes_1 = require("./features/roadmap/roadmap.routes");
const upload_route_1 = require("./features/upload/upload.route");
const fastify = (0, fastify_1.default)({
    logger: true,
    requestTimeout: 60000, // 30 segundos para timeout de requisições
    keepAliveTimeout: 5000, // 5 segundos para keep-alive
    bodyLimit: 1048576, // 1MB para limite do body
    maxParamLength: 200 // Limite de caracteres para parâmetros de rota
});
//Plugins
fastify.register(cors_1.default, {
    origin: true, // Permite todas as origens em desenvolvimento
    credentials: true, // Permite cookies e headers de autenticação
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});
fastify.register(prisma_1.prismaPlugin);
//Conexão com o banco de dados
(0, prisma_1.connectPrisma)(fastify);
// Healthcheck route
fastify.get('/health', async (request, reply) => {
    try {
        // Verificar conexão com o banco de dados
        const prisma = request.server.prisma;
        await prisma.$queryRaw `SELECT 1`;
        return reply.send({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: 'connected'
        });
    }
    catch (error) {
        request.log.error(error);
        return reply.status(503).send({
            status: 'error',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: 'disconnected',
            error: 'Database connection failed'
        });
    }
});
// Registrar rotas
fastify.get('/llm/rag', {
    preHandler: [middlewares_1.authMiddleware, middlewares_1.storeContextMiddleware]
}, async (request, reply) => {
    try {
        const productId = "cmg4ixgh90005e8vgqdn5k6qz"; // ID do produto para teste
        const query = "Qual a última movimentação de entrada do produto?";
        const response = await (0, rag_1.queryRAG)(productId, query);
        return reply.send(response);
    }
    catch (error) {
        console.error('Error in RAG:', error);
        return reply.status(500).send({ error: 'RAG processing failed' });
    }
});
fastify.register(auth_routes_1.AuthRoutes, { prefix: '/auth' });
fastify.register(user_routes_1.UserRoutes, { prefix: '/users' });
fastify.register(product_routes_1.ProductRoutes, { prefix: '/products' });
fastify.register(supplier_routes_1.SupplierRoutes, { prefix: '/suppliers' });
fastify.register(store_routes_1.StoreRoutes, { prefix: '/stores' });
fastify.register(category_routes_1.CategoryRoutes, { prefix: '/categories' });
fastify.register(movement_routes_1.MovementRoutes, { prefix: '/movements' });
fastify.register(permission_routes_1.PermissionRoutes, { prefix: '/permissions' });
fastify.register(report_routes_1.ReportRoutes, { prefix: '/reports' });
fastify.register(notification_routes_1.NotificationRoutes, { prefix: '/notifications' });
fastify.register(chat_routes_1.ChatRoutes, { prefix: '/chat' });
fastify.register(roadmap_routes_1.RoadmapRoutes, { prefix: '/roadmaps' });
fastify.register(upload_route_1.UploadRoutes, { prefix: '/uploads' });
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
fastify.listen({ port: PORT, host: HOST })
    .then(() => {
    fastify.log.info(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`✅ Servidor rodando em http://${HOST}:${PORT}`);
})
    .catch((err) => {
    fastify.log.error(err);
    console.error('❌ Falha ao iniciar o servidor:', err);
    process.exit(1);
});
