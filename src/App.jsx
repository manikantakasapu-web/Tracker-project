import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";

import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import AddTransaction from "./Pages/AddTransaction";

export default function App() {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddTransaction />} />
      </Routes>
    </div>
  );
}