import * as auditLogService from "../../services/audit/service.js";

export async function listAuditLogs(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const entity = req.query.entity || undefined;
    const invoiceId = req.query.invoiceId || undefined;

    const data = await auditLogService.listAuditLogs({ page, limit, entity, invoiceId });

    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getAuditLogById(req, res, next) {
  try {
    const data = await auditLogService.getAuditLogById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Audit log not found" });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
}
