import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import CustomerProfile from "./pages/CustomerProfile";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>

      {/* Dashboard */}
      <Route 
        path="/" 
        element={<Dashboard />} 
      />


      {/* Inventory (products + stock, combined) */}
      <Route
        path="/inventory"
        element={<Inventory />}
      />


      {/* Customers */}
      <Route
        path="/customers"
        element={<Customers />}
      />

      {/* Customer Profile */}
      <Route
        path="/customers/:id"
        element={<CustomerProfile />}
      />


      {/* Reports */}
      <Route
        path="/reports"
        element={<Reports />}
      />


      {/* Settings */}
      <Route
        path="/settings"
        element={<Settings />}
      />


    </Routes>
  );
}