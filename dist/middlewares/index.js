"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireTimeBasedPermission = exports.requireResourcePermission = exports.requireGranularPermission = exports.GranularPermissionService = exports.requireStoreResourceAccess = exports.requireStoreUserManagement = exports.requireStoreRoleAccess = exports.requireStoreAccess = exports.requireOwnership = exports.requireStoreRole = exports.requireAnyPermission = exports.requireAllPermissions = exports.requirePermission = exports.requireRole = exports.hasStoreRole = exports.hasRole = exports.hasPermission = exports.Action = exports.StoreRole = exports.UserRole = exports.optionalAuthMiddleware = exports.authMiddleware = void 0;
// Auth middlewares
var auth_middleware_1 = require("./auth.middleware");
Object.defineProperty(exports, "authMiddleware", { enumerable: true, get: function () { return auth_middleware_1.authMiddleware; } });
Object.defineProperty(exports, "optionalAuthMiddleware", { enumerable: true, get: function () { return auth_middleware_1.optionalAuthMiddleware; } });
// Authorization middlewares
var authorization_middleware_1 = require("./authorization.middleware");
Object.defineProperty(exports, "UserRole", { enumerable: true, get: function () { return authorization_middleware_1.UserRole; } });
Object.defineProperty(exports, "StoreRole", { enumerable: true, get: function () { return authorization_middleware_1.StoreRole; } });
Object.defineProperty(exports, "Action", { enumerable: true, get: function () { return authorization_middleware_1.Action; } });
Object.defineProperty(exports, "hasPermission", { enumerable: true, get: function () { return authorization_middleware_1.hasPermission; } });
Object.defineProperty(exports, "hasRole", { enumerable: true, get: function () { return authorization_middleware_1.hasRole; } });
Object.defineProperty(exports, "hasStoreRole", { enumerable: true, get: function () { return authorization_middleware_1.hasStoreRole; } });
Object.defineProperty(exports, "requireRole", { enumerable: true, get: function () { return authorization_middleware_1.requireRole; } });
Object.defineProperty(exports, "requirePermission", { enumerable: true, get: function () { return authorization_middleware_1.requirePermission; } });
Object.defineProperty(exports, "requireAllPermissions", { enumerable: true, get: function () { return authorization_middleware_1.requireAllPermissions; } });
Object.defineProperty(exports, "requireAnyPermission", { enumerable: true, get: function () { return authorization_middleware_1.requireAnyPermission; } });
Object.defineProperty(exports, "requireStoreRole", { enumerable: true, get: function () { return authorization_middleware_1.requireStoreRole; } });
Object.defineProperty(exports, "requireOwnership", { enumerable: true, get: function () { return authorization_middleware_1.requireOwnership; } });
// Store access middlewares
var store_access_middleware_1 = require("./store-access.middleware");
Object.defineProperty(exports, "requireStoreAccess", { enumerable: true, get: function () { return store_access_middleware_1.requireStoreAccess; } });
Object.defineProperty(exports, "requireStoreRoleAccess", { enumerable: true, get: function () { return store_access_middleware_1.requireStoreRoleAccess; } });
Object.defineProperty(exports, "requireStoreUserManagement", { enumerable: true, get: function () { return store_access_middleware_1.requireStoreUserManagement; } });
Object.defineProperty(exports, "requireStoreResourceAccess", { enumerable: true, get: function () { return store_access_middleware_1.requireStoreResourceAccess; } });
var granular_permissions_middleware_1 = require("./granular-permissions.middleware");
Object.defineProperty(exports, "GranularPermissionService", { enumerable: true, get: function () { return granular_permissions_middleware_1.GranularPermissionService; } });
Object.defineProperty(exports, "requireGranularPermission", { enumerable: true, get: function () { return granular_permissions_middleware_1.requireGranularPermission; } });
Object.defineProperty(exports, "requireResourcePermission", { enumerable: true, get: function () { return granular_permissions_middleware_1.requireResourcePermission; } });
Object.defineProperty(exports, "requireTimeBasedPermission", { enumerable: true, get: function () { return granular_permissions_middleware_1.requireTimeBasedPermission; } });
