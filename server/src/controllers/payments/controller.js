import { getUserNameFromToken } from "../../middlewares/auth.js";
import * as PaymentService from "../../services/payments/service.js";

export async function createPayment(req, res, next) {
  try {
    const token = req.headers.authorization;

    const user = await getUserNameFromToken(token);

    const response = await PaymentService.createPayment(
      req.params.invoiceId,
      {
        ...req.body,
        userId: user,
      },
      req.idempotencyKey
    );

    res.status(201).json(response);

  } catch (err) {
    next(err);
  }
}
