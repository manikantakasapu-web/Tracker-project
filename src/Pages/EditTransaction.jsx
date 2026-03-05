import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTransaction() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("transactions") || "[]");
    const tx = data.find((t) => String(t.id) === String(id));

    if (!tx) {
      alert("Transaction not found!");
      navigate("/dashboard");
      return;
    }

    setTitle(tx.title || "");
    setAmount(String(tx.amount ?? ""));
    setType(tx.type || "expense");
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !amount) {
      alert("Please fill all fields");
      return;
    }

    const data = JSON.parse(localStorage.getItem("transactions") || "[]");

    const updated = data.map((t) =>
      String(t.id) === String(id)
        ? { ...t, title, amount: Number(amount), type }
        : t
    );

    localStorage.setItem("transactions", JSON.stringify(updated));
    navigate("/dashboard");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "30px", fontWeight: "bold" }}>Edit Transaction</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px", maxWidth: "420px" }}>
        <div style={{ marginBottom: "12px" }}>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="eg: Food, Salary"
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Amount</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="eg: 500"
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
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