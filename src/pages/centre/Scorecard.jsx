import { useState, useEffect, useMemo } from 'react';
import { projectAPI, stateAPI, dashboardAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  HiOutlineChartSquareBar, HiOutlineTrendingUp, HiOutlineTrendingDown,
  HiOutlineExclamationCircle, HiOutlineCheckCircle, HiOutlineStar,
  HiOutlineArrowUp, HiOutlineArrowDown, HiOutlineSwitchVertical,
} from 'react-icons/hi';

const TIER_CONFIG = {
  EXCELLENT: { label: 'Excellent', color: '#15803d', bg: 'rgba(21, 128, 61, 0.08)', border: 'rgba(21, 128, 61, 0.15)', emoji: '🏆' },
  GOOD:      { label: 'Good',      color: '#0369a1', bg: 'rgba(3, 105, 161, 0.08)', border: 'rgba(3, 105, 161, 0.15)', emoji: '✅' },
  NEEDS_IMPROVEMENT: { label: 'Needs Improvement', color: '#d97706', bg: 'rgba(217, 119, 6, 0.08)', border: 'rgba(217, 119, 6, 0.15)', emoji: '⚠️' },
  CRITICAL:  { label: 'Critical',  color: '#dc2626', bg: 'rgba(220, 38, 38, 0.08)', border: 'rgba(220, 38, 38, 0.15)', emoji: '🔴' },
};

function getTier(score) {
  if (score >= 80) return TIER_CONFIG.EXCELLENT;
  if (score >= 60) return TIER_CONFIG.GOOD;
  if (score >= 40) return TIER_CONFIG.NEEDS_IMPROVEMENT;
  return TIER_CONFIG.CRITICAL;
}

function getMedal(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}

function ProgressBar({ value, color, height = '6px' }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.04)', height }}>
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
      />
    </div>
  );
}

function StarRating({ score }) {
  const stars = Math.round(score / 20);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <HiOutlineStar
          key={i}
          size={14}
          style={{
            color: i <= stars ? '#f59e0b' : 'rgba(0,0,0,0.1)',
            fill: i <= stars ? '#f59e0b' : 'transparent',
          }}
        />
      ))}
    </div>
  );
}

