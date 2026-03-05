import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");

  const loadData = () => {
    const data = JSON.parse(localStorage.getItem("transactions") || "[]");
    setTransactions(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    localStorage.setItem("transactions", JSON.stringify(updated));
  };

  const income = useMemo(() => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [transactions]);

  const expense = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [transactions]);

  const balance = income - expense;

  // Pie chart
  const pieData = useMemo(() => {
    return {
      labels: ["Income", "Expense"],
      datasets: [
        {
          data: [income, expense],
          backgroundColor: ["#16a34a", "#dc2626"],
          borderWidth: 1,
        },
      ],
    };
  }, [income, expense]);

  // Monthly bar chart (uses t.date if exists, else current month)
  const barData = useMemo(() => {
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    const expenseByMonth = new Array(12).fill(0);

    transactions.forEach((t) => {
      if (t.type !== "expense") return;

      let m = new Date().getMonth();
      if (t.date) {
        const d = new Date(t.date);
        if (!isNaN(d.getTime())) m = d.getMonth();
      }
      expenseByMonth[m] += Number(t.amount || 0);
    });

    return {
      labels: months,
      datasets: [
        {
          label: "Monthly Expenses",
          data: expenseByMonth,
          backgroundColor: "#6366f1",
        },
      ],
    };
  }, [transactions]);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Monthly Expenses" },
    },
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter(
      (t) =>
        String(t.title || "").toLowerCase().includes(q) ||
        String(t.type || "").toLowerCase().includes(q)
    );
  }, [transactions, search]);

  return (
    <div style={{ padding: "20px" }}>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ fontSize: "30px", fontWeight: "bold", margin: 0 }}>
          Dashboard
        </h1>

        <button
          onClick={() => navigate("/add")}
          style={{
            padding: "10px 14px",
            background: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          + Add Transaction
        </button>
      </div>

      {/* Summary cards */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            padding: "15px",
            border: "1px solid #ddd",
            width: "220px",
            borderRadius: "12px",
            background: "#ecfdf5",
          }}
        >
          <h3 style={{ margin: 0 }}>Income</h3>
          <p
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginTop: "8px",
              color: "#16a34a",
            }}
          >
            ₹ {income}
          </p>
        </div>

        <div
          style={{
            padding: "15px",
            border: "1px solid #ddd",
            width: "220px",
            borderRadius: "12px",
            background: "#fef2f2",
          }}
        >
          <h3 style={{ margin: 0 }}>Expense</h3>
          <p
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginTop: "8px",
              color: "#dc2626",
            }}
          >
            ₹ {expense}
          </p>
        </div>

        <div
          style={{
            padding: "15px",
            border: "1px solid #ddd",
            width: "220px",
            borderRadius: "12px",
            background: "#eff6ff",
          }}
        >
          <h3 style={{ margin: 0 }}>Balance</h3>
          <p
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginTop: "8px",
              color: "#2563eb",
            }}
          >
            ₹ {balance}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          gap: "30px",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "320px",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            background: "white",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Income vs Expense</h3>
          <Pie data={pieData} />
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "380px",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            background: "white",
          }}
        >
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Transactions header + search */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "bold", margin: 0 }}>
          Transactions
        </h2>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search (title/type)"
          style={{
            padding: "10px 12px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            width: "260px",
          }}
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p style={{ marginTop: "10px" }}>
          {transactions.length === 0
            ? "No transactions yet."
            : "No matching transactions."}
        </p>
      ) : (
        <ul style={{ marginTop: "12px", padding: 0 }}>
          {filtered.map((t) => {
            const isIncome = t.type === "income";
            return (
              <li
                key={t.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px",
                  border: "1px solid #eee",
                  marginBottom: "10px",
                  borderRadius: "12px",
                  listStyle: "none",
                  background: "white",
                }}
              >
                <div>
                  <div style={{ fontWeight: "bold" }}>{t.title}</div>
                  <div style={{ fontSize: "14px", opacity: 0.7 }}>
                    {t.type}
                    {t.date ? ` • ${t.date}` : ""}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      color: isIncome ? "#16a34a" : "#dc2626",
                      minWidth: "110px",
                      textAlign: "right",
                    }}
                  >
                    {isIncome ? "+" : "-"} ₹{t.amount}
                  </span>

                  {/* ✅ EDIT BUTTON */}
                  <button
                    onClick={() => navigate(`/edit/${t.id}`)}
                    style={{
                      padding: "7px 12px",
                      background: "#f59e0b",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "700",
                    }}
                  >
                    Edit
                  </button>

                  {/* ✅ DELETE BUTTON */}
                  <button
                    onClick={() => handleDelete(t.id)}
                    style={{
                      padding: "7px 12px",
                      background: "#dc2626",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "700",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}