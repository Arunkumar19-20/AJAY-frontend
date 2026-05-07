import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { HiOutlinePencilAlt, HiOutlineArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi';

export default function TaskUpdate() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [projectId]);

  const load = async () => {
    try {
      const res = await projectAPI.getById(projectId);
      setProject(res.data);
      setProgress(res.data.progress || 0);
    } catch { toast.error('Failed to load project'); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await projectAPI.updateProgress(projectId, progress);
      setProject(res.data);
      toast.success('Progress updated!');
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99,102,241,0.15)', borderTopColor: 'var(--primary)' }} />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3 animate-fadeInUp">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <HiOutlineArrowLeft size={18} />
        </button>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <HiOutlinePencilAlt size={18} style={{ color: 'var(--primary-light)' }} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Update Task Progress</h1>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{project?.title || `Project #${projectId}`}</p>
        </div>
      </div>

      {/* Project Info */}
      {project && (
        <div className="glass rounded-2xl p-5 animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[['Status', project.status], ['Component', project.component?.replace('_', ' ')], ['Start', project.startDate || '—'], ['Deadline', project.deadline || '—']].map(([l, v]) => (
              <div key={l}><p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{l}</p><p className="text-sm font-semibold text-white">{v || '—'}</p></div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Slider */}
      <div className="glass rounded-2xl p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-white">Completion Progress</p>
          <p className="text-2xl font-black" style={{ color: progress >= 75 ? '#34d399' : progress >= 40 ? '#fbbf24' : '#818cf8' }}>{progress}%</p>
        </div>
        <div className="w-full h-3 rounded-full mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: progress >= 75 ? 'linear-gradient(90deg, #10b981, #34d399)' : progress >= 40 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'var(--gradient-1)' }} />
        </div>
        <input type="range" min={0} max={100} step={5} value={progress} onChange={e => setProgress(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer mb-4"
          style={{ background: `linear-gradient(to right, var(--primary) ${progress}%, rgba(255,255,255,0.06) ${progress}%)` }} />
        <div className="flex items-center gap-3">
          <input type="number" min={0} max={100} value={progress} onChange={e => setProgress(Math.min(100, Math.max(0, Number(e.target.value))))}
            className="w-24 text-center text-sm font-bold py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'white' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>percent</span>
        </div>
      </div>

      {/* Quick Milestones */}
      <div className="glass rounded-2xl p-5 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
        <p className="text-sm font-bold text-white mb-3">Quick Set</p>
        <div className="flex flex-wrap gap-2">
          {[0, 10, 25, 50, 75, 90, 100].map(v => (
            <button key={v} onClick={() => setProgress(v)} className="px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200"
              style={{ background: progress === v ? 'var(--gradient-1)' : 'rgba(255,255,255,0.03)', color: progress === v ? 'white' : 'var(--text-muted)', border: `1px solid ${progress === v ? 'transparent' : 'var(--border)'}` }}>
              {v}%{v === 100 && ' ✓'}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center animate-fadeInUp" style={{ borderRadius: '0.75rem', animationDelay: '0.2s' }}>
        <HiOutlineCheckCircle size={16} /> {saving ? 'Saving...' : 'Save Progress'}
      </button>
    </div>
  );
}
