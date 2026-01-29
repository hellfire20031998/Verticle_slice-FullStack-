import axios from "axios";

const token = localStorage.getItem("token")

export const API = axios.create({
  baseURL: "http://localhost:4000",
  headers:{
      Authorization :`Bearer ${token} ` 
    }
});

export const createPayment = (invoiceId: string, payload: any) => {
  return API.post(`/payments/${invoiceId}`, payload, {
    headers: {
      "Idempotency-Key": crypto.randomUUID(),
    },
  });
};
