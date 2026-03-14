import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const theme = {
    pageBg: darkMode ? "#0f172a" : "#f8fafc",
    cardBg: darkMode ? "#1e293b" : "#ffffff",
    cardBgSoft: darkMode ? "#111827" : "#f8fafc",
    text: darkMode ? "#f8fafc" : "#0f172a",
    subText: darkMode ? "#94a3b8" : "#64748b",
    border: darkMode ? "#334155" : "#cbd5e1",
    tableHeadBg: darkMode ? "#111827" : "#f8fafc",
    rowBorder: darkMode ? "#334155" : "#e2e8f0",
    inputBg: darkMode ? "#0f172a" : "#ffffff",
    inputText: darkMode ? "#f8fafc" : "#0f172a",
    shadow: darkMode
      ? "0 6px 24px rgba(0,0,0,0.35)"
      : "0 6px 24px rgba(15,23,42,0.06)",
  };

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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
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

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setTypeFilter("All");
    setFromDate("");
    setToDate("");
  };

  const uniqueCategories = useMemo(() => {
    const cats = transactions
      .map((t) => String(t.category || "").trim())
      .filter(Boolean);

    return ["All", ...new Set(cats)];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const titleValue = String(t.title || "").toLowerCase().trim();
      const categoryValue = String(t.category || "").trim();
      const typeValue = String(t.type || "").toLowerCase().trim();
      const transactionDate = String(t.date || "").trim();

      const searchValue = search.toLowerCase().trim();
      const selectedCategory = categoryFilter.trim();
      const selectedType = typeFilter.toLowerCase().trim();

      const matchesSearch = titleValue.includes(searchValue);

      const matchesCategory =
        selectedCategory === "All" || categoryValue === selectedCategory;

      const matchesType =
        selectedType === "all" || typeValue === selectedType;

      let matchesDate = true;

      if (fromDate && transactionDate) {
        matchesDate = matchesDate && transactionDate >= fromDate;
      }

      if (toDate && transactionDate) {
        matchesDate = matchesDate && transactionDate <= toDate;
      }

      if ((fromDate || toDate) && !transactionDate) {
        matchesDate = false;
      }

      return matchesSearch && matchesCategory && matchesType && matchesDate;
    });
  }, [transactions, search, categoryFilter, typeFilter, fromDate, toDate]);

  const income = useMemo(() => {
    return filteredTransactions
      .filter((t) => String(t.type || "").toLowerCase().trim() === "income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [filteredTransactions]);

  const expense = useMemo(() => {
    return filteredTransactions
      .filter((t) => String(t.type || "").toLowerCase().trim() === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [filteredTransactions]);

  const balance = income - expense;
  const totalTransactions = filteredTransactions.length;

  const EXPENSE_LIMIT = 15000;
  const showWarning = expense > EXPENSE_LIMIT;

  const highestExpense = Math.max(
    ...filteredTransactions
      .filter((t) => String(t.type || "").toLowerCase().trim() === "expense")
      .map((t) => Number(t.amount || 0)),
    0
  );

  const highestIncome = Math.max(
    ...filteredTransactions
      .filter((t) => String(t.type || "").toLowerCase().trim() === "income")
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

  const categoryPieData = useMemo(() => {
    const expenseTransactions = filteredTransactions.filter(
      (t) => String(t.type || "").toLowerCase().trim() === "expense"
    );

    const categoryTotals = {};

    expenseTransactions.forEach((t) => {
      const categoryName = String(t.category || "Other").trim();
      categoryTotals[categoryName] =
        (categoryTotals[categoryName] || 0) + Number(t.amount || 0);
    });

    return {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: [
            "#ef4444",
            "#f59e0b",
            "#10b981",
            "#3b82f6",
            "#8b5cf6",
            "#ec4899",
            "#14b8a6",
            "#f97316",
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [filteredTransactions]);

  const barData = useMemo(() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const expenseByMonth = new Array(12).fill(0);

    filteredTransactions.forEach((t) => {
      if (String(t.type || "").toLowerCase().trim() !== "expense") return;

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
      legend: {
        display: true,
        labels: {
          color: darkMode ? "#f8fafc" : "#0f172a",
        },
      },
      title: {
        display: true,
        text: "Monthly Expenses Overview",
        color: darkMode ? "#f8fafc" : "#0f172a",
      },
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? "#cbd5e1" : "#334155",
        },
        grid: {
          color: darkMode ? "#334155" : "#e2e8f0",
        },
      },
      y: {
        ticks: {
          color: darkMode ? "#cbd5e1" : "#334155",
        },
        grid: {
          color: darkMode ? "#334155" : "#e2e8f0",
        },
      },
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

  const exportPDF = () => {
    if (filteredTransactions.length === 0) {
      alert("No transactions to export");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Expense Tracker Report", 14, 20);

    const tableColumn = ["Title", "Amount", "Type", "Category", "Date"];
    const tableRows = filteredTransactions.map((t) => [
      t.title || "",
      t.amount ?? "",
      t.type || "",
      t.category || "",
      t.date || "",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("expense-report.pdf");
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
          color: darkMode ? "#f8fafc" : "#334155",
          background: theme.pageBg,
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
        background: theme.pageBg,
        padding: "30px 20px",
        transition: "0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
        }}
      >
        {showWarning && (
          <div
            style={{
              background: darkMode ? "#3f1d1d" : "#fee2e2",
              color: darkMode ? "#fecaca" : "#991b1b",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "20px",
              fontWeight: "700",
              border: darkMode ? "1px solid #7f1d1d" : "1px solid #fecaca",
              textAlign: "center",
              boxShadow: theme.shadow,
            }}
          >
            ⚠ Warning: Your expenses crossed ₹{EXPENSE_LIMIT}
          </div>
        )}

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
                color: theme.text,
              }}
            >
              Dashboard
            </h1>
            <p
              style={{
                marginTop: "6px",
                color: theme.subText,
              }}
            >
              Manage your transactions and track your financial activity.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={toggleDarkMode}
              style={{
                padding: "10px 16px",
                background: darkMode ? "#facc15" : "#111827",
                color: darkMode ? "#111827" : "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>

            <button
              onClick={() => navigate("/add-transaction")}
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

            <button
              onClick={exportPDF}
              style={{
                padding: "10px 16px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              Download PDF
            </button>
          </div>
        </div>

        <div
          style={{
            background: theme.cardBg,
            borderRadius: "16px",
            padding: "18px",
            boxShadow: theme.shadow,
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
                border: `1px solid ${theme.border}`,
                borderRadius: "10px",
                minWidth: "240px",
                outline: "none",
                background: theme.inputBg,
                color: theme.inputText,
              }}
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: "12px",
                border: `1px solid ${theme.border}`,
                borderRadius: "10px",
                outline: "none",
                background: theme.inputBg,
                color: theme.inputText,
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
                border: `1px solid ${theme.border}`,
                borderRadius: "10px",
                outline: "none",
                background: theme.inputBg,
                color: theme.inputText,
              }}
            >
              <option value="All">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{
                padding: "12px",
                border: `1px solid ${theme.border}`,
                borderRadius: "10px",
                outline: "none",
                background: theme.inputBg,
                color: theme.inputText,
              }}
            />

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{
                padding: "12px",
                border: `1px solid ${theme.border}`,
                borderRadius: "10px",
                outline: "none",
                background: theme.inputBg,
                color: theme.inputText,
              }}
            />

            <button
              onClick={resetFilters}
              style={{
                padding: "12px 16px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Reset Filters
            </button>
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
          <div style={getExtraStatCard(theme)}>
            <p style={getExtraStatTitle(theme)}>Total Transactions</p>
            <h3 style={getExtraStatValue(theme)}>{totalTransactions}</h3>
          </div>

          <div style={getExtraStatCard(theme)}>
            <p style={getExtraStatTitle(theme)}>Highest Expense</p>
            <h3 style={{ ...getExtraStatValue(theme), color: "#dc2626" }}>
              ₹ {highestExpense}
            </h3>
          </div>

          <div style={getExtraStatCard(theme)}>
            <p style={getExtraStatTitle(theme)}>Highest Income</p>
            <h3 style={{ ...getExtraStatValue(theme), color: "#16a34a" }}>
              ₹ {highestIncome}
            </h3>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              background: theme.cardBg,
              borderRadius: "18px",
              padding: "20px",
              boxShadow: theme.shadow,
            }}
          >
            <h3 style={{ marginTop: 0, color: theme.text }}>Income vs Expense</h3>
            <Pie data={pieData} />
          </div>

          <div
            style={{
              background: theme.cardBg,
              borderRadius: "18px",
              padding: "20px",
              boxShadow: theme.shadow,
              minWidth: 0,
            }}
          >
            <Bar data={barData} options={barOptions} />
          </div>

          <div
            style={{
              background: theme.cardBg,
              borderRadius: "18px",
              padding: "20px",
              boxShadow: theme.shadow,
            }}
          >
            <h3 style={{ marginTop: 0, color: theme.text }}>Expenses by Category</h3>

            {categoryPieData.labels.length === 0 ? (
              <p style={{ color: theme.subText }}>No expense data available.</p>
            ) : (
              <Pie data={categoryPieData} />
            )}
          </div>
        </div>

        <div
          style={{
            background: theme.cardBg,
            borderRadius: "18px",
            padding: "22px",
            boxShadow: theme.shadow,
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
              <h2 style={{ margin: 0, color: theme.text }}>Recent Transactions</h2>
              <p style={{ margin: "6px 0 0", color: theme.subText }}>
                View, edit, and delete your transaction history.
              </p>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                border: `1px dashed ${theme.border}`,
                borderRadius: "14px",
                background: theme.cardBgSoft,
              }}
            >
              <h3 style={{ marginBottom: "8px", color: theme.text }}>
                No transactions found
              </h3>
              <p style={{ color: theme.subText, marginBottom: "16px" }}>
                Add a new transaction or try changing your filters.
              </p>
              <button
                onClick={() => navigate("/add-transaction")}
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
                  <tr style={{ background: theme.tableHeadBg }}>
                    <th style={getTableHeadStyle(theme)}>Title</th>
                    <th style={getTableHeadStyle(theme)}>Amount</th>
                    <th style={getTableHeadStyle(theme)}>Type</th>
                    <th style={getTableHeadStyle(theme)}>Category</th>
                    <th style={getTableHeadStyle(theme)}>Date</th>
                    <th style={getTableHeadStyle(theme)}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map((t) => {
                    const normalizedType = String(t.type || "").toLowerCase().trim();
                    const isIncome = normalizedType === "income";

                    return (
                      <tr key={t.id} style={{ borderBottom: `1px solid ${theme.rowBorder}` }}>
                        <td style={getTableCellStyle(theme)}>{t.title}</td>

                        <td
                          style={{
                            ...getTableCellStyle(theme),
                            fontWeight: "700",
                            color: isIncome ? "#16a34a" : "#dc2626",
                          }}
                        >
                          ₹ {t.amount}
                        </td>

                        <td style={getTableCellStyle(theme)}>
                          <span
                            style={{
                              padding: "6px 10px",
                              borderRadius: "999px",
                              fontSize: "13px",
                              fontWeight: "600",
                              background: isIncome ? "#dcfce7" : "#fee2e2",
                              color: isIncome ? "#166534" : "#991b1b",
                            }}
                          >
                            {t.type}
                          </span>
                        </td>

                        <td style={getTableCellStyle(theme)}>
                          {t.category || "No Category"}
                        </td>
                        <td style={getTableCellStyle(theme)}>{t.date || "-"}</td>

                        <td style={getTableCellStyle(theme)}>
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const getTableHeadStyle = (theme) => ({
  textAlign: "left",
  padding: "14px",
  color: theme.subText,
  fontSize: "14px",
  fontWeight: "700",
});

const getTableCellStyle = (theme) => ({
  textAlign: "left",
  padding: "14px",
  color: theme.text,
  fontSize: "15px",
});

const getExtraStatCard = (theme) => ({
  background: theme.cardBg,
  borderRadius: "16px",
  padding: "20px",
  boxShadow: theme.shadow,
});

const getExtraStatTitle = (theme) => ({
  margin: 0,
  color: theme.subText,
  fontWeight: "600",
  fontSize: "15px",
});

const getExtraStatValue = (theme) => ({
  marginTop: "12px",
  marginBottom: 0,
  color: theme.text,
  fontSize: "30px",
  fontWeight: "800",
});