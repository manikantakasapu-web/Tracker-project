import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    alert("Logged out successfully");
    navigate("/login");
  };

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

        {isLoggedIn && (
          <Link
            to="/dashboard"
            style={{ color: "white", textDecoration: "none", fontWeight: "500" }}
          >
            Dashboard
          </Link>
        )}

        {!isLoggedIn && (
          <>
            <Link
              to="/login"
              style={{ color: "white", textDecoration: "none", fontWeight: "500" }}
            >
              Login
            </Link>

            <Link
              to="/signup"
              style={{ color: "white", textDecoration: "none", fontWeight: "500" }}
            >
              Signup
            </Link>
          </>
        )}

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 14px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}