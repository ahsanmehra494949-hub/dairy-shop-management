import { motion } from 'framer-motion'

export default function SummaryCard({ label, value, icon: Icon, tone = 'primary', suffix }) {
  const tones = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-400 to-amber-500',
    danger: 'from-rose-500 to-rose-600',
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white rounded-xl2 p-5 shadow-card hover:shadow-cardHover transition-shadow duration-200 border border-slate-50"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-ink-500 uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-2xl font-display font-bold text-ink-900">
            {suffix ? `${suffix}${value}` : value}
          </p>
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tones[tone]} flex items-center justify-center text-white shrink-0`}>
          <Icon size={20} />
        </div>
      </div>
    </motion.div>
  )
}
