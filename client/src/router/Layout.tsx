import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) {
      navigate("/"); // force login
      return;
    }
    setUser(JSON.parse(data));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null; // prevent flashing

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <div
        style={{
          width: "240px",
          background: "#111",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <h2 style={{ marginBottom: "30px" }}>Invoice App</h2>

        {/* USER INFO */}
        <div style={{ marginBottom: "30px" }}>
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
            {user.name}
          </div>
          <div style={{ fontSize: "14px", opacity: 0.7 }}>{user.role}</div>
        </div>

        {/* NAV LINKS */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link style={link} to="/invoices">Invoices</Link>
        </nav>

        {
          user.role ==="SUPERVISOR" &&   <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link style={link} to="/audit-logs">Audits</Link>
        </nav>


        }
        {/* BOTTOM LOGOUT */}
        <button
          onClick={logout}
          style={{
            marginTop: "auto",
            padding: "10px",
            background: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "30px" }}>
        {children}
      </div>
    </div>
  );
}

const link: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  padding: "8px 0",
  fontSize: "15px",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  cursor: "pointer"
};
