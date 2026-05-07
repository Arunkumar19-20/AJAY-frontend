import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import {
  HiOutlineHome, HiOutlineOfficeBuilding, HiOutlineClipboardList,
  HiOutlineCurrencyRupee, HiOutlineShieldCheck, HiOutlineLogout,
  HiOutlineMenu, HiOutlineX, HiOutlineChevronRight, HiOutlineGlobe,
  HiOutlineDocumentReport, HiOutlineUsers, HiOutlineCheckCircle,
  HiOutlineBell, HiOutlineUpload, HiOutlineUser, HiOutlinePencilAlt,
  HiOutlineDocumentText,
} from 'react-icons/hi';

const navConfigs = {
  CENTRE: [
    { path: '/centre/dashboard', label: 'Dashboard', icon: HiOutlineHome },
    { path: '/centre/states', label: 'States', icon: HiOutlineGlobe },
    { path: '/centre/agencies', label: 'Agencies', icon: HiOutlineOfficeBuilding },
    { path: '/centre/projects', label: 'Projects', icon: HiOutlineClipboardList },
    { path: '/centre/funds', label: 'Fund Flow', icon: HiOutlineCurrencyRupee },
    { path: '/centre/approvals', label: 'Approvals', icon: HiOutlineCheckCircle },
    { path: '/centre/audit', label: 'Audit Log', icon: HiOutlineShieldCheck },
    { path: '/centre/reports', label: 'Reports', icon: HiOutlineDocumentReport },
    { path: '/centre/users', label: 'Users', icon: HiOutlineUsers },
    { path: '/centre/notifications', label: 'Notifications', icon: HiOutlineBell },
  ],
  STATE: [
    { path: '/state/dashboard', label: 'Dashboard', icon: HiOutlineHome },
    { path: '/state/agencies', label: 'Agencies', icon: HiOutlineOfficeBuilding },
    { path: '/state/projects', label: 'Projects', icon: HiOutlineClipboardList },
    { path: '/state/funds', label: 'Fund Flow', icon: HiOutlineCurrencyRupee },
    { path: '/state/approvals', label: 'Approvals', icon: HiOutlineCheckCircle },
    { path: '/state/documents', label: 'Documents', icon: HiOutlineDocumentText },
    { path: '/state/reports', label: 'Reports', icon: HiOutlineDocumentReport },
    { path: '/state/notifications', label: 'Notifications', icon: HiOutlineBell },
  ],
  AGENCY: [
    { path: '/agency/dashboard', label: 'Dashboard', icon: HiOutlineHome },
    { path: '/agency/projects', label: 'My Projects', icon: HiOutlineClipboardList },
    { path: '/agency/funds', label: 'Fund Usage', icon: HiOutlineCurrencyRupee },
    { path: '/agency/documents/upload', label: 'Upload Docs', icon: HiOutlineUpload },
    { path: '/agency/dpr/submit', label: 'Submit DPR', icon: HiOutlinePencilAlt },
    { path: '/agency/notifications', label: 'Notifications', icon: HiOutlineBell },
    { path: '/agency/profile', label: 'Profile', icon: HiOutlineUser },
  ],
};

const roleLabels = {
  CENTRE: 'Centre Admin',
  STATE: 'State / UT',
  AGENCY: 'Agency',
};

export default function RoleLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = user?.role || 'CENTRE';
  const navItems = navConfigs[role] || [];
  const currentPage = navItems.find((n) => location.pathname.startsWith(n.path))?.label || 'PM-AJAY';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--surface-0)' }}>
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
        className={`fixed inset-y-0 left-0 z-50 w-[260px] transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 lg:static lg:flex-shrink-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRight: '1px solid var(--border)',
          backdropFilter: 'blur(32px)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm relative overflow-hidden"
            style={{ background: 'var(--gradient-saffron)', color: 'white' }}
          >
            <span className="relative z-10">PM</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-extrabold text-sm tracking-wide" style={{ color: 'var(--text-primary)' }}>PM-AJAY</h1>
            <p className="text-[10px] font-semibold" style={{ color: 'var(--primary-light)' }}>
              {roleLabels[role]} Portal
            </p>
          </div>
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onClick={() => setSidebarOpen(false)}
          >
            <HiOutlineX size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Navigation
          </p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== `/${role.toLowerCase()}/dashboard` && location.pathname.startsWith(item.path + '/'));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all duration-300 relative ${
                  isActive ? 'text-white' : 'hover:bg-white/[0.03]'
                }`}
                style={
                  isActive
                    ? {
                        background: 'var(--gradient-1)',
                        boxShadow: '0 4px 15px rgba(242, 101, 34, 0.25)',
                        color: 'white',
                      }
                    : { color: 'var(--text-secondary)' }
                }
              >
                <item.icon size={17} style={isActive ? {} : { opacity: 0.7 }} />
                <span>{item.label}</span>
                {isActive && <HiOutlineChevronRight size={13} className="ml-auto opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="px-3 py-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5 mb-2.5 p-2 rounded-lg" style={{ background: 'rgba(242, 101, 34, 0.06)' }}>
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--gradient-1)', color: 'white' }}
            >
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
              <p className="text-[10px] font-medium" style={{ color: 'var(--primary-light)' }}>{roleLabels[role]}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'transparent' }}
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
            <HiOutlineLogout size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <header
          className="flex items-center justify-between px-6 py-3 relative flex-shrink-0"
          style={{ background: 'rgba(255, 255, 255, 0.95)', borderBottom: '1px solid var(--border)', zIndex: 50, backdropFilter: 'blur(16px)' }}
        >
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)' }}
              onClick={() => setSidebarOpen(true)}
            >
              <HiOutlineMenu size={20} />
            </button>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                {currentPage}
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--success)', boxShadow: '0 0 6px var(--success-glow)' }} />
              </h2>
              <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                PM-AJAY • {roleLabels[role]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <NotificationBell />
            <div className="hidden sm:block w-px h-5" style={{ background: 'var(--border-light)' }} />
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(242, 101, 34, 0.06)', border: '1px solid rgba(242, 101, 34, 0.1)' }}>
              <div className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ background: 'var(--gradient-1)', color: 'white' }}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                <p className="text-[9px] font-medium" style={{ color: 'var(--primary-light)' }}>{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5" style={{ background: 'var(--surface-0)' }}>
          <div className="relative">{children}</div>
        </main>
      </div>
    </div>
  );
}
