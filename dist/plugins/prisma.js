"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.prisma = void 0;
exports.prismaPlugin = prismaPlugin;
exports.connectPrisma = connectPrisma;
const prisma_1 = require("../generated/prisma");
exports.prisma = new prisma_1.PrismaClient();
exports.db = exports.prisma;
async function prismaPlugin(app) {
    app.decorate("prisma", exports.prisma);
    app.addHook("onClose", async () => {
        await exports.prisma.$disconnect();
    });
}
async function connectPrisma(app) {
    try {
        await exports.prisma.$connect();
        console.log('✅ Prisma conectado com sucesso ao banco de dados');
        app.log.info('Prisma conectado com sucesso ao banco de dados');
    }
    catch (error) {
        app.log.error('Falha ao conectar com o banco de dados:');
        console.log('❌ Falha ao conectar com o banco de dados:');
        console.error(error);
        process.exit(1);
    }
}
