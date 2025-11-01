import { type Action, StoreRole, UserRole } from '@/middlewares/authorization.middleware'
import { GranularPermissionService } from '@/middlewares/granular-permissions.middleware'

// ================================
// CONSULTAS DE PERMISSÕES CUSTOMIZADAS
// ================================

export const getUserPermissions = async (
  prisma: any,
  filters: {
    userId: string
    storeId?: string
    action?: Action
    active?: boolean
    page?: number
    limit?: number
  }
) => {
  const { userId, storeId, action, active, page = 1, limit = 10 } = filters

  const where: any = { userId }

  if (storeId) where.storeId = storeId
  if (action) where.action = action
  if (active !== undefined) {
    if (active) {
      where.OR = [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
    } else {
      where.expiresAt = { lte: new Date() }
    }
  }

  const [permissions, total] = await Promise.all([
    prisma.userPermission.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.userPermission.count({ where }),
  ])

  return {
    permissions: permissions.map((p) => ({
      ...p,
      conditions: p.conditions ? JSON.parse(p.conditions) : null,
    })),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export const getUserPermissionById = async (prisma: any, id: string) => {
  const permission = await prisma.userPermission.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      creator: {
        select: { id: true, name: true, email: true },
      },
    },
  })

  if (permission) {
    return {
      ...permission,
      conditions: permission.conditions ? JSON.parse(permission.conditions) : null,
    }
  }

  return null
}

// ================================
// CONSULTAS DE PERMISSÕES POR LOJA
// ================================

