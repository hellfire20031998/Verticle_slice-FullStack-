import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Invoice } from "../types/invoice";
import { getInvoiceById } from "../api/invoices";
import PaymentModal from "../components/PaymentModal";
import VoidModal from "../components/VoidModal";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [showPay, setShowPay] = useState(false);
  const [showVoid, setShowVoid] = useState(false);

  const loadInvoice = async () => {
    if (!id) return;
    try {
      const res = await getInvoiceById(id);
      setInvoice(res.data);
    } catch (err) {
      console.error("Failed to load invoice", err);
    }
  };

  useEffect(() => {
    loadInvoice();
  }, [id]);

  if (!invoice) return <p>Loading invoice...</p>;

  return (
    <div style={styles.container}>
      {/* TOP NAV BUTTONS */}
      <div style={styles.topNav}>
        <button style={styles.navBtn} onClick={() => navigate("/")}>
          ← Back to List
        </button>

        <button
          style={styles.navBtnPrimary}
          onClick={() => navigate("/invoices/create")}
        >
          + Create Invoice
        </button>
      </div>

      {/* Header Section */}
      <div style={styles.header}>
        <h2 style={styles.title}>{invoice.invoiceNumber}</h2>
        <p><strong>Status:</strong> {invoice.status}</p>
        <p><strong>Total:</strong> ₹{invoice.totalAmount}</p>
        <p><strong>Balance Due:</strong> ₹{invoice.balanceDue}</p>

        {invoice.status !== "VOID" && (
          <div style={styles.actions}>
            <button style={styles.btnPrimary} onClick={() => setShowPay(true)}>
              Add Payment
            </button>

            {invoice.payments.length === 0 && (
              <button style={styles.btnDanger} onClick={() => setShowVoid(true)}>
                Void Invoice
              </button>
            )}
          </div>
        )}
      </div>

      {/* Line Items */}
      <div style={styles.section}>
        <h3>Line Items</h3>
        <ul>
          {invoice.lineItems.map((item) => (
            <li key={item.id}>
              {item.description} — {item.quantity} × ₹{item.unitPrice}
            </li>
          ))}
        </ul>
      </div>

      {/* Payments */}
      <div style={styles.section}>
        <h3>Payments</h3>
        {invoice.payments.length === 0 && <p>No payments yet.</p>}

        <ul>
          {invoice.payments.map((payment) => (
            <li key={payment.id}>
              ₹{payment.amount} ({payment.method})
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Modal */}
      {showPay && (
        <PaymentModal
          invoiceId={invoice.id}
          onClose={() => {
            setShowPay(false);
            loadInvoice();
          }}
        />
      )}

      {/* Void Modal */}
      {showVoid && (
        <VoidModal
          invoiceId={invoice.id}
          onClose={() => {
            setShowVoid(false);
            loadInvoice();
          }}
        />
      )}
    </div>
  );
}

/* Inline Styling */
const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "24px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "sans-serif",
  },

  topNav: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  navBtn: {
    padding: "8px 14px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  navBtnPrimary: {
    padding: "8px 14px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  header: {
    paddingBottom: "20px",
    borderBottom: "1px solid #ccc",
  },
  title: { marginBottom: "8px" },
  actions: { marginTop: "16px", display: "flex", gap: "10px" },

  btnPrimary: {
    padding: "8px 14px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  btnDanger: {
    padding: "8px 14px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  section: { marginTop: "24px" },
};
