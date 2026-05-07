import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineArrowRight } from 'react-icons/hi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeDemoIdx, setActiveDemoIdx] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await login(email, password);
      toast.success('Welcome to PM-AJAY Portal!');
      const roleHome = userData.role === 'CENTRE' ? '/centre/dashboard' : userData.role === 'STATE' ? '/state/dashboard' : '/agency/dashboard';
      navigate(roleHome);
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.message || err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const demoLogins = [
    {
      label: 'Centre Admin',
      desc: 'Policy & Oversight (MoSJE)',
      roleTag: 'Top-Level Administrator',
      roleSummary: 'The Centre sets policy, sanctions projects, releases funds to States, and monitors overall implementation across India.',
      email: 'admin@pmajay.gov.in',
      password: 'admin123',
      bg: 'rgba(255,153,51,0.08)',
      bgActive: 'rgba(255,153,51,0.15)',
      border: 'rgba(255,153,51,0.12)',
      borderActive: 'rgba(255,153,51,0.3)',
      iconBg: 'rgba(255,153,51,0.12)',
      iconBorder: 'rgba(255,153,51,0.2)',
      icon: '🏛️',
      capabilities: [
        'Create & manage all projects',
        'Release funds to States',
        'Register & delete agencies',
        'Monitor all States progress',
        'View audit logs & reports',
        'Track fund utilization',
      ],
    },
    {
      label: 'State / UT Officer',
      desc: 'Manager & Supervisor',
      roleTag: 'Middle Layer — Coordinate & Monitor',
      roleSummary: 'The State manages, supervises, and coordinates between the Centre and ground-level agencies.',
      email: 'ap@pmajay.gov.in',
      password: 'state123',
      bg: 'rgba(129,140,248,0.06)',
      bgActive: 'rgba(129,140,248,0.12)',
      border: 'rgba(129,140,248,0.1)',
      borderActive: 'rgba(129,140,248,0.25)',
      iconBg: 'rgba(129,140,248,0.1)',
      iconBorder: 'rgba(129,140,248,0.18)',
      icon: '🏢',
      capabilities: [
        'Register executing agencies',
        'Assign projects to agencies',
        'Disburse funds to agencies',
        'Monitor progress & flag delays',
        'Approve DPRs & work plans',
        'Submit UCs & reports to Centre',
      ],
    },
    {
      label: 'Agency Officer',
      desc: 'Worker & Executor',
      roleTag: 'Ground Level — Build & Report',
      roleSummary: 'The Agency is the ground-level doer — they execute the actual work and report progress back.',
      email: 'agency-ap@pmajay.gov.in',
      password: 'agency123',
      bg: 'rgba(52,211,153,0.06)',
      bgActive: 'rgba(52,211,153,0.12)',
      border: 'rgba(52,211,153,0.1)',
      borderActive: 'rgba(52,211,153,0.25)',
      iconBg: 'rgba(52,211,153,0.1)',
      iconBorder: 'rgba(52,211,153,0.18)',
      icon: '👤',
      capabilities: [
        'View assigned projects',
        'Update fund utilization',
        'Report task completion %',
        'Upload bills & proof docs',
        'Respond to SLA alerts',
        'View project timeline',
      ],
    },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
      style={{ background: 'var(--surface-0)' }}
    >
      {/* Background effects */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(242, 101, 34, 0.1) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 90%, rgba(21, 128, 61, 0.05) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 10% 70%, rgba(3, 105, 161, 0.05) 0%, transparent 50%)',
      }} />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      {/* Floating accent orbs */}
      <div className="absolute w-[400px] h-[400px] rounded-full blur-[150px] animate-float" style={{ background: 'rgba(242, 101, 34, 0.08)', top: '-10%', right: '10%' }} />
      <div className="absolute w-[300px] h-[300px] rounded-full blur-[120px] animate-float" style={{ background: 'rgba(21, 128, 61, 0.06)', bottom: '-5%', left: '15%', animationDelay: '3s' }} />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-[460px]">
        {/* Logo + Title */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div
            className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-5 relative"
            style={{
              background: 'linear-gradient(135deg, #FF9933 0%, #e88520 100%)',
              boxShadow: '0 12px 40px rgba(255, 153, 51, 0.25)',
            }}
          >
            <span className="text-3xl font-black relative z-10" style={{ color: 'white' }}>PM</span>
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent 60%)',
              }}
            />
          </div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>PM-AJAY</h1>
          <p className="text-sm font-medium mt-1.5" style={{ color: 'var(--text-muted)' }}>
            Digital Coordination Platform
          </p>
          {/* Tricolor strip */}
          <div className="flex mx-auto w-32 h-1 rounded-full overflow-hidden mt-4">
            <div className="flex-1" style={{ background: '#FF9933' }} />
            <div className="flex-1 bg-white" />
            <div className="flex-1" style={{ background: '#138808' }} />
          </div>
        </div>

        {/* Login Form Card */}
        <div
          className="rounded-3xl p-8 animate-fadeInUp"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-xl)',
            backdropFilter: 'blur(20px)',
            animationDelay: '0.15s',
          }}
        >
          <div className="mb-7">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Sign in to your account</h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Enter your credentials below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2" size={17} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10"
                  placeholder="officer@pmajay.gov.in"
                  required
                  id="login-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2" size={17} style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <HiOutlineEyeOff size={17} /> : <HiOutlineEye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-sm mt-2"
              id="login-submit"
              style={{ borderRadius: '0.875rem' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <HiOutlineArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Demo Logins */}
          <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-center mb-4" style={{ color: 'var(--text-muted)' }}>
              Select Role to Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              {demoLogins.map((demo, idx) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => {
                    setEmail(demo.email);
                    setPassword(demo.password);
                    setActiveDemoIdx(idx);
                  }}
                  className="flex flex-col items-center gap-2 px-3 py-3.5 rounded-xl transition-all duration-300 text-center"
                  style={{
                    background: activeDemoIdx === idx ? demo.bgActive : demo.bg,
                    border: `1px solid ${activeDemoIdx === idx ? demo.borderActive : demo.border}`,
                  }}
                  onMouseEnter={e => {
                    if (activeDemoIdx !== idx) {
                      e.currentTarget.style.background = demo.bgActive;
                      e.currentTarget.style.borderColor = demo.borderActive;
                    }
                  }}
                  onMouseLeave={e => {
                    if (activeDemoIdx !== idx) {
                      e.currentTarget.style.background = demo.bg;
                      e.currentTarget.style.borderColor = demo.border;
                    }
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-base"
                    style={{ background: demo.iconBg, border: `1px solid ${demo.iconBorder}` }}
                  >
                    {demo.icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>{demo.label}</p>
                    <p className="text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{demo.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Role capabilities */}
            {activeDemoIdx !== null && (
              <div
                key={activeDemoIdx}
                className="mt-3 rounded-xl animate-fadeInUp overflow-hidden"
                style={{
                  background: demoLogins[activeDemoIdx].bg,
                  border: `1px solid ${demoLogins[activeDemoIdx].border}`,
                }}
              >
                {/* Role header */}
                <div className="px-4 pt-3.5 pb-2.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base">{demoLogins[activeDemoIdx].icon}</span>
                    <span className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>{demoLogins[activeDemoIdx].label}</span>
                    <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{
                      background: demoLogins[activeDemoIdx].bgActive,
                      color: 'var(--text-secondary)',
                      border: `1px solid ${demoLogins[activeDemoIdx].border}`,
                    }}>
                      {demoLogins[activeDemoIdx].roleTag}
                    </span>
                  </div>
                  <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {demoLogins[activeDemoIdx].roleSummary}
                  </p>
                </div>

                {/* Capabilities */}
                <div className="px-4 pb-3.5 pt-1">
                  <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                    Platform Actions
                  </p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {demoLogins[activeDemoIdx].capabilities.map((cap, i) => (
                      <p key={i} className="text-[10px] flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ color: '#34d399', fontSize: '7px' }}>●</span>
                        {cap}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-[11px] font-medium animate-fadeInUp" style={{ color: 'var(--text-muted)', animationDelay: '0.3s' }}>
          Pradhan Mantri Adi Janjati Adivasi Yojana • Government of India
        </p>
      </div>
    </div>
  );
}
