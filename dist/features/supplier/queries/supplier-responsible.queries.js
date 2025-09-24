export class SupplierResponsibleQueries {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getById(supplierId, responsibleId) {
        const responsible = await this.prisma.supplierResponsible.findFirst({
            where: {
                id: responsibleId,
                supplierId
            }
        });
        if (!responsible) {
            throw new Error('Responsible not found for this supplier');
        }
        return responsible;
    }
    async list(supplierId, params) {
        const { page = 1, limit = 10, search, status } = params;
        const skip = (page - 1) * limit;
        // Verificar se o supplier existe
        const supplier = await this.prisma.supplier.findUnique({
            where: { id: supplierId }
        });
        if (!supplier) {
            throw new Error('Supplier not found');
        }
        // Construir filtros
        const where = {
            supplierId
        };
        if (status !== undefined) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { cpf: { contains: search, mode: 'insensitive' } }
            ];
        }
        // Buscar responsáveis
        const [responsibles, total] = await Promise.all([
            this.prisma.supplierResponsible.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.supplierResponsible.count({ where })
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            responsibles,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };
    }
    async getByEmail(supplierId, email) {
        const responsible = await this.prisma.supplierResponsible.findFirst({
            where: {
                supplierId,
                email
            }
        });
        if (!responsible) {
            throw new Error('Responsible not found with this email for this supplier');
        }
        return responsible;
    }
    async getByCpf(supplierId, cpf) {
        const responsible = await this.prisma.supplierResponsible.findFirst({
            where: {
                supplierId,
                cpf
            }
        });
        if (!responsible) {
            throw new Error('Responsible not found with this CPF for this supplier');
        }
        return responsible;
    }
    async getActive(supplierId) {
        // Verificar se o supplier existe
        const supplier = await this.prisma.supplier.findUnique({
            where: { id: supplierId }
        });
        if (!supplier) {
            throw new Error('Supplier not found');
        }
        return await this.prisma.supplierResponsible.findMany({
            where: {
                supplierId,
                status: true
            },
            orderBy: { name: 'asc' }
        });
    }
    async getStats(supplierId) {
        // Verificar se o supplier existe
        const supplier = await this.prisma.supplier.findUnique({
            where: { id: supplierId }
        });
        if (!supplier) {
            throw new Error('Supplier not found');
        }
        const [total, active, inactive] = await Promise.all([
            this.prisma.supplierResponsible.count({
                where: { supplierId }
            }),
            this.prisma.supplierResponsible.count({
                where: { supplierId, status: true }
            }),
            this.prisma.supplierResponsible.count({
                where: { supplierId, status: false }
            })
        ]);
        return {
            total,
            active,
            inactive
        };
    }
    async search(supplierId, searchTerm, limit = 10) {
        // Verificar se o supplier existe
        const supplier = await this.prisma.supplier.findUnique({
            where: { id: supplierId }
        });
        if (!supplier) {
            throw new Error('Supplier not found');
        }
        return await this.prisma.supplierResponsible.findMany({
            where: {
                supplierId,
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { email: { contains: searchTerm, mode: 'insensitive' } },
                    { phone: { contains: searchTerm, mode: 'insensitive' } },
                    { cpf: { contains: searchTerm, mode: 'insensitive' } }
                ]
            },
            take: limit,
            orderBy: { name: 'asc' }
        });
    }
    async getBySupplier(supplierId) {
        // Verificar se o supplier existe
        const supplier = await this.prisma.supplier.findUnique({
            where: { id: supplierId }
        });
        if (!supplier) {
            throw new Error('Supplier not found');
        }
        return await this.prisma.supplierResponsible.findMany({
            where: { supplierId },
            orderBy: { name: 'asc' }
        });
    }
    async getRecent(supplierId, limit = 5) {
        // Verificar se o supplier existe
        const supplier = await this.prisma.supplier.findUnique({
            where: { id: supplierId }
        });
        if (!supplier) {
            throw new Error('Supplier not found');
        }
        return await this.prisma.supplierResponsible.findMany({
            where: { supplierId },
            take: limit,
            orderBy: { createdAt: 'desc' }
        });
    }
}
