import prisma from "../../prisma.js";


export async function addAuditLog(tx, { entity, entityId, action, metadata, createdBy }) {
  return tx.auditLog.create({
    data: {
      entity,
      entityId,
      action,
      metadata,
      createdBy,
    },
  });
}

export async function listAuditLogs({ page, limit, entity, invoiceId }) {
  const skip = (page - 1) * limit;

  let where = {};

  if (entity) {
    where.entity = entity;
  }

  if (invoiceId) {
    where.entityId = invoiceId;    
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        invoice: true,   // include invoice details if present
      },
    }),

    prisma.auditLog.count({ where }),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: logs,
  };
}

export async function getAuditLogById(id) {
  return prisma.auditLog.findUnique({
    where: { id },
    include: { invoice: true },
  });
}
