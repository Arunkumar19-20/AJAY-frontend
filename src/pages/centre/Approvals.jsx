import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { approvalAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineEye, HiOutlineSearch } from 'react-icons/hi';

export default function Approvals() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await approvalAPI.getAll();
      setItems(res.data);
    } catch { /* empty */ } finally { setLoading(false); }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === 'APPROVED') await approvalAPI.approve(id, user.userId);
      else await approvalAPI.reject(id, user.userId);
      toast.success(`DPR ${action.toLowerCase()}`);
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: action } : i));
      setViewItem(null);
    } catch { toast.error('Action failed'); }
  };

  const filtered = items.filter(i => (i.title || '').toLowerCase().includes(search.toLowerCase()) || (i.agencyName || '').toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99,102,241,0.15)', borderTopColor: 'var(--primary)' }} />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between animate-fadeInUp">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <HiOutlineCheckCircle size={18} style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Approvals</h1>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{items.filter(i => i.status === 'PENDING_CENTRE').length} pending review</p>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
        <div className="relative">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-muted)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="form-input pl-10" placeholder="Search DPRs, agencies..." />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl text-center py-16 animate-fadeInUp"><p className="text-sm" style={{ color: 'var(--text-muted)' }}>No approvals found</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <div key={item.id} className="glass rounded-xl p-5 animate-fadeInUp" style={{ animationDelay: `${0.1 + i * 0.04}s` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`badge ${item.status === 'PENDING_CENTRE' ? 'badge-pending' : item.status === 'APPROVED' ? 'badge-completed' : item.status === 'REJECTED' ? 'badge-delayed' : 'badge-in-progress'}`}>
                      {item.status === 'PENDING_CENTRE' ? 'PENDING' : item.status.replace('_', ' ')}
                    </span>
                    {item.component && <span className="badge badge-in-progress">{item.component.replace('_', ' ')}</span>}
                    {item.type && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(99,102,241,0.08)', color: 'var(--primary-light)' }}>{item.type}</span>}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                  <div className="flex flex-wrap gap-4 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {item.agencyName && <span>🏢 {item.agencyName}</span>}
                    {item.budget && <span>💰 ₹{Number(item.budget).toLocaleString()}</span>}
                    {item.submittedAt && <span>📅 {new Date(item.submittedAt).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => setViewItem(item)} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--primary-light)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <HiOutlineEye size={16} />
                  </button>
                  {item.status === 'PENDING_CENTRE' && (
                    <>
                      <button onClick={() => handleAction(item.id, 'APPROVED')} className="p-2 rounded-lg transition-colors" style={{ color: '#34d399' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <HiOutlineCheckCircle size={16} />
                      </button>
                      <button onClick={() => handleAction(item.id, 'REJECTED')} className="p-2 rounded-lg transition-colors" style={{ color: '#f87171' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <HiOutlineXCircle size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={() => setViewItem(null)}>
          <div className="w-full max-w-lg p-6 rounded-2xl animate-scaleIn" style={{ background: 'rgba(17,24,39,0.95)', border: '1px solid var(--border-light)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-4">{viewItem.title}</h2>
            {viewItem.description && <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{viewItem.description}</p>}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[['Agency', viewItem.agencyName], ['Component', viewItem.component?.replace('_',' ')], ['Type', viewItem.type], ['Budget', viewItem.budget ? `₹${Number(viewItem.budget).toLocaleString()}` : '—'], ['Submitted', viewItem.submittedAt ? new Date(viewItem.submittedAt).toLocaleDateString() : '—'], ['Status', viewItem.status]].map(([l,v]) => (
                <div key={l}><p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{l}</p><p className="text-sm font-semibold text-white">{v || '—'}</p></div>
              ))}
            </div>
            {viewItem.status === 'PENDING_CENTRE' && (
              <div className="flex gap-2">
                <button onClick={() => handleAction(viewItem.id, 'APPROVED')} className="btn-primary flex-1 justify-center" style={{ borderRadius: '0.75rem', background: 'linear-gradient(135deg, #10b981, #34d399)' }}>✓ Approve</button>
                <button onClick={() => handleAction(viewItem.id, 'REJECTED')} className="btn-secondary flex-1 justify-center" style={{ borderRadius: '0.75rem', color: '#f87171', borderColor: 'rgba(239,68,68,0.2)' }}>✗ Reject</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
