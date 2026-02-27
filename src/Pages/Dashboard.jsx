import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Tooltip, Legend } from "recharts";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");

  // ✅ Search + Sort
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("latest");

  // ✅ Dark Mode
  const [darkMode, setDarkMode] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState("expense");
  const [editCategory, setEditCategory] = useState("Food");
  const [editDate, setEditDate] = useState(() => new Date().toISOString().slice(0, 10));

  const loadData = () => {
    const data = JSON.parse(localStorage.getItem("transactions") || "[]");
    setTransactions(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return ["All", ...Array.from(set)];
  }, [transactions]);

  // ✅ Category + Search + Sort pipeline
  let filteredTransactions = transactions;

  if (categoryFilter !== "All") {
    filteredTransactions = filteredTransactions.filter(
      (t) => t.category === categoryFilter
    );
  }

  if (searchTerm.trim() !== "") {
    filteredTransactions = filteredTransactions.filter((t) =>
      String(t.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (sortType === "amountHigh") {
    filteredTransactions = [...filteredTransactions].sort(
      (a, b) => Number(b.amount || 0) - Number(a.amount || 0)
    );
  } else if (sortType === "amountLow") {
    filteredTransactions = [...filteredTransactions].sort(
      (a, b) => Number(a.amount || 0) - Number(b.amount || 0)
    );
  } else {
    filteredTransactions = [...filteredTransactions].sort(
      (a, b) => Number(b.id || 0) - Number(a.id || 0)
    );
  }

  const income = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const expense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const balance = income - expense;

  const chartData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  const persist = (updatedList) => {
    setTransactions(updatedList);
    localStorage.setItem("transactions", JSON.stringify(updatedList));
  };

  const handleDelete = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    persist(updated);
    if (editingId === id) cancelEdit();
  };

  const handleClearAll = () => {
    localStorage.removeItem("transactions");
    setTransactions([]);
    cancelEdit();
  };

  // ✅ EXPORT CSV
  const exportCSV = () => {
    if (transactions.length === 0) {
      alert("No transactions to export");
      return;
    }

    const headers = ["Title", "Amount", "Type", "Category", "Date"];
    const rows = transactions.map((t) => [
      t.title ?? "",
      t.amount ?? "",
      t.type ?? "",
      t.category ?? "",
      t.date ?? "",
    ]);

    const escapeCSV = (val) => {
      const s = String(val);
      return `"${s.replaceAll('"', '""')}"`;
    };

    const csv =
      [headers, ...rows].map((row) => row.map(escapeCSV).join(",")).join("\n") +
      "\n";

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  // --- EDIT FUNCTIONS ---
  const startEdit = (tx) => {
    setEditingId(tx.id);
    setEditTitle(tx.title || "");
    setEditAmount(String(tx.amount ?? ""));
    setEditType(tx.type || "expense");
    setEditCategory(tx.category || "Food");
    setEditDate(tx.date || new Date().toISOString().slice(0, 10));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditAmount("");
    setEditType("expense");
    setEditCategory("Food");
    setEditDate(new Date().toISOString().slice(0, 10));
  };

  const saveEdit = () => {
    if (!editTitle.trim() || !editAmount) {
      alert("Please fill all fields");
      return;
    }

    const updated = transactions.map((t) => {
      if (t.id !== editingId) return t;

      return {
        ...t,
        title: editTitle.trim(),
        amount: Number(editAmount),
        type: editType,
        category: editCategory,
        date: editDate,
      };
    });

    persist(updated);
    cancelEdit();
  };

  // ✅ Theme helpers
  const bg = darkMode ? "#0b1220" : "#f3f4f6";
  const text = darkMode ? "white" : "black";
  const panel = darkMode ? "#111827" : "white";
  const border = darkMode ? "#1f2937" : "#e5e7eb";

  return (
    <div style={{ padding: "20px", minHeight: "100vh", background: bg, color: text }}>
      <h1 style={{ fontSize: "30px", fontWeight: "bold" }}>Dashboard</h1>

      {/* Controls */}
      <div
        style={{
          marginTop: "15px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label style={{ fontWeight: "bold", marginRight: "8px" }}>Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: `1px solid ${border}`,
              background: panel,
              color: text,
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Search title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "8px",
            border: `1px solid ${border}`,
            background: panel,
            color: text,
          }}
        />

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "8px",
            border: `1px solid ${border}`,
            background: panel,
            color: text,
          }}
        >
          <option value="latest">Latest</option>
          <option value="amountHigh">Amount High → Low</option>
          <option value="amountLow">Amount Low → High</option>
        </select>

        <button
          onClick={() => setDarkMode((v) => !v)}
          style={{
            padding: "8px 12px",
            background: darkMode ? "#e5e7eb" : "#111",
            color: darkMode ? "black" : "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          onClick={handleClearAll}
          style={{
            padding: "8px 12px",
            background: "#111",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Clear All
        </button>

        <button
          onClick={exportCSV}
          style={{
            padding: "8px 12px",
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "15px", marginTop: "20px", flexWrap: "wrap" }}>
        {[
          { label: "Income", value: income },
          { label: "Expense", value: expense },
          { label: "Balance", value: balance },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              padding: "15px",
              border: `1px solid ${border}`,
              width: "220px",
              borderRadius: "10px",
              background: panel,
            }}
          >
            <h3>{card.label}</h3>
            <p style={{ fontSize: "20px", fontWeight: "bold" }}>₹ {card.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <h2 style={{ marginTop: "30px", fontSize: "22px", fontWeight: "bold" }}>
        Reports (Chart)
      </h2>

      <div
        style={{
          marginTop: "10px",
          padding: "15px",
          border: `1px solid ${border}`,
          borderRadius: "10px",
          width: "fit-content",
          background: panel,
        }}
      >
        <PieChart width={320} height={260}>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label />
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Edit Panel */}
      {editingId !== null && (
        <div
          style={{
            marginTop: "30px",
            padding: "15px",
            border: `1px solid ${border}`,
            borderRadius: "10px",
            background: panel,
            maxWidth: "520px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Edit Transaction</h2>

          <div style={{ marginTop: "12px", display: "grid", gap: "10px" }}>
            <div>
              <label>Title</label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{ width: "100%", padding: "10px", border: `1px solid ${border}`, borderRadius: "8px", background: bg, color: text }}
              />
            </div>

            <div>
              <label>Amount</label>
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                style={{ width: "100%", padding: "10px", border: `1px solid ${border}`, borderRadius: "8px", background: bg, color: text }}
              />
            </div>

            <div>
              <label>Type</label>
              <select
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
                style={{ width: "100%", padding: "10px", border: `1px solid ${border}`, borderRadius: "8px", background: bg, color: text }}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label>Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                style={{ width: "100%", padding: "10px", border: `1px solid ${border}`, borderRadius: "8px", background: bg, color: text }}
              >
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Rent">Rent</option>
                <option value="Shopping">Shopping</option>
                <option value="Salary">Salary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label>Date</label>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                style={{ width: "100%", padding: "10px", border: `1px solid ${border}`, borderRadius: "8px", background: bg, color: text }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={saveEdit}
                style={{ padding: "10px 14px", background: "black", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
              >
                Save
              </button>

              <button
                onClick={cancelEdit}
                style={{ padding: "10px 14px", background: "#e5e7eb", color: "black", border: "none", borderRadius: "8px", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transactions */}
      <h2 style={{ marginTop: "30px", fontSize: "22px", fontWeight: "bold" }}>
        Transactions
      </h2>

      {filteredTransactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <ul style={{ marginTop: "10px", padding: 0 }}>
          {filteredTransactions.map((t) => (
            <li
              key={t.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                border: `1px solid ${border}`,
                marginBottom: "10px",
                borderRadius: "10px",
                listStyle: "none",
                background: panel,
              }}
            >
              <div>
                <div style={{ fontWeight: "bold" }}>{t.title}</div>
                <div style={{ fontSize: "14px", opacity: 0.75 }}>
                  {t.type} • {t.category || "Other"} • {t.date || "-"}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontWeight: "bold" }}>
                  {t.type === "income" ? "+" : "-"} ₹{t.amount}
                </span>

                <button
                  onClick={() => startEdit(t)}
                  style={{
                    padding: "6px 10px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(t.id)}
                  style={{
                    padding: "6px 10px",
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
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