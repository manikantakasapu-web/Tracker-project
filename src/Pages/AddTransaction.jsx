import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddTransaction() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [customCategory, setCustomCategory] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalCategory = category === "Other" ? customCategory.trim() : category;
    const finalTitle = title.trim();
    const finalAmount = Number(amount);

    if (!finalTitle || !amount || !finalCategory || !date) {
      alert("Please fill all fields");
      return;
    }

    if (finalAmount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    if (category === "Other" && !customCategory.trim()) {
      alert("Please enter custom category");
      return;
    }

    setSubmitting(true);

    axios
      .post("http://127.0.0.1:8000/api/transactions/", {
        title: finalTitle,
        amount: finalAmount,
        type,
        category: finalCategory,
        date,
      })
      .then(() => {
        alert("Transaction added successfully");
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log("Error adding transaction:", err);
        alert("Failed to add transaction");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "620px",
          margin: "0 auto",
          background: "white",
          borderRadius: "22px",
          boxShadow: "0 12px 35px rgba(15,23,42,0.08)",
          padding: "32px",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "34px",
              fontWeight: "800",
              margin: 0,
              color: "#0f172a",
            }}
          >
            Add Transaction
          </h1>
          <p
            style={{
              marginTop: "8px",
              color: "#64748b",
              fontSize: "15px",
            }}
          >
            Add a new income or expense record to your tracker.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="eg: Biryani, Salary, Petrol"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Amount
            </label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              placeholder="eg: 500"
              style={inputStyle}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#334155",
                }}
              >
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={inputStyle}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#334155",
                }}
              >
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (e.target.value !== "Other") {
                  setCustomCategory("");
                }
              }}
              style={inputStyle}
            >
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Rent">Rent</option>
              <option value="Shopping">Shopping</option>
              <option value="Salary">Salary</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {category === "Other" && (
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#334155",
                }}
              >
                Custom Category
              </label>
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter your custom category"
                style={{
                  ...inputStyle,
                  border: "1px solid #6366f1",
                }}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "24px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "12px 18px",
                background: submitting ? "#94a3b8" : "#6366f1",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: submitting ? "not-allowed" : "pointer",
                fontWeight: "700",
                boxShadow: "0 8px 20px rgba(99,102,241,0.25)",
              }}
            >
              {submitting ? "Adding..." : "Add Transaction"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              disabled={submitting}
              style={{
                padding: "12px 18px",
                background: "#e2e8f0",
                color: "#0f172a",
                border: "none",
                borderRadius: "10px",
                cursor: submitting ? "not-allowed" : "pointer",
                fontWeight: "700",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  outline: "none",
  fontSize: "15px",
  boxSizing: "border-box",
  background: "#fff",
};