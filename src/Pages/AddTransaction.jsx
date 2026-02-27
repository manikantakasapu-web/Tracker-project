import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTransaction() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(() => {
    // yyyy-mm-dd (for input type="date")
    return new Date().toISOString().slice(0, 10);
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !amount) {
      alert("Please fill all fields");
      return;
    }

    const newTx = {
      id: Date.now(),
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      date, // yyyy-mm-dd
    };

    const old = JSON.parse(localStorage.getItem("transactions") || "[]");
    localStorage.setItem("transactions", JSON.stringify([newTx, ...old]));

    navigate("/dashboard");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "30px", fontWeight: "bold" }}>Add Transaction</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px", maxWidth: "420px" }}>
        <div style={{ marginBottom: "12px" }}>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="eg: Biryani, Salary"
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
            background: "black",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </form>
    </div>
  );
}