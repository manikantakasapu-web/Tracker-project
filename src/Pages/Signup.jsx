import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      alert("Username and password are required");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/signup/", {
        username: cleanUsername,
        password: cleanPassword,
      });

      alert(res.data?.message || "Signup successful");
      navigate("/login");
    } catch (err) {
      console.log("Signup error:", err);
      console.log("Signup error response:", err.response?.data);

      alert(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Signup failed"
      );
    }
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
            cursor: "pointer",
          }}
        >
          Signup
        </button>
      </form>
    </div>
  );
}