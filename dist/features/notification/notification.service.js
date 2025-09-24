const URI = '/notification';
export const NotificationService = {
    // === CRUD BÁSICO ===
    create: (data) => fetchAuth(URI, { method: "POST", data }),
    list: (params) => fetchAuth(URI, { method: "GET", params }),
    single: (id) => fetchAuth(`${URI}/${id}`, { method: "GET" }),
    update: (id, data) => fetchAuth(`${URI}/${id}`, { method: "PUT", data }),
    delete: (id) => fetchAuth(`${URI}/${id}`, { method: "DELETE" }),
    // === CONSULTAS ESPECÍFICAS ===
    getByUser: (userId, params) => fetchAuth(`${URI}/user/${userId}`, { method: "GET", params }),
    getUnread: (userId, limit) => fetchAuth(`${URI}/user/${userId}/unread`, { method: "GET", params: { limit } }),
    getByType: (type, limit) => fetchAuth(`${URI}/type/${type}`, { method: "GET", params: { limit } }),
    getByPriority: (priority, limit) => fetchAuth(`${URI}/priority/${priority}`, { method: "GET", params: { limit } }),
    getRecent: (userId, days, limit) => fetchAuth(`${URI}/user/${userId}/recent`, { method: "GET", params: { days, limit } }),
    getStats: (userId) => fetchAuth(`${URI}/stats`, { method: "GET", params: { userId } }),
    search: (term, limit) => fetchAuth(`${URI}/search`, { method: "GET", params: { q: term, limit } }),
    // === COMANDOS ESPECÍFICOS ===
    markAsRead: (id) => fetchAuth(`${URI}/${id}/read`, { method: "PATCH" }),
    markAsUnread: (id) => fetchAuth(`${URI}/${id}/unread`, { method: "PATCH" }),
    markAllAsRead: (userId) => fetchAuth(`${URI}/mark-all-read`, { method: "PATCH", data: { userId } }),
    deleteExpired: () => fetchAuth(`${URI}/expired`, { method: "DELETE" }),
    deleteByUser: (userId) => fetchAuth(`${URI}/user/${userId}`, { method: "DELETE" }),
    // === UTILITÁRIOS ===
    createStockAlert: (userId, productName, currentStock, minStock) => NotificationService.create({
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
    createMovementNotification: (userId, movementType, productName, quantity) => {
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
    createPermissionNotification: (userId, action, resource) => NotificationService.create({
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
    createSystemNotification: (userId, title, message, priority = 'MEDIUM') => NotificationService.create({
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
    getUnreadCount: (userId) => NotificationService.getStats(userId).then(stats => stats.unread),
    getNotificationsByDateRange: (userId, startDate, endDate, limit) => {
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        return NotificationService.getRecent(userId, days, limit);
    },
    markAllAsReadByType: (userId, type) => {
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
    getNotificationSummary: (userId) => Promise.all([
        NotificationService.getStats(userId),
        NotificationService.getRecent(userId, 7, 5)
    ]).then(([stats, recentResponse]) => ({
        total: stats.total,
        unread: stats.unread,
        byType: stats.byType,
        recent: recentResponse.notifications
    }))
};
