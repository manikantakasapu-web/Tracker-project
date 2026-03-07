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
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("transactions") || "[]");
    setTransactions(Array.isArray(data) ? data : []);
  }, []);

  const handleDelete = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    localStorage.setItem("transactions", JSON.stringify(updated));
  };

  const uniqueCategories = useMemo(() => {
    const cats = transactions.map((t) => t.category).filter(Boolean);
    return ["All", ...new Set(cats)];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        String(t.title || "").toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || t.category === categoryFilter;

      const matchesType =
        typeFilter === "All" || t.type === typeFilter;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [transactions, search, categoryFilter, typeFilter]);

  const income = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [filteredTransactions]);

  const expense = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [filteredTransactions]);

  const balance = income - expense;

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

  const barData = useMemo(() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const expenseByMonth = new Array(12).fill(0);

    filteredTransactions.forEach((t) => {
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
  }, [filteredTransactions]);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Monthly Expenses" },
    },
  };

  const exportCSV = () => {
    if (filteredTransactions.length === 0) {
      alert("No transactions to export");
      return;
    }

    const headers = ["Title", "Amount", "Type", "Category", "Date"];
    const rows = filteredTransactions.map((t) => [
      t.title || "",
      t.amount ?? "",
      t.type || "",
      t.category || "",
      t.date || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h1 style={{ margin: 0 }}>Dashboard</h1>

        <div>
          <button
            onClick={() => navigate("/add")}
            style={{
              marginRight: "10px",
              padding: "8px 14px",
              background: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            + Add
          </button>

          <button
            onClick={exportCSV}
            style={{
              padding: "8px 14px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "20px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            minWidth: "220px",
          }}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          {uniqueCategories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <option value="All">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* SUMMARY */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            width: "220px",
            background: "#ecfdf5",
          }}
        >
          <h3>Income</h3>
          <p style={{ color: "#16a34a", fontWeight: "bold" }}>₹ {income}</p>
        </div>

        <div
          style={{
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            width: "220px",
            background: "#fef2f2",
          }}
        >
          <h3>Expense</h3>
          <p style={{ color: "#dc2626", fontWeight: "bold" }}>₹ {expense}</p>
        </div>

        <div
          style={{
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            width: "220px",
            background: "#eff6ff",
          }}
        >
          <h3>Balance</h3>
          <p style={{ color: "#2563eb", fontWeight: "bold" }}>₹ {balance}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          gap: "25px",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "320px",
            padding: "16px",
            border: "1px solid #eee",
            borderRadius: "12px",
            background: "white",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Income vs Expense</h3>
          <Pie data={pieData} />
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "420px",
            padding: "16px",
            border: "1px solid #eee",
            borderRadius: "12px",
            background: "white",
          }}
        >
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* TRANSACTIONS */}
      <h2 style={{ marginTop: "30px" }}>Transactions</h2>

      {filteredTransactions.length === 0 ? (
        <p>No matching transactions found.</p>
      ) : (
        <ul style={{ padding: 0 }}>
          {filteredTransactions.map((t) => (
            <li
              key={t.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                border: "1px solid #eee",
                marginBottom: "10px",
                borderRadius: "8px",
                listStyle: "none",
                background: "white",
              }}
            >
              <div>
                <strong>{t.title}</strong> <br />
                <small>
                  {t.type} • {t.category || "No Category"}
                  {t.date ? ` • ${t.date}` : ""}
                </small>
              </div>

              <div>
                <span
                  style={{
                    marginRight: "10px",
                    fontWeight: "bold",
                    color: t.type === "income" ? "#16a34a" : "#dc2626",
                  }}
                >
                  ₹ {t.amount}
                </span>

                <button
                  onClick={() => navigate(`/edit/${t.id}`)}
                  style={{
                    marginRight: "6px",
                    padding: "5px 10px",
                    background: "#f59e0b",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(t.id)}
                  style={{
                    padding: "5px 10px",
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}