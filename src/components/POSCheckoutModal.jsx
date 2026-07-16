import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LuX, LuMinus, LuPlus, LuCheck, LuUsers } from 'react-icons/lu'
import { useShop } from '../context/ShopContext'

const emptyManual = { name: '', phone: '', address: '' }

export default function POSCheckoutModal({ open, onClose, cart, updateCartQty, onSubmit }) {
  const { customers } = useShop()

  const [discountPercent, setDiscountPercent] = useState(0)
  const [taxPercent, setTaxPercent] = useState(0)
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [manual, setManual] = useState(emptyManual)
  const [paymentMode, setPaymentMode] = useState('paid')
  const [takingAdvance, setTakingAdvance] = useState(false)
  const [advanceAmount, setAdvanceAmount] = useState('')

  useEffect(() => {
    if (open) {
      setDiscountPercent(0)
      setTaxPercent(0)
      setDate(new Date().toISOString().slice(0, 10))
      setSelectedCustomerId('')
      setManual(emptyManual)
      setPaymentMode('paid')
      setTakingAdvance(false)
      setAdvanceAmount('')
    }
  }, [open])

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const discountAmount = (subtotal * Number(discountPercent || 0)) / 100
  const afterDiscount = subtotal - discountAmount
  const taxAmount = (afterDiscount * Number(taxPercent || 0)) / 100
  const total = afterDiscount + taxAmount

  const selectedCustomer = customers.find((c) => String(c.id) === String(selectedCustomerId))
  const canSubmit = cart.length > 0 && (selectedCustomer || manual.name.trim())

  const existingOutstanding = (selectedCustomer?.invoices || []).reduce((sum, inv) => {
    if (inv.type !== 'udhaar') return sum
    const remaining = Number(inv.amount) - Number(inv.paidAmount || 0)
    return sum + Math.max(0, remaining)
  }, 0)

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit({
      items: cart,
      subtotal,
      discountPercent: Number(discountPercent || 0),
      taxPercent: Number(taxPercent || 0),
      total,
      paymentMode,
      advanceAmount: paymentMode === 'credit' && takingAdvance ? Number(advanceAmount || 0) : 0,
      customerId: selectedCustomer ? selectedCustomer.id : null,
      customerName: selectedCustomer ? selectedCustomer.name : manual.name.trim() || 'Walk-in Customer',
      customerPhone: selectedCustomer ? selectedCustomer.phone : manual.phone,
      customerAddress: selectedCustomer ? selectedCustomer.address : manual.address,
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
            className="bg-white rounded-xl2 shadow-cardHover w-full max-w-lg inline-block align-middle text-left my-8 mx-auto p-6"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0">
                  <LuUsers size={18} />
                </span>
                <div>
                  <h3 className="text-lg font-display font-semibold text-ink-900">Customer Details</h3>
                  <p className="text-xs text-ink-500">Complete the invoice</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-50 text-ink-500">
                <LuX size={18} />
              </button>
            </div>

            <p className="text-xs font-semibold text-ink-500 tracking-wide mb-2">CART SUMMARY</p>
            <div className="bg-slate-50 rounded-xl p-3 mb-4 flex flex-col gap-3 max-h-40 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">{item.name}</p>
                    <p className="text-xs text-ink-500">Rs {item.price}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateCartQty(item.productId, -1)}
                      className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-ink-500"
                    >
                      <LuMinus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateCartQty(item.productId, 1)}
                      className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-ink-500"
                    >
                      <LuPlus size={12} />
                    </button>
                    <span className="text-sm font-semibold text-ink-900 w-16 text-right">
                      Rs {(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
              {cart.length === 0 && <p className="text-sm text-ink-500 text-center py-2">Cart is empty.</p>}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-ink-500">Discount %</span>
                <input
                  type="number"
                  min="0"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="input"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-ink-500">Tax %</span>
                <input
                  type="number"
                  min="0"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value)}
                  className="input"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-ink-500">Date</span>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
              </label>
            </div>

            <div className="bg-primary-50/50 rounded-xl p-4 mb-5 space-y-1.5">
              <div className="flex justify-between text-sm text-ink-700">
                <span>Subtotal</span>
                <span>Rs {subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-ink-700">
                  <span>Discount</span>
                  <span>- Rs {discountAmount.toLocaleString()}</span>
                </div>
              )}
              {taxAmount > 0 && (
                <div className="flex justify-between text-sm text-ink-700">
                  <span>Tax</span>
                  <span>+ Rs {taxAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-ink-900 pt-1.5 border-t border-primary-100">
                <span>Total</span>
                <span>Rs {total.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-ink-500 tracking-wide mb-2">CUSTOMER</p>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="input mb-2"
            >
              <option value="">Select from saved customers...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
              ))}
            </select>

            {!selectedCustomerId && (
              <>
                <p className="text-xs text-ink-500 mb-2">Or enter details manually below</p>
                <div className="flex flex-col gap-3 mb-2">
                  <input
                    placeholder="Customer Name *"
                    value={manual.name}
                    onChange={(e) => setManual((p) => ({ ...p, name: e.target.value }))}
                    className="input"
                  />
                  <input
                    placeholder="Phone (optional)"
                    value={manual.phone}
                    onChange={(e) => setManual((p) => ({ ...p, phone: e.target.value }))}
                    className="input"
                  />
                  <input
                    placeholder="Address (optional)"
                    value={manual.address}
                    onChange={(e) => setManual((p) => ({ ...p, address: e.target.value }))}
                    className="input"
                  />
                </div>
              </>
            )}

            <p className="text-xs font-semibold text-ink-500 tracking-wide mt-4 mb-2">PAYMENT MODE</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMode('paid')}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  paymentMode === 'paid' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    paymentMode === 'paid' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-ink-400'
                  }`}
                >
                  <LuCheck size={16} />
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-ink-900">Paid</p>
                  <p className="text-xs text-ink-500">Cash / Full</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('credit')}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  paymentMode === 'credit' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    paymentMode === 'credit' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-ink-400'
                  }`}
                >
                  $
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-ink-900">Credit</p>
                  <p className="text-xs text-ink-500">Pay later</p>
                </div>
              </button>
            </div>

            {paymentMode === 'credit' && existingOutstanding > 0 && (
              <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3 mb-3 -mt-3 flex justify-between text-sm">
                <span className="text-ink-700">{selectedCustomer?.name || 'Customer'}'s existing credit balance</span>
                <span className="font-semibold text-rose-600">Rs {existingOutstanding.toLocaleString()}</span>
              </div>
            )}

            {paymentMode === 'credit' && (
              <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-4 mb-6 -mt-3">
                <p className="text-sm font-medium text-ink-900 mb-2">Are you taking an advance payment?</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() => setTakingAdvance(true)}
                    className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                      takingAdvance ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-200 text-ink-700 hover:bg-white'
                    }`}
                  >
                    Yes, partial advance
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTakingAdvance(false); setAdvanceAmount('') }}
                    className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                      !takingAdvance ? 'bg-slate-700 border-slate-700 text-white' : 'border-slate-200 text-ink-700 hover:bg-white'
                    }`}
                  >
                    No, full credit
                  </button>
                </div>
                {takingAdvance && (
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-ink-500">Advance Amount (Rs)</span>
                    <input
                      type="number"
                      min="0"
                      max={total}
                      value={advanceAmount}
                      onChange={(e) => setAdvanceAmount(e.target.value)}
                      placeholder="0"
                      className="input"
                      autoFocus
                    />
                    <span className="text-xs text-ink-500">
                      Remaining balance: Rs {Math.max(0, total - Number(advanceAmount || 0)).toLocaleString()}
                    </span>
                  </label>
                )}
                <p className="text-xs text-ink-500 mt-2 pt-2 border-t border-amber-100">
                  New total credit balance:{' '}
                  <span className="font-semibold text-rose-600">
                    Rs {Math.max(0, existingOutstanding + total - Number(takingAdvance ? advanceAmount || 0 : 0)).toLocaleString()}
                  </span>
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onClose}
                className="py-3 rounded-xl border border-slate-200 text-ink-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
              >
                <LuCheck size={17} /> Generate Invoice
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}