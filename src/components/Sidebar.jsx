import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuLayoutDashboard,
  LuPackageSearch,
  LuUsers,
  LuFileChartColumn,
  LuSettings,
  LuChevronRight,
  LuX,
  LuShoppingCart,
  LuReceipt,
} from 'react-icons/lu'

const menuItems = [
  { to: '/', label: 'Dashboard', icon: LuLayoutDashboard, end: true },
  { to: '/pos', label: 'Point of Sale', icon: LuShoppingCart },
  { to: '/inventory', label: 'Inventory', icon: LuPackageSearch },
  { to: '/invoices', label: 'Invoices', icon: LuReceipt },
  { to: '/customers', label: 'Customers', icon: LuUsers },
  { to: '/reports', label: 'Reports', icon: LuFileChartColumn },
  { to: '/settings', label: 'Settings', icon: LuSettings },
]

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 bg-ink-900/40 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 84 : 260 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="hidden lg:flex fixed left-0 top-0 h-screen bg-white border-r border-slate-100 shadow-sidebar z-30 flex-col"
      >
        <SidebarContent collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 z-40 w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-card hover:bg-primary-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          <motion.span animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
            <LuChevronRight size={14} />
          </motion.span>
        </button>
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-screen w-[260px] bg-white z-40 shadow-sidebar flex flex-col lg:hidden"
          >
            <div className="flex justify-end p-4">
              <button onClick={() => setMobileOpen(false)} className="text-ink-500 hover:text-ink-900">
                <LuX size={20} />
              </button>
            </div>
            <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

function SidebarContent({ collapsed, onNavigate }) {
  return (
    <div className="flex flex-col h-full py-6 px-3 overflow-y-auto">
      <div className={`px-2 mb-8 ${collapsed ? 'hidden' : ''}`}>
        <span className="font-display font-bold text-sm leading-tight text-ink-900">
          Dairy Shop<br />Management System
        </span>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {menuItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-semibold'
                  : 'text-ink-500 hover:bg-slate-50 hover:text-ink-900'
              }`
            }
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-primary-600"
                  />
                )}
                <Icon size={19} className="shrink-0" />
                {!collapsed && <span className="text-sm whitespace-nowrap">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
