import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LuX, LuPlus, LuMinus } from 'react-icons/lu'

export default function StockAdjustModal({ open, onClose, onAdjust, product }) {
  const [mode, setMode] = useState('add')
  const [qty, setQty] = useState('')

  useEffect(() => {
    if (open) {
      setMode('add')
      setQty('')
    }
  }, [open])

  const handleSubmit = (e) => {
    e.preventDefault()
    const amount = Number(qty)
    if (!amount || amount <= 0) return
    onAdjust(mode === 'add' ? amount : -amount)
    onClose()
  }

  if (!product) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm overflow-y-auto text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <span className="inline-block h-full align-middle" aria-hidden="true">&#8203;</span>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl2 shadow-cardHover w-full max-w-sm p-6 inline-block align-middle text-left my-8 mx-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-display font-semibold text-ink-900">Adjust Stock</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-50 text-ink-500">
                <LuX size={18} />
              </button>
            </div>

            <p className="text-sm text-ink-700 mb-1 font-medium">{product.name}</p>
            <p className="text-xs text-ink-500 mb-5">
              Current stock: <span className="font-semibold text-ink-900">{product.stock} {product.unit}</span>
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('add')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    mode === 'add' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-ink-500 hover:bg-slate-100'
                  }`}
                >
                  <LuPlus size={15} /> Add Stock
                </button>
                <button
                  type="button"
                  onClick={() => setMode('remove')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    mode === 'remove' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-ink-500 hover:bg-slate-100'
                  }`}
                >
                  <LuMinus size={15} /> Remove Stock
                </button>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-ink-500">Quantity ({product.unit})</span>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="0"
                  className="input"
                  autoFocus
                  required
                />
              </label>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl text-white font-medium transition-colors ${
                  mode === 'add' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {mode === 'add' ? 'Add to Stock' : 'Remove from Stock'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
