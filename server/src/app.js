import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import invoiceRoutes from "./routes/invoices/route.js";
import paymentRoutes from "./routes/payments/route.js";
import errorHandler from "./middlewares/errorHandler.js";
import customerRoutes from "./routes/customers.js";
import authRoutes from "./routes/auth.js";
import auditLogRoutes from "./routes/auditLog.js";




dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/customers", customerRoutes);
app.use("/auth",authRoutes);

app.use("/invoices", invoiceRoutes);
app.use("/payments", paymentRoutes);

app.use("/audit-logs", auditLogRoutes);

app.use(errorHandler);

export default app;
