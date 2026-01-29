import { Router } from "express";
import { listAuditLogs, getAuditLogById } from "../controllers/auditLog/controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/", authMiddleware, listAuditLogs);       // GET all with pagination
router.get("/:id", authMiddleware, getAuditLogById);  // GET single log

export default router;
