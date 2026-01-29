import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../api/payments";

export default function AuditLogListPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entityFilter, setEntityFilter] = useState("");

  const limit = 10;

  useEffect(() => {
    loadLogs(page, entityFilter);
  }, [page, entityFilter]);

  const loadLogs = async (page: number, entity: string) => {
    const res = await API.get("/audit-logs", {
      params: {
        page,
        limit,
        entity: entity || undefined,
      },
    });

    setLogs(res.data.data);
    setTotalPages(res.data.totalPages);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Audit Logs
      </h2>

      {/* FILTERS */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: 600 }}>Entity Filter:</label>
        <select
          value={entityFilter}
          onChange={(e) => {
            setPage(1);
            setEntityFilter(e.target.value);
          }}
          style={{
            marginLeft: "10px",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          <option value="">All</option>
          <option value="INVOICE">Invoice</option>
          <option value="PAYMENT">Payment</option>
        </select>
      </div>

      <AuditLogTable logs={logs} />

      {/* PAGINATION */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          gap: "8px",
        }}
      >
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={{
            padding: "6px 12px",
            background: page === 1 ? "#ccc" : "black",
            color: "white",
            borderRadius: "6px",
            cursor: page === 1 ? "not-allowed" : "pointer",
            border: "none",
          }}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              padding: "6px 12px",
              background: p === page ? "#333" : "#eee",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {p}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          style={{
            padding: "6px 12px",
            background: page === totalPages ? "#ccc" : "black",
            color: "white",
            borderRadius: "6px",
            cursor: page === totalPages ? "not-allowed" : "pointer",
            border: "none",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// --------------------------------------
// TABLE COMPONENT
// --------------------------------------
function AuditLogTable({ logs }: { logs: any[] }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        overflow: "hidden",
        background: "white",
        boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f7f7f7" }}>
            <th style={headerCell}>Entity</th>
            <th style={headerCell}>Action</th>
            <th style={headerCell}>Metadata</th>
            <th style={headerCell}>Invoice #</th>
            <th style={headerCell}>Created By</th>
            <th style={headerCell}>Timestamp</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log, i) => (
            <tr
              key={log.id}
              style={{
                background: i % 2 === 0 ? "white" : "#fafafa",
                borderBottom: "1px solid #eee",
              }}
            >
              <td style={cell}>{log.entity}</td>
              <td style={cell}>{log.action}</td>

              <td style={cell}>
                <pre
                  style={{
                    margin: 0,
                    background: "#f4f4f4",
                    padding: "6px",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </td>

              <td style={cell}>
                {log.invoice?.invoiceNumber || "-"}
              </td>

              <td style={cell}>{log.createdBy}</td>

              <td style={cell}>
                {new Date(log.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const headerCell: React.CSSProperties = {
  padding: "12px",
  fontSize: "14px",
  fontWeight: 600,
  borderBottom: "1px solid #ddd",
  textAlign: "left",
};

const cell: React.CSSProperties = {
  padding: "12px",
  fontSize: "14px",
};
