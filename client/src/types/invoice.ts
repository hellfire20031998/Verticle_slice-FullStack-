export interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total?: number;
}

export interface Payment {
  id: string;
  amount: number;
  method: string;
  createdBy: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: "OPEN" | "PARTIALLY_PAID" | "PAID" | "VOID";
  totalAmount: number;
  balanceDue: number;
  createdBy: string;
  lineItems: LineItem[];
  payments: Payment[];
}
