-- Migration: Add Granular Permissions Tables
-- Description: Creates tables for granular permission system

-- Table for custom user permissions
CREATE TABLE "UserPermission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT,
    "storeId" TEXT,
    "grant" BOOLEAN NOT NULL DEFAULT true,
    "conditions" JSONB,
    "expiresAt" TIMESTAMP(3),
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    
    -- Foreign keys
    CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserPermission_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserPermission_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Table for store-specific permissions
CREATE TABLE "StorePermission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "storeRole" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,
    "conditions" JSONB,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    
    -- Foreign keys
    CONSTRAINT "StorePermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StorePermission_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StorePermission_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Unique constraint
    CONSTRAINT "StorePermission_userId_storeId_key" UNIQUE ("userId", "storeId")
);

-- Table for permission templates
CREATE TABLE "PermissionTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" JSONB NOT NULL,
    "conditions" JSONB,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    
    -- Foreign key
    CONSTRAINT "PermissionTemplate_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Unique constraint
    CONSTRAINT "PermissionTemplate_name_key" UNIQUE ("name")
);

-- Table for permission audit logs
CREATE TABLE "PermissionAuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "permissionId" TEXT NOT NULL,
    "permissionType" TEXT NOT NULL, -- 'user' or 'store'
    "action" TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'expired'
    "userId" TEXT NOT NULL,
    "changes" JSONB,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    
    -- Foreign key
    CONSTRAINT "PermissionAuditLog_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Indexes for better performance
CREATE INDEX "UserPermission_userId_idx" ON "UserPermission"("userId");
CREATE INDEX "UserPermission_action_idx" ON "UserPermission"("action");
CREATE INDEX "UserPermission_storeId_idx" ON "UserPermission"("storeId");
CREATE INDEX "UserPermission_expiresAt_idx" ON "UserPermission"("expiresAt");
CREATE INDEX "UserPermission_grant_idx" ON "UserPermission"("grant");

CREATE INDEX "StorePermission_userId_idx" ON "StorePermission"("userId");
CREATE INDEX "StorePermission_storeId_idx" ON "StorePermission"("storeId");
CREATE INDEX "StorePermission_storeRole_idx" ON "StorePermission"("storeRole");
CREATE INDEX "StorePermission_expiresAt_idx" ON "StorePermission"("expiresAt");

CREATE INDEX "PermissionTemplate_isDefault_idx" ON "PermissionTemplate"("isDefault");
CREATE INDEX "PermissionTemplate_createdBy_idx" ON "PermissionTemplate"("createdBy");

CREATE INDEX "PermissionAuditLog_permissionId_idx" ON "PermissionAuditLog"("permissionId");
CREATE INDEX "PermissionAuditLog_userId_idx" ON "PermissionAuditLog"("userId");
CREATE INDEX "PermissionAuditLog_action_idx" ON "PermissionAuditLog"("action");
CREATE INDEX "PermissionAuditLog_createdAt_idx" ON "PermissionAuditLog"("createdAt");

-- Insert default permission templates
INSERT INTO "PermissionTemplate" ("id", "name", "description", "permissions", "isDefault", "createdBy") VALUES
('template_salesperson', 'Vendedor', 'Permissões básicas para vendedores', '["READ_PRODUCT", "LIST_PRODUCTS", "READ_MOVEMENT", "LIST_MOVEMENTS"]', true, 'system'),
('template_manager', 'Gerente', 'Permissões gerenciais', '["CREATE_PRODUCT", "READ_PRODUCT", "UPDATE_PRODUCT", "DELETE_PRODUCT", "LIST_PRODUCTS", "CREATE_MOVEMENT", "READ_MOVEMENT", "UPDATE_MOVEMENT", "DELETE_MOVEMENT", "LIST_MOVEMENTS"]', true, 'system'),
('template_admin', 'Administrador', 'Permissões administrativas completas', '["CREATE_USER", "READ_USER", "UPDATE_USER", "DELETE_USER", "LIST_USERS", "CREATE_STORE", "READ_STORE", "UPDATE_STORE", "DELETE_STORE", "LIST_STORES", "MANAGE_STORE_USERS", "CREATE_PRODUCT", "READ_PRODUCT", "UPDATE_PRODUCT", "DELETE_PRODUCT", "LIST_PRODUCTS", "CREATE_CATEGORY", "READ_CATEGORY", "UPDATE_CATEGORY", "DELETE_CATEGORY", "LIST_CATEGORIES", "CREATE_SUPPLIER", "READ_SUPPLIER", "UPDATE_SUPPLIER", "DELETE_SUPPLIER", "LIST_SUPPLIERS", "CREATE_MOVEMENT", "READ_MOVEMENT", "UPDATE_MOVEMENT", "DELETE_MOVEMENT", "LIST_MOVEMENTS", "VIEW_AUDIT_LOGS"]', true, 'system');

-- Add comments for documentation
COMMENT ON TABLE "UserPermission" IS 'Custom permissions for individual users';
COMMENT ON TABLE "StorePermission" IS 'Store-specific permissions for users';
COMMENT ON TABLE "PermissionTemplate" IS 'Templates for common permission sets';
COMMENT ON TABLE "PermissionAuditLog" IS 'Audit log for permission changes';

COMMENT ON COLUMN "UserPermission"."action" IS 'The action being permitted/denied';
COMMENT ON COLUMN "UserPermission"."resource" IS 'Specific resource (e.g., product:123, store:456) or * for all';
COMMENT ON COLUMN "UserPermission"."grant" IS 'true = grant permission, false = deny permission';
COMMENT ON COLUMN "UserPermission"."conditions" IS 'JSON conditions for when permission applies';
COMMENT ON COLUMN "UserPermission"."expiresAt" IS 'When permission expires (null = never)';

COMMENT ON COLUMN "StorePermission"."storeRole" IS 'Role within the store';
COMMENT ON COLUMN "StorePermission"."permissions" IS 'Array of actions permitted for this store role';
COMMENT ON COLUMN "StorePermission"."conditions" IS 'JSON conditions for when permissions apply';

COMMENT ON COLUMN "PermissionTemplate"."permissions" IS 'Array of actions included in this template';
COMMENT ON COLUMN "PermissionTemplate"."conditions" IS 'Default conditions for permissions in this template';
COMMENT ON COLUMN "PermissionTemplate"."isDefault" IS 'Whether this is a system default template';

COMMENT ON COLUMN "PermissionAuditLog"."permissionType" IS 'Type of permission: user or store';
COMMENT ON COLUMN "PermissionAuditLog"."action" IS 'Action performed: created, updated, deleted, expired';
COMMENT ON COLUMN "PermissionAuditLog"."changes" IS 'JSON of what changed (for updates)';
