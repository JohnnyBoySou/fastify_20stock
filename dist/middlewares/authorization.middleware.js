// Define available roles
export var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["ADMIN"] = "admin";
    UserRole["MANAGER"] = "manager";
    UserRole["USER"] = "user";
})(UserRole || (UserRole = {}));
// Define available store roles
export var StoreRole;
(function (StoreRole) {
    StoreRole["OWNER"] = "OWNER";
    StoreRole["ADMIN"] = "ADMIN";
    StoreRole["MANAGER"] = "MANAGER";
    StoreRole["STAFF"] = "STAFF";
})(StoreRole || (StoreRole = {}));
// Define available actions
export var Action;
(function (Action) {
    // User actions
    Action["CREATE_USER"] = "create_user";
    Action["READ_USER"] = "read_user";
    Action["UPDATE_USER"] = "update_user";
    Action["DELETE_USER"] = "delete_user";
    Action["LIST_USERS"] = "list_users";
    // Store actions
    Action["CREATE_STORE"] = "create_store";
    Action["READ_STORE"] = "read_store";
    Action["UPDATE_STORE"] = "update_store";
    Action["DELETE_STORE"] = "delete_store";
    Action["LIST_STORES"] = "list_stores";
    Action["MANAGE_STORE_USERS"] = "manage_store_users";
    // Product actions
    Action["CREATE_PRODUCT"] = "create_product";
    Action["READ_PRODUCT"] = "read_product";
    Action["UPDATE_PRODUCT"] = "update_product";
    Action["DELETE_PRODUCT"] = "delete_product";
    Action["LIST_PRODUCTS"] = "list_products";
    // Category actions
    Action["CREATE_CATEGORY"] = "create_category";
    Action["READ_CATEGORY"] = "read_category";
    Action["UPDATE_CATEGORY"] = "update_category";
    Action["DELETE_CATEGORY"] = "delete_category";
    Action["LIST_CATEGORIES"] = "list_categories";
    // Supplier actions
    Action["CREATE_SUPPLIER"] = "create_supplier";
    Action["READ_SUPPLIER"] = "read_supplier";
    Action["UPDATE_SUPPLIER"] = "update_supplier";
    Action["DELETE_SUPPLIER"] = "delete_supplier";
    Action["LIST_SUPPLIERS"] = "list_suppliers";
    // Movement actions
    Action["CREATE_MOVEMENT"] = "create_movement";
    Action["READ_MOVEMENT"] = "read_movement";
    Action["UPDATE_MOVEMENT"] = "update_movement";
    Action["DELETE_MOVEMENT"] = "delete_movement";
    Action["LIST_MOVEMENTS"] = "list_movements";
    // System actions
    Action["VIEW_AUDIT_LOGS"] = "view_audit_logs";
    Action["MANAGE_SYSTEM_SETTINGS"] = "manage_system_settings";
})(Action || (Action = {}));
// Define permissions matrix
const PERMISSIONS = {
    [UserRole.SUPER_ADMIN]: Object.values(Action), // Can do everything
    [UserRole.ADMIN]: [
        // User management
        Action.CREATE_USER,
        Action.READ_USER,
        Action.UPDATE_USER,
        Action.DELETE_USER,
        Action.LIST_USERS,
        // Store management
        Action.CREATE_STORE,
        Action.READ_STORE,
        Action.UPDATE_STORE,
        Action.DELETE_STORE,
        Action.LIST_STORES,
        Action.MANAGE_STORE_USERS,
        // Product management
        Action.CREATE_PRODUCT,
        Action.READ_PRODUCT,
        Action.UPDATE_PRODUCT,
        Action.DELETE_PRODUCT,
        Action.LIST_PRODUCTS,
        // Category management
        Action.CREATE_CATEGORY,
        Action.READ_CATEGORY,
        Action.UPDATE_CATEGORY,
        Action.DELETE_CATEGORY,
        Action.LIST_CATEGORIES,
        // Supplier management
        Action.CREATE_SUPPLIER,
        Action.READ_SUPPLIER,
        Action.UPDATE_SUPPLIER,
        Action.DELETE_SUPPLIER,
        Action.LIST_SUPPLIERS,
        // Movement management
        Action.CREATE_MOVEMENT,
        Action.READ_MOVEMENT,
        Action.UPDATE_MOVEMENT,
        Action.DELETE_MOVEMENT,
        Action.LIST_MOVEMENTS,
        // System
        Action.VIEW_AUDIT_LOGS
    ],
    [UserRole.MANAGER]: [
        // Store management (limited)
        Action.READ_STORE,
        Action.LIST_STORES,
        Action.MANAGE_STORE_USERS,
        // Product management
        Action.CREATE_PRODUCT,
        Action.READ_PRODUCT,
        Action.UPDATE_PRODUCT,
        Action.DELETE_PRODUCT,
        Action.LIST_PRODUCTS,
        // Category management
        Action.CREATE_CATEGORY,
        Action.READ_CATEGORY,
        Action.UPDATE_CATEGORY,
        Action.DELETE_CATEGORY,
        Action.LIST_CATEGORIES,
        // Supplier management
        Action.CREATE_SUPPLIER,
        Action.READ_SUPPLIER,
        Action.UPDATE_SUPPLIER,
        Action.DELETE_SUPPLIER,
        Action.LIST_SUPPLIERS,
        // Movement management
        Action.CREATE_MOVEMENT,
        Action.READ_MOVEMENT,
        Action.UPDATE_MOVEMENT,
        Action.DELETE_MOVEMENT,
        Action.LIST_MOVEMENTS
    ],
    [UserRole.USER]: [
        // Read-only access
        Action.READ_STORE,
        Action.LIST_STORES,
        Action.READ_PRODUCT,
        Action.LIST_PRODUCTS,
        Action.READ_CATEGORY,
        Action.LIST_CATEGORIES,
        Action.READ_SUPPLIER,
        Action.LIST_SUPPLIERS,
        Action.READ_MOVEMENT,
        Action.LIST_MOVEMENTS
    ]
};
// Helper function to check if user has permission
export const hasPermission = (userRoles, action) => {
    // Check if user has any of the required roles
    for (const role of userRoles) {
        const userRole = role;
        if (PERMISSIONS[userRole]?.includes(action)) {
            return true;
        }
    }
    return false;
};
// Helper function to check if user has any of the required roles
export const hasRole = (userRoles, requiredRoles) => {
    return requiredRoles.some(role => userRoles.includes(role));
};
// Helper function to check if user has store role
export const hasStoreRole = (userRoles, requiredStoreRoles) => {
    return requiredStoreRoles.some(role => userRoles.includes(role));
};
// Middleware factory for role-based authorization
export const requireRole = (requiredRoles) => {
    return async (request, reply) => {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    error: 'Authentication required'
                });
            }
            const userRoles = request.user.roles;
            if (!hasRole(userRoles, requiredRoles)) {
                return reply.status(403).send({
                    error: 'Insufficient permissions',
                    required: requiredRoles,
                    current: userRoles
                });
            }
            return;
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    };
};
// Middleware factory for permission-based authorization
export const requirePermission = (action) => {
    return async (request, reply) => {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    error: 'Authentication required'
                });
            }
            const userRoles = request.user.roles;
            if (!hasPermission(userRoles, action)) {
                return reply.status(403).send({
                    error: 'Insufficient permissions',
                    required: action,
                    current: userRoles
                });
            }
            return;
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    };
};
// Middleware factory for multiple permissions (user needs ALL permissions)
export const requireAllPermissions = (actions) => {
    return async (request, reply) => {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    error: 'Authentication required'
                });
            }
            const userRoles = request.user.roles;
            const hasAllPermissions = actions.every(action => hasPermission(userRoles, action));
            if (!hasAllPermissions) {
                return reply.status(403).send({
                    error: 'Insufficient permissions',
                    required: actions,
                    current: userRoles
                });
            }
            return;
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    };
};
// Middleware factory for multiple permissions (user needs ANY permission)
export const requireAnyPermission = (actions) => {
    return async (request, reply) => {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    error: 'Authentication required'
                });
            }
            const userRoles = request.user.roles;
            const hasAnyPermission = actions.some(action => hasPermission(userRoles, action));
            if (!hasAnyPermission) {
                return reply.status(403).send({
                    error: 'Insufficient permissions',
                    required: actions,
                    current: userRoles
                });
            }
            return;
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    };
};
// Middleware for store-specific authorization
export const requireStoreRole = (requiredStoreRoles) => {
    return async (request, reply) => {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    error: 'Authentication required'
                });
            }
            const userRoles = request.user.roles;
            if (!hasStoreRole(userRoles, requiredStoreRoles)) {
                return reply.status(403).send({
                    error: 'Insufficient store permissions',
                    required: requiredStoreRoles,
                    current: userRoles
                });
            }
            return;
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    };
};
// Middleware for resource ownership check
export const requireOwnership = (resourceUserIdField = 'userId') => {
    return async (request, reply) => {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    error: 'Authentication required'
                });
            }
            const currentUserId = request.user.id;
            const resourceUserId = request.params[resourceUserIdField];
            // Super admin can access everything
            if (request.user.roles.includes(UserRole.SUPER_ADMIN)) {
                return;
            }
            // Check if user owns the resource
            if (currentUserId !== resourceUserId) {
                return reply.status(403).send({
                    error: 'Access denied - resource ownership required'
                });
            }
            return;
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    };
};
