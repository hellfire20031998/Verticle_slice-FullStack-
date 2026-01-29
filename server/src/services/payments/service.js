import prisma from "../../prisma.js";

import { addAuditLog } from "../audit/service.js";
import { updateInvoicePaymentStatus } from "../../utils/stateMachine.js";

export async function createPayment(invoiceId, payload, idempotencyKey = null) {
  
  const { amount, method, userId } = payload;

  if (amount <= 0) {
    throw new Error("Payment amount must be positive.");
  }

  return await prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.findUnique({
      where: { id: invoiceId },
      include: { payments: true, customer: true },
    });

    if (!invoice) throw new Error("Invoice not found");

    if (invoice.status === "VOID") {
      throw new Error("Cannot apply payment to a voided invoice.");
    }

    let appliedAmount = amount;
    let extraCredit = 0;

    // ⭐ OVERPAYMENT LOGIC
    if (amount > invoice.balanceDue) {
      extraCredit = amount - invoice.balanceDue;     // money to be added as credit
      appliedAmount = invoice.balanceDue;            // only balanceDue goes to invoice
    }

    // Save payment with appliedAmount (not full amount)
    const payment = await tx.payment.create({
      data: {
        invoiceId,
        amount: appliedAmount,
        method,
        createdBy: userId,
      },
    });

    // Update invoice totals
    const newBalanceDue = invoice.balanceDue - appliedAmount;
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

    if (extraCredit > 0) {
      await tx.customer.update({
        where: { id: invoice.customerId },
        data: {
          remainingAmount: invoice.customer.remainingAmount + extraCredit,
        },
      });
    }

    // AUDIT LOG
    await addAuditLog(tx, {
      entity: "PAYMENT",
      entityId: invoice.id,
      action: "PAYMENT_ADDED",
      metadata: { amount, appliedAmount, extraCredit, method },
      createdBy: userId,
    });

    // IDEMPOTENCY
    if (idempotencyKey) {
      await tx.idempotencyKey.create({
        data: {
          key: idempotencyKey,
          responseBody: payment,
        },
      });
    }

    return {
      ...payment,
      extraCredit,
      invoiceStatus: newStatus,
    };
  });
}


