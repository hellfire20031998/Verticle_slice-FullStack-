import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000",
});

export const createPayment = (invoiceId: string, payload: any) => {
  return API.post(`/payments/${invoiceId}`, payload, {
    headers: {
      "Idempotency-Key": crypto.randomUUID(),
    },
  });
};
