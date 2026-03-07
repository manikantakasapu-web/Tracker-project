import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    const user = { email, password };

    localStorage.setItem("user", JSON.stringify(user));

    alert("Signup successful!");

    navigate("/login");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Signup</h1>

      <form onSubmit={handleSignup} style={{ maxWidth: "400px" }}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button
          style={{
            padding: "10px 20px",
            background: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          Signup
        </button>

      </form>
    </div>
  );
}