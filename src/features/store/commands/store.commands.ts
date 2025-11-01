import { db } from '@/plugins/prisma'
export const StoreCommands = {
  async create(data: {
    ownerId: string
    name: string
    cnpj: string
    email?: string
    phone?: string
    cep?: string
    city?: string
    state?: string
    address?: string
    status?: boolean
  }) {
    // Check if CNPJ already exists
    const existingStore = await db.store.findUnique({
      where: { cnpj: data.cnpj },
    })

    if (existingStore) {
      throw new Error('CNPJ already exists')
    }

    // Check if owner exists
    const owner = await db.user.findUnique({
      where: { id: data.ownerId },
    })

    if (!owner) {
      throw new Error('Owner not found')
    }

    return await db.store.create({
      data: {
        ownerId: data.ownerId,
        name: data.name,
        cnpj: data.cnpj,
        email: data.email || null,
        phone: data.phone || null,
        cep: data.cep || null,
        city: data.city || null,
        state: data.state || null,
        address: data.address || null,
        status: data.status !== undefined ? data.status : true,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  },

  async update(
    id: string,
    data: {
      name?: string
      cnpj?: string
      email?: string
      phone?: string
      cep?: string
      city?: string
      state?: string
      address?: string
      status?: boolean
    }
  ) {
    // Check if store exists
    const existingStore = await db.store.findUnique({
      where: { id },
    })

    if (!existingStore) {
      throw new Error('Store not found')
    }

    // If updating CNPJ, check if it already exists
    if (data.cnpj && data.cnpj !== existingStore.cnpj) {
      const cnpjExists = await db.store.findUnique({
        where: { cnpj: data.cnpj },
      })

      if (cnpjExists) {
        throw new Error('CNPJ already exists')
      }
    }

    return await db.store.update({
      where: { id },
      data: {
        ...data,
        email: data.email === '' ? null : data.email,
        phone: data.phone === '' ? null : data.phone,
        cep: data.cep === '' ? null : data.cep,
        city: data.city === '' ? null : data.city,
        state: data.state === '' ? null : data.state,
        address: data.address === '' ? null : data.address,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  },

  async delete(id: string) {
    // Check if store exists
    const existingStore = await db.store.findUnique({
      where: { id },
    })

    if (!existingStore) {
      throw new Error('Store not found')
    }

    // Check if store has products
    const productCount = await db.product.count({
      where: { storeId: id },
    })

    if (productCount > 0) {
      throw new Error('Cannot delete store with existing products')
    }

    return await db.store.delete({
      where: { id },
    })
  },
}
