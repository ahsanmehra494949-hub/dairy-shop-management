import { LuSearch, LuBell, LuMenu } from 'react-icons/lu'

export default function Navbar({ title, onMobileMenuClick }) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="flex items-center justify-between gap-4 px-5 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuClick}
            className="lg:hidden p-2 rounded-lg text-ink-700 hover:bg-slate-50"
            aria-label="Open menu"
          >
            <LuMenu size={20} />
          </button>
          <h1 className="text-xl font-semibold text-ink-900">{title}</h1>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-sm relative">
          <LuSearch className="absolute left-3.5 text-ink-300" size={17} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-sm placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:bg-white focus:border-primary-300 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Notification Icon */}
          <button
            className="relative p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
            aria-label="Notifications"
          >
            <LuBell size={19} className="text-ink-700" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-600" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold">
              A
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-ink-900 leading-tight">Admin User</p>
              <p className="text-xs text-ink-500 leading-tight">Shop Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
