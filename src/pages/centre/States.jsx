import { useState, useEffect } from 'react';
import { stateAPI } from '../../services/api';
import { HiOutlineGlobe } from 'react-icons/hi';

export default function States() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stateAPI.getAll().then(r => setStates(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99,102,241,0.15)', borderTopColor: 'var(--primary)' }} />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 animate-fadeInUp">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.15)' }}>
          <HiOutlineGlobe size={18} style={{ color: '#22d3ee' }} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">States & UTs</h1>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{states.length} registered</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {states.map((s, i) => (
          <div key={s.id} className="glass rounded-xl p-4 card-hover animate-fadeInUp" style={{ animationDelay: `${i * 0.04}s` }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--gradient-3)' }}>
                {s.name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{s.name}</p>
                <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Code: {s.code || s.id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
