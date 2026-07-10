import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuX } from "react-icons/lu";

const emptyForm = { name: "", email: "", phone: "", address: "" };

export default function CustomerModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!form.name || !form.phone) return;

    onSave({ ...form });

    setForm(emptyForm);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div className="flex justify-between mb-5">
              <h2 className="text-xl font-bold">Add Customer</h2>
              <button onClick={onClose}>
                <LuX />
              </button>
            </div>

            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-ink-500 block mb-1.5">Customer Name</label>
                <input
                  placeholder="e.g. Ali Khan"
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-ink-500 block mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. ali.khan@example.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-ink-500 block mb-1.5">Phone Number</label>
                <input
                  placeholder="e.g. 0300-1234567"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  required
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-ink-500 block mb-1.5">Address</label>
                <input
                  placeholder="e.g. Main Market, Lahore"
                  value={form.address}
                  onChange={handleChange("address")}
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              <button className="w-full bg-primary-600 text-white py-3 rounded-xl">
                Save Customer
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
