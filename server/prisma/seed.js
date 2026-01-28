import prisma from "./client.js";

async function runSeed() {
  await prisma.auditLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.lineItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.idempotencyKey.deleteMany();

  console.log("Cleared existing data.");

  const operator = await prisma.user.create({
    data: {
      id: "op1",
      name: "Billing Operator",
      role: "OPERATOR",
    },
  });

  const supervisor = await prisma.user.create({
    data: {
      id: "sup1",
      name: "Supervisor",
      role: "SUPERVISOR",
    },
  });

  // ==============================
  // 1. OPEN INVOICE
  // ==============================
  const inv1 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-1001",
      status: "OPEN",
      currency: "INR",
      totalAmount: 1000,
      balanceDue: 1000,
      createdBy: operator.id,
    },
  });

  await prisma.lineItem.create({
    data: {
      invoiceId: inv1.id,
      description: "Product A",
      quantity: 1,
      unitPrice: 1000,
      total: 1000,
    },
  });

  // ==============================
  // 2. PARTIALLY PAID
  // ==============================
  const inv2 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2001",
      status: "PARTIALLY_PAID",
      currency: "INR",
      totalAmount: 2000,
      balanceDue: 500,
      createdBy: operator.id,
    },
  });

  await prisma.lineItem.create({
    data: {
      invoiceId: inv2.id,
      description: "Service A",
      quantity: 2,
      unitPrice: 1000,
      total: 2000,
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: inv2.id,
      amount: 1500,
      method: "UPI",
      createdBy: operator.id,
    },
  });

  // ==============================
  // 3. PAID INVOICE
  // ==============================
  const inv3 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-3001",
      status: "PAID",
      currency: "INR",
      totalAmount: 500,
      balanceDue: 0,
      createdBy: operator.id,
    },
  });

  await prisma.lineItem.create({
    data: {
      invoiceId: inv3.id,
      description: "Consulting",
      quantity: 1,
      unitPrice: 500,
      total: 500,
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: inv3.id,
      amount: 500,
      method: "CASH",
      createdBy: operator.id,
    },
  });

  // ==============================
  // 4. VOID INVOICE
  // ==============================
  const inv4 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-4001",
      status: "VOID",
      currency: "INR",
      totalAmount: 1200,
      balanceDue: 1200,
      voidReason: "Duplicate",
      createdBy: operator.id,
    },
  });

  await prisma.lineItem.create({
    data: {
      invoiceId: inv4.id,
      description: "Wrong Entry",
      quantity: 1,
      unitPrice: 1200,
      total: 1200,
    },
  });

  console.log("Seed completed.");
  process.exit(0);
}

runSeed();
