import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { agencyAPI } from '../../services/api';
import { HiOutlineUser, HiOutlinePhone, HiOutlineOfficeBuilding } from 'react-icons/hi';

export default function Profile() {
  const { user } = useAuth();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.agencyId) {
      agencyAPI.getById(user.agencyId).then(r => setAgency(r.data)).catch(() => {}).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99,102,241,0.15)', borderTopColor: 'var(--primary)' }} />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3 animate-fadeInUp">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <HiOutlineUser size={18} style={{ color: 'var(--primary-light)' }} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Agency Profile</h1>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Your agency details</p>
        </div>
      </div>

      {/* User Card */}
      <div className="glass rounded-2xl p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-sm font-bold text-white mb-4">User Info</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Name', value: user?.name },
            { label: 'Email', value: user?.email },
            { label: 'Role', value: user?.role },
            { label: 'User ID', value: user?.userId },
          ].map(item => (
            <div key={item.label}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
              <p className="text-sm font-semibold text-white">{item.value || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Agency Card */}
      {agency && (
        <div className="glass rounded-2xl p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <HiOutlineOfficeBuilding size={16} style={{ color: 'var(--primary-light)' }} />
            Agency Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Agency Name', value: agency.name },
              { label: 'Type', value: agency.type },
              { label: 'Component', value: agency.component?.replace('_', ' ') },
              { label: 'District', value: agency.district },
              { label: 'Nodal Officer', value: agency.nodalOfficer },
              { label: 'Contact', value: agency.contact },
            ].map(item => (
              <div key={item.label}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                <p className="text-sm font-semibold text-white">{item.value || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
