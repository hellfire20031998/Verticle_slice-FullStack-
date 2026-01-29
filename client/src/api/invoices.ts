import axios from "axios";
import { Invoice } from "../types/invoice";


const token = localStorage.getItem("token")


const API = axios.create({
  baseURL: "http://localhost:4000",
  headers:{
      Authorization :`Bearer ${token} ` 
    }
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
