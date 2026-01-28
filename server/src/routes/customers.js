import express from "express";
import { findCustomer } from "../controllers/customers/controller.js";

const router = express.Router();

router.get("/:phoneNumber", findCustomer);

export default router;
