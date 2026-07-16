import { motion, AnimatePresence } from 'framer-motion'
import { LuX, LuPrinter, LuDownload } from 'react-icons/lu'
import { useShop } from '../context/ShopContext'

export default function InvoiceDetailModal({ open, onClose, invoice }) {
  const { shopInfo } = useShop()
  const SHOP = shopInfo
  if (!invoice) return null

  const handlePrint = () => {
    setTimeout(() => window.print(), 300)
  }

  const handleDownload = () => {
    const lines = [
      SHOP.name,
      SHOP.address,
      `Contact: ${SHOP.contact}`,
      `Owner: ${SHOP.ownerName}${SHOP.ownerContact ? ' | ' + SHOP.ownerContact : ''}`,
      '--------------------------------',
      `Invoice #: ${invoice.number}`,
      `Date/Time: ${invoice.date} ${invoice.time || ''}`,
      `Customer: ${invoice.customerName}`,
      invoice.customerAddress ? `Address: ${invoice.customerAddress}` : null,
      `Type: ${invoice.source === 'custom' ? 'Custom' : 'POS Sale'} | ${invoice.paymentMode === 'paid' ? 'Paid' : 'Credit'}`,
      '--------------------------------',
      'SR  Item                Qty  Price   Total',
      ...invoice.items.map((i, idx) => `${idx + 1}.  ${i.name} x${i.qty} @ Rs ${i.price} = Rs ${(i.price * i.qty).toLocaleString()}`),
      '--------------------------------',
      `Subtotal: Rs ${invoice.subtotal.toLocaleString()}`,
      invoice.discountPercent ? `Discount: ${invoice.discountPercent}%` : null,
      invoice.taxPercent ? `Tax: ${invoice.taxPercent}%` : null,
      `Total: Rs ${invoice.total.toLocaleString()}`,
      '',
      'Thank you for your business!',
      'Powered by Dairy Shop Management System',
    ].filter(Boolean)

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${invoice.number}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm overflow-y-auto px-4 py-8 print:bg-white print:p-0"
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
            className="print-container bg-white rounded-xl2 shadow-cardHover w-full max-w-[340px] mx-auto p-5 print:shadow-none print:rounded-none print:max-w-full print:w-full print:p-0 print:mx-0"
          >
            <div className="flex items-center justify-between mb-3 print:hidden">
              <h3 className="text-sm font-display font-semibold text-ink-900">Invoice Preview</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-50 text-ink-500">
                <LuX size={18} />
              </button>
            </div>

            <div className="font-mono text-[12.5px] leading-relaxed text-ink-900">
              <div className="text-center mb-2">
                <p className="text-sm font-bold">{SHOP.name}</p>
                <p className="text-[11px] text-ink-600">{SHOP.address}</p>
                <p className="text-[11px] text-ink-600">Contact: {SHOP.contact}</p>
                <p className="text-[11px] text-ink-600">Owner: {SHOP.ownerName}{SHOP.ownerContact ? ` (${SHOP.ownerContact})` : ''}</p>
              </div>

              <div className="border-t border-dashed border-ink-300 my-2" />

              <div className="flex justify-between">
                <span>Invoice #:</span>
                <span className="font-semibold">{invoice.number}</span>
              </div>
              <div className="flex justify-between">
                <span>Date/Time:</span>
                <span>{invoice.date} {invoice.time}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span>{invoice.source === 'custom' ? 'Custom' : 'POS Sale'}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-semibold">{invoice.paymentMode === 'paid' ? 'Paid' : 'Credit'}</span>
              </div>

              <div className="border-t border-dashed border-ink-300 my-2" />

              <p><span className="text-ink-600">Customer:</span> {invoice.customerName}</p>
              {invoice.customerPhone && <p><span className="text-ink-600">Phone:</span> {invoice.customerPhone}</p>}
              <p><span className="text-ink-600">Address:</span> {invoice.customerAddress || '-'}</p>

              <div className="border-t border-dashed border-ink-300 my-2" />

              <div className="flex text-[11px] font-semibold text-ink-600 mb-1">
                <span className="w-5">SR</span>
                <span className="flex-1">Item</span>
                <span className="w-8 text-right">Qty</span>
                <span className="w-16 text-right">Total</span>
              </div>
              {invoice.items.map((item, idx) => (
                <div key={item.productId} className="flex text-[12px] mb-0.5">
                  <span className="w-5">{idx + 1}.</span>
                  <span className="flex-1 truncate pr-1">{item.name}</span>
                  <span className="w-8 text-right">{item.qty}</span>
                  <span className="w-16 text-right">Rs {(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}

              <div className="border-t border-dashed border-ink-300 my-2" />

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs {invoice.subtotal.toLocaleString()}</span>
              </div>
              {invoice.discountPercent > 0 && (
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>{invoice.discountPercent}%</span>
                </div>
              )}
              {invoice.taxPercent > 0 && (
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{invoice.taxPercent}%</span>
                </div>
              )}

              <div className="border-t border-dashed border-ink-300 my-2" />

              <div className="flex justify-between text-sm font-bold">
                <span>TOTAL</span>
                <span>Rs {invoice.total.toLocaleString()}</span>
              </div>

              <div className="border-t border-dashed border-ink-300 my-2" />

              <div className="text-center text-[11px] text-ink-600 mt-3">
                <p>Thank you for your business!</p>
                <p className="mt-1 text-[10px] text-ink-400">Powered by Dairy Shop Management System</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-ink-700 font-medium hover:bg-slate-50 transition-colors"
              >
                <LuPrinter size={16} /> Print
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
              >
                <LuDownload size={16} /> Download
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}