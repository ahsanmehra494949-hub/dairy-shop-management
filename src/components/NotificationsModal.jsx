import { motion, AnimatePresence } from 'framer-motion'
import { LuX, LuTriangleAlert, LuPackageX, LuBell } from 'react-icons/lu'

export default function NotificationsModal({ open, onClose, notifications }) {
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
            className="bg-white rounded-xl2 shadow-cardHover w-full max-w-sm inline-block align-middle text-left my-8 mx-auto"
          >
            <div className="flex items-center justify-between p-6 pb-4">
              <h3 className="text-lg font-display font-semibold text-ink-900 flex items-center gap-2">
                <LuBell size={18} className="text-primary-600" /> Stock Notifications
              </h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-50 text-ink-500">
                <LuX size={18} />
              </button>
            </div>

            {notifications.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-ink-500 text-center">
                All products are well stocked.
              </p>
            ) : (
              <ul className="px-3 pb-3">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50/60"
                  >
                    <span
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        n.outOfStock ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {n.outOfStock ? <LuPackageX size={16} /> : <LuTriangleAlert size={16} />}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink-900">{n.title}</p>
                      <p className="text-xs text-ink-500">{n.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="p-4 pt-1">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
