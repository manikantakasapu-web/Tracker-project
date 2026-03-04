import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import AddTransaction from "./Pages/AddTransaction";

export default function App() {
  return (
    // Full page layout
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      <Header />

      {/* Main area */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add" element={<AddTransaction />} />
        </Routes>
      </div>

    </div>
  );
} 