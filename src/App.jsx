import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import ProtectedRoute from "./Components/ProtectedRoute";

import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import AddTransaction from "./Pages/AddTransaction";
import EditTransaction from "./Pages/EditTransaction";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-transaction"
            element={
              <ProtectedRoute>
                <AddTransaction />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditTransaction />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}