export const getStoreUserPermissions = async (
  prisma: any,
  filters: {
    storeId: string
    page?: number
    limit?: number
  }
) => {
  const { storeId, page = 1, limit = 10 } = filters

  const [permissions, total] = await Promise.all([
    prisma.storePermission.findMany({
      where: { storeId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        store: {
          select: { id: true, name: true },
        },
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.storePermission.count({ where: { storeId } }),
  ])

  return {
    permissions: permissions.map((p) => ({
      ...p,
      permissions: JSON.parse(p.permissions),
      conditions: p.conditions ? JSON.parse(p.conditions) : null,
    })),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export const getStoreUserPermission = async (prisma: any, userId: string, storeId: string) => {
  const permission = await prisma.storePermission.findUnique({
    where: {
      userId_storeId: {
        userId,
        storeId,
      },
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      store: {
        select: { id: true, name: true },
      },
      creator: {
        select: { id: true, name: true, email: true },
      },
    },
  })

  if (permission) {
    return {
      ...permission,
      permissions: JSON.parse(permission.permissions),
      conditions: permission.conditions ? JSON.parse(permission.conditions) : null,
    }
  }

  return null
}

// ================================
// CONSULTAS AVANÇADAS
// ================================

export const getUserEffectivePermissions = async (
  prisma: any,
  context: {
    userId: string
    storeId?: string
  }
) => {
  const { userId, storeId } = context

  // Buscar usuário
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, roles: true },
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Buscar permissões customizadas
  const customPermissions = await prisma.userPermission.findMany({
    where: {
      userId,
      ...(storeId ? { storeId } : {}),
    },
  })

  // Buscar permissões da loja
  let storePermissions = []
  if (storeId) {
    storePermissions = await prisma.storePermission.findMany({
      where: { userId, storeId },
    })
  }

  // Construir contexto completo
  const permissionContext = {
    userId,
    userRoles: user.roles,
    storeId,
    storeRole: storePermissions[0]?.storeRole,
    customPermissions: customPermissions.map((p) => ({
      ...p,
      conditions: p.conditions ? JSON.parse(p.conditions) : null,
    })),
    storePermissions: storePermissions.map((p) => ({
      ...p,
      permissions: JSON.parse(p.permissions),
      conditions: p.conditions ? JSON.parse(p.conditions) : null,
    })),
  }

  // Obter permissões efetivas
  const effectivePermissions =
    await GranularPermissionService.getUserEffectivePermissions(permissionContext)

  return {
    userId,
    userRoles: user.roles,
    storeId,
    effectivePermissions,
    customPermissions: permissionContext.customPermissions,
    storePermissions: permissionContext.storePermissions,
  }
}

export const testPermission = async (
  prisma: any,
  context: {
    userId: string
    action: Action
    resource?: string
    storeId?: string
    testContext?: any
  }
) => {
  const { userId, action, resource, storeId, testContext } = context

  // Buscar usuário
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, roles: true },
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Buscar permissões customizadas
  const customPermissions = await prisma.userPermission.findMany({
    where: { userId },
  })

  // Buscar permissões da loja
  let storePermissions = []
  if (storeId) {
    storePermissions = await prisma.storePermission.findMany({
      where: { userId, storeId },
    })
  }

  // Construir contexto de permissão
  const permissionContext = {
    userId,
    userRoles: user.roles,
    storeId,
    storeRole: storePermissions[0]?.storeRole,
    customPermissions: customPermissions.map((p) => ({
      ...p,
      conditions: p.conditions ? JSON.parse(p.conditions) : null,
    })),
    storePermissions: storePermissions.map((p) => ({
      ...p,
      permissions: JSON.parse(p.permissions),
      conditions: p.conditions ? JSON.parse(p.conditions) : null,
    })),
    requestTime: new Date(),
    requestData: testContext || {},
  }

  // Testar permissão
  const result = await GranularPermissionService.hasPermission(permissionContext, action, resource)

  return {
    userId,
    action,
    resource,
    storeId,
    result,
    context: permissionContext,
  }
}

// ================================
// ESTATÍSTICAS E RELATÓRIOS
// ================================

export const getPermissionStats = async (prisma: any) => {
  const [
    totalUserPermissions,
    activeUserPermissions,
    expiredUserPermissions,
    totalStorePermissions,
    permissionsByAction,
    permissionsByRole,
  ] = await Promise.all([
    prisma.userPermission.count(),
    prisma.userPermission.count({
      where: {
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    }),
    prisma.userPermission.count({
      where: {
        expiresAt: { lte: new Date() },
      },
    }),
    prisma.storePermission.count(),
    prisma.userPermission.groupBy({
      by: ['action'],
      _count: { action: true },
    }),
    prisma.storePermission.groupBy({
      by: ['storeRole'],
      _count: { storeRole: true },
    }),
  ])

  return {
    userPermissions: {
      total: totalUserPermissions,
      active: activeUserPermissions,
      expired: expiredUserPermissions,
    },
    storePermissions: {
      total: totalStorePermissions,
    },
    permissionsByAction: permissionsByAction.map((p) => ({
      action: p.action,
      count: p._count.action,
    })),
    permissionsByRole: permissionsByRole.map((p) => ({
      role: p.storeRole,
      count: p._count.storeRole,
    })),
  }
}

export const getPermissionsByUser = async (prisma: any, userId: string) => {
  const [userPermissions, storePermissions] = await Promise.all([
    prisma.userPermission.findMany({
      where: { userId },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.storePermission.findMany({
      where: { userId },
      include: {
        store: {
          select: { id: true, name: true },
        },
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
  ])

  return {
    userPermissions: userPermissions.map((p) => ({
      ...p,
      conditions: p.conditions ? JSON.parse(p.conditions) : null,
    })),
    storePermissions: storePermissions.map((p) => ({
      ...p,
      permissions: JSON.parse(p.permissions),
      conditions: p.conditions ? JSON.parse(p.conditions) : null,
    })),
  }
}

export const getPermissionsByStore = async (prisma: any, storeId: string) => {
  const storePermissions = await prisma.storePermission.findMany({
    where: { storeId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      store: {
        select: { id: true, name: true },
      },
      creator: {
        select: { id: true, name: true, email: true },
      },
    },
  })

  return storePermissions.map((p) => ({
    ...p,
    permissions: JSON.parse(p.permissions),
    conditions: p.conditions ? JSON.parse(p.conditions) : null,
  }))
}

export const getExpiringPermissions = async (prisma: any, days = 7) => {
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + days)

  const [userPermissions, storePermissions] = await Promise.all([
    prisma.userPermission.findMany({
      where: {
        expiresAt: {
          gte: new Date(),
          lte: futureDate,
        },
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.storePermission.findMany({
      where: {
        expiresAt: {
          gte: new Date(),
          lte: futureDate,
        },
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        store: {
          select: { id: true, name: true },
        },
      },
    }),
  ])

  return {
    userPermissions: userPermissions.map((p) => ({
      ...p,
      conditions: p.conditions ? JSON.parse(p.conditions) : null,
    })),
    storePermissions: storePermissions.map((p) => ({
      ...p,
      permissions: JSON.parse(p.permissions),
      conditions: p.conditions ? JSON.parse(p.conditions) : null,
    })),
  }
}

export const searchPermissions = async (prisma: any, query: string, limit = 10) => {
  const userPermissions = await prisma.userPermission.findMany({
    where: {
      OR: [
        { reason: { contains: query, mode: 'insensitive' } },
        { action: { contains: query, mode: 'insensitive' } },
        { resource: { contains: query, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
            ],
          },
        },
      ],
    },
    take: limit,
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      creator: {
        select: { id: true, name: true, email: true },
      },
    },
  })

  return userPermissions.map((p) => ({
    ...p,
    conditions: p.conditions ? JSON.parse(p.conditions) : null,
  }))
}
