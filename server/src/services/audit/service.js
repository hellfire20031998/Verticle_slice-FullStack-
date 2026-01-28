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
