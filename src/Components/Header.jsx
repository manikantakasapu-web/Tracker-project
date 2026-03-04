import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header
      style={{
        width: "100%",
        padding: "12px 35px",
        background: "linear-gradient(90deg,#111827,#1f2937)",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 3px 12px rgba(0,0,0,0.3)",
      }}
    >
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          textDecoration: "none",
          color: "white",
        }}
      >
        {/* LOGO */}
        <img
          src="/logo.png"
          alt="Logo"
          style={{
            width: "60px",
            height: "60px",
            objectFit: "contain",
            borderRadius: "10px",
            background: "white",
            padding: "4px",
            display: "block",
          }}
        />

        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700" }}>
          Expense Tracker
        </h2>
      </Link>

      <nav style={{ display: "flex", gap: "25px", alignItems: "center" }}>
        <Link
          to="/"
          style={{ color: "white", textDecoration: "none", fontWeight: "500" }}
        >
          Home
        </Link>

        <Link
          to="/dashboard"
          style={{ color: "white", textDecoration: "none", fontWeight: "500" }}
        >
          Dashboard
        </Link>

        <Link
          to="/add"
          style={{
            background: "#6366f1",
            padding: "8px 16px",
            borderRadius: "8px",
            color: "white",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          + Add
        </Link>
      </nav>
    </header>
  );
}