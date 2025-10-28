import { db } from '@/plugins/prisma';
import { NotificationCommands } from '@/features/notification/commands/notification.commands';
import { TriggerHandler } from '@/services/workflow-engine/trigger-handler.service';

export interface StockAlertData {
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
  currentStock: number;
  stockMin: number;
  stockMax: number;
  alertPercentage: number;
  previousStock: number;
  movementType: 'ENTRADA' | 'SAIDA' | 'PERDA';
  movementQuantity: number;
  movementId: string;
}

export interface StockAlertResult {
  alertTriggered: boolean;
  alertType: 'LOW_STOCK' | 'CRITICAL_STOCK' | 'OVERSTOCK' | 'STOCK_RECOVERED' | null;
  notification?: any;
  message?: string;
}

export class StockAlertService {
  /**
   * Verifica se uma movimentação deve gerar alertas de estoque
   */
  static async checkStockAlerts(
    productId: string,
    storeId: string,
    movementType: 'ENTRADA' | 'SAIDA' | 'PERDA',
    movementQuantity: number,
    movementId: string
  ): Promise<StockAlertResult> {
    try {
      // Buscar informações do produto e loja
      const product = await db.product.findFirst({
        where: {
          id: productId,
          storeId: storeId,
          status: true
        },
        include: {
          store: {
            select: {
              id: true,
              name: true,
              ownerId: true,
              users: {
                select: {
                  userId: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!product) {
        throw new Error('Product not found');
      }

      // Calcular estoque atual baseado nas movimentações
      const movements = await db.movement.findMany({
        where: { 
          productId,
          cancelled: false
        },
        select: {
          type: true,
          quantity: true
        }
      });

      let currentStock = 0;
      movements.forEach(movement => {
        if (movement.type === 'ENTRADA') {
          currentStock += movement.quantity;
        } else {
          currentStock -= movement.quantity;
        }
      });

      // Calcular estoque anterior (antes desta movimentação)
      const previousStock = movementType === 'ENTRADA' 
        ? currentStock - movementQuantity 
        : currentStock + movementQuantity;

      // Determinar tipo de alerta
      const alertType = this.determineAlertType(
        currentStock,
        previousStock,
        product.stockMin,
        product.stockMax,
        product.alertPercentage
      );

      if (!alertType) {
        return {
          alertTriggered: false,
          alertType: null
        };
      }

      // Criar dados do alerta
      const alertData: StockAlertData = {
        productId: product.id,
        productName: product.name,
        storeId: product.store.id,
        storeName: product.store.name,
        currentStock,
        stockMin: product.stockMin,
        stockMax: product.stockMax,
        alertPercentage: product.alertPercentage,
        previousStock,
        movementType,
        movementQuantity,
        movementId
      };

      // Criar notificações para usuários da loja
      const notifications = await this.createStockAlertNotifications(alertData, alertType, product.store);

      // Disparar workflows baseados em alertas de estoque
      try {
        if (alertType === 'LOW_STOCK' || alertType === 'CRITICAL_STOCK') {
          await TriggerHandler.handleStockBelowMin(product);
        } else if (alertType === 'OVERSTOCK') {
          await TriggerHandler.handleStockAboveMax(product);
        }
      } catch (error) {
        console.error('Error triggering workflows for stock alert:', error);
        // Não falhar o alerta se houver erro nos workflows
      }

      return {
        alertTriggered: true,
        alertType,
        notification: notifications[0], // Retorna a primeira notificação como exemplo
        message: this.generateAlertMessage(alertData, alertType)
      };

    } catch (error) {
      console.error('Error checking stock alerts:', error);
      return {
        alertTriggered: false,
        alertType: null
      };
    }
  }

  /**
   * Determina o tipo de alerta baseado no estoque atual e anterior
   */
  private static determineAlertType(
    currentStock: number,
    previousStock: number,
    stockMin: number,
    stockMax: number,
    alertPercentage: number
  ): 'LOW_STOCK' | 'CRITICAL_STOCK' | 'OVERSTOCK' | 'STOCK_RECOVERED' | null {
    
    // Calcular limite de alerta baseado na porcentagem
    const alertThreshold = Math.round(stockMin * (alertPercentage / 100));
    
    // Estoque crítico (zero ou negativo)
    if (currentStock <= 0) {
      return 'CRITICAL_STOCK';
    }
    
    // Estoque baixo (abaixo do limite de alerta)
    if (currentStock <= alertThreshold && currentStock > 0) {
      return 'LOW_STOCK';
    }
    
    // Estoque recuperado (voltou acima do limite de alerta)
    if (currentStock > alertThreshold && previousStock <= alertThreshold) {
      return 'STOCK_RECOVERED';
    }
    
    // Estoque excessivo (acima do máximo)
    if (currentStock > stockMax && previousStock <= stockMax) {
      return 'OVERSTOCK';
    }
    
    return null;
  }

  /**
   * Cria notificações para usuários da loja
   */
  private static async createStockAlertNotifications(
    alertData: StockAlertData,
    alertType: 'LOW_STOCK' | 'CRITICAL_STOCK' | 'OVERSTOCK' | 'STOCK_RECOVERED',
    store: any
  ): Promise<any[]> {
    const notifications = [];
    
    // Determinar prioridade e tipo da notificação
    const { priority, notificationType } = this.getNotificationConfig(alertType);
    
    // Criar notificação para o dono da loja
    const ownerNotification = await NotificationCommands.create({
      userId: store.ownerId,
      title: this.getAlertTitle(alertType),
      message: this.generateAlertMessage(alertData, alertType),
      type: notificationType,
      priority,
      data: {
        productId: alertData.productId,
        productName: alertData.productName,
        storeId: alertData.storeId,
        storeName: alertData.storeName,
        currentStock: alertData.currentStock,
        stockMin: alertData.stockMin,
        stockMax: alertData.stockMax,
        movementType: alertData.movementType,
        movementQuantity: alertData.movementQuantity,
        movementId: alertData.movementId,
        alertType
      },
      actionUrl: `/products/${alertData.productId}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
    });
    
    notifications.push(ownerNotification);
    
    // Criar notificações para usuários da loja (exceto o dono)
    const storeUsers = store.users.filter((su: any) => su.userId !== store.ownerId);
    
    for (const storeUser of storeUsers) {
      const userNotification = await NotificationCommands.create({
        userId: storeUser.userId,
        title: this.getAlertTitle(alertType),
        message: this.generateAlertMessage(alertData, alertType),
        type: notificationType,
        priority,
        data: {
          productId: alertData.productId,
          productName: alertData.productName,
          storeId: alertData.storeId,
          storeName: alertData.storeName,
          currentStock: alertData.currentStock,
          stockMin: alertData.stockMin,
          stockMax: alertData.stockMax,
          movementType: alertData.movementType,
          movementQuantity: alertData.movementQuantity,
          movementId: alertData.movementId,
          alertType
        },
        actionUrl: `/products/${alertData.productId}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
      });
      
      notifications.push(userNotification);
    }
    
    return notifications;
  }

  /**
   * Obtém configuração de notificação baseada no tipo de alerta
   */
  private static getNotificationConfig(alertType: string): { priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT', notificationType: 'STOCK_ALERT' | 'WARNING' | 'ERROR' } {
    switch (alertType) {
      case 'CRITICAL_STOCK':
        return { priority: 'URGENT', notificationType: 'ERROR' };
      case 'LOW_STOCK':
        return { priority: 'HIGH', notificationType: 'WARNING' };
      case 'OVERSTOCK':
        return { priority: 'MEDIUM', notificationType: 'WARNING' };
      case 'STOCK_RECOVERED':
        return { priority: 'LOW', notificationType: 'STOCK_ALERT' };
      default:
        return { priority: 'MEDIUM', notificationType: 'STOCK_ALERT' };
    }
  }

  /**
   * Gera título do alerta
   */
  private static getAlertTitle(alertType: string): string {
    switch (alertType) {
      case 'CRITICAL_STOCK':
        return '🚨 Estoque Crítico';
      case 'LOW_STOCK':
        return '⚠️ Estoque Baixo';
      case 'OVERSTOCK':
        return '📦 Estoque Excessivo';
      case 'STOCK_RECOVERED':
        return '✅ Estoque Recuperado';
      default:
        return '📊 Alerta de Estoque';
    }
  }

  /**
   * Gera mensagem do alerta
   */
  private static generateAlertMessage(alertData: StockAlertData, alertType: string): string {
    const { productName, currentStock, stockMin, stockMax, movementType, movementQuantity } = alertData;
    
    switch (alertType) {
      case 'CRITICAL_STOCK':
        return `Produto "${productName}" está com estoque crítico (${currentStock} unidades). Movimentação de ${movementType.toLowerCase()} de ${movementQuantity} unidades realizada.`;
      
      case 'LOW_STOCK':
        return `Produto "${productName}" está com estoque baixo (${currentStock} unidades). Estoque mínimo: ${stockMin} unidades. Movimentação de ${movementType.toLowerCase()} de ${movementQuantity} unidades realizada.`;
      
      case 'OVERSTOCK':
        return `Produto "${productName}" está com estoque excessivo (${currentStock} unidades). Estoque máximo: ${stockMax} unidades. Movimentação de ${movementType.toLowerCase()} de ${movementQuantity} unidades realizada.`;
      
      case 'STOCK_RECOVERED':
        return `Produto "${productName}" recuperou o estoque (${currentStock} unidades). Estoque mínimo: ${stockMin} unidades. Movimentação de ${movementType.toLowerCase()} de ${movementQuantity} unidades realizada.`;
      
      default:
        return `Alerta de estoque para o produto "${productName}" (${currentStock} unidades).`;
    }
  }

  /**
   * Verifica produtos com estoque baixo em uma loja
   */
  static async checkLowStockProducts(storeId: string): Promise<any[]> {
    try {
      const products = await db.product.findMany({
        where: {
          storeId,
          status: true
        },
        include: {
          store: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      const lowStockProducts = [];

      for (const product of products) {
        // Calcular estoque atual
        const movements = await db.movement.findMany({
          where: { 
            productId: product.id,
            cancelled: false
          },
          select: {
            type: true,
            quantity: true
          }
        });

        let currentStock = 0;
        movements.forEach(movement => {
          if (movement.type === 'ENTRADA') {
            currentStock += movement.quantity;
          } else {
            currentStock -= movement.quantity;
          }
        });

        // Calcular limite de alerta
        const alertThreshold = Math.round(product.stockMin * (product.alertPercentage / 100));
        
        if (currentStock <= alertThreshold) {
          lowStockProducts.push({
            productId: product.id,
            productName: product.name,
            currentStock,
            stockMin: product.stockMin,
            stockMax: product.stockMax,
            alertPercentage: product.alertPercentage,
            alertThreshold,
            storeId: product.store.id,
            storeName: product.store.name
          });
        }
      }

      return lowStockProducts;
    } catch (error) {
      console.error('Error checking low stock products:', error);
      return [];
    }
  }

  /**
   * Cria notificação de resumo de estoque baixo
   */
  static async createLowStockSummaryNotification(storeId: string): Promise<any> {
    try {
      const lowStockProducts = await this.checkLowStockProducts(storeId);
      
      if (lowStockProducts.length === 0) {
        return null;
      }

      const store = await db.store.findUnique({
        where: { id: storeId },
        select: {
          id: true,
          name: true,
          ownerId: true,
          users: {
            select: {
              userId: true
            }
          }
        }
      });

      if (!store) {
        throw new Error('Store not found');
      }

      const criticalProducts = lowStockProducts.filter(p => p.currentStock <= 0);
      const lowProducts = lowStockProducts.filter(p => p.currentStock > 0);

      const title = `📊 Resumo de Estoque - ${store.name}`;
      const message = `Encontrados ${lowStockProducts.length} produtos com estoque baixo:\n` +
        `• ${criticalProducts.length} produtos críticos (estoque zero)\n` +
        `• ${lowProducts.length} produtos com estoque baixo\n\n` +
        `Produtos críticos: ${criticalProducts.map(p => p.productName).join(', ')}`;

      return await NotificationCommands.create({
        userId: store.ownerId,
        title,
        message,
        type: 'STOCK_ALERT',
        priority: criticalProducts.length > 0 ? 'URGENT' : 'HIGH',
        data: {
          storeId,
          storeName: store.name,
          lowStockProducts,
          criticalCount: criticalProducts.length,
          lowCount: lowProducts.length
        },
        actionUrl: `/reports/low-stock?storeId=${storeId}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
      });

    } catch (error) {
      console.error('Error creating low stock summary notification:', error);
      return null;
    }
  }
}
