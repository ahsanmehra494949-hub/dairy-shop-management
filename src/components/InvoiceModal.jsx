import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LuX } from 'react-icons/lu'

export default function InvoiceModal({ open, onClose, onSave, defaultType = 'paid', existingOutstanding = 0 }) {
  const [form, setForm] = useState({ description: '', amount: '', type: defaultType })
  const [takingAdvance, setTakingAdvance] = useState(false)
  const [advanceAmount, setAdvanceAmount] = useState('')

  useEffect(() => {
    if (open) {
      setForm({ description: '', amount: '', type: defaultType })
      setTakingAdvance(false)
      setAdvanceAmount('')
    }
  }, [open, defaultType])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.amount || !form.description) return
    onSave({
      ...form,
      amount: Number(form.amount),
      advanceAmount: form.type === 'udhaar' && takingAdvance ? Number(advanceAmount || 0) : 0,
    })
  }

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
            className="bg-white rounded-xl2 shadow-cardHover w-full max-w-md inline-block align-middle text-left my-8 mx-auto p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-display font-semibold text-ink-900">New Invoice</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-50 text-ink-500">
                <LuX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-ink-500">Description</span>
                <input
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="e.g. Weekly milk supply"
                  className="input"
                  required
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-ink-500">Amount (Rs)</span>
                <input
                  type="number"
                  min="0"
                  value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="0"
                  className="input"
                  required
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-ink-500">Payment Status</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, type: 'paid' }))}
                    className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                      form.type === 'paid'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-200 text-ink-700 hover:bg-slate-50'
                    }`}
                  >
                    Paid
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, type: 'udhaar' }))}
                    className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                      form.type === 'udhaar'
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'border-slate-200 text-ink-700 hover:bg-slate-50'
                    }`}
                  >
                    Credit
                  </button>
                </div>
              </label>

              {form.type === 'udhaar' && existingOutstanding > 0 && (
                <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3 -mt-1 flex justify-between text-sm">
                  <span className="text-ink-700">Existing credit balance</span>
                  <span className="font-semibold text-rose-600">Rs {existingOutstanding.toLocaleString()}</span>
                </div>
              )}

              {form.type === 'udhaar' && (
                <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-4 -mt-1">
                  <p className="text-sm font-medium text-ink-900 mb-2">Are you collecting an advance?</p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => setTakingAdvance(true)}
                      className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                        takingAdvance ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-200 text-ink-700 hover:bg-white'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTakingAdvance(false); setAdvanceAmount('') }}
                      className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                        !takingAdvance ? 'bg-slate-700 border-slate-700 text-white' : 'border-slate-200 text-ink-700 hover:bg-white'
                      }`}
                    >
                      No
                    </button>
                  </div>
                  {takingAdvance && (
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-ink-500">Advance Amount (Rs)</span>
                      <input
                        type="number"
                        min="0"
                        max={form.amount || undefined}
                        value={advanceAmount}
                        onChange={(e) => setAdvanceAmount(e.target.value)}
                        placeholder="0"
                        className="input"
                      />
                    </label>
                  )}
                  {Number(form.amount) > 0 && (
                    <p className="text-xs text-ink-500 mt-2 pt-2 border-t border-amber-100">
                      New total credit balance:{' '}
                      <span className="font-semibold text-rose-600">
                        Rs {Math.max(0, existingOutstanding + Number(form.amount) - Number(advanceAmount || 0)).toLocaleString()}
                      </span>
                    </p>
                  )}
                </div>
              )}

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
                  Generate Invoice
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}