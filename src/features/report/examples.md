# 📊 Exemplos de Uso da Feature de Relatórios

Este arquivo contém exemplos práticos de como usar a feature de relatórios e estatísticas.

## 🚀 Inicialização Rápida

### 1. Dashboard de Estatísticas
```bash
# Obter estatísticas gerais do sistema
curl -X GET "http://localhost:3000/reports/dashboard/stats"

# Estatísticas de uma loja específica
curl -X GET "http://localhost:3000/reports/dashboard/stats?storeId=store123"

# Estatísticas do último mês
curl -X GET "http://localhost:3000/reports/dashboard/stats?period=month&startDate=2024-01-01&endDate=2024-01-31"
```

### 2. Relatório de Inventário
```bash
# Listar todos os produtos
curl -X GET "http://localhost:3000/reports/inventory"

# Produtos com estoque baixo
curl -X GET "http://localhost:3000/reports/inventory?lowStock=true"

# Produtos de uma categoria específica
curl -X GET "http://localhost:3000/reports/inventory?categoryId=cat123"

# Ordenar por valor total (decrescente)
curl -X GET "http://localhost:3000/reports/inventory?sortBy=value&sortOrder=desc"

# Paginação
curl -X GET "http://localhost:3000/reports/inventory?page=2&limit=50"
```

### 3. Relatório de Movimentações
```bash
# Todas as movimentações
curl -X GET "http://localhost:3000/reports/movements"

# Apenas entradas
curl -X GET "http://localhost:3000/reports/movements?type=ENTRADA"

# Movimentações de um produto específico
curl -X GET "http://localhost:3000/reports/movements?productId=prod123"

# Movimentações de um período
curl -X GET "http://localhost:3000/reports/movements?startDate=2024-01-01&endDate=2024-01-31"
```

### 4. Relatório Financeiro
```bash
# Relatório financeiro do último mês
curl -X GET "http://localhost:3000/reports/financial?startDate=2024-01-01&endDate=2024-01-31"

# Agrupado por semana
curl -X GET "http://localhost:3000/reports/financial?groupBy=week&startDate=2024-01-01&endDate=2024-01-31"

# Relatório financeiro de uma loja
curl -X GET "http://localhost:3000/reports/financial?storeId=store123&startDate=2024-01-01&endDate=2024-01-31"
```

### 5. Relatório de Categorias
```bash
# Todas as categorias
curl -X GET "http://localhost:3000/reports/categories"

# Incluindo subcategorias
curl -X GET "http://localhost:3000/reports/categories?includeSubcategories=true"

# Categorias de uma loja específica
curl -X GET "http://localhost:3000/reports/categories?storeId=store123"
```

### 6. Relatório de Fornecedores
```bash
# Todos os fornecedores
curl -X GET "http://localhost:3000/reports/suppliers"

# Apenas fornecedores ativos
curl -X GET "http://localhost:3000/reports/suppliers?status=active"

# Fornecedores de uma loja
curl -X GET "http://localhost:3000/reports/suppliers?storeId=store123"
```

### 7. Relatório de Atividade de Usuários
```bash
# Todas as atividades
curl -X GET "http://localhost:3000/reports/user-activity"

# Atividades de um usuário específico
curl -X GET "http://localhost:3000/reports/user-activity?userId=user123"

# Apenas criações
curl -X GET "http://localhost:3000/reports/user-activity?action=CREATE"

# Atividades de um período
curl -X GET "http://localhost:3000/reports/user-activity?startDate=2024-01-01&endDate=2024-01-31"
```

### 8. Relatório de Alertas de Estoque
```bash
# Todos os alertas
curl -X GET "http://localhost:3000/reports/stock-alerts"

# Apenas alertas de estoque baixo
curl -X GET "http://localhost:3000/reports/stock-alerts?alertType=low"

# Alertas de uma loja específica
curl -X GET "http://localhost:3000/reports/stock-alerts?storeId=store123"
```

## 📤 Exportação de Relatórios

### 1. Exportar para CSV
```bash
# Exportar inventário para CSV
curl -X GET "http://localhost:3000/reports/export?reportType=inventory&format=csv"

# Exportar movimentações para CSV com filtros
curl -X GET "http://localhost:3000/reports/export?reportType=movement&format=csv&storeId=store123&startDate=2024-01-01&endDate=2024-01-31"
```

### 2. Exportar para Excel
```bash
# Exportar relatório financeiro para Excel
curl -X GET "http://localhost:3000/reports/export?reportType=financial&format=xlsx&startDate=2024-01-01&endDate=2024-01-31"
```

