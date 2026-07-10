import { motion, AnimatePresence } from 'framer-motion'
import { LuX, LuUser, LuMail, LuShieldCheck, LuStore } from 'react-icons/lu'

export default function AdminProfileModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        /* FIXED: Added fixed top-0 left-0 w-full h-full to force it to break out of any parent containers and align to the screen viewport */
        <motion.div
          className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-ink-900/40 backdrop-blur-sm px-4 py-6"
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
            className="bg-white rounded-xl2 shadow-cardHover w-full max-w-sm max-h-[90vh] overflow-y-auto p-6 my-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-display font-semibold text-ink-900">Admin Profile</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-50 text-ink-500">
                <LuX size={18} />
              </button>
            </div>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-semibold mb-3">
                A
              </div>
              <p className="font-semibold text-ink-900">Admin User</p>
              <p className="text-xs text-ink-500">Shop Administrator</p>
            </div>

            <div className="flex flex-col gap-3">
              <InfoRow icon={LuUser} label="Username" value="Admin User" />
              <InfoRow icon={LuMail} label="Email" value="admin@dairyshop.com" />
              <InfoRow icon={LuShieldCheck} label="Role" value="Shop Administrator" />
              <InfoRow icon={LuStore} label="Shop" value="Fresh Dairy Shop" />
            </div>

            <button
              onClick={onClose}
              className="w-full mt-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
      <span className="w-9 h-9 rounded-lg bg-white text-primary-600 flex items-center justify-center shrink-0 border border-slate-100">
        <Icon size={16} />
      </span>
      <div>
        <p className="text-xs text-ink-500">{label}</p>
        <p className="text-sm font-medium text-ink-900">{value}</p>
      </div>
    </div>
  )
}