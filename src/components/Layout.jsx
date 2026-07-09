import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({ title, children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className={`transition-[margin] duration-300 ${collapsed ? 'lg:ml-[84px]' : 'lg:ml-[260px]'}`}>
        <Navbar title={title} onMobileMenuClick={() => setMobileOpen(true)} />
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
