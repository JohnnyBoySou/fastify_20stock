import type { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
export const db = prisma;
export async function prismaPlugin(app: FastifyInstance) {
  app.decorate("prisma", prisma as any);

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
}

export async function connectPrisma(app: FastifyInstance) {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error('Falha ao conectar com o banco de dados:', error);
    throw error;
  }
}