import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LuX, LuMinus, LuPlus, LuCheck, LuSearch, LuTrash2 } from 'react-icons/lu'
import { useShop } from '../context/ShopContext'

const emptyManual = { name: '', phone: '', address: '' }

export default function CustomInvoiceModal({ open, onClose, onSubmit, initialData }) {
  const { products, categories, customers } = useShop()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [discountPercent, setDiscountPercent] = useState(0)
  const [taxPercent, setTaxPercent] = useState(0)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [manual, setManual] = useState(emptyManual)
  const [paymentMode, setPaymentMode] = useState('paid')

  useEffect(() => {
    if (!open) return
    if (initialData) {
      setCart(initialData.items || [])
      setDiscountPercent(initialData.discountPercent || 0)
      setTaxPercent(initialData.taxPercent || 0)
      setSelectedCustomerId(initialData.customerId ? String(initialData.customerId) : '')
      setManual(initialData.customerId ? emptyManual : { name: initialData.customerName || '', phone: initialData.customerPhone || '', address: initialData.customerAddress || '' })
      setPaymentMode(initialData.paymentMode || 'paid')
    } else {
      setCart([])
      setDiscountPercent(0)
      setTaxPercent(0)
      setSelectedCustomerId('')
      setManual(emptyManual)
      setPaymentMode('paid')
    }
    setSearch('')
    setCategory('All')
  }, [open, initialData])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'All' || p.category === category
      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === product.id)
      if (existing) return prev.map((c) => (c.productId === product.id ? { ...c, qty: c.qty + 1 } : c))
      return [...prev, { productId: product.id, name: product.name, price: product.price, qty: 1, unit: product.unit }]
    })
  }

  const updateQty = (productId, delta) => {
    setCart((prev) =>
      prev.map((c) => (c.productId === productId ? { ...c, qty: Math.max(0, c.qty + delta) } : c)).filter((c) => c.qty > 0)
    )
  }

  const removeItem = (productId) => setCart((prev) => prev.filter((c) => c.productId !== productId))

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const discountAmount = (subtotal * Number(discountPercent || 0)) / 100
  const afterDiscount = subtotal - discountAmount
  const taxAmount = (afterDiscount * Number(taxPercent || 0)) / 100
  const total = afterDiscount + taxAmount

  const selectedCustomer = customers.find((c) => String(c.id) === String(selectedCustomerId))
  const canSubmit = cart.length > 0 && (selectedCustomer || manual.name.trim())

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit({
      items: cart,
      subtotal,
      discountPercent: Number(discountPercent || 0),
      taxPercent: Number(taxPercent || 0),
      total,
      paymentMode,
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
            className="bg-white rounded-xl2 shadow-cardHover w-full max-w-2xl inline-block align-middle text-left my-8 mx-auto p-6"
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-lg font-display font-semibold text-ink-900">
                  {initialData ? 'Edit Invoice' : 'New Custom Invoice'}
                </h3>
                <p className="text-xs text-ink-500">Select products and customize the invoice</p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-50 text-ink-500">
                <LuX size={18} />
              </button>
            </div>

            {/* PRODUCT PICKER */}
            <p className="text-xs font-semibold text-ink-500 tracking-wide mb-2">SELECT PRODUCTS</p>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <div className="relative flex-1">
                <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={16} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto mb-4 pr-1">
              {filteredProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="text-left border border-slate-200 hover:border-primary-300 rounded-lg p-2.5 transition-colors"
                >
                  <p className="text-xs font-medium text-ink-900 truncate">{p.name}</p>
                  <p className="text-xs text-primary-700 font-semibold">Rs {p.price}</p>
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <p className="col-span-full text-center text-xs text-ink-500 py-4">No products found.</p>
              )}
            </div>

            {/* CART */}
            <p className="text-xs font-semibold text-ink-500 tracking-wide mb-2">CART SUMMARY</p>
            <div className="bg-slate-50 rounded-xl p-3 mb-4 flex flex-col gap-3 max-h-40 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">{item.name}</p>
                    <p className="text-xs text-ink-500">Rs {item.price}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => updateQty(item.productId, -1)} className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-ink-500">
                      <LuMinus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.productId, 1)} className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-ink-500">
                      <LuPlus size={12} />
                    </button>
                    <span className="text-sm font-semibold text-ink-900 w-16 text-right">
                      Rs {(item.price * item.qty).toLocaleString()}
                    </span>
                    <button onClick={() => removeItem(item.productId)} className="text-rose-500 hover:text-rose-600">
                      <LuTrash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && <p className="text-sm text-ink-500 text-center py-2">No products selected yet.</p>}
            </div>

            {/* DISCOUNT / TAX */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-ink-500">Discount %</span>
                <input type="number" min="0" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} className="input" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-ink-500">Tax %</span>
                <input type="number" min="0" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} className="input" />
              </label>
            </div>

            {/* TOTALS */}
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

            {/* CUSTOMER */}
            <p className="text-xs font-semibold text-ink-500 tracking-wide mb-2">CUSTOMER</p>
            <select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} className="input mb-2">
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
                  <input placeholder="Phone (optional)" value={manual.phone} onChange={(e) => setManual((p) => ({ ...p, phone: e.target.value }))} className="input" />
                  <input placeholder="Address (optional)" value={manual.address} onChange={(e) => setManual((p) => ({ ...p, address: e.target.value }))} className="input" />
                </div>
              </>
            )}

            {/* PAYMENT MODE */}
            <p className="text-xs font-semibold text-ink-500 tracking-wide mt-4 mb-2">PAYMENT MODE</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMode('paid')}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  paymentMode === 'paid' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${paymentMode === 'paid' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-ink-400'}`}>
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
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${paymentMode === 'credit' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-ink-400'}`}>
                  $
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-ink-900">Credit</p>
                  <p className="text-xs text-ink-500">Pay later</p>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={onClose} className="py-3 rounded-xl border border-slate-200 text-ink-700 font-medium hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
              >
                <LuCheck size={17} /> {initialData ? 'Save Changes' : 'Create Invoice'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
