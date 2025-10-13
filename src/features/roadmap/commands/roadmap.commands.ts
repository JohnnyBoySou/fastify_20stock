import { db } from '@/plugins/prisma';
enum RoadmapStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

export const RoadmapCommands = {
  async create(data: any) {
    return await db.roadmap.create({ data })
  },

  async update(id: string, data: any) {
    return await db.roadmap.update({
      where: { id },
      data
    })
  },

  async delete(id: string) {
    return await db.roadmap.delete({
      where: { id }
    })
  },

  async updateStatus(id: string, status: RoadmapStatus) {
    return await db.roadmap.update({
      where: { id },
      data: { status }
    })
  }
}