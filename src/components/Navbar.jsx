import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  LuSearch, 
  LuBell, 
  LuMenu, 
  LuUser, 
  LuSettings, 
  LuLogOut, 
  LuChevronDown 
} from 'react-icons/lu'
import { useShop } from '../context/ShopContext'
import NotificationsModal from './NotificationsModal'

export default function Navbar({ title, onMobileMenuClick }) {
  const navigate = useNavigate()
  const { products } = useShop()
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Build live low-stock / out-of-stock notifications straight from current inventory
  const notifications = (products || [])
    .filter((p) => p.stock <= 10)
    .sort((a, b) => a.stock - b.stock)
    .map((p) => ({
      id: p.id,
      outOfStock: p.stock === 0,
      title: p.stock === 0 ? `${p.name} is Out of Stock` : `${p.name} — Low Stock`,
      detail: p.stock === 0 ? 'No quantity remaining' : `Only ${p.stock} ${p.unit} left`,
    }))

  // Close dropdown menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between gap-4 px-5 lg:px-8 py-4">
          
          {/* LEFT COMPONENT */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMobileMenuClick}
              className="lg:hidden p-2 rounded-lg text-ink-700 hover:bg-slate-50 transition-colors"
              aria-label="Open menu"
            >
              <LuMenu size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          </div>

          {/* MIDDLE SEARCH */}
          <div className="hidden md:flex items-center flex-1 max-w-sm relative">
            <LuSearch className="absolute left-3.5 text-slate-400" size={17} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-400 transition-all"
            />
          </div>

          {/* RIGHT CONTROLS */}
          <div className="flex items-center gap-4">
            
            {/* Notification Button with Counter Badge */}
            <button
              onClick={() => setNotifOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <LuBell size={19} />
              {notifications.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Profile Menu Dropdown Container */}
            <div className="relative flex items-center" ref={menuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 pl-3 border-l border-slate-200 hover:opacity-90 transition-opacity cursor-pointer focus:outline-none"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-200 uppercase tracking-wider">
                  A
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-slate-800 leading-tight">Admin User</p>
                  <p className="text-xs text-slate-400 font-medium leading-tight mt-0.5">Shop Admin</p>
                </div>
                <LuChevronDown size={14} className={`text-slate-400 transition-transform hidden sm:block ${profileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* DROPDOWN POPUP MENU */}
              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 transition-all">
                  
                  {/* Profile Header (Name changed from shakir to Admin User) */}
                  <div className="p-4 border-b border-slate-50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      A
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-bold text-slate-800 truncate">Admin User</h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">admin@dairyshop.com</p>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false)
                        navigate('/profile')
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                        <LuUser size={15} />
                      </div>
                      My Profile
                    </button>

                    <button
                      onClick={() => {
                        setProfileMenuOpen(false)
                        navigate('/settings')
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500">
                        <LuSettings size={15} />
                      </div>
                      Settings
                    </button>

                    <div className="h-px bg-slate-100 my-1 mx-3" />

                    <button
                      onClick={() => {
                        setProfileMenuOpen(false)
                        console.log('Logging out...')
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50/50 transition-colors text-left"
                    >
                      <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                        <LuLogOut size={15} />
                      </div>
                      Sign Out
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* FIXED LAYER FOR NOTIFICATION MODAL TO PREVENT CUTOFFS */}
      {notifOpen && (
        <div className="fixed inset-0 z-[9999] pointer-events-auto">
          <NotificationsModal 
            open={notifOpen} 
            onClose={() => setNotifOpen(false)} 
            notifications={notifications} 
          />
        </div>
      )}
    </>
  )
}