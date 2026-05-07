import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI, projectAPI } from '../../services/api';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  HiOutlineClipboardList, HiOutlineOfficeBuilding,
  HiOutlineCurrencyRupee, HiOutlineExclamationCircle,
  HiOutlineClock, HiOutlineCheckCircle, HiOutlineTrendingUp,
  HiOutlineLightningBolt, HiOutlineChartBar,
} from 'react-icons/hi';

const COLORS = {
  PENDING: '#fbbf24',
  IN_PROGRESS: '#818cf8',
  COMPLETED: '#34d399',
  DELAYED: '#f87171',
};

const PIE_COLORS = ['#fbbf24', '#818cf8', '#34d399', '#f87171'];

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [fundFlow, setFundFlow] = useState([]);
  const [delayedProjects, setDelayedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sumRes, fundRes, delRes] = await Promise.all([
        dashboardAPI.getSummary(),
        dashboardAPI.getFundFlow(),
        projectAPI.getDelayed(),
      ]);
      setSummary(sumRes.data);
      setFundFlow(fundRes.data);
      setDelayedProjects(delRes.data);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-12 h-12 border-3 rounded-full animate-spin" style={{ borderColor: 'rgba(99, 102, 241, 0.15)', borderTopColor: 'var(--primary)' }} />
          <div className="absolute inset-0 w-12 h-12 rounded-full" style={{ boxShadow: '0 0 20px var(--primary-glow)', animation: 'glow-pulse 1.5s ease-in-out infinite' }} />
        </div>
      </div>
    );
  }

  const pieData = summary ? [
    { name: 'Pending', value: summary.pendingProjects },
    { name: 'In Progress', value: summary.inProgressProjects },
    { name: 'Completed', value: summary.completedProjects },
    { name: 'Delayed', value: summary.delayedProjects },
  ] : [];

  const componentData = summary?.projectsByComponent
    ? Object.entries(summary.projectsByComponent).map(([key, value]) => ({
        name: key.replace('_', ' '),
        projects: value,
      }))
    : [];

  const fundData = fundFlow.map((f) => ({
    name: f.stateName || `State ${f.stateId}`,
    released: Number(f.totalReleased) / 100000,
    utilized: Number(f.totalUtilized) / 100000,
  }));

  const completionRate = summary ? Math.round((summary.completedProjects / (summary.totalProjects || 1)) * 100) : 0;

  const statCards = [
    {
      label: 'Total Projects',
      value: summary?.totalProjects || 0,
      icon: HiOutlineClipboardList,
      gradient: 'var(--gradient-1)',
      glowColor: 'rgba(99, 102, 241, 0.15)',
      change: '+12%',
      isUp: true,
    },
    {
      label: 'Total Agencies',
      value: summary?.totalAgencies || 0,
      icon: HiOutlineOfficeBuilding,
      gradient: 'var(--gradient-3)',
      glowColor: 'rgba(6, 182, 212, 0.15)',
      change: '+5%',
      isUp: true,
    },
    {
      label: 'Funds Released',
      value: `₹${((Number(summary?.totalFundsReleased) || 0) / 100000).toFixed(1)}L`,
      icon: HiOutlineCurrencyRupee,
      gradient: 'var(--gradient-4)',
      glowColor: 'rgba(16, 185, 129, 0.15)',
      change: '+18%',
      isUp: true,
    },
    {
      label: 'Delayed Projects',
      value: summary?.delayedProjects || 0,
      icon: HiOutlineExclamationCircle,
      gradient: 'linear-gradient(135deg, #f87171, #ef4444)',
      glowColor: 'rgba(239, 68, 68, 0.15)',
      change: delayedProjects.length > 0 ? 'Action needed' : 'All clear',
      isAlert: delayedProjects.length > 0,
    },
  ];

  const chartTooltipStyle = {
    background: 'rgba(17, 24, 39, 0.95)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    color: '#f1f5f9',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
    padding: '12px 16px',
  };

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-7 relative overflow-hidden animate-fadeInUp"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.04))',
          border: '1px solid rgba(99, 102, 241, 0.1)',
        }}
      >
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-[0.08] blur-[80px]" style={{ background: 'var(--gradient-saffron)' }} />
        <div className="absolute bottom-0 left-[30%] w-[200px] h-[200px] rounded-full opacity-[0.05] blur-[60px]" style={{ background: 'var(--gradient-3)' }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">👋</span>
              <h1 className="text-2xl font-black text-white">
                Welcome back, {user?.name}
              </h1>
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Here's what's happening with PM-AJAY projects today.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
          }}>
            <HiOutlineLightningBolt size={18} style={{ color: '#34d399' }} />
            <span className="text-sm font-bold" style={{ color: '#34d399' }}>{completionRate}% Completion</span>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className="glass-vivid rounded-2xl p-6 card-hover stat-card animate-fadeInUp"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-5">
              <div
                className="icon-orb w-12 h-12 flex items-center justify-center"
                style={{ background: card.gradient, borderRadius: '0.875rem' }}
              >
                <card.icon size={22} className="text-white" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                card.isAlert 
                  ? '' 
                  : ''
              }`}
              style={{
                background: card.isAlert ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: card.isAlert ? '#f87171' : '#34d399',
                border: `1px solid ${card.isAlert ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'}`,
              }}>
                {card.isUp && !card.isAlert && '↑ '}{card.change}
              </span>
            </div>
            <p className="text-3xl font-black text-white mb-1.5">{card.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Pie Chart */}
        <div className="glass rounded-2xl p-6 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
              <HiOutlineChartBar style={{ color: 'var(--primary-light)' }} size={16} />
            </div>
            Projects by Status
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend
                  wrapperStyle={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fund Flow Bar Chart */}
        <div className="glass rounded-2xl p-6 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <HiOutlineCurrencyRupee style={{ color: '#34d399' }} size={16} />
            </div>
            Fund Released vs Utilized
            <span className="text-xs font-medium ml-1" style={{ color: 'var(--text-muted)' }}>(₹ Lakhs)</span>
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fundData} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600 }} />
                <Bar dataKey="released" fill="#818cf8" radius={[6, 6, 0, 0]} name="Released" />
                <Bar dataKey="utilized" fill="#34d399" radius={[6, 6, 0, 0]} name="Utilized" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Component-wise + Delayed row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Component Progress */}
        <div className="glass rounded-2xl p-6 lg:col-span-1 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              <HiOutlineTrendingUp style={{ color: '#a78bfa' }} size={16} />
            </div>
            By Component
          </h3>
          <div className="space-y-5">
            {componentData.map((comp, i) => {
              const pct = (comp.projects / (summary?.totalProjects || 1)) * 100;
              const gradients = ['var(--gradient-1)', 'var(--gradient-3)', 'var(--gradient-5)'];
              return (
                <div key={comp.name} className="animate-fadeInUp" style={{ animationDelay: `${0.7 + i * 0.1}s` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{comp.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>{pct.toFixed(0)}%</span>
                      <span className="text-sm font-black text-white">{comp.projects}</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${pct}%`,
                        background: gradients[i % gradients.length],
                        boxShadow: `0 0 12px rgba(99, 102, 241, 0.2)`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delayed Projects Alert */}
        <div className="glass rounded-2xl p-6 lg:col-span-2 animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
          <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <HiOutlineClock style={{ color: '#f87171' }} size={16} />
            </div>
            Delayed Projects
            {delayedProjects.length > 0 && (
              <span className="badge badge-delayed ml-2">{delayedProjects.length}</span>
            )}
          </h3>
          {delayedProjects.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.08)' }}>
                <HiOutlineCheckCircle size={32} style={{ color: '#34d399' }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>No delayed projects!</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>All projects are on track 🎉</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {delayedProjects.map((project, i) => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 animate-fadeInUp group"
                  style={{
                    background: 'rgba(239, 68, 68, 0.03)',
                    border: '1px solid rgba(239, 68, 68, 0.08)',
                    animationDelay: `${0.8 + i * 0.05}s`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.08)';
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                    <HiOutlineExclamationCircle className="text-red-400" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{project.title}</p>
                    <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Deadline: {project.deadline} • {project.assignedOfficer}
                    </p>
                  </div>
                  <span className="badge badge-delayed flex-shrink-0">Delayed</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
