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

# Gerar cliente Prisma com o engine correto para Alpine Linux
RUN npx prisma generate --generator client

# Compilar TypeScript
RUN pnpm run build

# ================================
# STAGE 3: Production
# ================================
FROM node:22-alpine AS runner

# Instalar dependências necessárias para o Alpine
RUN apk add --no-cache libc6-compat openssl openssl-dev

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 fastify

# Configurar diretório de trabalho
WORKDIR /app

# Copiar dependências de produção
COPY --from=deps /app/node_modules ./node_modules

# Copiar código compilado
COPY --from=builder /app/dist ./dist

# IMPORTANTE: Copiar o Prisma Client gerado e os binários
COPY --from=builder /app/src/generated ./src/generated

# Copiar binários do Prisma (engine do query)
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copiar schema do Prisma (necessário para migrations em runtime)
COPY --from=builder /app/prisma ./prisma

# Copiar arquivos necessários
COPY package.json ./

# Configurar variáveis de ambiente para o Prisma encontrar o engine
ENV PRISMA_QUERY_ENGINE_LIBRARY="/app/node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node"
ENV PRISMA_QUERY_ENGINE_BINARY="/app/node_modules/.prisma/client/query-engine-linux-musl-openssl-3.0.x"

# Configurar permissões
RUN chown -R fastify:nodejs /app

# Verificar se os arquivos do Prisma foram copiados (antes de mudar para usuário não-root)
RUN ls -la /app/src/generated/prisma/ || echo "Prisma generated files not found"
RUN ls -la /app/node_modules/.prisma/client/ || echo "Prisma client not found"

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
