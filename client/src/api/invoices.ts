import axios from "axios";
import { Invoice } from "../types/invoice";

const API = axios.create({
  baseURL: "http://localhost:4000",
});

export const getInvoices = (page?: number, limit?: number, status?: string, phoneNumber?: string) =>
  API.get("/invoices", {
    params: { page, limit, status, phoneNumber },
  });


export const getInvoiceById = (id: string) =>
  API.get<Invoice>(`/invoices/${id}`);

export const createInvoice = (payload: any) =>
  API.post("/invoices", payload);

export const voidInvoice = (id: string, reason: string) =>
  API.post(`/invoices/${id}/void`, { reason });
