import { BrowserRouter, Routes, Route } from "react-router-dom";
import InvoiceListPage from "../pages/InvoiceListPage";
import InvoiceCreatePage from "../pages/InvoiceCreatePage";
import InvoiceDetailPage from "../pages/InvoiceDetailPage";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InvoiceListPage />} />
        <Route path="/invoices/create" element={<InvoiceCreatePage />} />
        <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
