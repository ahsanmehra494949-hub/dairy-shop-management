import { motion, AnimatePresence } from 'framer-motion'
import { LuX, LuPrinter } from 'react-icons/lu'
import { useShop } from '../context/ShopContext'

export default function InvoiceViewModal({ open, onClose, invoice, customer }) {
  const { shopInfo } = useShop()
  if (!invoice) return null

  const remaining = Number(invoice.amount) - Number(invoice.paidAmount || 0)
  const isSettled = invoice.type === 'paid' || remaining <= 0

  // PRINT FIX: Delay add kiya hai taake browser content ko sahi se load kar sake
  const handlePrint = () => {
    setTimeout(() => {
      window.print()
    }, 500)
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
            
            // PRINT FIX: 'print-container' class add kar di hai
            className="print-container bg-white rounded-xl2 shadow-cardHover w-full max-w-md inline-block align-middle text-left my-8 mx-auto p-6"
          >
            <div className="flex items-center justify-between mb-5 print:hidden">
              <h3 className="text-lg font-display font-semibold text-ink-900">Invoice</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-50 text-ink-500">
                <LuX size={18} />
              </button>
            </div>

            {/* Screen view (card style) — hidden when printing */}
            <div className="border border-slate-100 rounded-xl p-5 print:hidden">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-display font-semibold text-ink-900">{shopInfo.name}</p>
                  <p className="text-xs text-ink-500">{shopInfo.address}</p>
                  <p className="text-xs text-ink-500">Owner: {shopInfo.ownerName}{shopInfo.ownerContact ? ` (${shopInfo.ownerContact})` : ''}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isSettled ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  {isSettled ? 'Paid' : 'Credit'}
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

                {invoice.type === 'udhaar' && (
                  <>
                    {(invoice.paymentHistory || []).length > 0 && (
                      <div className="mt-4 pt-3 border-t border-dashed border-slate-200">
                        <p className="text-xs font-semibold text-ink-500 tracking-wide mb-2">PAYMENT HISTORY</p>
                        <div className="flex flex-col gap-1.5">
                          {invoice.paymentHistory.map((p, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-ink-600">Payment received ({p.date})</span>
                              <span className="font-medium text-emerald-600">Rs {Number(p.amount).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between text-sm mt-3 pt-3 border-t border-slate-100">
                      <span className="font-semibold text-ink-900">
                        {remaining <= 0 ? 'Paid In Full' : 'Remaining Balance'}
                      </span>
                      <span className={`font-bold ${remaining <=0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        Rs {Math.max(0, remaining).toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Thermal receipt print view (80mm) — only shown when printing */}
            <div className="hidden print:block font-mono text-[12px] leading-relaxed text-ink-900">
              <div className="text-center mb-2">
                <p className="text-sm font-bold">{shopInfo.name}</p>
                <p className="text-[11px]">{shopInfo.address}</p>
                <p className="text-[11px]">Contact: {shopInfo.contact}</p>
                <p className="text-[11px]">
                  Owner: {shopInfo.ownerName}{shopInfo.ownerContact ? ` (${shopInfo.ownerContact})` : ''}
                </p>
              </div>

              <div className="border-t border-dashed border-ink-900 my-2" />

              <div className="flex justify-between"><span>Invoice #:</span><span className="font-semibold">INV-{invoice.id}</span></div>
              <div className="flex justify-between"><span>Date:</span><span>{invoice.date}</span></div>
              <div className="flex justify-between"><span>Status:</span><span className="font-semibold">{isSettled ? 'Paid' : 'Credit'}</span></div>

              <div className="border-t border-dashed border-ink-900 my-2" />

              <p><span>Customer: </span>{customer?.name}</p>
              {customer?.phone && <p><span>Phone: </span>{customer.phone}</p>}

              <div className="border-t border-dashed border-ink-900 my-2" />

              <div className="flex justify-between"><span>Description</span></div>
              <p className="mb-1">{invoice.description}</p>
              <div className="flex justify-between text-sm font-bold mt-1">
                <span>Total Amount</span>
                <span>Rs {Number(invoice.amount).toLocaleString()}</span>
              </div>

              {invoice.type === 'udhaar' && (
                <>
                  {(invoice.paymentHistory || []).length > 0 && (
                    <>
                      <div className="border-t border-dashed border-ink-900 my-2" />
                      <p className="font-semibold mb-1">PAYMENT HISTORY</p>
                      {invoice.paymentHistory.map((p, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>Paid ({p.date})</span>
                          <span>Rs {Number(p.amount).toLocaleString()}</span>
                        </div>
                      ))}
                    </>
                  )}
                  <div className="border-t border-dashed border-ink-900 my-2" />
                  <div className="flex justify-between font-bold">
                    <span>{remaining <= 0 ? 'Paid In Full' : 'Remaining Balance'}</span>
                    <span>Rs {Math.max(0, remaining).toLocaleString()}</span>
                  </div>
                </>
              )}

              <div className="border-t border-dashed border-ink-900 my-2" />
              <div className="text-center text-[11px] mt-2">
                <p>Thank you for your business!</p>
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