import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LuX } from 'react-icons/lu'
import { categories } from '../data/dummyData'

const emptyForm = { name: '', category: 'Milk', price: '', stock: '', unit: 'Liter' }

export default function ProductModal({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        category: initialData.category,
        price: initialData.price,
        stock: initialData.stock,
        unit: initialData.unit,
      })
    } else {
      setForm(emptyForm)
    }
  }, [initialData, open])

  const handleChange = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.stock) return
    onSave({ ...form, price: Number(form.price), stock: Number(form.stock) })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl2 shadow-cardHover w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-display font-semibold text-ink-900">
                {initialData ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-50 text-ink-500">
                <LuX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field label="Product Name">
                <input
                  value={form.name}
                  onChange={handleChange('name')}
                  placeholder="e.g. Full Cream Milk"
                  className="input"
                  required
                />
              </Field>

              <Field label="Category">
                <select value={form.category} onChange={handleChange('category')} className="input">
                  {categories.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (Rs)">
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={handleChange('price')}
                    placeholder="0"
                    className="input"
                    required
                  />
                </Field>
                <Field label="Stock Quantity">
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange('stock')}
                    placeholder="0"
                    className="input"
                    required
                  />
                </Field>
              </div>

              <Field label="Unit">
                <select value={form.unit} onChange={handleChange('unit')} className="input">
                  <option value="Liter">Liter</option>
                  <option value="KG">KG</option>
                  <option value="Packet">Packet</option>
                </select>
              </Field>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-ink-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-ink-500">{label}</span>
      {children}
    </label>
  )
}
