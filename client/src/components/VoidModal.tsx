import { useState } from "react";
import { voidInvoice } from "../api/invoices";

interface Props {
  invoiceId: string;
  onClose: () => void;
}

export default function VoidModal({ invoiceId, onClose }: Props) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason.");
      return;
    }

    try {
      setLoading(true);
      await voidInvoice(invoiceId, reason);
      onClose();
    } catch (err) {
      alert("Failed to void invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modalCard}>
        <h2 style={styles.title}>Void Invoice</h2>

        {/* Reason */}
        <label style={styles.label}>Reason for voiding</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={styles.textarea}
          placeholder="Enter reason..."
        />

        {/* Buttons */}
        <div style={styles.buttonRow}>
          <button style={styles.confirmBtn} onClick={submit} disabled={loading}>
            {loading ? "Voiding..." : "Confirm"}
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
    width: 400,
    background: "#fff",
    padding: "28px 24px",
    borderRadius: 12,
    boxShadow: "0 8px 28px rgba(0,0,0,0.15)",
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
    marginTop: 10,
    fontSize: 14,
    fontWeight: 500,
  },

  textarea: {
    width: "100%",
    minHeight: 80,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 15,
    resize: "none",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: 24,
  },

  confirmBtn: {
    padding: "10px 18px",
    background: "#dc2626",
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
