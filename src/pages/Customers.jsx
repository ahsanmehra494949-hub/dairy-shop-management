import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  LuUsers,
  LuUserPlus,
  LuShoppingCart,
  LuTrendingUp,
  LuSearch,
  LuEye,
  LuPencil,
  LuTrash2,
} from "react-icons/lu";

import Layout from "../components/Layout";
import CustomerModal from "../components/CustomerModal";
import { useShop } from "../context/ShopContext";

export default function Customers() {
  const navigate = useNavigate();
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useShop();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.includes(search)
  );

  const totalOrders = customers.reduce((sum, c) => sum + (c.orders || 0), 0);
  const totalRevenue = customers.reduce((sum, c) => sum + (c.total || 0), 0);

  const openAddModal = () => {
    setEditingCustomer(null);
    setModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setModalOpen(true);
  };

  const handleSave = (form) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, form);
    } else {
      addCustomer(form);
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteCustomer(id);
    }
  };

  return (
    <Layout title="Customers">
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-ink-900">Customer Management</h1>
          <p className="text-sm text-ink-500 mt-1">Manage customers and purchase history</p>

          <button
            onClick={openAddModal}
            className="mt-4 flex items-center gap-2 bg-primary-600 hover:bg-primary-700 transition-colors text-white px-5 py-3 rounded-xl shadow-sm"
          >
            <LuUserPlus />
            Add Customer
          </button>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Card title="Total Customers" value={customers.length} icon={LuUsers} />
          <Card title="Total Orders" value={totalOrders} icon={LuShoppingCart} />
          <Card title="Revenue" value={`Rs ${totalRevenue.toLocaleString()}`} icon={LuTrendingUp} />
          <Card
            title="Active Customers"
            value={customers.filter((x) => x.status === "Active").length}
            icon={LuUsers}
          />
        </div>

        {/* SEARCH */}
        <div className="bg-white p-5 rounded-2xl border">
          <div className="flex items-center gap-3 border rounded-xl px-4 py-3 focus-within:border-primary-500 transition-colors">
            <LuSearch className="text-slate-400" />
            <input
              placeholder="Search customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none w-full text-sm"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <h2 className="p-5 text-xl font-semibold border-b text-slate-900">Customer List</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Orders</th>
                  <th className="p-4">Total Spend</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {/* NAME */}
                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/customers/${customer.id}`)}
                        className="group flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-800 hover:underline text-left"
                        title="Click to view full profile"
                      >
                        {customer.name}
                        <LuEye size={14} className="text-primary-400 shrink-0" />
                      </button>
                    </td>

                    {/* PHONE */}
                    <td className="p-4 font-mono text-slate-600">{customer.phone}</td>

                    {/* ORDERS */}
                    <td className="p-4">{customer.orders}</td>

                    {/* TOTAL SPEND */}
                    <td className="p-4 font-medium text-slate-900">
                      Rs {Number(customer.total || 0).toLocaleString()}
                    </td>

                    {/* ACTION COLUMN */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Action */}
                        <button
                          onClick={() => openEditModal(customer)}
                          className="p-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all shadow-sm cursor-pointer flex items-center justify-center"
                          title="Edit Customer"
                        >
                          <LuPencil size={15} />
                        </button>

                        {/* Delete Action */}
                        <button
                          onClick={() => handleDelete(customer.id, customer.name)}
                          className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all shadow-sm cursor-pointer flex items-center justify-center"
                          title="Delete Customer"
                        >
                          <LuTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-sm text-ink-500">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <CustomerModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditingCustomer(null); }}
          onSave={handleSave}
          initialData={editingCustomer}
        />
      </div>
    </Layout>
  );
}

function Card({ title, value, icon: Icon }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white p-5 rounded-2xl border shadow-card">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-2xl font-bold mt-2 text-slate-900">{value}</h2>
        </div>

        <div className="bg-primary-50 text-primary-600 p-3 rounded-xl">
          <Icon size={20} />
        </div>
      </div>
    </motion.div>
  );
}