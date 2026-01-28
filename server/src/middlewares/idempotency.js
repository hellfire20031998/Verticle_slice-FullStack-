import prisma from "../prisma.js";

export default async function idempotency(req, res, next) {
  const key = req.headers["idempotency-key"];

  if (!key) return next();

  const existing = await prisma.idempotencyKey.findUnique({
    where: { key }
  });

  if (existing) {
    return res.json(existing.responseBody);
  }

  req.idempotencyKey = key;
  next();
}
