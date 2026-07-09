import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LuX } from 'react-icons/lu'
import { PRODUCT_ICONS, defaultIconForCategory } from './ProductIcon'

const emptyForm = { name: '', category: '', price: '', stock: '', unit: 'Liter', icon: 'package' }

export default function ProductModal({ open, onClose, onSave, initialData, categories = [] }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        category: initialData.category,
        price: initialData.price,
        stock: initialData.stock,
        unit: initialData.unit,
        icon: initialData.icon || 'package',
      })
    } else {
      setForm({ ...emptyForm, category: categories[0] || '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, open])

  const handleChange = (key) => (e) => {
    const value = e.target.value
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      // When category changes (and user hasn't manually picked a custom icon
      // for a brand new product), suggest a matching icon automatically.
      if (key === 'category' && !initialData) {
        next.icon = defaultIconForCategory(value)
      }
      return next
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.stock || !form.category) return
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
            className="bg-white rounded-xl2 shadow-cardHover w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
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

              <Field label="Product Icon">
                <div className="grid grid-cols-7 gap-2">
                  {PRODUCT_ICONS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      title={label}
                      onClick={() => setForm((prev) => ({ ...prev, icon: id }))}
                      className={`aspect-square rounded-xl flex items-center justify-center transition-colors ${
                        form.icon === id
                          ? 'bg-primary-600 text-white'
                          : 'bg-slate-50 text-ink-500 hover:bg-primary-50 hover:text-primary-600'
                      }`}
                    >
                      <Icon size={17} />
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Category">
                {categories.length > 0 ? (
                  <select value={form.category} onChange={handleChange('category')} className="input">
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-ink-500 bg-slate-50 rounded-xl px-4 py-3">
                    No categories yet — add one from Settings → Categories first.
                  </p>
                )}
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
                  disabled={categories.length === 0}
                  className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