### 3. Exportar para PDF
```bash
# Exportar alertas de estoque para PDF
curl -X GET "http://localhost:3000/reports/export?reportType=stock-alert&format=pdf&alertType=low"
```

## 📅 Agendamento de Relatórios

### 1. Agendar Relatório Diário
```bash
curl -X POST "http://localhost:3000/reports/schedule" \
  -H "Content-Type: application/json" \
  -d '{
    "reportType": "inventory",
    "schedule": {
      "frequency": "daily",
      "time": "09:00"
    },
    "filters": {
      "storeId": "store123",
      "lowStock": true
    },
    "emailRecipients": ["admin@example.com", "manager@example.com"]
  }'
```

### 2. Agendar Relatório Semanal
```bash
curl -X POST "http://localhost:3000/reports/schedule" \
  -H "Content-Type: application/json" \
  -d '{
    "reportType": "financial",
    "schedule": {
      "frequency": "weekly",
      "time": "08:00",
      "dayOfWeek": 1
    },
    "filters": {
      "startDate": "2024-01-01",
      "endDate": "2024-12-31"
    },
    "emailRecipients": ["finance@example.com"]
  }'
```

### 3. Agendar Relatório Mensal
```bash
curl -X POST "http://localhost:3000/reports/schedule" \
  -H "Content-Type: application/json" \
  -d '{
    "reportType": "movement",
    "schedule": {
      "frequency": "monthly",
      "time": "10:00",
      "dayOfMonth": 1
    },
    "filters": {
      "storeId": "store123"
    },
    "emailRecipients": ["operations@example.com"]
  }'
```

### 4. Cancelar Agendamento
```bash
curl -X DELETE "http://localhost:3000/reports/schedule/schedule123"
```

## 📧 Envio por Email

### 1. Enviar Relatório por Email
```bash
curl -X POST "http://localhost:3000/reports/send-email" \
  -H "Content-Type: application/json" \
  -d '{
    "reportType": "inventory",
    "format": "xlsx",
    "data": [
      {
        "id": "prod1",
        "name": "Produto 1",
        "currentStock": 10,
        "totalValue": 100.00
      }
    ],
    "emailRecipients": ["admin@example.com"],
    "subject": "Relatório de Inventário - Janeiro 2024",
    "message": "Segue em anexo o relatório de inventário solicitado."
  }'
```

## 🔧 Utilitários

### 1. Obter Tipos de Relatórios Disponíveis
```bash
curl -X GET "http://localhost:3000/reports/types"
```

### 2. Obter Estatísticas de Relatórios
```bash
curl -X GET "http://localhost:3000/reports/statistics"
```

### 3. Validar Filtros
```bash
curl -X POST "http://localhost:3000/reports/validate-filters" \
  -H "Content-Type: application/json" \
  -d '{
    "filters": {
      "storeId": "store123",
      "startDate": "2024-01-01",
      "endDate": "2024-01-31",
      "page": 1,
      "limit": 50
    }
  }'
```

## 📱 Exemplos com JavaScript/TypeScript

### 1. Dashboard Stats com Fetch
```javascript
async function getDashboardStats(storeId = null, period = 'month') {
  const params = new URLSearchParams();
  if (storeId) params.append('storeId', storeId);
  params.append('period', period);
  
  const response = await fetch(`http://localhost:3000/reports/dashboard/stats?${params}`);
  const data = await response.json();
  
  console.log('Dashboard Stats:', data);
  return data;
}

// Uso
getDashboardStats('store123', 'month');
```

### 2. Relatório de Inventário com Axios
```javascript
import axios from 'axios';

