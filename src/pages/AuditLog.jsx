import { useState, useEffect } from 'react';
import { auditAPI } from '../services/api';
import { toast } from 'react-toastify';
import { HiOutlineShieldCheck, HiOutlineSearch } from 'react-icons/hi';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await auditAPI.getAll();
      setLogs(res.data);
    } catch { toast.error('Failed to load audit logs'); } finally { setLoading(false); }
  };

  const filtered = logs.filter(l =>
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.entityType?.toLowerCase().includes(search.toLowerCase()) ||
    l.ipAddress?.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 animate-fadeInUp">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
          <HiOutlineShieldCheck size={20} style={{ color: '#22d3ee' }} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Audit Log</h1>
          <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>{filtered.length} actions recorded</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="relative">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input pl-10"
            placeholder="Search actions, entities, IPs..."
          />
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99, 102, 241, 0.15)', borderTopColor: 'var(--primary)' }} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User ID</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Entity ID</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => (
                  <tr key={log.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.02}s` }}>
                    <td className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}
                    </td>
                    <td className="text-white font-semibold">#{log.userId || '—'}</td>
                    <td>
                      <span className={`badge ${
                        log.action?.includes('CREATE') ? 'badge-completed' :
                        log.action?.includes('DELETE') ? 'badge-delayed' :
                        'badge-in-progress'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{log.entityType}</td>
                    <td style={{ color: 'var(--text-muted)' }}>#{log.entityId || '—'}</td>
                    <td className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{log.ipAddress}</td>
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
