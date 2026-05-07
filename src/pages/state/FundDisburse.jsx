import { useState, useEffect } from 'react';
import { agencyAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { HiOutlineCurrencyRupee, HiOutlineArrowRight, HiOutlineCheckCircle } from 'react-icons/hi';

export default function FundDisburse() {
  const [agencies, setAgencies] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState('');
  const [amount, setAmount] = useState('');
  const [project, setProject] = useState('');
  const [remarks, setRemarks] = useState('');
  const [disbursed, setDisbursed] = useState([]);

  useEffect(() => { agencyAPI.getAll().then(r => setAgencies(r.data)).catch(() => {}); }, []);

  const handleDisburse = () => {
    if (!selectedAgency || !amount) { toast.error('Select agency and enter amount'); return; }
    const agency = agencies.find(a => String(a.id) === selectedAgency);
    setDisbursed(prev => [...prev, { agency: agency?.name || selectedAgency, amount, project: project || '—', date: new Date().toLocaleDateString(), id: Date.now() }]);
    toast.success(`₹${Number(amount).toLocaleString()} disbursed to ${agency?.name}`);
    setAmount(''); setProject(''); setRemarks(''); setSelectedAgency('');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 animate-fadeInUp">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)' }}>
          <HiOutlineCurrencyRupee size={18} style={{ color: '#34d399' }} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Disburse Funds to Agencies</h1>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Forward Centre-released funds to executing agencies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass rounded-2xl p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm font-bold text-white mb-4">New Disbursement</h3>
          <div className="space-y-4">
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Select Agency</label>
              <select value={selectedAgency} onChange={e => setSelectedAgency(e.target.value)} className="form-input">
                <option value="">Choose agency...</option>
                {agencies.map(a => <option key={a.id} value={a.id}>{a.name} ({a.district || a.type})</option>)}
              </select>
            </div>
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Amount (₹)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="form-input" placeholder="Enter amount" />
            </div>
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>For Project (optional)</label>
              <input value={project} onChange={e => setProject(e.target.value)} className="form-input" placeholder="Project name" />
            </div>
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Remarks</label>
              <textarea value={remarks} onChange={e => setRemarks(e.target.value)} className="form-input" rows={2} placeholder="Optional" />
            </div>
            <button onClick={handleDisburse} className="btn-primary w-full justify-center" style={{ borderRadius: '0.75rem' }}>
              <HiOutlineArrowRight size={16} /> Disburse Funds
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><HiOutlineCheckCircle size={16} style={{ color: '#34d399' }} /> Recent Disbursements</h3>
          {disbursed.length === 0 ? (
            <div className="text-center py-12"><p className="text-sm" style={{ color: 'var(--text-muted)' }}>No disbursements yet</p></div>
          ) : (
            <div className="space-y-2.5">
              {disbursed.map(d => (
                <div key={d.id} className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.1)' }}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{d.agency}</p>
                    <p className="text-sm font-bold" style={{ color: '#34d399' }}>₹{Number(d.amount).toLocaleString()}</p>
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Project: {d.project} • {d.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
