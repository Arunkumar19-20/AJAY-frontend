import { useState, useEffect } from 'react';
import { reportAPI } from '../../services/api';
import { HiOutlineDocumentReport, HiOutlineDownload, HiOutlineSearch, HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';

const typeColors = { UC: 'badge-pending', QPR: 'badge-in-progress', APR: 'badge-completed', PPR: 'badge-delayed' };

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const res = await reportAPI.getAll(); setReports(res.data); }
    catch { /* empty */ } finally { setLoading(false); }
  };

  const handleVerify = async (id) => {
    try {
      await reportAPI.verify(id);
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'VERIFIED' } : r));
      toast.success('Report verified');
    } catch { toast.error('Verification failed'); }
  };

  const filtered = reports.filter(r =>
    (filterType === 'ALL' || r.reportType === filterType) &&
    ((r.title || '').toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99,102,241,0.15)', borderTopColor: 'var(--primary)' }} />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 animate-fadeInUp">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.15)' }}>
          <HiOutlineDocumentReport size={18} style={{ color: '#22d3ee' }} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Reports & UCs</h1>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{reports.length} total submissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
        {[{ label: 'Total', val: reports.length, color: '#818cf8' }, { label: 'Submitted', val: reports.filter(r => r.status === 'SUBMITTED').length, color: '#fbbf24' }, { label: 'Verified', val: reports.filter(r => r.status === 'VERIFIED').length, color: '#34d399' }, { label: 'Types', val: new Set(reports.map(r => r.reportType)).size, color: '#22d3ee' }].map(s => (
          <div key={s.label} className="glass rounded-xl p-4 text-center card-hover">
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.val}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-muted)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="form-input pl-10" placeholder="Search reports..." />
        </div>
        <div className="flex gap-1.5">
          {['ALL', 'UC', 'QPR', 'APR', 'PPR'].map(t => (
            <button key={t} onClick={() => setFilterType(t)} className="px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200" style={{ background: filterType === t ? 'var(--gradient-1)' : 'transparent', color: filterType === t ? 'white' : 'var(--text-muted)', border: filterType === t ? 'none' : '1px solid var(--border)' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Report</th><th>Type</th><th>Quarter</th><th>Amount</th><th>Submitted</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td className="text-white font-semibold">{r.title}</td>
                  <td><span className={`badge ${typeColors[r.reportType] || 'badge-pending'}`}>{r.reportType}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{r.quarter || '—'}</td>
                  <td className="text-white font-bold">{r.amount ? `₹${Number(r.amount).toLocaleString()}` : '—'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : '—'}</td>
                  <td><span className={`badge ${r.status === 'VERIFIED' ? 'badge-completed' : 'badge-pending'}`}>{r.status}</span></td>
                  <td>
                    {r.status === 'SUBMITTED' && (
                      <button onClick={() => handleVerify(r.id)} className="p-1.5 rounded-lg transition-colors" style={{ color: '#34d399' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <HiOutlineCheckCircle size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
