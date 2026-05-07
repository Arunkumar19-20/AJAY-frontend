import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { notificationAPI } from '../../services/api';
import { HiOutlineBell, HiOutlineCheck } from 'react-icons/hi';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await notificationAPI.getForUser(user.userId);
      setNotifications(res.data);
    } catch { /* empty */ } finally { setLoading(false); }
  };

  const markRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch { /* empty */ }
  };

  const unread = notifications.filter(n => !n.isRead).length;

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99,102,241,0.15)', borderTopColor: 'var(--primary)' }} />
    </div>
  );

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center justify-between animate-fadeInUp">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <HiOutlineBell size={18} style={{ color: 'var(--primary-light)' }} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Notifications</h1>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{unread} unread</p>
          </div>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="glass rounded-2xl text-center py-20 animate-fadeInUp">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.06)' }}>
            <HiOutlineBell size={24} style={{ color: 'var(--text-muted)' }} />
          </div>
          <p className="text-sm font-semibold text-white">No notifications</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <div
              key={n.id}
              className="glass rounded-xl p-4 flex items-start gap-3 transition-all duration-200 animate-fadeInUp"
              style={{ animationDelay: `${i * 0.03}s`, background: !n.isRead ? 'rgba(99,102,241,0.04)' : undefined }}
            >
              <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.isRead ? 'var(--border)' : 'var(--primary)', boxShadow: n.isRead ? 'none' : '0 0 8px var(--primary-glow)' }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">{n.message}</p>
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {!n.isRead && (
                <button onClick={() => markRead(n.id)} className="p-1.5 rounded-lg transition-colors flex-shrink-0" style={{ color: 'var(--primary-light)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <HiOutlineCheck size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
