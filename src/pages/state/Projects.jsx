import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { projectAPI, stateAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { HiOutlinePlus, HiOutlineSearch, HiOutlineCalendar, HiOutlineEye, HiOutlineFilter, HiOutlineClipboardList, HiOutlineX } from 'react-icons/hi';

const statusConfig = {
  PENDING: { badge: 'badge-pending', label: 'Pending', color: '#fbbf24' },
  IN_PROGRESS: { badge: 'badge-in-progress', label: 'In Progress', color: '#818cf8' },
  COMPLETED: { badge: 'badge-completed', label: 'Completed', color: '#34d399' },
  DELAYED: { badge: 'badge-delayed', label: 'Delayed', color: '#f87171' },
};

export default function Projects() {
  const { user, isCentre } = useAuth();
  const [projects, setProjects] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [form, setForm] = useState({ title:'', component:'', stateId:'', status:'PENDING', startDate:'', deadline:'', assignedOfficer:'' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [p, s] = await Promise.all([projectAPI.getAll(), stateAPI.getAll()]);
      setProjects(p.data); setStates(s.data);
    } catch { toast.error('Failed to load'); } finally { setLoading(false); }
  };

  const getStateName = (id) => states.find(s => s.id === id)?.name || '';

  const handleSave = async () => {
    try {
      editProject ? await projectAPI.update(editProject.id, form) : await projectAPI.create(form);
      toast.success('Saved!'); setShowForm(false); setEditProject(null); loadData();
    } catch { toast.error('Save failed'); }
  };

  const filtered = projects.filter(p => {
    const ms = p.title?.toLowerCase().includes(search.toLowerCase());
    const mst = filterStatus === 'ALL' || p.status === filterStatus;
    return ms && mst;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeInUp">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
            <HiOutlineClipboardList size={20} style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Project Tracker</h1>
            <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>{filtered.length} projects</p>
          </div>
        </div>
        {isCentre() && (
          <button
            onClick={() => { setShowForm(true); setEditProject(null); setForm({ title:'', component:'', stateId:'', status:'PENDING', startDate:'', deadline:'', assignedOfficer:'' }); }}
            className="btn-primary"
          >
            <HiOutlinePlus size={18} />
            New Project
          </button>
        )}
      </div>

      <div className="glass rounded-2xl p-5 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="form-input pl-10" placeholder="Search projects..." />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="form-input w-40">
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="DELAYED">Delayed</option>
          </select>
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
            className="w-full max-w-lg space-y-5 animate-scaleIn p-7"
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
              <h2 className="text-xl font-black text-white">{editProject ? 'Edit' : 'Create'} Project</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}>
                <HiOutlineX size={18} />
              </button>
            </div>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="form-input" placeholder="Project Title" />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.component} onChange={e => setForm({...form, component: e.target.value})} className="form-input">
                <option value="">Component</option>
                <option value="ADARSH_GRAM">Adarsh Gram</option>
                <option value="GIA">GIA</option>
                <option value="HOSTEL">Hostel</option>
              </select>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="form-input">
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="DELAYED">Delayed</option>
              </select>
            </div>
            <select value={form.stateId} onChange={e => setForm({...form, stateId: e.target.value})} className="form-input">
              <option value="">Select State</option>
              {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Start Date</label>
                <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="form-input" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="form-input" />
              </div>
            </div>
            <input value={form.assignedOfficer} onChange={e => setForm({...form, assignedOfficer: e.target.value})} className="form-input" placeholder="Assigned Officer" />
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="btn-primary flex-1 justify-center" style={{ borderRadius: '0.875rem' }}>Save Project</button>
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center" style={{ borderRadius: '0.875rem' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99, 102, 241, 0.15)', borderTopColor: 'var(--primary)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl text-center py-24">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(99, 102, 241, 0.06)' }}>
            <HiOutlineFilter size={28} style={{ color: 'var(--text-muted)' }} />
          </div>
          <p className="text-base font-semibold text-white">No projects found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p, i) => {
            const cfg = statusConfig[p.status] || statusConfig.PENDING;
            return (
              <div
                key={p.id}
                className="glass rounded-2xl p-6 card-hover animate-fadeInUp"
                style={{ animationDelay: `${0.15 + i * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.15)' }}
                  >
                    {p.component?.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-3 line-clamp-2 leading-snug">{p.title}</h3>
                <div className="space-y-2 text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                  <p className="flex items-center gap-2">
                    <span>📍</span>
                    <span className="font-medium">{getStateName(p.stateId)}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>👤</span>
                    <span className="font-medium">{p.assignedOfficer || '—'}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <HiOutlineCalendar size={14} style={{ color: 'var(--text-muted)' }} />
                    <span className="font-medium">{p.startDate || '—'} → {p.deadline || '—'}</span>
                  </p>
                </div>
                {/* Status line */}
                <div className="w-full h-1 rounded-full mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: p.status === 'COMPLETED' ? '100%' : p.status === 'IN_PROGRESS' ? '60%' : p.status === 'DELAYED' ? '40%' : '15%',
                      background: cfg.color,
                      boxShadow: `0 0 8px ${cfg.color}40`,
                      transition: 'width 1s ease',
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/state/projects/${p.id}`}
                    className="btn-secondary text-xs py-2 px-4 flex-1 flex items-center justify-center gap-1.5"
                    style={{ borderRadius: '0.75rem' }}
                  >
                    <HiOutlineEye size={14} />
                    View Details
                  </Link>
                  {isCentre() && (
                    <button
                      onClick={() => {
                        setEditProject(p);
                        setForm({ title: p.title, component: p.component, stateId: p.stateId || '', status: p.status, startDate: p.startDate || '', deadline: p.deadline || '', assignedOfficer: p.assignedOfficer || '' });
                        setShowForm(true);
                      }}
                      className="btn-secondary text-xs py-2 px-4 flex-1 justify-center"
                      style={{ borderRadius: '0.75rem' }}
                    >
                      ✏️ Edit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
