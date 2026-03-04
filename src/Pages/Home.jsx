import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleExplore = () => {
    document
      .getElementById("project-info")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetStarted = () => {
    navigate("/add");
  };

  return (
    <div>
      {/* HERO SECTION */}
      <div
        style={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "20px",
          flexDirection: "column",

          // ✅ COLORFUL GRADIENT BACKGROUND
          background:
            "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "52px",
            fontWeight: "900",
            margin: 0,
          }}
        >
          Expense Tracker <br /> Keep Your Finances In Check
        </h1>

        <p style={{ marginTop: "18px", fontSize: "18px", maxWidth: "700px" }}>
          Track all your expenses and incomes in one place. Categorize,
          analyze, and manage your money easily with a modern UI.
        </p>

        <div style={{ marginTop: "25px" }}>
          <button
            onClick={handleExplore}
            style={{
              padding: "10px 18px",
              marginRight: "12px",
              background: "white",
              color: "#4f46e5",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Explore Project
          </button>

          <button
            onClick={handleGetStarted}
            style={{
              padding: "10px 18px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* PROJECT INFO SECTION */}
      <section
        id="project-info"
        style={{
          padding: "70px 20px",
          background: "#f9fafb",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "900",
              color: "#111827",
            }}
          >
            About This Project
          </h2>

          <p style={{ marginTop: "14px", lineHeight: 1.7, color: "#374151" }}>
            Expense Tracker is a React-based web application that helps users
            manage daily income and expenses. Users can add, edit, delete
            transactions, filter and search data, view reports using charts,
            and export transactions to CSV.
          </p>

          <h3 style={{ marginTop: "28px", fontSize: "22px", fontWeight: "800" }}>
            Key Features
          </h3>

          <ul style={{ marginTop: "10px", lineHeight: 1.9 }}>
            <li>✅ Add / Edit / Delete Transactions</li>
            <li>✅ Category Filter + Search + Sort</li>
            <li>✅ Income / Expense / Balance Summary</li>
            <li>✅ Pie Chart Reports</li>
            <li>✅ Export CSV</li>
            <li>✅ Dark Mode</li>
          </ul>
        </div>
      </section>
    </div>
  );
}