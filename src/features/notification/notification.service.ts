
const URI = '/notification';

// === INTERFACES ===
export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'STOCK_ALERT' | 'MOVEMENT' | 'PERMISSION' | 'SYSTEM';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    isRead: boolean;
    readAt: string | null;
    data: any;
    actionUrl: string | null;
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        name: string | null;
        email: string;
    };
}

export interface NotificationCreateRequest {
    userId: string;
    title: string;
    message: string;
    type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'STOCK_ALERT' | 'MOVEMENT' | 'PERMISSION' | 'SYSTEM';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    data?: any;
    actionUrl?: string;
    expiresAt?: string;
}

export interface NotificationUpdateRequest {
    title?: string;
    message?: string;
    type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'STOCK_ALERT' | 'MOVEMENT' | 'PERMISSION' | 'SYSTEM';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    data?: any;
    actionUrl?: string;
    expiresAt?: string;
}

export interface NotificationListResponse {
    items: Notification[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface NotificationStats {
    total: number;
    unread: number;
    read: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
}

export const NotificationService = {
    // === CRUD BÁSICO ===
    create: (data: NotificationCreateRequest): Promise<Notification> =>
        fetchAuth(URI, { method: "POST", data }),

    list: (params?: {
        page?: number;
        limit?: number;
        search?: string;
        type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'STOCK_ALERT' | 'MOVEMENT' | 'PERMISSION' | 'SYSTEM';
        priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
        isRead?: boolean;
        userId?: string;
    }): Promise<NotificationListResponse> =>
        fetchAuth(URI, { method: "GET", params }),

    single: (id: string): Promise<Notification> =>
        fetchAuth(`${URI}/${id}`, { method: "GET" }),

    update: (id: string, data: NotificationUpdateRequest): Promise<Notification> =>
        fetchAuth(`${URI}/${id}`, { method: "PUT", data }),

    delete: (id: string): Promise<void> =>
        fetchAuth(`${URI}/${id}`, { method: "DELETE" }),

    // === CONSULTAS ESPECÍFICAS ===
    getByUser: (userId: string, params?: {
        page?: number;
        limit?: number;
        isRead?: boolean;
        type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'STOCK_ALERT' | 'MOVEMENT' | 'PERMISSION' | 'SYSTEM';
    }): Promise<NotificationListResponse> =>
        fetchAuth(`${URI}/user/${userId}`, { method: "GET", params }),

    getUnread: (userId: string, limit?: number): Promise<{ notifications: Notification[] }> =>
        fetchAuth(`${URI}/user/${userId}/unread`, { method: "GET", params: { limit } }),

    getByType: (type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'STOCK_ALERT' | 'MOVEMENT' | 'PERMISSION' | 'SYSTEM', limit?: number): Promise<{ notifications: Notification[] }> =>
        fetchAuth(`${URI}/type/${type}`, { method: "GET", params: { limit } }),

    getByPriority: (priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT', limit?: number): Promise<{ notifications: Notification[] }> =>
        fetchAuth(`${URI}/priority/${priority}`, { method: "GET", params: { limit } }),

    getRecent: (userId: string, days?: number, limit?: number): Promise<{ notifications: Notification[] }> =>
        fetchAuth(`${URI}/user/${userId}/recent`, { method: "GET", params: { days, limit } }),

    getStats: (userId?: string): Promise<NotificationStats> =>
        fetchAuth(`${URI}/stats`, { method: "GET", params: { userId } }),

    search: (term: string, limit?: number): Promise<{ notifications: Notification[] }> =>
        fetchAuth(`${URI}/search`, { method: "GET", params: { q: term, limit } }),

    // === COMANDOS ESPECÍFICOS ===
    markAsRead: (id: string): Promise<Notification> =>
        fetchAuth(`${URI}/${id}/read`, { method: "PATCH" }),

    markAsUnread: (id: string): Promise<Notification> =>
        fetchAuth(`${URI}/${id}/unread`, { method: "PATCH" }),

    markAllAsRead: (userId: string): Promise<{ success: boolean; count: number }> =>
        fetchAuth(`${URI}/mark-all-read`, { method: "PATCH", data: { userId } }),

    deleteExpired: (): Promise<{ success: boolean; count: number }> =>
        fetchAuth(`${URI}/expired`, { method: "DELETE" }),

    deleteByUser: (userId: string): Promise<{ success: boolean; count: number }> =>
        fetchAuth(`${URI}/user/${userId}`, { method: "DELETE" }),

    // === UTILITÁRIOS ===
    createStockAlert: (userId: string, productName: string, currentStock: number, minStock: number): Promise<Notification> =>
        NotificationService.create({
            userId,
            title: 'Alerta de Estoque Baixo',
            message: `O produto "${productName}" está com estoque baixo. Atual: ${currentStock}, Mínimo: ${minStock}`,
            type: 'STOCK_ALERT',
            priority: 'HIGH',
            data: {
                productName,
                currentStock,
                minStock,
                alertType: 'LOW_STOCK'
            }
        }),

    createMovementNotification: (userId: string, movementType: 'ENTRADA' | 'SAIDA' | 'PERDA', productName: string, quantity: number): Promise<Notification> => {
        const typeMap = {
            'ENTRADA': 'Sucesso',
            'SAIDA': 'Informação',
            'PERDA': 'Aviso'
        };

        return NotificationService.create({
            userId,
            title: `Movimentação de Estoque - ${typeMap[movementType]}`,
            message: `${movementType === 'ENTRADA' ? 'Entrada' : movementType === 'SAIDA' ? 'Saída' : 'Perda'} de ${quantity} unidades do produto "${productName}"`,
            type: 'MOVEMENT',
            priority: movementType === 'PERDA' ? 'HIGH' : 'MEDIUM',
            data: {
                movementType,
                productName,
                quantity,
                timestamp: new Date().toISOString()
            }
        });
    },

    createPermissionNotification: (userId: string, action: string, resource: string): Promise<Notification> =>
        NotificationService.create({
            userId,
            title: 'Alteração de Permissão',
            message: `Sua permissão para "${action}" em "${resource}" foi alterada`,
            type: 'PERMISSION',
            priority: 'MEDIUM',
            data: {
                action,
                resource,
                timestamp: new Date().toISOString()
            }
        }),

    createSystemNotification: (userId: string, title: string, message: string, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM'): Promise<Notification> =>
        NotificationService.create({
            userId,
            title,
            message,
            type: 'SYSTEM',
            priority,
            data: {
                timestamp: new Date().toISOString()
            }
        }),

    // === MÉTODOS AVANÇADOS ===
    getUnreadCount: (userId: string): Promise<number> =>
        NotificationService.getStats(userId).then(stats => stats.unread),

    getNotificationsByDateRange: (userId: string, startDate: Date, endDate: Date, limit?: number): Promise<{ notifications: Notification[] }> => {
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        return NotificationService.getRecent(userId, days, limit);
    },

    markAllAsReadByType: (userId: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'STOCK_ALERT' | 'MOVEMENT' | 'PERMISSION' | 'SYSTEM'): Promise<{ success: boolean; count: number }> => {
        // Primeiro busca as notificações não lidas do tipo específico
        return NotificationService.getByUser(userId, { isRead: false, type })
            .then(response => {
                const unreadIds = response.items.map(notification => notification.id);
                if (unreadIds.length === 0) {
                    return { success: true, count: 0 };
                }
                
                // Marca todas como lidas
                const promises = unreadIds.map(id => NotificationService.markAsRead(id));
                return Promise.all(promises).then(() => ({ success: true, count: unreadIds.length }));
            });
    },

    getNotificationSummary: (userId: string): Promise<{
        total: number;
        unread: number;
        byType: Record<string, number>;
        recent: Notification[];
    }> =>
        Promise.all([
            NotificationService.getStats(userId),
            NotificationService.getRecent(userId, 7, 5)
        ]).then(([stats, recentResponse]) => ({
            total: stats.total,
            unread: stats.unread,
            byType: stats.byType,
            recent: recentResponse.notifications
        }))
};
