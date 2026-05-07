import { useState } from 'react';
import { HiOutlineUsers, HiOutlinePlus, HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';

const mockUsers = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@pmajay.gov.in', role: 'STATE', state: 'Jharkhand', status: 'ACTIVE', lastLogin: '2025-12-15' },
  { id: 2, name: 'Priya Sharma', email: 'priya@pmajay.gov.in', role: 'STATE', state: 'Odisha', status: 'ACTIVE', lastLogin: '2025-12-14' },
  { id: 3, name: 'Vikram Singh', email: 'vikram@pmajay.gov.in', role: 'AGENCY', state: 'MP', status: 'ACTIVE', lastLogin: '2025-12-13' },
  { id: 4, name: 'Anita Devi', email: 'anita@pmajay.gov.in', role: 'STATE', state: 'Chhattisgarh', status: 'INACTIVE', lastLogin: '2025-11-20' },
  { id: 5, name: 'Suresh Patel', email: 'suresh@pmajay.gov.in', role: 'AGENCY', state: 'AP', status: 'ACTIVE', lastLogin: '2025-12-12' },
  { id: 6, name: 'Meena Kumari', email: 'meena@pmajay.gov.in', role: 'AGENCY', state: 'Jharkhand', status: 'ACTIVE', lastLogin: '2025-12-10' },
];

export default function Users() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'STATE', state: '' });

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = () => {
    if (!form.name || !form.email) return;
    setUsers(prev => [...prev, { ...form, id: Date.now(), status: 'ACTIVE', lastLogin: '—' }]);
    setForm({ name: '', email: '', role: 'STATE', state: '' });
    setShowModal(false);
  };

  const handleDelete = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between animate-fadeInUp">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.15)' }}>
            <HiOutlineUsers size={18} style={{ color: '#f472b6' }} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">User Management</h1>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{users.length} users</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary"><HiOutlinePlus size={16} /> Add User</button>
      </div>

      <div className="glass rounded-2xl p-4 animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
        <div className="relative">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-muted)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="form-input pl-10" placeholder="Search users..." />
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>User</th><th>Role</th><th>State</th><th>Status</th><th>Last Login</th><th></th></tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: u.role === 'STATE' ? 'var(--gradient-1)' : 'var(--gradient-4)' }}>{u.name.charAt(0)}</div>
                      <div><p className="text-sm font-semibold text-white">{u.name}</p><p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{u.email}</p></div>
                    </div>
                  </td>
                  <td><span className={`badge ${u.role === 'STATE' ? 'badge-in-progress' : 'badge-completed'}`}>{u.role}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.state}</td>
                  <td><span className={`badge ${u.status === 'ACTIVE' ? 'badge-completed' : 'badge-delayed'}`}>{u.status}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{u.lastLogin}</td>
                  <td>
                    <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}>
                      <HiOutlineTrash size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md p-6 rounded-2xl animate-scaleIn" style={{ background: 'rgba(17,24,39,0.95)', border: '1px solid var(--border-light)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Add User</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}><HiOutlineX size={18} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Name</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="form-input" placeholder="Full name" /></div>
              <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Email</label><input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="form-input" placeholder="email@pmajay.gov.in" /></div>
              <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Role</label><select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="form-input"><option value="STATE">State Officer</option><option value="AGENCY">Agency Officer</option></select></div>
              <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>State</label><input value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} className="form-input" placeholder="State name" /></div>
              <button onClick={handleCreate} className="btn-primary w-full justify-center mt-2" style={{ borderRadius: '0.75rem' }}>Create User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
