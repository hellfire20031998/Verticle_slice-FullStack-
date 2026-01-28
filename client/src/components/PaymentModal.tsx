import { useState } from "react";
import { createPayment } from "../api/payments";

interface Props {
  invoiceId: string;
  onClose: () => void;
}

export default function PaymentModal({ invoiceId, onClose }: Props) {
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);
      await createPayment(invoiceId, { amount, method, createdBy: "op1" });
      onClose();
    } catch (err) {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modalCard}>
        <h2 style={styles.title}>Add Payment</h2>

        {/* Amount */}
        <label style={styles.label}>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={styles.input}
        />

        {/* Method */}
        <label style={styles.label}>Payment Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          style={styles.select}
        >
          <option value="UPI">UPI</option>
          <option value="CARD">Card</option>
          <option value="CASH">Cash</option>
        </select>

        {/* Actions */}
        <div style={styles.buttonRow}>
          <button style={styles.submitBtn} onClick={submit} disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </button>

          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------- STYLES -------------------- */
const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modalCard: {
    width: 380,
    background: "#fff",
    padding: "28px 24px",
    borderRadius: 12,
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
    animation: "fadeIn 0.2s ease",
  },

  title: {
    margin: 0,
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 600,
  },

  label: {
    display: "block",
    marginBottom: 6,
    marginTop: 12,
    fontSize: 14,
    fontWeight: 500,
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 15,
  },

  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 15,
    background: "#fff",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: 24,
  },

  submitBtn: {
    padding: "10px 18px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 500,
  },

  cancelBtn: {
    padding: "10px 18px",
    background: "#e5e7eb",
    color: "#111",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 15,
  },
};
