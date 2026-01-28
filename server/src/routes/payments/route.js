import { Router } from "express";
import idempotencyMiddleware from "../../middlewares/idempotency.js";
import * as PaymentController from "../../controllers/payments/controller.js";

const router = Router();

router.post(
  "/:invoiceId",
  idempotencyMiddleware,
  PaymentController.createPayment
);

export default router;