async function getInventoryReport(filters = {}) {
  try {
    const response = await axios.get('http://localhost:3000/reports/inventory', {
      params: {
        storeId: filters.storeId,
        categoryId: filters.categoryId,
        lowStock: filters.lowStock,
        sortBy: filters.sortBy || 'name',
        sortOrder: filters.sortOrder || 'asc',
        page: filters.page || 1,
        limit: filters.limit || 20
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao obter relatório de inventário:', error);
    throw error;
  }
}

// Uso
getInventoryReport({
  storeId: 'store123',
  lowStock: true,
  sortBy: 'value',
  sortOrder: 'desc'
});
```

### 3. Exportar Relatório
```javascript
async function exportReport(reportType, format, filters = {}) {
  try {
    const params = new URLSearchParams();
    params.append('reportType', reportType);
    params.append('format', format);
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await fetch(`http://localhost:3000/reports/export?${params}`);
    const data = await response.json();
    
    if (data.success) {
      // Fazer download do arquivo
      window.open(data.downloadUrl, '_blank');
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao exportar relatório:', error);
    throw error;
  }
}

// Uso
exportReport('inventory', 'xlsx', {
  storeId: 'store123',
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});
```

### 4. Agendar Relatório
```javascript
async function scheduleReport(reportType, schedule, filters, emailRecipients) {
  try {
    const response = await axios.post('http://localhost:3000/reports/schedule', {
      reportType,
      schedule,
      filters,
      emailRecipients
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao agendar relatório:', error);
    throw error;
  }
}

// Uso
scheduleReport(
  'inventory',
  {
    frequency: 'weekly',
    time: '09:00',
    dayOfWeek: 1
  },
  {
    storeId: 'store123',
    lowStock: true
  },
  ['admin@example.com', 'manager@example.com']
);
```

## 🔐 Exemplos com Autenticação

### 1. Com Token JWT
```javascript
const token = 'your-jwt-token';

async function getAuthenticatedReport() {
  const response = await fetch('http://localhost:3000/reports/inventory', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.json();
}
```

### 2. Com Axios e Interceptors
```javascript
import axios from 'axios';

// Configurar interceptor para adicionar token automaticamente
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Agora todas as requisições incluirão o token automaticamente
const report = await axios.get('http://localhost:3000/reports/dashboard/stats');
```

## 📊 Exemplos de Resposta

### Dashboard Stats Response
```json
{
  "overview": {
    "totalProducts": 150,
    "totalCategories": 25,
    "totalSuppliers": 10,
    "totalStores": 3,
    "totalUsers": 15
  },
  "inventory": {
    "totalValue": 125000.50,
    "lowStockItems": 12,
    "outOfStockItems": 3,
    "averageStockValue": 833.34
  },
  "movements": {
    "totalMovements": 450,
    "entries": 200,
    "exits": 180,
    "losses": 70,
    "totalValue": 50000.00
  },
  "recentActivity": {
    "lastMovements": [
      {
        "id": "mov1",
        "type": "ENTRADA",
        "productName": "Produto A",
        "quantity": 50,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "recentProducts": [
      {
        "id": "prod1",
        "name": "Novo Produto",
        "createdAt": "2024-01-15T09:00:00Z"
      }
    ]
  },
  "charts": {
    "movementsByType": [
      { "type": "ENTRADA", "count": 200, "value": 30000.00 },
      { "type": "SAIDA", "count": 180, "value": 25000.00 },
      { "type": "PERDA", "count": 70, "value": 5000.00 }
    ],
    "topProducts": [
      {
        "productId": "prod1",
        "productName": "Produto A",
        "movements": 45,
        "value": 15000.00
      }
    ],
    "movementsByDay": [
      {
        "date": "2024-01-15",
        "entries": 10,
        "exits": 8,
        "losses": 2
      }
    ]
  }
}
```

### Inventory Report Response
```json
{
  "products": [
    {
      "id": "prod1",
      "name": "Produto A",
      "description": "Descrição do produto",
      "category": {
        "id": "cat1",
        "name": "Categoria A"
      },
      "supplier": {
        "id": "sup1",
        "corporateName": "Fornecedor A"
      },
      "currentStock": 25,
      "stockMin": 10,
      "stockMax": 100,
      "unitPrice": 50.00,
      "totalValue": 1250.00,
      "status": true,
      "alertLevel": "normal",
      "lastMovement": "2024-01-15T10:30:00Z"
    }
  ],
  "summary": {
    "totalProducts": 150,
    "totalValue": 125000.50,
    "lowStockCount": 12,
    "outOfStockCount": 3,
    "averageStockValue": 833.34
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## 🚨 Tratamento de Erros

### 1. Erro de Validação
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation error",
  "details": {
    "field": "startDate",
    "message": "Start date cannot be after end date"
  }
}
```

### 2. Erro de Permissão
```json
{
  "statusCode": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions",
  "details": {
    "required": "reports:read",
    "userPermissions": ["reports:export"]
  }
}
```

### 3. Erro de Servidor
```json
{
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "Erro interno do servidor"
}
```

## 💡 Dicas de Uso

1. **Performance**: Use filtros de data para limitar o volume de dados
2. **Paginação**: Sempre use paginação para relatórios grandes
3. **Cache**: As estatísticas do dashboard são cacheadas por 5 minutos
4. **Exportação**: Relatórios exportados expiram em 24 horas
5. **Agendamento**: Relatórios agendados são executados em background
6. **Email**: Configure corretamente os destinatários de email
7. **Permissões**: Verifique as permissões necessárias antes de usar
8. **Validação**: Use o endpoint de validação para verificar filtros
