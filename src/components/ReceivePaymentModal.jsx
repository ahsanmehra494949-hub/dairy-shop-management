import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LuX, LuCheck, LuWallet } from 'react-icons/lu'

export default function ReceivePaymentModal({ open, onClose, onSave, customer }) {
  const [invoiceId, setInvoiceId] = useState('auto')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const udhaarInvoices = (customer?.invoices || []).filter(
    (inv) => inv.type === 'udhaar' && Number(inv.amount) - Number(inv.paidAmount || 0) > 0
  )

  useEffect(() => {
    if (open) {
      setInvoiceId('auto')
      setAmount('')
      setNote('')
    }
  }, [open])

  const selectedInvoice = udhaarInvoices.find((i) => String(i.id) === String(invoiceId))
  const remainingFor = (inv) => Number(inv.amount) - Number(inv.paidAmount || 0)
  const totalOutstanding = udhaarInvoices.reduce((sum, i) => sum + remainingFor(i), 0)

  const handlePick = (id) => {
    setInvoiceId(id)
    const inv = udhaarInvoices.find((i) => String(i.id) === String(id))
    if (inv) setAmount(String(remainingFor(inv)))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return
    onSave({
      amount: Number(amount),
      note,
      invoiceId: invoiceId === 'auto' ? null : Number(invoiceId),
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
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-display font-semibold text-ink-900 flex items-center gap-2">
                <LuWallet size={18} className="text-emerald-600" /> Receive Payment
              </h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-50 text-ink-500">
                <LuX size={18} />
              </button>
            </div>
            <p className="text-xs text-ink-500 mb-5">
              From {customer?.name} · Total credit Rs {totalOutstanding.toLocaleString()}
            </p>

            {udhaarInvoices.length === 0 ? (
              <p className="text-sm text-ink-500 text-center py-6">No outstanding credit for this customer.</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <span className="text-xs font-medium text-ink-500 block mb-2">Which credit invoice is this payment for?</span>
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => handlePick('auto')}
                      className={`flex items-center justify-between gap-2 p-3 rounded-xl border text-left transition-colors ${
                        invoiceId === 'auto' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-medium text-ink-900">Apply to all (auto, oldest first)</span>
                        <span className="block text-xs text-ink-500">Amount will be applied to the oldest credit invoices first</span>
                      </span>
                      {invoiceId === 'auto' && <LuCheck size={16} className="text-emerald-600 shrink-0" />}
                    </button>

                    {udhaarInvoices.map((inv) => (
                      <button
                        type="button"
                        key={inv.id}
                        onClick={() => handlePick(inv.id)}
                        className={`flex items-center justify-between gap-2 p-3 rounded-xl border text-left transition-colors ${
                          String(invoiceId) === String(inv.id) ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-ink-900 truncate">INV-{inv.id} · {inv.description}</span>
                          <span className="block text-xs text-ink-500">
                            {inv.date} · Due Rs {remainingFor(inv).toLocaleString()} / Rs {Number(inv.amount).toLocaleString()}
                          </span>
                        </span>
                        {String(invoiceId) === String(inv.id) && <LuCheck size={16} className="text-emerald-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-ink-500">Amount (Rs)</span>
                  <input
                    type="number"
                    min="0"
                    max={selectedInvoice ? remainingFor(selectedInvoice) : undefined}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="input"
                    required
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-ink-500">Note (optional)</span>
                  <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Cash payment" className="input" />
                </label>

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
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
                  >
                    <LuCheck size={16} /> Receive Payment
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}