export default function Scorecard() {
  const [projects, setProjects] = useState([]);
  const [states, setStates] = useState([]);
  const [fundFlow, setFundFlow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('score');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, sRes, fRes] = await Promise.all([
        projectAPI.getAll(),
        stateAPI.getAll(),
        dashboardAPI.getFundFlow(),
      ]);
      setProjects(pRes.data);
      setStates(sRes.data);
      setFundFlow(fRes.data);
    } catch {
      toast.error('Failed to load scorecard data');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Compute Scorecard Data ─── */
  const scorecardData = useMemo(() => {
    return states.map(state => {
      const stateProjects = projects.filter(p => p.stateId === state.id);
      const total = stateProjects.length;
      const completed = stateProjects.filter(p => p.status === 'COMPLETED').length;
      const delayed = stateProjects.filter(p => p.status === 'DELAYED').length;
      const inProgress = stateProjects.filter(p => p.status === 'IN_PROGRESS').length;
      const pending = stateProjects.filter(p => p.status === 'PENDING').length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      const fund = fundFlow.find(f => f.stateId === state.id);
      const released = Number(fund?.totalReleased || 0);
      const utilized = Number(fund?.totalUtilized || 0);
      const utilizationPct = released > 0 ? Math.round((utilized / released) * 100) : 0;

      /* Delay penalty: 0 = no delayed, 100 = all delayed */
      const delayPenalty = total > 0 ? Math.round((1 - delayed / total) * 100) : 100;

      /* Composite score: 50% utilization + 30% completion + 20% no-delay */
      const score = Math.round(utilizationPct * 0.50 + completionRate * 0.30 + delayPenalty * 0.20);

      return {
        id: state.id,
        name: state.name,
        code: state.code,
        total,
        completed,
        delayed,
        inProgress,
        pending,
        completionRate,
        released,
        utilized,
        utilizationPct,
        score,
        tier: getTier(score),
      };
    }).filter(s => s.total > 0); // Only show states with projects
  }, [projects, states, fundFlow]);

  /* ─── Sorting ─── */
  const sorted = useMemo(() => {
    const arr = [...scorecardData];
    arr.sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy];
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      if (sortDir === 'asc') return va > vb ? 1 : -1;
      return va < vb ? 1 : -1;
    });
    return arr.map((s, i) => ({ ...s, rank: i + 1 }));
  }, [scorecardData, sortBy, sortDir]);

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <HiOutlineSwitchVertical size={12} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />;
    return sortDir === 'desc'
      ? <HiOutlineArrowDown size={12} style={{ color: 'var(--primary)' }} />
      : <HiOutlineArrowUp size={12} style={{ color: 'var(--primary)' }} />;
  };

  /* ─── Summary Stats ─── */
  const avgScore = scorecardData.length > 0
    ? Math.round(scorecardData.reduce((a, s) => a + s.score, 0) / scorecardData.length) : 0;
  const avgUtilization = scorecardData.length > 0
    ? Math.round(scorecardData.reduce((a, s) => a + s.utilizationPct, 0) / scorecardData.length) : 0;
  const totalDelayed = scorecardData.reduce((a, s) => a + s.delayed, 0);
  const totalCompleted = scorecardData.reduce((a, s) => a + s.completed, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-3 rounded-full animate-spin" style={{ borderColor: 'rgba(99, 102, 241, 0.15)', borderTopColor: 'var(--primary)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeInUp">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
            <HiOutlineChartSquareBar size={20} style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">State Performance Scorecard</h1>
            <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Public accountability dashboard • {scorecardData.length} states ranked
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{
          background: getTier(avgScore).bg,
          border: `1px solid ${getTier(avgScore).border}`,
        }}>
          <span className="text-sm">{getTier(avgScore).emoji}</span>
          <span className="text-xs font-bold" style={{ color: getTier(avgScore).color }}>
            Avg Score: {avgScore}/100
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        {[
          {
            label: 'Average Score',
            value: `${avgScore}/100`,
            icon: HiOutlineStar,
            gradient: 'var(--gradient-1)',
            sub: getTier(avgScore).label,
            subColor: getTier(avgScore).color,
          },
          {
            label: 'Avg Utilization',
            value: `${avgUtilization}%`,
            icon: HiOutlineTrendingUp,
            gradient: 'var(--gradient-4)',
            sub: 'Fund utilization',
            subColor: '#15803d',
          },
          {
            label: 'Projects Done',
            value: totalCompleted,
            icon: HiOutlineCheckCircle,
            gradient: 'var(--gradient-3)',
            sub: 'Completed',
            subColor: '#0369a1',
          },
          {
            label: 'Delayed',
            value: totalDelayed,
            icon: HiOutlineExclamationCircle,
            gradient: 'linear-gradient(135deg, #dc2626, #b91c1c)',
            sub: totalDelayed > 0 ? 'Action needed' : 'All clear',
            subColor: totalDelayed > 0 ? '#dc2626' : '#15803d',
          },
        ].map((card, i) => (
          <div key={card.label} className="glass-vivid rounded-2xl p-5 card-hover animate-fadeInUp" style={{ animationDelay: `${0.15 + i * 0.05}s` }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="icon-orb w-9 h-9 flex items-center justify-center" style={{ background: card.gradient, borderRadius: '0.75rem' }}>
                <card.icon size={17} className="text-white" style={{ color: 'white' }} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{card.label}</span>
            </div>
            <p className="text-2xl font-black text-white">{card.value}</p>
            <p className="text-[10px] font-semibold mt-1" style={{ color: card.subColor }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Scorecard Table */}
      <div className="glass rounded-2xl overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.25s' }}>
        <div className="p-5 pb-0">
          <h3 className="text-base font-bold text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              <HiOutlineChartSquareBar style={{ color: '#a78bfa' }} size={16} />
            </div>
            State Rankings
            <span className="text-xs font-medium ml-1" style={{ color: 'var(--text-muted)' }}>
              (Weighted: 50% Utilization + 30% Completion + 20% No-Delay)
            </span>
          </h3>
        </div>

        <div className="overflow-x-auto p-5 pt-4">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>Rank</th>
                <th>
                  <button onClick={() => toggleSort('name')} className="flex items-center gap-1 font-bold uppercase tracking-wider text-inherit" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', letterSpacing: 'inherit' }}>
                    State <SortIcon field="name" />
                  </button>
                </th>
                <th>
                  <button onClick={() => toggleSort('utilizationPct')} className="flex items-center gap-1 font-bold uppercase tracking-wider text-inherit" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', letterSpacing: 'inherit' }}>
                    Fund Utilization <SortIcon field="utilizationPct" />
                  </button>
                </th>
                <th>
                  <button onClick={() => toggleSort('completionRate')} className="flex items-center gap-1 font-bold uppercase tracking-wider text-inherit" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', letterSpacing: 'inherit' }}>
                    Completion <SortIcon field="completionRate" />
                  </button>
                </th>
                <th>
                  <button onClick={() => toggleSort('delayed')} className="flex items-center gap-1 font-bold uppercase tracking-wider text-inherit" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', letterSpacing: 'inherit' }}>
                    Delays <SortIcon field="delayed" />
                  </button>
                </th>
                <th style={{ width: '80px' }}>Projects</th>
                <th>
                  <button onClick={() => toggleSort('score')} className="flex items-center gap-1 font-bold uppercase tracking-wider text-inherit" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', letterSpacing: 'inherit' }}>
                    Score <SortIcon field="score" />
                  </button>
                </th>
                <th>Rating</th>
                <th>Tier</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, i) => (
                <tr
                  key={s.id}
                  className="animate-fadeInUp"
                  style={{
                    animationDelay: `${0.3 + i * 0.05}s`,
                    background: s.rank <= 3 ? 'rgba(242, 101, 34, 0.02)' : 'transparent',
                  }}
                >
                  {/* Rank */}
                  <td>
                    <span style={{
                      fontSize: s.rank <= 3 ? '18px' : '13px',
                      fontWeight: 800,
                      color: s.rank <= 3 ? undefined : 'var(--text-muted)',
                    }}>
                      {getMedal(s.rank)}
                    </span>
                  </td>

                  {/* State Name */}
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: 'var(--gradient-1)' }}>
                        {s.code || s.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white" style={{ lineHeight: 1.2 }}>{s.name}</p>
                        <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                          {s.total} project{s.total !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Fund Utilization */}
                  <td>
                    <div className="space-y-1" style={{ minWidth: '100px' }}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold" style={{ color: s.utilizationPct >= 70 ? '#15803d' : s.utilizationPct >= 40 ? '#d97706' : '#dc2626' }}>
                          {s.utilizationPct}%
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          ₹{(s.utilized / 100000).toFixed(1)}L
                        </span>
                      </div>
                      <ProgressBar
                        value={s.utilizationPct}
                        color={s.utilizationPct >= 70 ? '#15803d' : s.utilizationPct >= 40 ? '#d97706' : '#dc2626'}
                      />
                    </div>
                  </td>

                  {/* Completion Rate */}
                  <td>
                    <div className="space-y-1" style={{ minWidth: '90px' }}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold" style={{ color: s.completionRate >= 70 ? '#15803d' : s.completionRate >= 40 ? '#d97706' : '#dc2626' }}>
                          {s.completionRate}%
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {s.completed}/{s.total}
                        </span>
                      </div>
                      <ProgressBar
                        value={s.completionRate}
                        color={s.completionRate >= 70 ? '#15803d' : s.completionRate >= 40 ? '#0369a1' : '#d97706'}
                      />
                    </div>
                  </td>

                  {/* Delays */}
                  <td>
                    {s.delayed > 0 ? (
                      <span className="badge badge-delayed" style={{ fontSize: '11px' }}>
                        {s.delayed} delayed
                      </span>
                    ) : (
                      <span className="text-xs font-semibold flex items-center gap-1" style={{ color: '#15803d' }}>
                        <HiOutlineCheckCircle size={14} /> None
                      </span>
                    )}
                  </td>

                  {/* Projects Breakdown */}
                  <td>
                    <div className="flex gap-1">
                      {s.completed > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(21, 128, 61, 0.1)', color: '#15803d' }}>{s.completed}✓</span>}
                      {s.inProgress > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(3, 105, 161, 0.1)', color: '#0369a1' }}>{s.inProgress}⟳</span>}
                      {s.pending > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#d97706' }}>{s.pending}⏳</span>}
                      {s.delayed > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626' }}>{s.delayed}⚠</span>}
                    </div>
                  </td>

                  {/* Score */}
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black" style={{ color: s.tier.color }}>{s.score}</span>
                      <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>/100</span>
                    </div>
                  </td>

                  {/* Star Rating */}
                  <td>
                    <StarRating score={s.score} />
                  </td>

                  {/* Tier */}
                  <td>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{
                      background: s.tier.bg,
                      color: s.tier.color,
                      border: `1px solid ${s.tier.border}`,
                    }}>
                      {s.tier.emoji} {s.tier.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.06)' }}>
              <HiOutlineChartSquareBar size={28} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p className="text-base font-semibold text-white">No data available</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Projects need to be assigned to states first</p>
          </div>
        )}
      </div>

      {/* Methodology Note */}
      <div className="glass rounded-2xl p-5 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          📋 Scoring Methodology
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(21, 128, 61, 0.04)', border: '1px solid rgba(21, 128, 61, 0.1)' }}>
            <p className="text-xs font-bold mb-1" style={{ color: '#15803d' }}>Fund Utilization — 50%</p>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Ratio of utilized funds to released funds. Higher utilization = better score.
            </p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(3, 105, 161, 0.04)', border: '1px solid rgba(3, 105, 161, 0.1)' }}>
            <p className="text-xs font-bold mb-1" style={{ color: '#0369a1' }}>Project Completion — 30%</p>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Percentage of projects marked as completed out of total assigned.
            </p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(220, 38, 38, 0.04)', border: '1px solid rgba(220, 38, 38, 0.1)' }}>
            <p className="text-xs font-bold mb-1" style={{ color: '#dc2626' }}>Delay Penalty — 20%</p>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              States with delayed projects receive a penalty inversely proportional to delay count.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
