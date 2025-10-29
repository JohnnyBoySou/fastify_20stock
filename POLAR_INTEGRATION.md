# Integração Polar.sh - Documentação

## Variáveis de Ambiente Necessárias

Adicione ao seu arquivo `.env`:

```env
# Polar.sh Configuration
POLAR_API_KEY=your_polar_api_key_here
POLAR_WEBHOOK_SECRET=your_webhook_secret_here
POLAR_ENV=sandbox  # ou 'production' para produção
POLAR_BASE_URL=https://sandbox-api.polar.sh/v1  # Opcional, padrão baseado em POLAR_ENV
POLAR_SUCCESS_URL=https://yourapp.com/payment/success  # URL de sucesso do checkout
POLAR_CANCEL_URL=https://yourapp.com/payment/cancel  # URL de cancelamento do checkout
```

## URL Base da API

- **Sandbox**: `https://sandbox-api.polar.sh/v1`
- **Production**: `https://api.polar.sh/v1`

## Endpoint de Webhook

Configure no dashboard do Polar o endpoint:
```
POST https://yourapp.com/webhooks/polar
```

## Funcionalidades Implementadas

### ✅ Concluído
1. SDK e tipos TypeScript para API Polar
2. PolarService implementando PaymentGateway
3. Integração com PaymentService
4. Schema Prisma atualizado (campos polarProductId, polarCustomerId, polarSubscriptionId, polarInvoiceId)
5. Webhook handler com mapeamento de eventos
6. Endpoint POST /webhooks/polar
7. Handlers de webhook usando InvoiceCommands e CustomerCommands

### ⏳ Pendente (próximas iterações)
1. Sincronização Plan ↔ Polar Product
2. Sincronização Customer ↔ Polar Subscription  
3. Feature completa de Checkout
4. Testes em sandbox

## Fluxo de Webhooks

Os seguintes eventos do Polar são mapeados automaticamente:

| Evento Polar | Evento Padronizado | Ação |
|-------------|-------------------|------|
| `checkout.succeeded` | `payment.completed` | Marca invoice como paga |
| `checkout.expired` | `payment.cancelled` | Cancela pagamento |
| `subscription.created` | `subscription.created` | Atualiza status do customer |
| `subscription.updated` | `subscription.updated` | Atualiza status do customer |
| `subscription.canceled` | `subscription.cancelled` | Cancela assinatura |
| `invoice.paid` | `invoice.paid` | Marca invoice como paga e renova subscription |
| `invoice.payment_failed` | `invoice.failed` | Marca invoice como falhada |

## Próximos Passos

1. Configurar conta Polar.sh no dashboard
2. Obter API Key e Webhook Secret
3. Configurar variáveis de ambiente
4. Executar migration do Prisma: `npx prisma migrate dev`
5. Testar webhook em sandbox
6. Implementar sincronização bidirecional de Planos e Customers

