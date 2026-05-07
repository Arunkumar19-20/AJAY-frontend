import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import {
  HiOutlineHome,
  HiOutlineOfficeBuilding,
  HiOutlineClipboardList,
  HiOutlineCurrencyRupee,
  HiOutlineShieldCheck,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineChevronRight,
} from 'react-icons/hi';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineHome, roles: ['CENTRE', 'STATE', 'AGENCY'] },
  { path: '/agencies', label: 'Agencies', icon: HiOutlineOfficeBuilding, roles: ['CENTRE', 'STATE', 'AGENCY'] },
  { path: '/projects', label: 'Projects', icon: HiOutlineClipboardList, roles: ['CENTRE', 'STATE', 'AGENCY'] },
  { path: '/funds', label: 'Fund Flow', icon: HiOutlineCurrencyRupee, roles: ['CENTRE', 'STATE', 'AGENCY'] },
  { path: '/audit', label: 'Audit Log', icon: HiOutlineShieldCheck, roles: ['CENTRE', 'STATE'] },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNav = navItems.filter((item) => item.roles.includes(user?.role));

  const currentPage = filteredNav.find((n) => n.path === location.pathname)?.label || 'PM-AJAY';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--surface-0)' }}>
      {/* Mesh background */}
      <div className="mesh-bg" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[270px] transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 lg:static lg:flex-shrink-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(10, 15, 30, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%)',
          borderRight: '1px solid var(--border)',
          backdropFilter: 'blur(32px)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3.5 px-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-sm relative overflow-hidden"
            style={{ background: 'var(--gradient-saffron)' }}
          >
            <span className="relative z-10">PM</span>
            <div className="absolute inset-0 bg-white/10" style={{ animation: 'shimmer 3s ease-in-out infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
          </div>
          <div>
            <h1 className="text-white font-extrabold text-base tracking-wide" style={{ letterSpacing: '0.05em' }}>
              PM-AJAY
            </h1>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
              Digital Coordination
            </p>
          </div>
          <button
            className="lg:hidden ml-auto p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onClick={() => setSidebarOpen(false)}
          >
            <HiOutlineX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
            Navigation
          </p>
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 relative ${
                  isActive
                    ? 'text-white'
                    : 'hover:bg-white/[0.03]'
                }`}
                style={
                  isActive
                    ? {
                        background: 'var(--gradient-1)',
                        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                        color: 'white',
                      }
                    : { color: 'var(--text-secondary)' }
                }
              >
                <item.icon size={19} style={isActive ? {} : { opacity: 0.7 }} />
                <span>{item.label}</span>
                {isActive && (
                  <HiOutlineChevronRight size={14} className="ml-auto opacity-60" />
                )}
                {!isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 rounded-full transition-all duration-300 group-hover:h-5"
                    style={{ background: 'var(--primary)' }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 mb-3 p-2 rounded-xl" style={{ background: 'rgba(99, 102, 241, 0.04)' }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'var(--gradient-1)', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}
            >
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs font-medium" style={{ color: 'var(--primary-light)' }}>{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
            style={{
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#f87171';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <HiOutlineLogout size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 py-3.5 relative flex-shrink-0"
          style={{
            background: '#0a0f1e',
            borderBottom: '1px solid var(--border)',
            zIndex: 50,
          }}
        >
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-xl transition-colors"
              style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)' }}
              onClick={() => setSidebarOpen(true)}
            >
              <HiOutlineMenu size={22} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {currentPage}
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: 'var(--success)', boxShadow: '0 0 8px var(--success-glow)', animation: 'glow-pulse 2s ease-in-out infinite' }}
                />
              </h2>
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                Pradhan Mantri Adi Janjati Adivasi Yojana
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="hidden sm:block w-px h-6" style={{ background: 'var(--border-light)' }} />
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(99, 102, 241, 0.06)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'var(--gradient-1)' }}
              >
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{user?.name}</p>
                <p className="text-[10px] font-medium" style={{ color: 'var(--primary-light)' }}>{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ background: 'var(--surface-0)' }}>
          <div className="relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
