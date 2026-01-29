import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/invoices");

    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={card}>
        <h2 style={{ marginBottom: "20px" }}>Login</h2>

        <label style={label}>Email</label>
        <input
          type="email"
          style={input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={label}>Password</label>
        <input
          type="password"
          style={input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={btnPrimary} onClick={login}>
          Login
        </button>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          {/* Don’t have an account? <Link to="/signup">Signup</Link> */}
        </p>
      </div>
    </div>
  );
}

const pageWrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "#f5f5f5",
};

const card = {
  width: "350px",
  padding: "30px",
  background: "white",
  borderRadius: "10px",
  boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
};

const label = {
  fontWeight: 600,
  marginBottom: "6px",
};

const input = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  marginBottom: "15px",
};

const btnPrimary = {
  padding: "10px 16px",
  background: "black",
  color: "white",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  marginTop: "10px",
};
