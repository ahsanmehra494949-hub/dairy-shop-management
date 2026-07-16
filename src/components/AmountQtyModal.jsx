import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LuX, LuCheck } from 'react-icons/lu'

export default function AmountQtyModal({ open, onClose, product, onConfirm }) {
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (open) setAmount('')
  }, [open, product])

  if (!product) return null

  const qty = amount ? Math.round((Number(amount) / product.price) * 100) / 100 : 0

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0 || qty <= 0) return
    onConfirm(product, qty)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-ink-900/40 backdrop-blur-sm overflow-y-auto text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <span className="inline-block h-full align-middle" aria-hidden="true">&#8203;</span>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="bg-white rounded-xl2 shadow-cardHover w-full max-w-sm inline-block align-middle text-left my-8 mx-auto p-6"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-display font-semibold text-ink-900">Add by Amount</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-50 text-ink-500">
                <LuX size={18} />
              </button>
            </div>
            <p className="text-xs text-ink-500 mb-5">
              {product.name} · Rs {product.price} / {product.unit}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-ink-500">Enter Target Amount (Rs)</span>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 100"
                  className="input text-lg"
                  autoFocus
                  required
                />
              </label>

              <div className="bg-slate-50 rounded-xl p-3 text-sm flex justify-between items-center">
                <span className="text-ink-600">Calculated Quantity</span>
                <span className="font-semibold text-ink-900">{qty > 0 ? qty : 0} {product.unit}</span>
              </div>

              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-ink-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
                >
                  <LuCheck size={16} /> Add to Cart
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}