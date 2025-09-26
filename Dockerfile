# Use Node.js 22 Alpine como base (menor tamanho)
FROM node:22-alpine AS base

# Instalar dependências necessárias para o Alpine
RUN apk add --no-cache libc6-compat

# Configurar diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json pnpm-lock.yaml* ./

# Instalar pnpm globalmente
RUN npm install -g pnpm

# ================================
# STAGE 1: Dependencies
# ================================
FROM base AS deps

# Instalar dependências de produção
RUN pnpm install --no-frozen-lockfile --prod

# ================================
# STAGE 2: Build
# ================================
FROM base AS builder

# Instalar todas as dependências (dev + prod)
RUN pnpm install --no-frozen-lockfile

# Copiar código fonte
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Compilar TypeScript
RUN pnpm run build

# ================================
# STAGE 3: Production
# ================================
FROM node:22-alpine AS runner

# Instalar dependências necessárias para o Alpine
RUN apk add --no-cache libc6-compat

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 fastify

# Configurar diretório de trabalho
WORKDIR /app

# Copiar dependências de produção
COPY --from=deps /app/node_modules ./node_modules

# Copiar código compilado
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./dist/generated
COPY --from=builder /app/prisma ./prisma

# Copiar arquivos necessários
COPY package.json ./
COPY tsconfig.json ./

# Configurar permissões
RUN chown -R fastify:nodejs /app
USER fastify

# Expor porta
EXPOSE 3000

# Configurar variáveis de ambiente
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Comando de inicialização
CMD ["node", "dist/server.js"]
