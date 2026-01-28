import prisma from "../../prisma.js";

// Fetch customer by phone
export async function getCustomerByPhone(phoneNumber) {
  return prisma.customer.findUnique({
    where: { phoneNumber },
  });
}

export async function createCustomerIfNotExists(phoneNumber) {
  let customer = await prisma.customer.findUnique({
    where: { phoneNumber },
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        phoneNumber,
        remainingAmount: 0,
      },
    });
  }

  return customer;
}
