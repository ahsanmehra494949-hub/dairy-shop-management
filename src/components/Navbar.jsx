import { useEffect, useRef, useState } from 'react'
import { LuSearch, LuBell, LuMenu, LuTriangleAlert, LuPackageX } from 'react-icons/lu'
import { useShop } from '../context/ShopContext'
import AdminProfileModal from './AdminProfileModal'

export default function Navbar({ title, onMobileMenuClick }) {
  const { products } = useShop()
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const notifRef = useRef(null)

  // Build live low-stock / out-of-stock notifications straight from current inventory.
  const notifications = products
    .filter((p) => p.stock <= 10)
    .sort((a, b) => a.stock - b.stock)
    .map((p) => ({
      id: p.id,
      outOfStock: p.stock === 0,
      title: p.stock === 0 ? `${p.name} is Out of Stock` : `${p.name} — Low Stock`,
      detail: p.stock === 0 ? 'No quantity remaining' : `Only ${p.stock} ${p.unit} left`,
    }))

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="flex items-center justify-between gap-4 px-5 lg:px-8 py-4">
        
        {/* Left Side: Menu and Title Perfectly Centered */}
        <div className="flex items-center gap-3 h-10">
          <button
            onClick={onMobileMenuClick}
            className="lg:hidden p-2 rounded-lg text-ink-700 hover:bg-slate-50 flex items-center justify-center shrink-0"
            aria-label="Open menu"
          >
            <LuMenu size={20} />
          </button>
          <h1 className="text-xl font-semibold text-ink-900 leading-none self-center">
            {title}
          </h1>
        </div>

        {/* Center Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-sm relative">
          <LuSearch className="absolute left-3.5 text-ink-300" size={17} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-sm placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:bg-white focus:border-primary-300 transition-all"
          />
        </div>

        {/* Right Side: Bell and Profile Actions - Perfectly Centered Row */}
        <div className="flex items-center gap-3 h-10">
          
          {/* Notification Icon */}
          <div className="relative flex items-center h-full" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center shrink-0"
              aria-label="Notifications"
            >
              <LuBell size={19} className="text-ink-700" />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            {/* Dropdown position adjusted relative to the row */}
            {notifOpen && (
              <div className="absolute right-0 top-[48px] w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-cardHover border border-slate-100 z-50">
                <div className="p-4 border-b border-slate-100">
                  <p className="font-semibold text-ink-900 text-sm">Stock Notifications</p>
                </div>
                {notifications.length === 0 ? (
                  <p className="p-5 text-sm text-ink-500 text-center">
                    All products are well stocked.
                  </p>
                ) : (
                  <ul>
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className="flex items-start gap-3 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                      >
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
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
              </div>
            )}
          </div>

          {/* User Profile - FIXED: Centered vertically, no longer sticking to the top */}
          <div className="flex items-center h-full pl-3 border-l border-slate-100">
            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity h-full"
            >
              {/* Rounded Avatar Circle */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                A
              </div>
              
              {/* Admin Name Details - Perfectly aligned inside the flex row */}
              <div className="hidden sm:flex flex-col items-start justify-center text-left">
                <p className="text-sm font-semibold text-ink-900 leading-none mb-1">
                  Admin User
                </p>
                <p className="text-xs text-ink-500 leading-none">
                  Shop Admin
                </p>
              </div>
            </button>
          </div>
          
        </div>
      </div>

      <AdminProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </header>
  )
}