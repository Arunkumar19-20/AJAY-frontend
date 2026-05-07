import { useState, useEffect } from 'react';
import { fundAPI } from '../services/api';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HiOutlineCurrencyRupee, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

export default function Funds() {
  const { isCentre } = useAuth();
  const [funds, setFunds] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ projectId:'', amount:'', releasedBy:'CENTRE', releaseDate:'', utilizationStatus:'PENDING', remarks:'' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [f, s] = await Promise.all([fundAPI.getAll(), fundAPI.getSummary()]);
      setFunds(f.data); setSummary(s.data);
    } catch { toast.error('Failed to load'); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      await fundAPI.create({ ...form, amount: parseFloat(form.amount) });
      toast.success('Transaction recorded'); setShowForm(false); loadData();
    } catch { toast.error('Failed to save'); }
  };

  const chartData = summary.map(s => ({
    name: s.stateName || `State ${s.stateId}`,
    released: Number(s.totalReleased) / 100000,
    utilized: Number(s.totalUtilized) / 100000,
    pending: Number(s.pendingUtilization) / 100000,
  }));

  const totalReleased = summary.reduce((a, s) => a + Number(s.totalReleased || 0), 0);
  const totalUtilized = summary.reduce((a, s) => a + Number(s.totalUtilized || 0), 0);
  const utilizationPct = totalReleased > 0 ? Math.round((totalUtilized / totalReleased) * 100) : 0;

  const chartTooltipStyle = {
    background: 'rgba(17, 24, 39, 0.95)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    color: '#f1f5f9',
    boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
    padding: '12px 16px',
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99, 102, 241, 0.15)', borderTopColor: 'var(--primary)' }} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeInUp">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
            <HiOutlineCurrencyRupee size={20} style={{ color: '#34d399' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Fund Flow Tracker</h1>
            <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>{funds.length} transactions recorded</p>
          </div>
        </div>
        {isCentre() && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <HiOutlinePlus size={18} />
            Record Transaction
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        {[
          {
            label: 'Total Released',
            value: `₹${(totalReleased / 100000).toFixed(1)}L`,
            gradient: 'var(--gradient-3)',
            glowColor: 'rgba(6, 182, 212, 0.15)',
            icon: '💰',
          },
          {
            label: 'Total Utilized',
            value: `₹${(totalUtilized / 100000).toFixed(1)}L`,
            gradient: 'var(--gradient-4)',
            glowColor: 'rgba(16, 185, 129, 0.15)',
            icon: '✅',
            sub: `${utilizationPct}% utilization`,
          },
          {
            label: 'Pending',
            value: `₹${((totalReleased - totalUtilized) / 100000).toFixed(1)}L`,
            gradient: 'var(--gradient-5)',
            glowColor: 'rgba(245, 158, 11, 0.15)',
            icon: '⏳',
          },
        ].map(card => (
          <div key={card.label} className="glass-vivid rounded-2xl p-6 card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-orb w-11 h-11 flex items-center justify-center text-lg" style={{ background: card.gradient, borderRadius: '0.875rem' }}>
                {card.icon}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{card.label}</span>
            </div>
            <p className="text-3xl font-black text-white">{card.value}</p>
            {card.sub && <p className="text-xs font-semibold mt-1" style={{ color: '#34d399' }}>{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass rounded-2xl p-7 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
            <HiOutlineCurrencyRupee style={{ color: 'var(--primary-light)' }} size={16} />
          </div>
          Fund Flow by State
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>(₹ Lakhs)</span>
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
              <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600 }} />
              <Bar dataKey="released" fill="#818cf8" radius={[6, 6, 0, 0]} name="Released" />
              <Bar dataKey="utilized" fill="#34d399" radius={[6, 6, 0, 0]} name="Utilized" />
              <Bar dataKey="pending" fill="#fbbf24" radius={[6, 6, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-md space-y-5 animate-scaleIn p-7"
            style={{
              background: 'rgba(17, 24, 39, 0.95)',
              backdropFilter: 'blur(32px)',
              border: '1px solid var(--border-light)',
              borderRadius: '1.5rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">Record Transaction</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}>
                <HiOutlineX size={18} />
              </button>
            </div>
            <input value={form.projectId} onChange={e => setForm({...form, projectId: e.target.value})} className="form-input" placeholder="Project ID" type="number" />
            <input value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="form-input" placeholder="Amount (₹)" type="number" />
            <select value={form.releasedBy} onChange={e => setForm({...form, releasedBy: e.target.value})} className="form-input">
              <option value="CENTRE">Centre</option>
              <option value="STATE">State</option>
            </select>
            <input type="date" value={form.releaseDate} onChange={e => setForm({...form, releaseDate: e.target.value})} className="form-input" />
            <select value={form.utilizationStatus} onChange={e => setForm({...form, utilizationStatus: e.target.value})} className="form-input">
              <option value="PENDING">Pending</option>
              <option value="PARTIAL">Partial</option>
              <option value="FULL">Full</option>
            </select>
            <textarea value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})} className="form-input" placeholder="Remarks" rows={2} />
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="btn-primary flex-1 justify-center" style={{ borderRadius: '0.875rem' }}>Save</button>
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center" style={{ borderRadius: '0.875rem' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Project</th>
                <th>Amount</th>
                <th>Released By</th>
                <th>Date</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {funds.map(f => (
                <tr key={f.id}>
                  <td style={{ color: 'var(--text-muted)' }}>#{f.id}</td>
                  <td className="text-white font-semibold">Project #{f.projectId}</td>
                  <td className="text-white font-bold">₹{Number(f.amount).toLocaleString()}</td>
                  <td><span className={`badge ${f.releasedBy === 'CENTRE' ? 'badge-in-progress' : 'badge-completed'}`}>{f.releasedBy}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{f.releaseDate || '—'}</td>
                  <td><span className={`badge ${f.utilizationStatus === 'FULL' ? 'badge-completed' : f.utilizationStatus === 'PARTIAL' ? 'badge-pending' : 'badge-delayed'}`}>{f.utilizationStatus}</span></td>
                  <td className="text-xs max-w-xs truncate" style={{ color: 'var(--text-muted)' }}>{f.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
