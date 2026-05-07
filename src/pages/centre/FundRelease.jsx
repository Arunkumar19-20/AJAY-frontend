import { useState } from 'react';
import { HiOutlineCurrencyRupee, HiOutlineArrowRight, HiOutlineCheckCircle } from 'react-icons/hi';

const mockStates = [
  { id: 1, name: 'Andhra Pradesh', pending: '₹45L', lastRelease: '2025-12-10' },
  { id: 2, name: 'Jharkhand', pending: '₹72L', lastRelease: '2025-11-25' },
  { id: 3, name: 'Odisha', pending: '₹38L', lastRelease: '2025-12-05' },
  { id: 4, name: 'Madhya Pradesh', pending: '₹55L', lastRelease: '2025-11-30' },
  { id: 5, name: 'Chhattisgarh', pending: '₹61L', lastRelease: '2025-12-01' },
];

export default function FundRelease() {
  const [selectedState, setSelectedState] = useState(null);
  const [amount, setAmount] = useState('');
  const [component, setComponent] = useState('');
  const [remarks, setRemarks] = useState('');
  const [released, setReleased] = useState([]);

  const handleRelease = () => {
    if (!selectedState || !amount || !component) return;
    setReleased(prev => [...prev, { state: selectedState, amount, component, date: new Date().toLocaleDateString(), id: Date.now() }]);
    setAmount(''); setComponent(''); setRemarks(''); setSelectedState(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 animate-fadeInUp">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)' }}>
          <HiOutlineCurrencyRupee size={18} style={{ color: '#34d399' }} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Release Funds to States</h1>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Approve and release fund installments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Release Form */}
        <div className="glass rounded-2xl p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm font-bold text-white mb-4">New Fund Release</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Select State</label>
              <select value={selectedState || ''} onChange={e => setSelectedState(e.target.value)} className="form-input">
                <option value="">Choose state...</option>
                {mockStates.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Amount (₹)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="form-input" placeholder="Enter amount" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Component</label>
              <select value={component} onChange={e => setComponent(e.target.value)} className="form-input">
                <option value="">Select component</option>
                <option value="ADARSH_GRAM">Adarsh Gram</option>
                <option value="GIA">GIA</option>
                <option value="HOSTEL">Hostel</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Remarks</label>
              <textarea value={remarks} onChange={e => setRemarks(e.target.value)} className="form-input" rows={2} placeholder="Optional remarks" />
            </div>
            <button onClick={handleRelease} className="btn-primary w-full justify-center" style={{ borderRadius: '0.75rem' }}>
              <HiOutlineArrowRight size={16} /> Release Funds
            </button>
          </div>
        </div>

        {/* Pending States */}
        <div className="glass rounded-2xl p-6 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
          <h3 className="text-sm font-bold text-white mb-4">States Pending Release</h3>
          <div className="space-y-2.5">
            {mockStates.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.04)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--gradient-3)' }}>{s.name.charAt(0)}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{s.name}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Last: {s.lastRelease}</p>
                </div>
                <span className="text-sm font-bold" style={{ color: '#fbbf24' }}>{s.pending}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Releases */}
      {released.length > 0 && (
        <div className="glass rounded-2xl p-6 animate-fadeInUp">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <HiOutlineCheckCircle size={16} style={{ color: '#34d399' }} /> Recent Releases
          </h3>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>State</th><th>Amount</th><th>Component</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {released.map(r => (
                  <tr key={r.id}>
                    <td className="text-white font-semibold">{r.state}</td>
                    <td className="text-white font-bold">₹{Number(r.amount).toLocaleString()}</td>
                    <td><span className="badge badge-in-progress">{r.component.replace('_', ' ')}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{r.date}</td>
                    <td><span className="badge badge-completed">Released</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
