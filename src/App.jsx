import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";

import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import AddTransaction from "./Pages/AddTransaction";
import EditTransaction from "./Pages/EditTransaction";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        <Routes>

          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Transactions */}
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/edit/:id" element={<EditTransaction />} />

        </Routes>
      </div>

    </div>
  );
}