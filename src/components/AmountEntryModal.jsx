import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LuX, LuCheck } from 'react-icons/lu'

export default function AmountEntryModal({ open, onClose, onSave, title, subtitle, amountLabel, noteLabel, confirmLabel, tone = 'primary' }) {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (open) {
      setAmount('')
      setNote('')
    }
  }, [open])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return
    onSave({ amount: Number(amount), note })
  }

  const toneClasses = tone === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary-600 hover:bg-primary-700'

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
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="bg-white rounded-xl2 shadow-cardHover w-full max-w-sm inline-block align-middle text-left my-8 mx-auto p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-display font-semibold text-ink-900">{title}</h3>
                {subtitle && <p className="text-xs text-ink-500">{subtitle}</p>}
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-50 text-ink-500">
                <LuX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-ink-500">{amountLabel || 'Amount (Rs)'}</span>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="input"
                  required
                  autoFocus
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-ink-500">{noteLabel || 'Note (optional)'}</span>
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Cash payment" className="input" />
              </label>

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
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-medium transition-colors ${toneClasses}`}
                >
                  <LuCheck size={16} /> {confirmLabel || 'Save'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
