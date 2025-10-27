import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
export const db = prisma;
export async function prismaPlugin(app: FastifyInstance) {
  app.decorate("prisma", prisma);

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
}

export async function connectPrisma(app: FastifyInstance) {
  try {
    await prisma.$connect();
    console.log('✅ Prisma conectado com sucesso ao banco de dados');
    app.log.info('Prisma conectado com sucesso ao banco de dados');
  } catch (error) {
    app.log.error('Falha ao conectar com o banco de dados:');
    console.log('❌ Falha ao conectar com o banco de dados:');
    console.error(error);
    process.exit(1);
  }
}