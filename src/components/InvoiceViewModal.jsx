import { motion, AnimatePresence } from 'framer-motion'
import { LuX, LuPrinter } from 'react-icons/lu'

export default function InvoiceViewModal({ open, onClose, invoice, customer }) {
  if (!invoice) return null

  const handlePrint = () => window.print()

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
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="bg-white rounded-xl2 shadow-cardHover w-full max-w-md p-6 print:shadow-none"
          >
            <div className="flex items-center justify-between mb-5 print:hidden">
              <h3 className="text-lg font-display font-semibold text-ink-900">Invoice</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-50 text-ink-500">
                <LuX size={18} />
              </button>
            </div>

            <div className="border border-slate-100 rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-display font-semibold text-ink-900">Fresh Dairy Shop</p>
                  <p className="text-xs text-ink-500">Main Market</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    invoice.type === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  {invoice.type === 'paid' ? 'Paid' : 'Credit'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <p className="text-xs text-ink-500">Invoice #</p>
                  <p className="font-medium text-ink-900">INV-{invoice.id}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-500">Date</p>
                  <p className="font-medium text-ink-900">{invoice.date}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-ink-500">Customer</p>
                  <p className="font-medium text-ink-900">{customer?.name}</p>
                  <p className="text-xs text-ink-500">{customer?.phone}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-ink-500">Description</span>
                  <span className="font-medium text-ink-900">{invoice.description}</span>
                </div>
                <div className="flex justify-between text-base mt-3">
                  <span className="font-semibold text-ink-900">Total Amount</span>
                  <span className="font-bold text-ink-900">Rs {Number(invoice.amount).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="w-full mt-5 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors print:hidden"
            >
              <LuPrinter size={17} /> Print Invoice
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
