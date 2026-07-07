import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Stock from "./pages/Stock";
import Customers from "./pages/Customers";
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


      {/* Products */}
      <Route
        path="/products"
        element={<Products />}
      />


      {/* Sales */}
      <Route
        path="/sales"
        element={<Sales />}
      />


      {/* Stock */}
      <Route
        path="/stock"
        element={<Stock />}
      />


      {/* Customers */}
      <Route
        path="/customers"
        element={<Customers />}
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