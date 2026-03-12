import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("loggedIn");

  const handleExplore = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div style={{ background: "#f8fafc" }}>
      {/* HERO SECTION */}
      <section
        style={{
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          background: "linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899)",
          color: "white",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "1000px" }}>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: "700",
              letterSpacing: "1px",
              textTransform: "uppercase",
              opacity: 0.9,
            }}
          >
            Smart Personal Finance Management
          </p>

          <h1
            style={{
              fontSize: "58px",
              fontWeight: "900",
              lineHeight: 1.15,
              margin: "18px 0 0",
            }}
          >
            Expense Tracker <br />
            Keep Your Finances In Check
          </h1>

          <p
            style={{
              margin: "22px auto 0",
              fontSize: "18px",
              maxWidth: "760px",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            Track income and expenses, manage categories, analyze your spending
            with visual reports, and export your data easily — all in one
            modern dashboard.
          </p>

          <div
            style={{
              marginTop: "30px",
              display: "flex",
              justifyContent: "center",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={handleExplore}
              style={{
                padding: "12px 22px",
                background: "white",
                color: "#4f46e5",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
              }}
            >
              Explore Features
            </button>

            <button
              onClick={handleGetStarted}
              style={{
                padding: "12px 22px",
                background: "#111827",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              {isLoggedIn ? "Go to Dashboard" : "Get Started"}
            </button>
          </div>

          <div
            style={{
              marginTop: "42px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
            }}
          >
            <div style={heroStatCard}>
              <h3 style={heroStatValue}>Add</h3>
              <p style={heroStatLabel}>Transactions Easily</p>
            </div>

            <div style={heroStatCard}>
              <h3 style={heroStatValue}>Track</h3>
              <p style={heroStatLabel}>Income & Expenses</p>
            </div>

            <div style={heroStatCard}>
              <h3 style={heroStatValue}>Analyze</h3>
              <p style={heroStatLabel}>Charts & Reports</p>
            </div>

            <div style={heroStatCard}>
              <h3 style={heroStatValue}>Export</h3>
              <p style={heroStatLabel}>CSV Statements</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section
        style={{
          padding: "80px 20px 30px",
          background: "#f8fafc",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "38px",
              fontWeight: "900",
              color: "#0f172a",
              margin: 0,
            }}
          >
            About This Project
          </h2>

          <p
            style={{
              margin: "18px auto 0",
              lineHeight: 1.9,
              color: "#475569",
              maxWidth: "850px",
              fontSize: "17px",
            }}
          >
            Expense Tracker is a React and Django based web application designed
            to help users record daily financial activity in a simple and smart
            way. It allows users to manage transactions, view insights through
            charts, filter records, and maintain better control over their
            budget.
          </p>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        id="features"
        style={{
          padding: "40px 20px 80px",
          background: "#f8fafc",
        }}
      >
        <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "34px" }}>
            <h2
              style={{
                fontSize: "38px",
                fontWeight: "900",
                color: "#0f172a",
                margin: 0,
              }}
            >
              Key Features
            </h2>
            <p style={{ color: "#64748b", marginTop: "10px", fontSize: "16px" }}>
              Powerful modules that make the project look practical and professional.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
            }}
          >
            <div style={featureCard}>
              <h3 style={featureTitle}>Add / Edit / Delete</h3>
              <p style={featureText}>
                Manage your income and expense records easily with full
                transaction control.
              </p>
            </div>

            <div style={featureCard}>
              <h3 style={featureTitle}>Smart Dashboard</h3>
              <p style={featureText}>
                View total income, expense, and current balance in a clean
                dashboard layout.
              </p>
            </div>

            <div style={featureCard}>
              <h3 style={featureTitle}>Search & Filters</h3>
              <p style={featureText}>
                Filter by category and type, and search transactions instantly
                by title.
              </p>
            </div>

            <div style={featureCard}>
              <h3 style={featureTitle}>Visual Analytics</h3>
              <p style={featureText}>
                Analyze financial activity using pie charts and monthly expense
                bar charts.
              </p>
            </div>

            <div style={featureCard}>
              <h3 style={featureTitle}>Custom Category</h3>
              <p style={featureText}>
                Select predefined categories or create your own custom category
                using Other.
              </p>
            </div>

            <div style={featureCard}>
              <h3 style={featureTitle}>Export CSV</h3>
              <p style={featureText}>
                Download transaction records as CSV for reporting and data
                management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        style={{
          padding: "80px 20px",
          background: "white",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "34px" }}>
            <h2
              style={{
                fontSize: "38px",
                fontWeight: "900",
                color: "#0f172a",
                margin: 0,
              }}
            >
              How It Works
            </h2>
            <p style={{ color: "#64748b", marginTop: "10px", fontSize: "16px" }}>
              A simple flow that makes expense tracking easy for users.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            <div style={stepCard}>
              <div style={stepNumber}>1</div>
              <h3 style={stepTitle}>Create an Account</h3>
              <p style={stepText}>
                Sign up and log in securely to access your personal expense dashboard.
              </p>
            </div>

            <div style={stepCard}>
              <div style={stepNumber}>2</div>
              <h3 style={stepTitle}>Add Transactions</h3>
              <p style={stepText}>
                Record income and expenses with title, amount, category, type,
                and date.
              </p>
            </div>

            <div style={stepCard}>
              <div style={stepNumber}>3</div>
              <h3 style={stepTitle}>Analyze Reports</h3>
              <p style={stepText}>
                View charts, summaries, filters, and exported reports to track
                spending patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT HIGHLIGHTS */}
      <section
        style={{
          padding: "80px 20px",
          background: "#eef2ff",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          <div style={highlightCard}>
            <h3 style={highlightValue}>100%</h3>
            <p style={highlightText}>Responsive user-friendly interface</p>
          </div>

          <div style={highlightCard}>
            <h3 style={highlightValue}>CRUD</h3>
            <p style={highlightText}>Complete transaction management</p>
          </div>

          <div style={highlightCard}>
            <h3 style={highlightValue}>Charts</h3>
            <p style={highlightText}>Pie and monthly expense analytics</p>
          </div>

          <div style={highlightCard}>
            <h3 style={highlightValue}>CSV</h3>
            <p style={highlightText}>Exportable data for reporting</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        style={{
          padding: "80px 20px",
          background: "linear-gradient(135deg, #111827, #1f2937)",
          color: "white",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "40px",
              fontWeight: "900",
              margin: 0,
            }}
          >
            Start Managing Your Money Smarter
          </h2>

          <p
            style={{
              marginTop: "14px",
              color: "#d1d5db",
              fontSize: "17px",
              lineHeight: 1.8,
            }}
          >
            Use the Expense Tracker dashboard to monitor transactions, control
            spending, and gain clear financial insights.
          </p>

          <button
            onClick={handleGetStarted}
            style={{
              marginTop: "24px",
              padding: "12px 24px",
              background: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 10px 24px rgba(99,102,241,0.25)",
            }}
          >
            {isLoggedIn ? "Open Dashboard" : "Create Account"}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "#0f172a",
          color: "#cbd5e1",
          padding: "26px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h3
            style={{
              margin: 0,
              color: "white",
              fontSize: "22px",
              fontWeight: "800",
            }}
          >
            Expense Tracker
          </h3>
          <p style={{ marginTop: "10px", lineHeight: 1.8 }}>
            A modern web application for managing personal income and expenses.
          </p>
          <p style={{ marginTop: "8px", fontSize: "14px", color: "#94a3b8" }}>
            © 2026 Expense Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const heroStatCard = {
  background: "rgba(255,255,255,0.14)",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: "16px",
  padding: "18px",
  backdropFilter: "blur(8px)",
};

const heroStatValue = {
  margin: 0,
  fontSize: "26px",
  fontWeight: "800",
  color: "white",
};

const heroStatLabel = {
  margin: "8px 0 0",
  color: "rgba(255,255,255,0.88)",
  fontSize: "14px",
};

const featureCard = {
  background: "white",
  borderRadius: "18px",
  padding: "22px",
  boxShadow: "0 10px 26px rgba(15,23,42,0.06)",
  border: "1px solid #e2e8f0",
};

const featureTitle = {
  margin: 0,
  fontSize: "20px",
  fontWeight: "800",
  color: "#0f172a",
};

const featureText = {
  marginTop: "12px",
  color: "#64748b",
  lineHeight: 1.8,
  fontSize: "15px",
};

const stepCard = {
  background: "#f8fafc",
  borderRadius: "18px",
  padding: "24px",
  border: "1px solid #e2e8f0",
};

const stepNumber = {
  width: "42px",
  height: "42px",
  borderRadius: "999px",
  background: "#6366f1",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "800",
  marginBottom: "14px",
};

const stepTitle = {
  margin: 0,
  fontSize: "20px",
  fontWeight: "800",
  color: "#0f172a",
};

const stepText = {
  marginTop: "12px",
  color: "#64748b",
  lineHeight: 1.8,
};

const highlightCard = {
  background: "white",
  borderRadius: "18px",
  padding: "24px",
  textAlign: "center",
  boxShadow: "0 10px 26px rgba(15,23,42,0.06)",
};

const highlightValue = {
  margin: 0,
  fontSize: "34px",
  fontWeight: "900",
  color: "#4f46e5",
};

const highlightText = {
  marginTop: "10px",
  color: "#64748b",
  lineHeight: 1.7,
};