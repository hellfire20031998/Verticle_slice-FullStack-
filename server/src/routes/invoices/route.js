import { Router } from "express";
import * as invoiceController from "../../controllers/invoices/controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

const router = Router();

router.post("/",  authMiddleware, invoiceController.createInvoice);
router.get("/", authMiddleware, invoiceController.listInvoices);
router.get("/:id", authMiddleware, invoiceController.getInvoiceById);
router.post("/:id/void", authMiddleware, invoiceController.voidInvoice);

export default router;
