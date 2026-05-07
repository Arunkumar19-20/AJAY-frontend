import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { agencyAPI, stateAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { HiOutlineClipboardList, HiOutlineArrowLeft } from 'react-icons/hi';

export default function ProjectCreate() {
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', agencyId: '', component: '', district: '', startDate: '', endDate: '', budget: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { agencyAPI.getAll().then(r => setAgencies(r.data)).catch(() => {}); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.agencyId) { toast.error('Fill required fields'); return; }
    setSubmitting(true);
    // Mock — would call projectAPI.create(form) when backend supports it
    setTimeout(() => {
      toast.success('Project created and assigned!');
      setSubmitting(false);
      navigate('/state/projects');
    }, 800);
  };

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3 animate-fadeInUp">
        <button onClick={() => navigate('/state/projects')} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <HiOutlineArrowLeft size={18} />
        </button>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <HiOutlineClipboardList size={18} style={{ color: 'var(--primary-light)' }} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Create & Assign Project</h1>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Set scope, timeline and assign to agency</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Project Name *</label><input value={form.name} onChange={e => update('name', e.target.value)} className="form-input" placeholder="e.g. Hostel Construction Phase-II" required /></div>
        <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label><textarea value={form.description} onChange={e => update('description', e.target.value)} className="form-input" rows={3} placeholder="Project scope and details" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Assign to Agency *</label>
            <select value={form.agencyId} onChange={e => update('agencyId', e.target.value)} className="form-input" required>
              <option value="">Select agency</option>
              {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Component</label>
            <select value={form.component} onChange={e => update('component', e.target.value)} className="form-input">
              <option value="">Select</option><option value="ADARSH_GRAM">Adarsh Gram</option><option value="GIA">GIA</option><option value="HOSTEL">Hostel</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>District</label><input value={form.district} onChange={e => update('district', e.target.value)} className="form-input" placeholder="District name" /></div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Budget (₹)</label><input type="number" value={form.budget} onChange={e => update('budget', e.target.value)} className="form-input" placeholder="0" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Start Date</label><input type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)} className="form-input" /></div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>End Date</label><input type="date" value={form.endDate} onChange={e => update('endDate', e.target.value)} className="form-input" /></div>
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center" style={{ borderRadius: '0.75rem' }}>{submitting ? 'Creating...' : 'Create & Assign Project'}</button>
      </form>
    </div>
  );
}
