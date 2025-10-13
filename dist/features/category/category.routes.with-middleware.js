"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutesWithMiddleware = categoryRoutesWithMiddleware;
const category_controller_1 = require("./category.controller");
const category_schema_1 = require("./category.schema");
const middlewares_1 = require("../../middlewares");
const authorization_middleware_1 = require("../../middlewares/authorization.middleware");
async function categoryRoutesWithMiddleware(fastify) {
    // POST /categories - Criar categoria (requer permissão)
    fastify.post('/', {
        schema: category_schema_1.CategorySchemas.create,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.CREATE_CATEGORY)
        ],
        handler: category_controller_1.CategoryController.create
    });
    // GET /categories - Listar categorias (requer permissão)
    fastify.get('/', {
        schema: category_schema_1.CategorySchemas.list,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.READ_CATEGORY)
        ],
        handler: category_controller_1.CategoryController.list
    });
    // GET /categories/:id - Buscar categoria por ID (requer permissão)
    fastify.get('/:id', {
        schema: category_schema_1.CategorySchemas.get,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.READ_CATEGORY)
        ],
        handler: category_controller_1.CategoryController.get
    });
    // PUT /categories/:id - Atualizar categoria (requer permissão)
    fastify.put('/:id', {
        schema: category_schema_1.CategorySchemas.update,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.UPDATE_CATEGORY)
        ],
        handler: category_controller_1.CategoryController.update
    });
    // DELETE /categories/:id - Deletar categoria (requer permissão)
    fastify.delete('/:id', {
        schema: category_schema_1.CategorySchemas.delete,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.DELETE_CATEGORY)
        ],
        handler: category_controller_1.CategoryController.delete
    });
    // PATCH /categories/:id/status - Atualizar status da categoria (requer permissão)
    fastify.patch('/:id/status', {
        schema: category_schema_1.CategorySchemas.updateStatus,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.UPDATE_CATEGORY)
        ],
        handler: category_controller_1.CategoryController.updateStatus
    });
    // PATCH /categories/:id/move - Mover categoria para outro pai (requer permissão)
    fastify.patch('/:id/move', {
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.UPDATE_CATEGORY)
        ],
        handler: category_controller_1.CategoryController.moveToParent
    });
    // GET /categories/active - Listar categorias ativas (requer permissão)
    fastify.get('/active', {
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.READ_CATEGORY)
        ],
        handler: category_controller_1.CategoryController.getActive
    });
    // GET /categories/root - Listar categorias raiz (requer permissão)
    fastify.get('/root', {
        schema: category_schema_1.CategorySchemas.getRoot,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.READ_CATEGORY)
        ],
        handler: category_controller_1.CategoryController.getRootCategories
    });
    // GET /categories/hierarchy - Listar hierarquia de categorias (requer permissão)
    fastify.get('/hierarchy', {
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.READ_CATEGORY)
        ],
        handler: category_controller_1.CategoryController.getHierarchy
    });
    // GET /categories/:id/children - Listar categorias filhas (requer permissão)
    fastify.get('/:id/children', {
        schema: category_schema_1.CategorySchemas.getChildren,
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.READ_CATEGORY)
        ],
        handler: category_controller_1.CategoryController.getChildren
    });
    // GET /categories/code/:code - Buscar categoria por código (requer permissão)
    fastify.get('/code/:code', {
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.READ_CATEGORY)
        ],
        handler: category_controller_1.CategoryController.getByCode
    });
    // GET /categories/search - Buscar categorias (requer permissão)
    fastify.get('/search', {
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.READ_CATEGORY)
        ],
        handler: category_controller_1.CategoryController.search
    });
    // GET /categories/stats - Estatísticas das categorias (requer permissão)
    fastify.get('/stats', {
        preHandler: [
            middlewares_1.authMiddleware,
            (0, middlewares_1.requirePermission)(authorization_middleware_1.Action.READ_CATEGORY)
        ],
        handler: category_controller_1.CategoryController.getStats
    });
}
