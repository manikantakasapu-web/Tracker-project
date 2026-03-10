import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post("http://127.0.0.1:8000/api/login/", {
      username: username,
      password: password
    })
    .then((res) => {

      alert("Login successful");

      localStorage.setItem("loggedIn", true);

      navigate("/dashboard");

    })
    .catch((err) => {

      alert("Invalid username or password");

    });
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin} style={{ maxWidth: "400px" }}>

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