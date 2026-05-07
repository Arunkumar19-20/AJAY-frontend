import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI, fundAPI, stateAPI } from '../../services/api';
import { HiOutlineArrowLeft, HiOutlineCalendar, HiOutlineCurrencyRupee } from 'react-icons/hi';

const statusConfig = {
  PENDING: { badge: 'badge-pending', label: 'Pending', color: '#fbbf24' },
  IN_PROGRESS: { badge: 'badge-in-progress', label: 'In Progress', color: '#818cf8' },
  COMPLETED: { badge: 'badge-completed', label: 'Completed', color: '#34d399' },
  DELAYED: { badge: 'badge-delayed', label: 'Delayed', color: '#f87171' },
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [funds, setFunds] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => { load(); }, [id]);

  const load = async () => {
    try {
      const [p, f, s] = await Promise.all([projectAPI.getById(id), fundAPI.getByProject(id), stateAPI.getAll()]);
      setProject(p.data); setFunds(f.data); setStates(s.data);
    } catch { navigate('/state/projects'); }
  };

  if (!project) return (
    <div className="flex justify-center py-24">
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99, 102, 241, 0.15)', borderTopColor: 'var(--primary)' }} />
    </div>
  );

  const cfg = statusConfig[project.status] || statusConfig.PENDING;
  const stateName = states.find(s => s.id === project.stateId)?.name || '';
  const totalFunds = funds.reduce((s, f) => s + Number(f.amount || 0), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 animate-fadeInUp">
        <button onClick={() => navigate('/state/projects')} className="btn-secondary px-3 py-2.5" style={{ borderRadius: '0.875rem' }}>
          <HiOutlineArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-white">{project.title}</h1>
          <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>Project #{project.id}</p>
        </div>
        <span className={`badge ${cfg.badge} text-sm`}>{cfg.label}</span>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        {[
          { label: 'Component', value: project.component?.replace('_', ' '), icon: '📋', gradient: 'var(--gradient-1)' },
          { label: 'State', value: stateName, icon: '📍', gradient: 'var(--gradient-3)' },
          { label: 'Assigned Officer', value: project.assignedOfficer || '—', icon: '👤', gradient: 'var(--gradient-4)' },
        ].map((card) => (
          <div
            key={card.label}
            className="glass rounded-2xl p-5 card-hover"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm" style={{ background: 'rgba(99, 102, 241, 0.06)' }}>
                {card.icon}
              </div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
            </div>
            <p className="text-lg font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="glass rounded-2xl p-7 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
            <HiOutlineCalendar style={{ color: 'var(--primary-light)' }} size={16} />
          </div>
          Timeline
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Start Date</p>
            <p className="text-white font-bold">{project.startDate || '—'}</p>
          </div>
          <div className="flex-1">
            <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: project.status === 'COMPLETED' ? '100%' : project.status === 'IN_PROGRESS' ? '60%' : '30%',
                  background: cfg.color,
                  boxShadow: `0 0 12px ${cfg.color}40`,
                }}
              />
            </div>
          </div>
          <div className="flex-1 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Deadline</p>
            <p className="text-white font-bold">{project.deadline || '—'}</p>
          </div>
        </div>
      </div>

      {/* Fund Transactions */}
      <div className="glass rounded-2xl p-7 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
        <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <HiOutlineCurrencyRupee style={{ color: '#34d399' }} size={16} />
          </div>
          Fund Transactions
          <span className="text-sm font-medium ml-2" style={{ color: 'var(--text-muted)' }}>
            Total: ₹{(totalFunds / 100000).toFixed(2)}L
          </span>
        </h3>
        {funds.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(99, 102, 241, 0.06)' }}>
              <HiOutlineCurrencyRupee size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No fund transactions recorded</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Released By</th>
                  <th>Release Date</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {funds.map(f => (
                  <tr key={f.id}>
                    <td className="text-white font-bold">₹{Number(f.amount).toLocaleString()}</td>
                    <td><span className={`badge ${f.releasedBy === 'CENTRE' ? 'badge-in-progress' : 'badge-completed'}`}>{f.releasedBy}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{f.releaseDate || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{f.receivedDate || '—'}</td>
                    <td><span className={`badge ${f.utilizationStatus === 'FULL' ? 'badge-completed' : f.utilizationStatus === 'PARTIAL' ? 'badge-pending' : 'badge-delayed'}`}>{f.utilizationStatus}</span></td>
                    <td className="text-xs max-w-xs truncate" style={{ color: 'var(--text-muted)' }}>{f.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
