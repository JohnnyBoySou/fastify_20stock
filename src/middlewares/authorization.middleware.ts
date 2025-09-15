import { FastifyRequest, FastifyReply } from 'fastify';

// Define available roles
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user'
}

// Define available store roles
export enum StoreRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF'
}

// Define available actions
export enum Action {
  // User actions
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  LIST_USERS = 'list_users',
  
  // Store actions
  CREATE_STORE = 'create_store',
  READ_STORE = 'read_store',
  UPDATE_STORE = 'update_store',
  DELETE_STORE = 'delete_store',
  LIST_STORES = 'list_stores',
  MANAGE_STORE_USERS = 'manage_store_users',
  
  // Product actions
  CREATE_PRODUCT = 'create_product',
  READ_PRODUCT = 'read_product',
  UPDATE_PRODUCT = 'update_product',
  DELETE_PRODUCT = 'delete_product',
  LIST_PRODUCTS = 'list_products',
  
  // Category actions
  CREATE_CATEGORY = 'create_category',
  READ_CATEGORY = 'read_category',
  UPDATE_CATEGORY = 'update_category',
  DELETE_CATEGORY = 'delete_category',
  LIST_CATEGORIES = 'list_categories',
  
  // Supplier actions
  CREATE_SUPPLIER = 'create_supplier',
  READ_SUPPLIER = 'read_supplier',
  UPDATE_SUPPLIER = 'update_supplier',
  DELETE_SUPPLIER = 'delete_supplier',
  LIST_SUPPLIERS = 'list_suppliers',
  
  // Movement actions
  CREATE_MOVEMENT = 'create_movement',
  READ_MOVEMENT = 'read_movement',
  UPDATE_MOVEMENT = 'update_movement',
  DELETE_MOVEMENT = 'delete_movement',
  LIST_MOVEMENTS = 'list_movements',
  
  // System actions
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  MANAGE_SYSTEM_SETTINGS = 'manage_system_settings'
}

// Define permissions matrix
const PERMISSIONS: Record<UserRole, Action[]> = {
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
export const hasPermission = (userRoles: string[], action: Action): boolean => {
  // Check if user has any of the required roles
  for (const role of userRoles) {
    const userRole = role as UserRole;
    if (PERMISSIONS[userRole]?.includes(action)) {
      return true;
    }
  }
  return false;
};

// Helper function to check if user has any of the required roles
export const hasRole = (userRoles: string[], requiredRoles: UserRole[]): boolean => {
  return requiredRoles.some(role => userRoles.includes(role));
};

// Helper function to check if user has store role
export const hasStoreRole = (userRoles: string[], requiredStoreRoles: StoreRole[]): boolean => {
  return requiredStoreRoles.some(role => userRoles.includes(role));
};

// Middleware factory for role-based authorization
export const requireRole = (requiredRoles: UserRole[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
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
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  };
};

// Middleware factory for permission-based authorization
export const requirePermission = (action: Action) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
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
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  };
};

// Middleware factory for multiple permissions (user needs ALL permissions)
export const requireAllPermissions = (actions: Action[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
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
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  };
};

// Middleware factory for multiple permissions (user needs ANY permission)
export const requireAnyPermission = (actions: Action[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
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
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  };
};

// Middleware for store-specific authorization
export const requireStoreRole = (requiredStoreRoles: StoreRole[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
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
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  };
};

// Middleware for resource ownership check
export const requireOwnership = (resourceUserIdField: string = 'userId') => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send({
          error: 'Authentication required'
        });
      }

      const currentUserId = request.user.id;
      const resourceUserId = (request.params as any)[resourceUserIdField];

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
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  };
};
