import prisma from "../../prisma.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../middlewares/auth.js";

export async function signupService({ name, email, password, role }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  const token = generateToken(user);
  return { user: { id: user.id, name: user.name, email: user.email }, token };
}

export async function loginService({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = generateToken(user);
  return { user: { id: user.id, name: user.name, email: user.email, role:user.role }, token };
}
