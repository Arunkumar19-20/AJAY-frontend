import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reportAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { HiOutlineDocumentReport, HiOutlineUpload } from 'react-icons/hi';

export default function Reports() {
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', reportType: 'UC', quarter: '', amount: '', remarks: '' });
  const [submitted, setSubmitted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = user?.stateId ? await reportAPI.getByState(user.stateId) : await reportAPI.getAll();
      setSubmitted(res.data);
    } catch { /* empty */ } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.reportType) { toast.error('Fill required fields'); return; }
    setSubmitting(true);
    try {
      const res = await reportAPI.create({
        title: form.title, reportType: form.reportType, quarter: form.quarter,
        amount: form.amount ? parseFloat(form.amount) : null,
        stateId: user?.stateId, submittedBy: user?.userId, remarks: form.remarks,
      });
      setSubmitted(prev => [res.data, ...prev]);
      toast.success('Report submitted to Centre!');
      setForm({ title: '', reportType: 'UC', quarter: '', amount: '', remarks: '' });
    } catch { toast.error('Submission failed'); }
    finally { setSubmitting(false); }
  };

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

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
          <h1 className="text-xl font-black text-white">Submit UCs & Reports</h1>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Submit to Centre (MoSJE)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm font-bold text-white">New Submission</h3>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Report Title *</label>
            <input value={form.title} onChange={e => update('title', e.target.value)} className="form-input" placeholder="e.g. Q3 2025 Utilization Certificate" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Type</label>
              <select value={form.reportType} onChange={e => update('reportType', e.target.value)} className="form-input">
                <option value="UC">Utilization Certificate</option><option value="QPR">Quarterly Progress</option><option value="APR">Annual Report</option><option value="PPR">Physical Progress</option>
              </select></div>
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Quarter</label>
              <select value={form.quarter} onChange={e => update('quarter', e.target.value)} className="form-input">
                <option value="">Select</option><option value="Q1">Q1 (Apr-Jun)</option><option value="Q2">Q2 (Jul-Sep)</option><option value="Q3">Q3 (Oct-Dec)</option><option value="Q4">Q4 (Jan-Mar)</option>
              </select></div>
          </div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Total Amount (₹)</label>
            <input type="number" value={form.amount} onChange={e => update('amount', e.target.value)} className="form-input" placeholder="0" /></div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Remarks</label>
            <textarea value={form.remarks} onChange={e => update('remarks', e.target.value)} className="form-input" rows={2} placeholder="Optional notes" /></div>
          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center" style={{ borderRadius: '0.75rem' }}>
            <HiOutlineUpload size={16} /> {submitting ? 'Submitting...' : 'Submit to Centre'}
          </button>
        </form>

        <div className="glass rounded-2xl p-6 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
          <h3 className="text-sm font-bold text-white mb-4">Submission History</h3>
          {submitted.length === 0 ? (
            <div className="text-center py-12"><p className="text-sm" style={{ color: 'var(--text-muted)' }}>No submissions yet</p></div>
          ) : (
            <div className="space-y-2.5">
              {submitted.map(r => (
                <div key={r.id} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{r.title}</p>
                    <span className={`badge ${r.status === 'VERIFIED' ? 'badge-completed' : 'badge-pending'}`}>{r.status}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    <span className="badge badge-in-progress" style={{ padding: '0.15rem 0.5rem', fontSize: '0.6rem' }}>{r.reportType}</span>
                    {r.quarter && <span>📅 {r.quarter}</span>}
                    {r.submittedAt && <span>{new Date(r.submittedAt).toLocaleDateString()}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
