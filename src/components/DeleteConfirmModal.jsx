import { motion, AnimatePresence } from 'framer-motion'
import { LuTriangleAlert } from 'react-icons/lu'

export default function DeleteConfirmModal({ open, onClose, onConfirm, productName }) {
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl2 shadow-cardHover w-full max-w-sm p-6 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <LuTriangleAlert size={22} />
            </div>
            <h3 className="text-lg font-display font-semibold text-ink-900 mb-1.5">Delete product?</h3>
            <p className="text-sm text-ink-500 mb-6">
              This will permanently remove <span className="font-medium text-ink-700">{productName}</span> from your inventory.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-ink-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
