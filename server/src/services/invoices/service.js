import prisma from "../../prisma.js";
import { createCustomerIfNotExists } from "../customers/service.js";
import { computeTotals, canVoidInvoice } from "../../utils/stateMachine.js";
import { addAuditLog } from "../audit/service.js";


export async function createInvoice(payload, user) {
  
  const { lineItems, discountType, discountValue, phoneNumber } = payload;

  if (!lineItems || lineItems.length === 0) {
    throw new Error("Invoice must contain at least one line item.");
  }

  // Compute totals
  const { discountedTotal } = computeTotals(
    lineItems,
    discountType,
    discountValue
  );

  const invoiceNumber = "INV-" + Date.now();

  return await prisma.$transaction(async (tx) => {

    const customer = await createCustomerIfNotExists(phoneNumber);

    const invoice = await tx.invoice.create({
      data: {
        invoiceNumber,
        status: "OPEN",
        currency: "INR",
        discountType,
        discountValue,
        totalAmount: discountedTotal,
        balanceDue: discountedTotal,
        createdBy: user,
        customerId: customer.id,
      },
    });

    for (const item of lineItems) {
      await tx.lineItem.create({
        data: {
          invoiceId: invoice.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
        },
      });
    }

    // 4️⃣ Add audit log
    await addAuditLog(tx, {
      entity: "INVOICE",
      entityId: invoice.id,
      action: "CREATED",
      metadata: { invoiceNumber, phoneNumber },
      createdBy:user,
    });

    // 5️⃣ Return invoice with items
    return {
      ...invoice,
      lineItems,
    };
  });
}

export async function listInvoices({ page, limit, status, phoneNumber }) {
  const skip = (page - 1) * limit;

  // Build dynamic filters
  const where = {};

  // Status filter
  if (status) {
    where.status = status;
  }

  // Phone number filter through Customer relation
  if (phoneNumber && phoneNumber.trim() !== "") {
    where.customer = {
      phoneNumber: phoneNumber,
    };
  }

  // Count total
  const totalCount = await prisma.invoice.count({ where });

  // Fetch paginated + filtered invoices
  const invoices = await prisma.invoice.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
    },
  });

  return {
    data: invoices,
    page,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
}


export async function getInvoiceById(id) {
  return prisma.invoice.findUnique({
    where: { id },
    include: {
      lineItems: true,
      payments: true,
      auditLogs: true,
    },
  });
}

export async function voidInvoice(id, reason) {
  return await prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.findUnique({
      where: { id },
      include: { payments: true },
    });

    if (!invoice) throw new Error("Invoice not found");

    if (!canVoidInvoice(invoice)) {
      throw new Error("Cannot void invoice with payments.");
    }

    const updated = await tx.invoice.update({
      where: { id },
      data: {
        status: "VOID",
        voidReason: reason || "No reason provided",
      },
    });

    await addAuditLog(tx, {
      entity: "INVOICE",
      entityId: id,
      action: "VOIDED",
      metadata: { reason },
      createdBy: "SYSTEM",
    });

    return updated;
  });
}
