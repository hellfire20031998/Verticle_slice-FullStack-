export function computeTotals(lineItems, discountType, discountValue) {
  const totalAmount = lineItems.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  );

  let discountedTotal = totalAmount;

  if (discountType === "PERCENT") {
    discountedTotal = totalAmount - totalAmount * (discountValue / 100);
  }

  if (discountType === "FIXED") {
    discountedTotal = totalAmount - discountValue;
  }

  return {
    totalAmount,
    discountedTotal: Math.max(discountedTotal, 0),
  };
}

export function updateInvoicePaymentStatus(balanceDue, totalAmount) {
  if (balanceDue === 0) return "PAID";
  if (balanceDue < totalAmount) return "PARTIALLY_PAID";
  return "OPEN";
}

export function canVoidInvoice(invoice) {
  return invoice.payments.length === 0;
}
