import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--surface-0)' }}>
      <div className="text-center animate-fadeInUp">
        <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
          <HiOutlineExclamationCircle size={40} style={{ color: '#f87171' }} />
        </div>
        <h1 className="text-4xl font-black text-white mb-2">403</h1>
        <p className="text-base font-semibold text-white mb-1">Access Denied</p>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>You don't have permission to access this page.</p>
        <Link to="/login" className="btn-primary" style={{ borderRadius: '0.75rem' }}>Back to Login</Link>
      </div>
    </div>
  );
}
