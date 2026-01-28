import prisma from "../../prisma.js";

import { addAuditLog } from "../audit/service.js";
import { updateInvoicePaymentStatus } from "../../utils/stateMachine.js";

export async function createPayment(invoiceId, payload, idempotencyKey = null) {
  const { amount, method, createdBy } = payload;

  if (amount <= 0) {
    throw new Error("Payment amount must be positive.");
  }

  return await prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.findUnique({
      where: { id: invoiceId },
      include: { payments: true },
    });

    if (!invoice) throw new Error("Invoice not found");

    if (invoice.status === "VOID") {
      throw new Error("Cannot apply payment to a voided invoice.");
    }

    if (amount > invoice.balanceDue) {
      throw new Error("Payment exceeds invoice balance.");
    }

    // Create payment
    const payment = await tx.payment.create({
      data: {
        invoiceId,
        amount,
        method,
        createdBy,
      },
    });

    // Update invoice totals + status
    const newBalanceDue = invoice.balanceDue - amount;
    const newStatus = updateInvoicePaymentStatus(
      newBalanceDue,
      invoice.totalAmount
    );

    await tx.invoice.update({
      where: { id: invoiceId },
      data: {
        balanceDue: newBalanceDue,
        status: newStatus,
      },
    });

    // FIXED AUDIT LOG
    await addAuditLog(tx, {
      entity: "PAYMENT",
      entityId: invoice.id,   
      action: "PAYMENT_ADDED",
      metadata: { amount, method },
      createdBy,
    });

    // Save idempotency key (if any)
    if (idempotencyKey) {
      await tx.idempotencyKey.create({
        data: {
          key: idempotencyKey,
          responseBody: payment,
        },
      });
    }

    return payment;
  });
}
