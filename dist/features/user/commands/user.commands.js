"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCommands = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("@/plugins/prisma");
exports.UserCommands = {
    async create(data) {
        // Verificar se o usuário já existe
        const existingUser = await prisma_1.db.user.findUnique({
            where: { email: data.email }
        });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        // Hash da senha
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
        // Criar usuário
        const user = await prisma_1.db.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                roles: data.roles || ['user']
            },
            select: {
                id: true,
                email: true,
                name: true,
                roles: true,
                status: true,
                createdAt: true
            }
        });
        return user;
    },
    async update(id, data) {
        // Verificar se o usuário existe
        const existingUser = await prisma_1.db.user.findUnique({
            where: { id }
        });
        if (!existingUser) {
            throw new Error('User not found');
        }
        const updateData = { ...data };
        // Se uma nova senha foi fornecida, fazer hash
        if (updateData.password) {
            updateData.password = await bcryptjs_1.default.hash(updateData.password, 12);
        }
        // Se email foi alterado, verificar se já existe
        if (updateData.email && updateData.email !== existingUser.email) {
            const emailExists = await prisma_1.db.user.findUnique({
                where: { email: updateData.email }
            });
            if (emailExists) {
                throw new Error('Email already exists');
            }
        }
        const user = await prisma_1.db.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                roles: true,
                status: true,
                emailVerified: true,
                updatedAt: true
            }
        });
        return user;
    },
    async delete(id) {
        // Verificar se o usuário existe
        const existingUser = await prisma_1.db.user.findUnique({
            where: { id }
        });
        if (!existingUser) {
            throw new Error('User not found');
        }
        // Soft delete - apenas desativar o usuário
        await prisma_1.db.user.update({
            where: { id },
            data: { status: false }
        });
        return { success: true };
    },
    async verifyEmail(id) {
        const user = await prisma_1.db.user.update({
            where: { id },
            data: { emailVerified: true },
            select: {
                id: true,
                email: true,
                emailVerified: true,
                updatedAt: true
            }
        });
        return user;
    },
    async updateLastLogin(id) {
        await prisma_1.db.user.update({
            where: { id },
            data: { lastLoginAt: new Date() }
        });
        return { success: true };
    }
};
