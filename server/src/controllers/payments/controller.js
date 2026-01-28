import * as PaymentService from "../../services/payments/service.js";

export async function createPayment(req, res, next) {
  try {
    const response = await PaymentService.createPayment(
      req.params.invoiceId,
      req.body,
      req.idempotencyKey
    );

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}
