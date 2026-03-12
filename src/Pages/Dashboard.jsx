import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [loading, setLoading] = useState(true);

  const fetchTransactions = () => {
    setLoading(true);

    axios
      .get("http://127.0.0.1:8000/api/transactions/")
      .then((res) => {
        setTransactions(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching transactions:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirmDelete) return;

    axios
      .delete(`http://127.0.0.1:8000/api/transactions/${id}/`)
      .then(() => {
        fetchTransactions();
      })
      .catch((err) => {
        console.log("Error deleting transaction:", err);
        alert("Failed to delete transaction");
      });
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

  const totalTransactions = filteredTransactions.length;

  const highestExpense = Math.max(
    ...filteredTransactions
      .filter((t) => t.type === "expense")
      .map((t) => Number(t.amount || 0)),
    0
  );

  const highestIncome = Math.max(
    ...filteredTransactions
      .filter((t) => t.type === "income")
      .map((t) => Number(t.amount || 0)),
    0
  );

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
          borderRadius: 6,
        },
      ],
    };
  }, [filteredTransactions]);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Monthly Expenses Overview" },
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

  if (loading) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          fontWeight: "700",
          color: "#334155",
          background: "#f8fafc",
        }}
      >
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "40px",
                color: "#0f172a",
              }}
            >
              Dashboard
            </h1>
            <p
              style={{
                marginTop: "6px",
                color: "#64748b",
              }}
            >
              Manage your transactions and track your financial activity.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/add")}
              style={{
                padding: "10px 16px",
                background: "#6366f1",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "700",
                boxShadow: "0 4px 12px rgba(99,102,241,0.25)",
              }}
            >
              + Add Transaction
            </button>

            <button
              onClick={exportCSV}
              style={{
                padding: "10px 16px",
                background: "#111827",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              Export CSV
            </button>
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "18px",
            boxShadow: "0 6px 24px rgba(15,23,42,0.06)",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "12px",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                minWidth: "240px",
                outline: "none",
              }}
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: "12px",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                outline: "none",
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
                padding: "12px",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                outline: "none",
              }}
            >
              <option value="All">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "18px",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
              padding: "22px",
              borderRadius: "18px",
              boxShadow: "0 8px 24px rgba(22,163,74,0.08)",
            }}
          >
            <p style={{ margin: 0, color: "#166534", fontWeight: "600" }}>
              Total Income
            </p>
            <h2 style={{ marginTop: "12px", color: "#16a34a", fontSize: "32px" }}>
              ₹ {income}
            </h2>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #fff1f2, #ffe4e6)",
              padding: "22px",
              borderRadius: "18px",
              boxShadow: "0 8px 24px rgba(220,38,38,0.08)",
            }}
          >
            <p style={{ margin: 0, color: "#991b1b", fontWeight: "600" }}>
              Total Expense
            </p>
            <h2 style={{ marginTop: "12px", color: "#dc2626", fontSize: "32px" }}>
              ₹ {expense}
            </h2>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
              padding: "22px",
              borderRadius: "18px",
              boxShadow: "0 8px 24px rgba(37,99,235,0.08)",
            }}
          >
            <p style={{ margin: 0, color: "#1d4ed8", fontWeight: "600" }}>
              Current Balance
            </p>
            <h2 style={{ marginTop: "12px", color: "#2563eb", fontSize: "32px" }}>
              ₹ {balance}
            </h2>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
            marginBottom: "28px",
          }}
        >
          <div style={extraStatCard}>
            <p style={extraStatTitle}>Total Transactions</p>
            <h3 style={extraStatValue}>{totalTransactions}</h3>
          </div>

          <div style={extraStatCard}>
            <p style={extraStatTitle}>Highest Expense</p>
            <h3 style={{ ...extraStatValue, color: "#dc2626" }}>₹ {highestExpense}</h3>
          </div>

          <div style={extraStatCard}>
            <p style={extraStatTitle}>Highest Income</p>
            <h3 style={{ ...extraStatValue, color: "#16a34a" }}>₹ {highestIncome}</h3>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(300px, 360px) minmax(0, 1fr)",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "20px",
              boxShadow: "0 6px 24px rgba(15,23,42,0.06)",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#0f172a" }}>Income vs Expense</h3>
            <Pie data={pieData} />
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "20px",
              boxShadow: "0 6px 24px rgba(15,23,42,0.06)",
              minWidth: 0,
            }}
          >
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "22px",
            boxShadow: "0 6px 24px rgba(15,23,42,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "18px",
            }}
          >
            <div>
              <h2 style={{ margin: 0, color: "#0f172a" }}>Recent Transactions</h2>
              <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                View, edit, and delete your transaction history.
              </p>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                border: "1px dashed #cbd5e1",
                borderRadius: "14px",
                background: "#f8fafc",
              }}
            >
              <h3 style={{ marginBottom: "8px", color: "#334155" }}>
                No transactions found
              </h3>
              <p style={{ color: "#64748b", marginBottom: "16px" }}>
                Add a new transaction or try changing your filters.
              </p>
              <button
                onClick={() => navigate("/add")}
                style={{
                  padding: "10px 16px",
                  background: "#6366f1",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                Add Transaction
              </button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "850px",
                }}
              >
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={tableHeadStyle}>Title</th>
                    <th style={tableHeadStyle}>Amount</th>
                    <th style={tableHeadStyle}>Type</th>
                    <th style={tableHeadStyle}>Category</th>
                    <th style={tableHeadStyle}>Date</th>
                    <th style={tableHeadStyle}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={tableCellStyle}>{t.title}</td>

                      <td
                        style={{
                          ...tableCellStyle,
                          fontWeight: "700",
                          color: t.type === "income" ? "#16a34a" : "#dc2626",
                        }}
                      >
                        ₹ {t.amount}
                      </td>

                      <td style={tableCellStyle}>
                        <span
                          style={{
                            padding: "6px 10px",
                            borderRadius: "999px",
                            fontSize: "13px",
                            fontWeight: "600",
                            background:
                              t.type === "income" ? "#dcfce7" : "#fee2e2",
                            color:
                              t.type === "income" ? "#166534" : "#991b1b",
                          }}
                        >
                          {t.type}
                        </span>
                      </td>

                      <td style={tableCellStyle}>{t.category || "No Category"}</td>
                      <td style={tableCellStyle}>{t.date || "-"}</td>

                      <td style={tableCellStyle}>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <button
                            onClick={() => navigate(`/edit/${t.id}`)}
                            style={{
                              padding: "8px 12px",
                              background: "#f59e0b",
                              color: "white",
                              border: "none",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(t.id)}
                            style={{
                              padding: "8px 12px",
                              background: "#dc2626",
                              color: "white",
                              border: "none",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const tableHeadStyle = {
  textAlign: "left",
  padding: "14px",
  color: "#334155",
  fontSize: "14px",
  fontWeight: "700",
};

const tableCellStyle = {
  textAlign: "left",
  padding: "14px",
  color: "#0f172a",
  fontSize: "15px",
};

const extraStatCard = {
  background: "white",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 6px 24px rgba(15,23,42,0.06)",
};

const extraStatTitle = {
  margin: 0,
  color: "#64748b",
  fontWeight: "600",
  fontSize: "15px",
};

const extraStatValue = {
  marginTop: "12px",
  marginBottom: 0,
  color: "#0f172a",
  fontSize: "30px",
  fontWeight: "800",
};