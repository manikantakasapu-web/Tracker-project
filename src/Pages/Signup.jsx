import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Username and password are required");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/api/signup/", {
        username: username.trim(),
        password: password.trim(),
      })
      .then((res) => {
        alert("Signup successful");
        navigate("/login");
      })
      .catch((err) => {
        alert(err.response?.data?.error || "Signup failed");
      });
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Signup</h1>

      <form onSubmit={handleSignup} style={{ maxWidth: "400px" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Signup
        </button>
      </form>
    </div>
  );
}