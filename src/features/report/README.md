# 📊 Feature de Relatórios e Estatísticas

Esta feature fornece um sistema completo de relatórios e estatísticas para o sistema de gestão de estoque, seguindo o padrão CQRS (Command Query Responsibility Segregation).

## 🎯 Funcionalidades

### 📈 Dashboard de Estatísticas
- **Visão Geral**: Contadores de produtos, categorias, fornecedores, lojas e usuários
- **Inventário**: Valor total, itens com estoque baixo, itens sem estoque
- **Movimentações**: Total de movimentações, entradas, saídas e perdas
- **Atividade Recente**: Últimas movimentações e produtos criados
- **Gráficos**: Movimentações por tipo, produtos mais movimentados, movimentações por dia

### 📋 Relatórios Disponíveis

#### 1. **Relatório de Inventário**
- Lista completa de produtos com estoque atual
- Filtros por categoria, fornecedor, status e estoque baixo
- Ordenação por nome, estoque, valor ou categoria
- Alertas de estoque (normal, baixo, alto, sem estoque)

#### 2. **Relatório de Movimentações**
- Histórico completo de movimentações de estoque
- Filtros por loja, produto, fornecedor, tipo e período
- Detalhes de lote, validade, preço e observações
- Informações do usuário que registrou a movimentação

#### 3. **Relatório Financeiro**
- Análise de receitas, custos e lucros
- Agrupamento por dia, semana, mês ou ano
- Breakdown por produto, categoria e fornecedor
- Cálculo de margem de lucro

#### 4. **Relatório de Categorias**
- Estatísticas por categoria de produto
- Inclui subcategorias (opcional)
- Valor total e quantidade de produtos
- Última movimentação por categoria

#### 5. **Relatório de Fornecedores**
- Estatísticas por fornecedor
- Produtos fornecidos e valor total
- Informações de contato dos responsáveis
- Histórico de movimentações

#### 6. **Relatório de Atividade de Usuários**
- Log de auditoria de ações dos usuários
- Filtros por usuário, ação e período
- Detalhes de alterações (antes/depois)
- Usuário mais ativo

#### 7. **Relatório de Alertas de Estoque**
- Produtos com alertas de estoque
- Classificação por severidade (baixa, média, alta, crítica)
- Filtros por tipo de alerta
- Valor total dos produtos com alertas

### 📤 Exportação de Relatórios
- **Formatos Suportados**: CSV, XLSX, PDF
- **Agendamento**: Relatórios automáticos diários, semanais ou mensais
- **Email**: Envio automático por email
- **Download**: URLs de download com expiração

## 🏗️ Arquitetura

### Estrutura de Arquivos
```
src/features/report/
├── commands/
│   └── report.commands.ts      # Operações de escrita (export, schedule, email)
├── queries/
│   └── report.queries.ts       # Operações de leitura (relatórios, estatísticas)
├── report.controller.ts         # Controller principal (padrão funcional)
├── report.interfaces.ts         # Interfaces TypeScript
├── report.routes.ts             # Rotas sem middleware
├── report.routes.with-middleware.ts # Rotas com autenticação/autorização
├── report.schema.ts             # Schemas de validação
├── report.service.ts            # Service layer
└── README.md                    # Documentação
```

### Padrão CQRS
- **Commands**: Operações que modificam dados (export, schedule, email)
- **Queries**: Operações que apenas leem dados (relatórios, estatísticas)
- **Controller**: Objeto com funções (padrão funcional obrigatório)

## 🚀 Endpoints da API

### Dashboard
- `GET /reports/dashboard/stats` - Estatísticas do dashboard

### Relatórios
- `GET /reports/inventory` - Relatório de inventário
- `GET /reports/movements` - Relatório de movimentações
- `GET /reports/financial` - Relatório financeiro
- `GET /reports/categories` - Relatório de categorias
- `GET /reports/suppliers` - Relatório de fornecedores
- `GET /reports/user-activity` - Relatório de atividade de usuários
- `GET /reports/stock-alerts` - Relatório de alertas de estoque

### Exportação
- `GET /reports/export` - Exportar relatório
- `GET /reports/download/:exportId` - Download de relatório

