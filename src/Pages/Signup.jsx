import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanConfirmPassword = confirmPassword.trim();

    if (!cleanUsername || !cleanEmail || !cleanPassword || !cleanConfirmPassword) {
      alert("Please fill all fields");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(cleanEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    if (cleanUsername.length < 3) {
      alert("Username must be at least 3 characters");
      return;
    }

    if (cleanPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (cleanPassword !== cleanConfirmPassword) {
      alert("Password and Confirm Password must match");
      return;
    }

    setSubmitting(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/signup/", {
        username: cleanUsername,
        email: cleanEmail,
        password: cleanPassword,
      });

      alert(res.data?.message || "Signup successful");
      navigate("/login");
    } catch (err) {
      console.log("Signup error:", err);
      console.log("Signup error response:", err.response?.data);

      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Signup failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "white",
          borderRadius: "18px",
          padding: "32px",
          boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            color: "#0f172a",
            marginBottom: "8px",
          }}
        >
          Signup
        </h1>

        <p
          style={{
            marginTop: 0,
            marginBottom: "24px",
            color: "#64748b",
          }}
        >
          Create your Expense Tracker account
        </p>

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "12px",
              background: submitting ? "#94a3b8" : "#111827",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: "700",
              fontSize: "15px",
            }}
          >
            {submitting ? "Creating Account..." : "Signup"}
          </button>
        </form>

        <p
          style={{
            marginTop: "18px",
            textAlign: "center",
            color: "#475569",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#4f46e5",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#334155",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  outline: "none",
  fontSize: "15px",
  boxSizing: "border-box",
};