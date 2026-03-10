import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditTransaction() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/transactions/${id}/`)
      .then((res) => {
        const tx = res.data;
        setTitle(tx.title || "");
        setAmount(String(tx.amount ?? ""));
        setType(tx.type || "expense");
        setCategory(tx.category || "Food");
        setDate(tx.date || "");
      })
      .catch((err) => {
        console.log("Error fetching transaction:", err);
        alert("Transaction not found!");
        navigate("/dashboard");
      });
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !amount || !date) {
      alert("Please fill all fields");
      return;
    }

    axios
      .put(`http://127.0.0.1:8000/api/transactions/${id}/`, {
        title: title.trim(),
        amount: Number(amount),
        type,
        category,
        date,
      })
      .then(() => {
        alert("Transaction updated successfully");
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log("Error updating transaction:", err);
        alert("Failed to update transaction");
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "30px", fontWeight: "bold" }}>
        Edit Transaction
      </h1>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px", maxWidth: "420px" }}>
        <div style={{ marginBottom: "12px" }}>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="eg: Food, Salary"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Amount</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="eg: 500"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Rent">Rent</option>
            <option value="Shopping">Shopping</option>
            <option value="Salary">Salary</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 14px",
            background: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          Update
        </button>
      </form>
    </div>
  );
}