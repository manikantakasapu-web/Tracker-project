import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";

import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import AddTransaction from "./Pages/AddTransaction";
import EditTransaction from "./Pages/EditTransaction";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/add" element={<AddTransaction />} />

          {/* Edit Transaction Route */}
          <Route path="/edit/:id" element={<EditTransaction />} />

        </Routes>
      </div>

    </div>
  );
}