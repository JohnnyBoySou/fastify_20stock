# 🐳 Docker Setup - Fastify Stock Management

Este documento explica como usar o Docker para executar o projeto Fastify Stock Management.

## 📋 Pré-requisitos

- Docker
- Docker Compose
- Make (opcional, mas recomendado)

## 🚀 Comandos Rápidos

### Desenvolvimento
```bash
# Iniciar ambiente de desenvolvimento
make dev-up

# Ver logs em tempo real
make dev-logs

# Parar ambiente de desenvolvimento
make dev-down
```

### Produção
```bash
# Construir e iniciar em produção
make build
make up

# Ver logs
make logs

# Parar serviços
make down
```

## 📁 Arquivos Docker

### `Dockerfile`
- **Multi-stage build** otimizado para produção
- **Node.js 22 Alpine** (imagem leve)
- **Usuário não-root** para segurança
- **Health check** integrado
- **Tamanho otimizado** (~200MB)

### `Dockerfile.dev`
- **Desenvolvimento** com hot reload
- **Volumes montados** para código fonte
- **Dependências completas** (dev + prod)

### `docker-compose.yml`
- **PostgreSQL 16** como banco de dados
- **Aplicação** em modo produção
- **Volumes persistentes** para dados
- **Networking** configurado

### `docker-compose.dev.yml`
- **Ambiente de desenvolvimento**
- **Hot reload** habilitado
- **Volumes** para código fonte

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` com as seguintes variáveis:

```bash
# Banco de dados
DATABASE_URL="postgresql://fastify_user:fastify_pass@postgres:5432/fastify_db"

# Aplicação
NODE_ENV=production
PORT=3000

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
```

### 2. Primeira Execução

```bash
# Desenvolvimento
make dev-up
make migrate-dev

# Produção
make build
make up
make migrate
```

## 📊 Estrutura dos Containers

### Desenvolvimento
```
┌─────────────────┐    ┌─────────────────┐
│   fastify_app   │    │  fastify_postgres│
│   (port 3000)   │◄───┤   (port 5432)   │
│   Hot Reload    │    │   PostgreSQL 16 │
└─────────────────┘    └─────────────────┘
```

### Produção
```
┌─────────────────┐    ┌─────────────────┐
│   fastify_app   │    │  fastify_postgres│
│   (port 3000)   │◄───┤   (port 5432)   │
│   Optimized     │    │   PostgreSQL 16 │
└─────────────────┘    └─────────────────┘
```

## 🛠️ Comandos Úteis

### Gerenciamento de Containers
```bash
# Status dos containers
make status

# Logs em tempo real
make logs
make dev-logs

# Reiniciar serviços
make restart
make restart-dev
```

### Banco de Dados
```bash
# Executar migrações
make migrate
make migrate-dev

# Acessar banco via CLI
docker-compose exec postgres psql -U fastify_user -d fastify_db
```

### Desenvolvimento
```bash
# Instalar nova dependência
docker-compose -f docker-compose.dev.yml exec app-dev pnpm add package-name

# Executar testes
make test

# Linting
make lint
```

### Limpeza
```bash
# Parar e remover tudo
make clean

# Remover apenas volumes
docker-compose down -v
```

## 🔍 Troubleshooting

### Porta já em uso
```bash
# Verificar processos na porta 3000
lsof -i :3000

# Parar processo específico
kill -9 <PID>
```

### Problemas de permissão
```bash
# Reconstruir containers
make clean
make build
```

### Banco de dados não conecta
```bash
# Verificar logs do PostgreSQL
docker-compose logs postgres

# Verificar se o container está rodando
docker-compose ps
```

## 📈 Performance

### Otimizações Implementadas
- ✅ **Multi-stage build** para reduzir tamanho
- ✅ **Alpine Linux** (imagem base leve)
- ✅ **Layer caching** otimizado
- ✅ **Usuário não-root** para segurança
- ✅ **Health checks** para monitoramento

### Tamanhos das Imagens
- **Base**: ~200MB
- **Com dependências**: ~300MB
- **Final**: ~150MB

## 🔒 Segurança

### Medidas Implementadas
- ✅ **Usuário não-root** nos containers
- ✅ **Secrets** via variáveis de ambiente
- ✅ **Network isolation** entre containers
- ✅ **Read-only** filesystem onde possível
- ✅ **Health checks** para monitoramento

## 📚 Comandos Make Disponíveis

```bash
make help          # Mostra todos os comandos
make build         # Constrói imagem de produção
make up            # Inicia serviços em produção
make down          # Para serviços em produção
make dev-build     # Constrói imagem de desenvolvimento
make dev-up        # Inicia serviços em desenvolvimento
make dev-down      # Para serviços em desenvolvimento
make migrate       # Executa migrações em produção
make migrate-dev   # Executa migrações em desenvolvimento
make logs          # Mostra logs de produção
make dev-logs      # Mostra logs de desenvolvimento
make clean         # Remove tudo (containers, volumes, imagens)
make status        # Mostra status dos containers
make test          # Executa testes
make lint          # Executa linting
make restart       # Reinicia serviços de produção
make restart-dev   # Reinicia serviços de desenvolvimento
```

## 🎯 Próximos Passos

1. **Configurar CI/CD** com GitHub Actions
2. **Adicionar monitoring** com Prometheus/Grafana
3. **Implementar load balancer** com Nginx
4. **Configurar backup** automático do banco
5. **Adicionar SSL/TLS** com Let's Encrypt
