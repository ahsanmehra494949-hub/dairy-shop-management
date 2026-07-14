import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Inventory from "./pages/Inventory";
import Invoices from "./pages/Invoices";
import Customers from "./pages/Customers";
import CustomerProfile from "./pages/CustomerProfile";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>

      {/* Dashboard */}
      <Route 
        path="/" 
        element={<Dashboard />} 
      />


      {/* Point of Sale */}
      <Route
        path="/pos"
        element={<POS />}
      />


      {/* Inventory (products + stock, combined) */}
      <Route
        path="/inventory"
        element={<Inventory />}
      />


      {/* Invoices */}
      <Route
        path="/invoices"
        element={<Invoices />}
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

      {/* Profile */}
      <Route
        path="/profile"
        element={<Profile />}
      />


    </Routes>
  );
}