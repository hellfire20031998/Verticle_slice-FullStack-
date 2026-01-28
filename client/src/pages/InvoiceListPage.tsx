import { useEffect, useState } from "react";
import { Invoice } from "../types/invoice";
import { getInvoices } from "../api/invoices";
import { Link } from "react-router-dom";
import InvoiceTable from "../components/InvoiceTable";

export default function InvoiceListPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");

  const [phoneSearch, setPhoneSearch] = useState("");      // input field
  const [debouncedPhone, setDebouncedPhone] = useState(""); // debounced value

  const limit = 10;

  // -----------------------------
  // DEBOUNCE PHONE SEARCH
  // -----------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPhone(phoneSearch.trim());
      setPage(1); // reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [phoneSearch]);

  // -----------------------------
  // LOAD INVOICES
  // -----------------------------
  useEffect(() => {
    loadInvoices(page, status, debouncedPhone);
  }, [page, status, debouncedPhone]);

  const loadInvoices = async (page: number, status: string, phoneNumber: string) => {
    const res = await getInvoices(page, limit, status || undefined, phoneNumber || undefined);

    setInvoices(res.data.data);
    setTotalPages(res.data.totalPages);
  };

  const clearPhoneSearch = () => {
    setPhoneSearch("");
    setDebouncedPhone("");
    setPage(1);
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>Invoices</h2>

        <Link to="/invoices/create">
          <button>Create Invoice</button>
        </Link>

        {/* ==== PHONE SEARCH (DEBOUNCED) ==== */}
        <div style={{ marginTop: "20px" }}>
          <label style={{ fontWeight: 600 }}>Phone Number: </label>
          <input
            type="text"
            maxLength={10}
            value={phoneSearch}
            onChange={(e) => setPhoneSearch(e.target.value.replace(/\D/g, ""))}
            placeholder="Search by Phone Number"
            style={{
              marginLeft: "10px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              width: "180px",
            }}
          />

          {debouncedPhone && (
            <button
              onClick={clearPhoneSearch}
              style={{
                marginLeft: "10px",
                padding: "8px 14px",
                background: "gray",
                color: "white",
                borderRadius: "6px",
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* ==== STATUS FILTER ==== */}
        <div style={{ marginTop: "20px", marginBottom: "10px" }}>
          <label>Status: </label>
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              marginLeft: "10px",
            }}
          >
            <option value="">All</option>
            <option value="OPEN">Open</option>
            <option value="PARTIALLY_PAID">Partial</option>
            <option value="PAID">Paid</option>
          </select>
        </div>

        {/* ==== TABLE ==== */}
        <InvoiceTable invoices={invoices} />

        {/* ==== PAGINATION ==== */}
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                background: p === page ? "#333" : "#eee",
                padding: "6px 12px",
                borderRadius: "6px",
              }}
            >
              {p}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
