import { Action, UserRole, StoreRole } from '@/middlewares/authorization.middleware';
import { PermissionConditions } from '@/middlewares/granular-permissions.middleware';

// ================================
// GESTÃO DE PERMISSÕES CUSTOMIZADAS
// ================================

export const createUserPermission = async (prisma: any, data: {
  userId: string;
  action: Action;
  resource?: string;
  storeId?: string;
  grant: boolean;
  conditions?: PermissionConditions;
  expiresAt?: string;
  reason?: string;
  createdBy: string;
}) => {
  return await prisma.userPermission.create({
    data: {
      userId: data.userId,
      action: data.action,
      resource: data.resource,
      storeId: data.storeId,
      grant: data.grant,
      conditions: data.conditions ? JSON.stringify(data.conditions) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      reason: data.reason,
      createdBy: data.createdBy
    }
  });
};

export const updateUserPermission = async (prisma: any, id: string, data: {
  action?: Action;
  resource?: string;
  storeId?: string;
  grant?: boolean;
  conditions?: PermissionConditions;
  expiresAt?: string;
  reason?: string;
}) => {
  return await prisma.userPermission.update({
    where: { id },
    data: {
      ...data,
      conditions: data.conditions ? JSON.stringify(data.conditions) : undefined,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined
    }
  });
};

export const deleteUserPermission = async (prisma: any, id: string) => {
  return await prisma.userPermission.delete({
    where: { id }
  });
};

// ================================
// GESTÃO DE PERMISSÕES POR LOJA
// ================================

export const setStoreUserPermissions = async (prisma: any, data: {
  userId: string;
  storeId: string;
  storeRole: StoreRole;
  permissions: Action[];
  conditions?: PermissionConditions;
  expiresAt?: string;
  createdBy: string;
}) => {
  return await prisma.storePermission.upsert({
    where: {
      userId_storeId: {
        userId: data.userId,
        storeId: data.storeId
      }
    },
    update: {
      storeRole: data.storeRole,
      permissions: JSON.stringify(data.permissions),
      conditions: data.conditions ? JSON.stringify(data.conditions) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      createdBy: data.createdBy
    },
    create: {
      userId: data.userId,
      storeId: data.storeId,
      storeRole: data.storeRole,
      permissions: JSON.stringify(data.permissions),
      conditions: data.conditions ? JSON.stringify(data.conditions) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      createdBy: data.createdBy
    }
  });
};

export const deleteStoreUserPermissions = async (prisma: any, userId: string, storeId: string) => {
  return await prisma.storePermission.delete({
    where: {
      userId_storeId: {
        userId,
        storeId
      }
    }
  });
};

// ================================
// OPERAÇÕES ESPECIAIS
// ================================

export const bulkCreateUserPermissions = async (prisma: any, permissions: Array<{
  userId: string;
  action: Action;
  resource?: string;
  storeId?: string;
  grant: boolean;
  conditions?: PermissionConditions;
  expiresAt?: string;
  reason?: string;
  createdBy: string;
}>) => {
  return await prisma.userPermission.createMany({
    data: permissions.map(permission => ({
      ...permission,
      conditions: permission.conditions ? JSON.stringify(permission.conditions) : null,
      expiresAt: permission.expiresAt ? new Date(permission.expiresAt) : null
    }))
  });
};

export const bulkUpdateUserPermissions = async (prisma: any, updates: Array<{
  id: string;
  data: {
    action?: Action;
    resource?: string;
    storeId?: string;
    grant?: boolean;
    conditions?: PermissionConditions;
    expiresAt?: string;
    reason?: string;
  };
}>) => {
  const transactions = updates.map(update => 
    prisma.userPermission.update({
      where: { id: update.id },
      data: {
        ...update.data,
        conditions: update.data.conditions ? JSON.stringify(update.data.conditions) : undefined,
        expiresAt: update.data.expiresAt ? new Date(update.data.expiresAt) : undefined
      }
    })
  );

  return await prisma.$transaction(transactions);
};

export const bulkDeleteUserPermissions = async (prisma: any, ids: string[]) => {
  return await prisma.userPermission.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  });
};

export const expireUserPermissions = async (prisma: any, userIds: string[], reason?: string) => {
  return await prisma.userPermission.updateMany({
    where: {
      userId: {
        in: userIds
      },
      expiresAt: {
        gt: new Date()
      }
    },
    data: {
      expiresAt: new Date(),
      reason: reason || 'Bulk expiration'
    }
  });
};

export const extendUserPermissions = async (prisma: any, userIds: string[], newExpiryDate: string, reason?: string) => {
  return await prisma.userPermission.updateMany({
    where: {
      userId: {
        in: userIds
      }
    },
    data: {
      expiresAt: new Date(newExpiryDate),
      reason: reason || 'Bulk extension'
    }
  });
};