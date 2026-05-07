import { HiOutlineSearchCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--surface-0)' }}>
      <div className="text-center animate-fadeInUp">
        <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
          <HiOutlineSearchCircle size={40} style={{ color: 'var(--primary-light)' }} />
        </div>
        <h1 className="text-4xl font-black text-white mb-2">404</h1>
        <p className="text-base font-semibold text-white mb-1">Page Not Found</p>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>The page you're looking for doesn't exist.</p>
        <Link to="/login" className="btn-primary" style={{ borderRadius: '0.75rem' }}>Go Home</Link>
      </div>
    </div>
  );
}
