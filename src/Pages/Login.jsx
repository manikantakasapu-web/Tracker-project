import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      alert("User not found. Please signup.");
      return;
    }

    if (email === savedUser.email && password === savedUser.password) {

      localStorage.setItem("loggedIn", true);

      alert("Login successful");

      navigate("/dashboard");

    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin} style={{ maxWidth: "400px" }}>

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
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          Login
        </button>

      </form>
    </div>
  );
}