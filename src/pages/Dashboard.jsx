import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LuWallet, LuTrendingUp, LuBoxes, LuTriangleAlert, LuPlus, LuShoppingCart, LuCheck, LuChevronDown, LuFilter } from 'react-icons/lu'
import Layout from '../components/Layout'
import SummaryCard from '../components/SummaryCard'
import { SalesOverviewChart } from '../components/Charts'
import RecentSalesTable from '../components/RecentSalesTable'
import NewSaleModal from '../components/NewSaleModal'
import { useShop } from '../context/ShopContext'
import { summaryStats, salesOverviewByPeriod } from '../data/dummyData'

const PERIOD_FILTERS = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { recentSales, addSale } = useShop()
  const [saleModalOpen, setSaleModalOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [salesPeriod, setSalesPeriod] = useState('day')
  const [salesPeriodOpen, setSalesPeriodOpen] = useState(false)

  const handleAddProductClick = () => {
    navigate('/inventory', { state: { openAdd: true } })
  }

  const handleSaveSale = (sale) => {
    addSale(sale)
    setSaleModalOpen(false)
    setToast('Sale recorded successfully')
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard label="Today's Sales" value={summaryStats.todaySales.toLocaleString()} suffix="Rs " icon={LuWallet} tone="primary" />
        <SummaryCard label="Today's Profit" value={summaryStats.todayProfit.toLocaleString()} suffix="Rs " icon={LuTrendingUp} tone="success" />
        <SummaryCard label="Total Products" value={summaryStats.totalProducts} icon={LuBoxes} tone="amber" />
        <SummaryCard label="Low Stock Products" value={summaryStats.lowStockProducts} icon={LuTriangleAlert} tone="danger" />
      </div>

      <div className="grid grid-cols-1 gap-5 mt-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="bg-white rounded-xl2 p-5 shadow-card border border-slate-50">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
            <div>
              <h3 className="font-semibold text-ink-900">Sales Overview</h3>
              <p className="text-xs text-ink-500">Sales &amp; profit trend by {salesPeriod}</p>
            </div>

            {/* Period filter dropdown — same pattern used on Reports/Invoices/Inventory */}
            <div className="w-40">
              <p className="text-xs font-medium text-ink-500 mb-1.5 px-1">View by</p>
              <div className="relative">
                <button
                  onClick={() => setSalesPeriodOpen((o) => !o)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <LuFilter size={15} />
                    {PERIOD_FILTERS.find((f) => f.key === salesPeriod)?.label}
                  </span>
                  <LuChevronDown size={16} className={`transition-transform ${salesPeriodOpen ? 'rotate-180' : ''}`} />
                </button>

                {salesPeriodOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setSalesPeriodOpen(false)} />
                    <div className="absolute right-0 z-20 mt-2 w-full bg-white rounded-xl shadow-cardHover border border-slate-100 overflow-hidden">
                      {PERIOD_FILTERS.map((f) => (
                        <button
                          key={f.key}
                          onClick={() => { setSalesPeriod(f.key); setSalesPeriodOpen(false) }}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-left transition-colors ${
                            salesPeriod === f.key ? 'bg-primary-50 text-primary-700 font-medium' : 'text-ink-700 hover:bg-slate-50'
                          }`}
                        >
                          {f.label}
                          {salesPeriod === f.key && <LuCheck size={15} />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <SalesOverviewChart data={salesOverviewByPeriod[salesPeriod]} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-6">
        <div className="xl:col-span-2 bg-white rounded-xl2 p-5 shadow-card border border-slate-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-ink-900">Recent Sales</h3>
            <button onClick={() => navigate('/reports')} className="text-xs font-medium text-primary-600 hover:text-primary-700">
              View all
            </button>
          </div>
          <RecentSalesTable data={recentSales} />
        </div>

        <div className="bg-white rounded-xl2 p-5 shadow-card border border-slate-50 flex flex-col gap-3">
          <h3 className="font-semibold text-ink-900 mb-1">Quick Actions</h3>
          <button
            onClick={handleAddProductClick}
            className="flex items-center gap-3 w-full p-4 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors text-left"
          >
            <span className="w-9 h-9 rounded-lg bg-primary-600 text-white flex items-center justify-center shrink-0">
              <LuPlus size={18} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink-900">Add Product</span>
              <span className="block text-xs text-ink-500">Add a new item to inventory</span>
            </span>
          </button>
          <button
            onClick={() => setSaleModalOpen(true)}
            className="flex items-center gap-3 w-full p-4 rounded-xl bg-cream hover:bg-amber-50 transition-colors text-left border border-primary-50"
          >
            <span className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
              <LuShoppingCart size={18} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink-900">New Sale</span>
              <span className="block text-xs text-ink-500">Record a walk-in sale</span>
            </span>
          </button>
        </div>
      </div>

      <NewSaleModal open={saleModalOpen} onClose={() => setSaleModalOpen(false)} onSave={handleSaveSale} />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 lg:left-[300px] lg:translate-x-0 bg-ink-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-cardHover flex items-center gap-2 z-50 justify-center sm:justify-start"
          >
            <LuCheck size={16} className="text-emerald-400" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}
