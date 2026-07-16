import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  LuSearch,
  LuShoppingCart,
  LuCircleCheck,
  LuWallet,
  LuTrash2,
  LuChevronRight,
  LuPlus,
  LuMinus,
  LuBanknote,
} from 'react-icons/lu'
import Layout from '../components/Layout'
import ProductIcon from '../components/ProductIcon'
import POSCheckoutModal from '../components/POSCheckoutModal'
import AmountQtyModal from '../components/AmountQtyModal'
import { getStockStatus } from '../data/dummyData'
import { useShop } from '../context/ShopContext'

export default function POS() {
  const { products, categories, invoices, createInvoiceRecord, receivePayment } = useShop()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [successInvoice, setSuccessInvoice] = useState(null)
  const [amountProduct, setAmountProduct] = useState(null)

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'All' || p.category === category
      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  const today = new Date().toDateString()
  const todaysPosInvoices = invoices.filter((i) => i.source === 'pos' && new Date(i.date).toDateString() === today)
  const inStockTotal = products.reduce((sum, p) => sum + p.stock, 0)
  const todaysRevenue = todaysPosInvoices.reduce((sum, i) => sum + i.total, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  const cartQtyFor = (productId) => cart.find((c) => c.productId === productId)?.qty || 0

  const addToCart = (product) => {
    if (product.stock <= 0) return
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === product.id)
      if (existing) {
        if (existing.qty >= product.stock) return prev
        return prev.map((c) => (c.productId === product.id ? { ...c, qty: c.qty + 1 } : c))
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, qty: 1, unit: product.unit }]
    })
  }

  const updateCartQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((c) => (c.productId === productId ? { ...c, qty: Math.max(0, c.qty + delta) } : c))
        .filter((c) => c.qty > 0)
    )
  }

  const clearCart = () => setCart([])

  const addToCartByAmount = (product, qty) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === product.id)
      if (existing) {
        return prev.map((c) => (c.productId === product.id ? { ...c, qty: Math.round((c.qty + qty) * 100) / 100 } : c))
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, qty, unit: product.unit }]
    })
    setAmountProduct(null)
  }

  const handleGenerateInvoice = (payload) => {
    const { advanceAmount, ...rest } = payload
    const invoice = createInvoiceRecord({ ...rest, source: 'pos', items: cart })
    if (invoice.customerInvoiceId && Number(advanceAmount) > 0) {
      receivePayment(invoice.customerId, Number(advanceAmount), 'Advance received at invoice creation', invoice.customerInvoiceId)
    }
    setCart([])
    setCheckoutOpen(false)
    setSuccessInvoice(invoice)
  }

  return (
    <Layout title="Point of Sale">
      <div className="space-y-6 pb-28">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">Point of Sale</h1>
          <p className="text-sm text-ink-500 mt-1">Build a cart and generate an invoice in a few taps</p>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={LuCircleCheck} tone="emerald" label="In Stock" value={inStockTotal} />
          <StatCard icon={LuShoppingCart} tone="primary" label="Today's Sales" value={todaysPosInvoices.length} />
          <StatCard icon={LuWallet} tone="violet" label="Today's Revenue" value={`Rs ${todaysRevenue.toLocaleString()}`} />
          <StatCard icon={LuShoppingCart} tone="amber" label="Cart Total" value={`Rs ${cartTotal.toLocaleString()}`} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((p) => {
            const status = getStockStatus(p.stock)
            const qtyInCart = cartQtyFor(p.id)
            const disabled = p.stock <= 0
            return (
              <motion.button
                key={p.id}
                whileTap={{ scale: disabled ? 1 : 0.97 }}
                onClick={() => addToCart(p)}
                disabled={disabled}
                className={`relative text-left bg-white rounded-xl2 border p-4 shadow-card transition-colors ${
                  qtyInCart > 0 ? 'border-primary-400 ring-2 ring-primary-100' : 'border-slate-100'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-300'}`}
              >
                {qtyInCart > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center shadow-card">
                    {qtyInCart}
                  </span>
                )}
                <div className="flex items-start justify-between mb-2">
                  <ProductIcon icon={p.icon} />
                  <span
                    className={`px-2 py-1 rounded-full text-[11px] font-medium ${
                      status === 'Out of Stock'
                        ? 'bg-rose-50 text-rose-600'
                        : status === 'Low Stock'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <p className="font-medium text-ink-900 text-sm truncate">{p.name}</p>
                <p className="text-xs text-ink-500 mb-2">{p.category}</p>
                <p className="text-primary-700 font-bold">Rs {p.price}</p>
                <p className="text-xs text-ink-500">{p.stock} {p.unit} available</p>
                {!disabled && (
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); setAmountProduct(p) }}
                    className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg py-1.5 transition-colors"
                  >
                    <LuBanknote size={13} /> Add by Amount
                  </span>
                )}
              </motion.button>
            )
          })}

          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-12 text-sm text-ink-500">
              No products match your search.
            </div>
          )}
        </div>
      </div>

      {cart.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 lg:left-[260px] bg-white border-t border-slate-100 shadow-cardHover z-30 p-4"
        >
          <div className="max-w-5xl mx-auto flex flex-col gap-3">
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-2 bg-slate-50 rounded-full pl-3 pr-1.5 py-1.5">
                  <span className="text-sm font-medium text-ink-900 truncate max-w-[120px]">{item.name}</span>
                  <button
                    onClick={() => updateCartQty(item.productId, -1)}
                    className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-ink-500"
                  >
                    <LuMinus size={12} />
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateCartQty(item.productId, 1)}
                    className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-ink-500"
                  >
                    <LuPlus size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={clearCart}
                className="flex items-center gap-1.5 text-rose-600 text-sm font-medium hover:text-rose-700"
              >
                <LuTrash2 size={16} /> Clear
              </button>

              <div className="text-right">
                <p className="text-xs text-ink-500">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
                <p className="text-lg font-bold text-ink-900">Rs {cartTotal.toLocaleString()}</p>
              </div>

              <button
                onClick={() => setCheckoutOpen(true)}
                className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
              >
                Next <LuChevronRight size={17} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <POSCheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        updateCartQty={updateCartQty}
        onSubmit={handleGenerateInvoice}
      />

      <AmountQtyModal
        open={!!amountProduct}
        onClose={() => setAmountProduct(null)}
        product={amountProduct}
        onConfirm={addToCartByAmount}
      />

      {successInvoice && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onAnimationComplete={() => setTimeout(() => setSuccessInvoice(null), 2200)}
          className="fixed top-20 sm:top-6 inset-x-4 sm:inset-x-auto sm:right-6 z-[200] bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-xl flex items-center justify-center sm:justify-start gap-2 font-medium"
        >
          ✓ Invoice {successInvoice.number} created successfully
        </motion.div>
      )}
    </Layout>
  )
}

function StatCard({ icon: Icon, tone, label, value }) {
  const toneClasses = {
    emerald: 'bg-emerald-50 text-emerald-600',
    primary: 'bg-primary-50 text-primary-600',
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
  }
  return (
    <div className="bg-white p-4 rounded-xl2 shadow-card border border-slate-50">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${toneClasses[tone]}`}>
        <Icon size={18} />
      </div>
      <p className="text-lg font-bold text-ink-900">{value}</p>
      <p className="text-xs text-ink-500">{label}</p>
    </div>
  )
}