import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import { HiOutlineBell } from 'react-icons/hi';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?.userId) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.userId]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await notificationAPI.getForUser(user.userId);
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl transition-all duration-300"
        style={{
          background: isOpen ? 'rgba(242, 101, 34, 0.1)' : 'rgba(0, 0, 0, 0.03)',
          border: `1px solid ${isOpen ? 'rgba(242, 101, 34, 0.2)' : 'transparent'}`,
        }}
        id="notification-bell"
      >
        <HiOutlineBell size={20} style={{ color: isOpen ? 'var(--primary-light)' : 'var(--text-secondary)' }} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 rounded-full text-white text-[10px] flex items-center justify-center font-bold px-1"
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-[340px] max-h-[420px] overflow-hidden rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(32px) saturate(180%)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 9999,
            animation: 'fadeInDown 0.25s ease-out',
          }}
        >
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
            <div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</h3>
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{unreadCount} unread</p>
            </div>
            {unreadCount > 0 && (
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(242, 101, 34, 0.1)', color: 'var(--primary)', border: '1px solid rgba(242, 101, 34, 0.15)' }}
              >
                {unreadCount} NEW
              </span>
            )}
          </div>

          <div className="overflow-y-auto max-h-[340px]">
            {notifications.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(242, 101, 34, 0.08)' }}>
                  <HiOutlineBell size={24} style={{ color: 'var(--text-muted)' }} />
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No notifications yet</p>
              </div>
            ) : (
              <div>
                {notifications.slice(0, 20).map((notification) => (
                  <div
                    key={notification.id}
                    className="px-5 py-3.5 cursor-pointer transition-all duration-200"
                    style={{
                      borderBottom: '1px solid var(--border)',
                      background: !notification.isRead ? 'rgba(242, 101, 34, 0.05)' : 'transparent',
                    }}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(242, 101, 34, 0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = !notification.isRead ? 'rgba(242, 101, 34, 0.05)' : 'transparent'}
                  >
                    <div className="flex items-start gap-3">
                      {!notification.isRead && (
                        <div
                          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{ background: 'var(--primary)', boxShadow: '0 0 8px var(--primary-glow)' }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>
                          {notification.message}
                        </p>
                        <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
