import { HiOutlineCog } from 'react-icons/hi';

export default function PlaceholderPage({ title, description, icon: Icon = HiOutlineCog }) {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center animate-fadeInUp">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
          <Icon size={28} style={{ color: 'var(--primary-light)' }} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
        <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>{description}</p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold" style={{ background: 'rgba(245, 158, 11, 0.08)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          Under Development
        </div>
      </div>
    </div>
  );
}
