import { Invoice } from "../types/invoice";
import { Link } from "react-router-dom";

interface Props {
  invoices: Invoice[];
}

export default function InvoiceTable({ invoices }: Props) {
  return (
    <div
      style={{
        marginTop: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        overflow: "hidden",
        background: "white",
        boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f7f7f7", textAlign: "left" }}>
            <th style={headerStyle}>Invoice #</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}>Total</th>
            <th style={headerStyle}>Balance</th>
            <th style={{ ...headerStyle, textAlign: "center" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((inv, idx) => (
            <tr
              key={inv.id}
              style={{
                background: idx % 2 === 0 ? "white" : "#fafafa",
                borderBottom: "1px solid #eee",
              }}
            >
              <td style={cellStyle}>{inv.invoiceNumber}</td>
              <td style={cellStyle}>{inv.status}</td>
              <td style={cellStyle}>{inv.totalAmount}</td>
              <td style={cellStyle}>{inv.balanceDue}</td>
              <td style={{ ...cellStyle, textAlign: "center" }}>
                <Link
                  to={`/invoices/${inv.id}`}
                  style={{
                    padding: "6px 12px",
                    background: "black",
                    color: "white",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  padding: "12px",
  fontSize: "14px",
  fontWeight: 600,
  borderBottom: "1px solid #ddd",
};

const cellStyle: React.CSSProperties = {
  padding: "12px",
  fontSize: "14px",
};
