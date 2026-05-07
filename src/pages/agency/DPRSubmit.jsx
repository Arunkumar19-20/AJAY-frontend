import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { approvalAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { HiOutlineDocumentText, HiOutlineArrowLeft, HiOutlineUpload, HiOutlinePlusCircle, HiOutlineTrash } from 'react-icons/hi';

export default function DPRSubmit() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', description: '', budget: '', component: '', type: 'DPR' });
  const [pastDPRs, setPastDPRs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await approvalAPI.getByUser(user.userId);
      setPastDPRs(res.data);
    } catch { /* empty */ } finally { setLoading(false); }
  };

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.budget) { toast.error('Fill required fields'); return; }
    setSubmitting(true);
    try {
      const res = await approvalAPI.create({
        title: form.title, description: form.description,
        budget: parseFloat(form.budget),
        component: form.component || null,
        type: form.type,
        submittedBy: user?.userId,
        assignedState: user?.stateId,
        agencyName: user?.name,
      });
      setPastDPRs(prev => [res.data, ...prev]);
      toast.success('DPR submitted for State approval!');
      setForm({ title: '', description: '', budget: '', component: '', type: 'DPR' });
    } catch { toast.error('Submission failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99,102,241,0.15)', borderTopColor: 'var(--primary)' }} />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3 animate-fadeInUp">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <HiOutlineArrowLeft size={18} />
        </button>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.15)' }}>
          <HiOutlineDocumentText size={18} style={{ color: '#a78bfa' }} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Submit Detailed Project Report</h1>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>For State approval before work begins</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="glass rounded-2xl p-6 space-y-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm font-bold text-white">Project Information</h3>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>DPR Title *</label>
            <input value={form.title} onChange={e => update('title', e.target.value)} className="form-input" placeholder="e.g. Hostel Construction Phase-III DPR" required /></div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Description & Scope</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} className="form-input" rows={3} placeholder="Project objectives, deliverables, methodology..." /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Total Budget (₹) *</label>
              <input type="number" value={form.budget} onChange={e => update('budget', e.target.value)} className="form-input" placeholder="0" required /></div>
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Component</label>
              <select value={form.component} onChange={e => update('component', e.target.value)} className="form-input">
                <option value="">Select</option><option value="ADARSH_GRAM">Adarsh Gram</option><option value="GIA">GIA</option><option value="HOSTEL">Hostel</option>
              </select></div>
          </div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Type</label>
            <select value={form.type} onChange={e => update('type', e.target.value)} className="form-input">
              <option value="DPR">Detailed Project Report</option><option value="WORK_PLAN">Work Plan</option>
            </select></div>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center" style={{ borderRadius: '0.75rem' }}>
          <HiOutlineUpload size={16} /> {submitting ? 'Submitting...' : 'Submit DPR for Approval'}
        </button>
      </form>

      {/* Past DPRs */}
      <div className="glass rounded-2xl p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-sm font-bold text-white mb-3">Previous Submissions</h3>
        {pastDPRs.length === 0 ? (
          <div className="text-center py-8"><p className="text-sm" style={{ color: 'var(--text-muted)' }}>No submissions yet</p></div>
        ) : (
          <div className="space-y-2">
            {pastDPRs.map(d => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                <div><p className="text-sm font-semibold text-white">{d.title}</p><p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{d.submittedAt ? new Date(d.submittedAt).toLocaleDateString() : '—'} {d.budget ? `• ₹${Number(d.budget).toLocaleString()}` : ''}</p></div>
                <span className={`badge ${d.status === 'APPROVED' ? 'badge-completed' : d.status === 'REJECTED' ? 'badge-delayed' : d.status === 'PENDING_STATE' || d.status === 'PENDING_CENTRE' ? 'badge-pending' : 'badge-in-progress'}`}>
                  {d.status === 'PENDING_STATE' ? 'PENDING (STATE)' : d.status === 'PENDING_CENTRE' ? 'PENDING (CENTRE)' : d.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
