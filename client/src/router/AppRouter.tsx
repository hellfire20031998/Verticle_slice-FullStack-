import { BrowserRouter, Routes, Route } from "react-router-dom";

import InvoiceListPage from "../pages/InvoiceListPage";
import InvoiceCreatePage from "../pages/InvoiceCreatePage";
import InvoiceDetailPage from "../pages/InvoiceDetailPage";

import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "./Layout";
import AuditLogListPage from "../pages/AuditLogListPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <Layout>
                <InvoiceListPage />
              </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path="/invoices/create"
          element={
            <ProtectedRoute>
              <Layout>
                <InvoiceCreatePage />
              </Layout>
             </ProtectedRoute>
          }
        />

        <Route
          path="/invoices/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <InvoiceDetailPage />
              </Layout>
             </ProtectedRoute>
          }
        />

        <Route path="/audit-logs" element={<ProtectedRoute>
              <Layout>
                <AuditLogListPage />
              </Layout>
             </ProtectedRoute>} />



      </Routes>
    </BrowserRouter>
  );
}