### Agendamento
- `POST /reports/schedule` - Agendar relatório
- `DELETE /reports/schedule/:scheduleId` - Cancelar agendamento

### Email
- `POST /reports/send-email` - Enviar relatório por email

### Utilitários
- `GET /reports/types` - Tipos de relatórios disponíveis
- `GET /reports/statistics` - Estatísticas de relatórios
- `POST /reports/validate-filters` - Validar filtros

## 🔐 Permissões Necessárias

### Permissões Básicas
- `reports:read` - Ler relatórios
- `reports:export` - Exportar relatórios
- `reports:schedule` - Agendar relatórios

### Permissões Específicas
- `financial:read` - Relatórios financeiros
- `audit:read` - Relatórios de auditoria

### Permissões Granulares
- `reports:read` - Leitura de relatórios
- `reports:export` - Exportação de relatórios
- `reports:schedule` - Agendamento de relatórios

## 📝 Exemplos de Uso

### Dashboard Stats
```typescript
GET /reports/dashboard/stats?storeId=123&period=month&startDate=2024-01-01&endDate=2024-01-31
```

### Inventory Report
```typescript
GET /reports/inventory?storeId=123&categoryId=456&lowStock=true&sortBy=value&sortOrder=desc&page=1&limit=50
```

### Movement Report
```typescript
GET /reports/movements?storeId=123&type=ENTRADA&startDate=2024-01-01&endDate=2024-01-31&page=1&limit=100
```

### Export Report
```typescript
GET /reports/export?reportType=inventory&format=xlsx&storeId=123&startDate=2024-01-01&endDate=2024-01-31
```

### Schedule Report
```typescript
POST /reports/schedule
{
  "reportType": "inventory",
  "schedule": {
    "frequency": "weekly",
    "time": "09:00",
    "dayOfWeek": 1
  },
  "filters": {
    "storeId": "123",
    "lowStock": true
  },
  "emailRecipients": ["admin@example.com"]
}
```

## 🔧 Configuração

### Middleware
Para usar as rotas com autenticação e autorização, registre as rotas com middleware:

```typescript
await fastify.register(ReportRoutesWithMiddleware, { prefix: '/reports' })
```

Para rotas sem middleware (desenvolvimento/teste):

```typescript
await fastify.register(ReportRoutes, { prefix: '/reports' })
```

### Dependências
- Prisma Client para acesso ao banco de dados
- Fastify para framework web
- Validação de schemas com JSON Schema

## 📊 Performance

### Otimizações Implementadas
- Paginação em todos os relatórios
- Índices de banco de dados otimizados
- Queries eficientes com Prisma
- Cache de estatísticas (implementação futura)

### Limites
- Máximo de 1000 registros por página
- Timeout de 30 segundos para relatórios complexos
- Cache de 5 minutos para estatísticas do dashboard

## 🚧 Melhorias Futuras

### Funcionalidades Planejadas
- [ ] Cache Redis para estatísticas
- [ ] Relatórios em tempo real com WebSockets
- [ ] Dashboards personalizáveis
- [ ] Alertas automáticos por email
- [ ] Integração com BI tools (Power BI, Tableau)
- [ ] Relatórios comparativos entre períodos
- [ ] Análise de tendências e previsões

### Otimizações
- [ ] Background jobs para relatórios pesados
- [ ] Compressão de arquivos exportados
- [ ] Streaming de dados para relatórios grandes
- [ ] Índices de banco de dados otimizados

## 🐛 Troubleshooting

### Problemas Comuns
1. **Timeout em relatórios grandes**: Use filtros de data mais específicos
2. **Erro de permissão**: Verifique se o usuário tem as permissões necessárias
3. **Export falha**: Verifique se o formato é suportado e os dados existem

### Logs
Todos os erros são logados com `request.log.error()` para facilitar o debug.

## 📚 Documentação Adicional

- [Guia de Estrutura de Controller com CQRS](../../../docs/controller-structure.md)
- [Padrões de Autenticação e Autorização](../../../docs/auth-patterns.md)
- [Schemas de Validação](../../../docs/validation-schemas.md)
