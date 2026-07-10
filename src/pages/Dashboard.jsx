import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LuWallet, LuTrendingUp, LuBoxes, LuTriangleAlert, LuPlus, LuShoppingCart, LuCheck } from 'react-icons/lu'
import Layout from '../components/Layout'
import SummaryCard from '../components/SummaryCard'
import { SalesOverviewChart, WeeklySalesChart } from '../components/Charts'
import RecentSalesTable from '../components/RecentSalesTable'
import NewSaleModal from '../components/NewSaleModal'
import { useShop } from '../context/ShopContext'
import { summaryStats, salesOverview, weeklySales } from '../data/dummyData'

export default function Dashboard() {
  const navigate = useNavigate()
  const { recentSales, addSale } = useShop()
  const [saleModalOpen, setSaleModalOpen] = useState(false)
  const [toast, setToast] = useState(null)

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
          <h3 className="font-semibold text-ink-900 mb-1">Sales Overview</h3>
          <p className="text-xs text-ink-500 mb-2">This week's daily sales trend</p>
          <SalesOverviewChart data={salesOverview} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} className="bg-white rounded-xl2 p-5 shadow-card border border-slate-50">
          <h3 className="font-semibold text-ink-900 mb-1">Weekly Sales</h3>
          <p className="text-xs text-ink-500 mb-2">Sales total for the last 4 weeks</p>
          <WeeklySalesChart data={weeklySales} />
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
