import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();
export const AuthService = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            phone: {
                type: "string",
                required: false,
            },
        },
    },
    advanced: {
        generateId: false, // Use o ID do Prisma
    },
    baseURL: "http://localhost:3000",
    basePath: "/auth",
});
