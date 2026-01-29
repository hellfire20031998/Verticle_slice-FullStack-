import { Router } from "express";
import idempotencyMiddleware from "../../middlewares/idempotency.js";
import * as PaymentController from "../../controllers/payments/controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

const router = Router();

router.post(
  "/:invoiceId",
  idempotencyMiddleware,
  authMiddleware,
  PaymentController.createPayment
);

export default router;
