import { fetchAuth } from '@/hooks/api';
const URI = '/category';
export const CategoryService = {
    // === CRUD BÁSICO ===
    create: (data) => fetchAuth(URI, { method: "POST", data }),
    list: (params) => fetchAuth(URI, { method: "GET", params }),
    single: (id) => fetchAuth(`${URI}/${id}`, { method: "GET" }),
    update: (id, data) => fetchAuth(`${URI}/${id}`, { method: "PUT", data }),
    delete: (id) => fetchAuth(`${URI}/${id}`, { method: "DELETE" }),
    // === CONSULTAS ESPECÍFICAS ===
    getActive: () => fetchAuth(`${URI}/active`, { method: "GET" }),
    getStats: () => fetchAuth(`${URI}/stats`, { method: "GET" }),
    search: (q, limit) => fetchAuth(`${URI}/search`, { method: "GET", params: { q, limit } }),
    getByCode: (code) => fetchAuth(`${URI}/code/${code}`, { method: "GET" }),
    getRootCategories: (status) => fetchAuth(`${URI}/root`, { method: "GET", params: { status } }),
    getChildren: (id) => fetchAuth(`${URI}/${id}/children`, { method: "GET" }),
    getHierarchy: () => fetchAuth(`${URI}/hierarchy`, { method: "GET" }),
    // === COMANDOS ESPECÍFICOS ===
    updateStatus: (id, status) => fetchAuth(`${URI}/${id}/status`, { method: "PATCH", data: { status } }),
    moveToParent: (id, parentId) => fetchAuth(`${URI}/${id}/move`, { method: "PATCH", data: { parentId } }),
    // === UTILITÁRIOS ===
    toggleStatus: (id) => {
        // Primeiro busca a categoria para obter o status atual
        return fetchAuth(`${URI}/${id}`, { method: "GET" })
            .then((category) => fetchAuth(`${URI}/${id}/status`, {
            method: "PATCH",
            data: { status: !category.status }
        }));
    },
    getCategoryTree: () => {
        // Busca todas as categorias e organiza em árvore
        return fetchAuth(`${URI}/hierarchy`, { method: "GET" })
            .then((response) => response.categories);
    },
    getCategoriesWithProducts: () => {
        // Busca categorias que possuem produtos
        return fetchAuth(URI, { method: "GET", params: { limit: 1000 } })
            .then((response) => response.items.filter(category => category._count.products > 0));
    },
    getLeafCategories: () => {
        // Busca categorias folha (sem filhos)
        return fetchAuth(URI, { method: "GET", params: { limit: 1000 } })
            .then((response) => response.items.filter(category => category._count.children === 0));
    },
    bulkUpdateStatus: (ids, status) => {
        // Atualiza status de múltiplas categorias
        const promises = ids.map(id => fetchAuth(`${URI}/${id}/status`, { method: "PATCH", data: { status } }));
        return Promise.all(promises);
    },
    getCategoryPath: (id) => {
        // Busca o caminho completo de uma categoria (até a raiz)
        return fetchAuth(`${URI}/${id}`, { method: "GET" })
            .then((category) => {
            const path = [category];
            let current = category.parent;
            while (current) {
                path.unshift(current);
                current = current.parent;
            }
            return path;
        });
    }
};
