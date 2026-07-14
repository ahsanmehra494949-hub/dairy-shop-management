import { motion } from 'framer-motion'
import { LuUser, LuMail, LuShieldCheck, LuStore } from 'react-icons/lu'
import Layout from '../components/Layout'

export default function Profile() {
  return (
    <Layout title="Profile">
      <div className="max-w-xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-ink-900">Admin Profile</h1>
          <p className="text-sm text-ink-500 mt-1">Your account details and shop information</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-xl2 shadow-card border border-slate-50 p-6"
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-semibold mb-3">
              A
            </div>
            <p className="text-lg font-semibold text-ink-900">Admin User</p>
            <p className="text-sm text-ink-500">Shop Administrator</p>
          </div>

          <div className="flex flex-col gap-3">
            <InfoRow icon={LuUser} label="Username" value="Admin User" />
            <InfoRow icon={LuMail} label="Email" value="admin@dairyshop.com" />
            <InfoRow icon={LuShieldCheck} label="Role" value="Shop Administrator" />
            <InfoRow icon={LuStore} label="Shop" value="Fresh Dairy Shop" />
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
      <span className="w-10 h-10 rounded-lg bg-white text-primary-600 flex items-center justify-center shrink-0 border border-slate-100">
        <Icon size={18} />
      </span>
      <div>
        <p className="text-xs text-ink-500">{label}</p>
        <p className="text-sm font-medium text-ink-900">{value}</p>
      </div>
    </div>
  )
}
