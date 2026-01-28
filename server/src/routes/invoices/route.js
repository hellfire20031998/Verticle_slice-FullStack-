import { Router } from "express";
import * as invoiceController from "../../controllers/invoices/controller.js";

const router = Router();

router.post("/", invoiceController.createInvoice);
router.get("/", invoiceController.listInvoices);
router.get("/:id", invoiceController.getInvoiceById);
router.post("/:id/void", invoiceController.voidInvoice);

export default router;
