import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Layers3, Newspaper, Users, Settings, LogOut, Menu, X, ChevronRight, CircleHelp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Brand from '../components/Brand'

const navigation = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/categories', label: 'Category', icon: Layers3 },
  { path: '/news', label: 'News', icon: Newspaper },
  { path: '/users', label: 'Users', icon: Users },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const location = useLocation()
  const current = navigation.find(item => item.path === location.pathname)
  const date = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date())

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      {open && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="sidebar-brand"><Brand /><button className="icon-button sidebar-close" aria-label="Close menu" onClick={() => setOpen(false)}><X size={20} /></button></div>
        <div className="workspace-label"><span className="workspace-dot" /> ADMIN WORKSPACE</div>
        <nav aria-label="Main navigation" className="nav flex-column">
          {navigation.map(({ path, label, icon: Icon }) => <NavLink key={path} to={path} onClick={() => setOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={19} strokeWidth={1.7} /><span>{label}</span>{location.pathname === path && <span className="active-nav-dot" />}</NavLink>)}
        </nav>
        <div className="sidebar-bottom"><div className="workspace-note"><CircleHelp size={20} /><strong>Your campus, your stories.</strong><p>Keep your community informed,<br />one story at a time.</p></div><div className="sidebar-account"><span className="avatar">AD</span><div><strong>Administrator</strong><small>Admin account</small></div><button className="icon-button" aria-label="Sign out" onClick={logout}><LogOut size={18} /></button></div></div>
      </aside>
      <div className="main-shell">
        <header className="app-header"><div className="header-breadcrumb"><button className="icon-button mobile-menu" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><Menu size={21} /></button><span>Workspace</span><ChevronRight size={14} /><strong>{current?.label || 'Page not found'}</strong></div><div className="header-meta"><span className="header-date">{date}</span><span className="header-divider" /><span className="avatar small">AD</span><span className="header-username">Admin</span></div></header>
        <main id="main-content" className="main-content" tabIndex={-1}><Outlet /></main>
        <footer className="app-footer"><span>© {new Date().getFullYear()} FU News. Made for our community.</span><span>SBA301 · SE1910 <span className="footer-dot">·</span> CE190169</span></footer>
      </div>
    </div>
  )
}
