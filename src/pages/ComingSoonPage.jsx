import Layout from '../components/Layout'

export default function ComingSoonPage({ title, icon: Icon, description }) {
  return (
    <Layout title={title}>
      <div className="bg-white rounded-xl2 shadow-card border border-slate-50 p-10 flex flex-col items-center text-center min-h-[60vh] justify-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center mb-5">
          <Icon size={30} />
        </div>
        <h2 className="font-display text-xl font-semibold text-ink-900 mb-2">{title}</h2>
        <p className="text-sm text-ink-500 max-w-sm">{description}</p>
      </div>
    </Layout>
  )
}
