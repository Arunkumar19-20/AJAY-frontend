import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { agencyAPI, stateAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  HiOutlinePlus, HiOutlineSearch, HiOutlineFilter,
  HiOutlinePencil, HiOutlineTrash, HiOutlinePhone,
  HiOutlineOfficeBuilding,
} from 'react-icons/hi';

export default function Agencies() {
  const { user, isCentre, isState } = useAuth();
  const [agencies, setAgencies] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterComponent, setFilterComponent] = useState('ALL');
  const [filterState, setFilterState] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [agRes, stRes] = await Promise.all([
        agencyAPI.getAll(),
        stateAPI.getAll(),
      ]);
      setAgencies(agRes.data);
      setStates(stRes.data);
    } catch (err) {
      toast.error('Failed to load agencies');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this agency?')) return;
    try {
      await agencyAPI.delete(id);
      setAgencies(agencies.filter((a) => a.id !== id));
      toast.success('Agency deleted successfully');
    } catch (err) {
      toast.error('Failed to delete agency');
    }
  };

  const getStateName = (stateId) => {
    return states.find((s) => s.id === stateId)?.name || `State ${stateId}`;
  };

  const filtered = agencies.filter((a) => {
    const matchSearch =
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.district?.toLowerCase().includes(search.toLowerCase()) ||
      a.nodalOfficer?.toLowerCase().includes(search.toLowerCase());
    const matchComponent = filterComponent === 'ALL' || a.component === filterComponent;
    const matchState = filterState === 'ALL' || String(a.stateId) === filterState;
    return matchSearch && matchComponent && matchState;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeInUp">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
            <HiOutlineOfficeBuilding size={20} style={{ color: 'var(--primary-light)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Agency Registry</h1>
            <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {filtered.length} agencies across {states.length} states
            </p>
          </div>
        </div>
        {(isCentre() || isState()) && (
          <Link to="/state/agencies/add" className="btn-primary" id="add-agency-btn">
            <HiOutlinePlus size={18} />
            Add Agency
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-5 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10"
              placeholder="Search agencies, districts, officers..."
              id="agency-search"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterComponent}
              onChange={(e) => setFilterComponent(e.target.value)}
              className="form-input w-40"
              id="filter-component"
            >
              <option value="ALL">All Components</option>
              <option value="ADARSH_GRAM">Adarsh Gram</option>
              <option value="GIA">GIA</option>
              <option value="HOSTEL">Hostel</option>
            </select>
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="form-input w-44"
              id="filter-state"
            >
              <option value="ALL">All States</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="relative">
              <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99, 102, 241, 0.15)', borderTopColor: 'var(--primary)' }} />
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(99, 102, 241, 0.06)' }}>
              <HiOutlineFilter size={28} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p className="text-base font-semibold text-white">No agencies found</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Agency Name</th>
                  <th>Component</th>
                  <th>State</th>
                  <th>District</th>
                  <th>Nodal Officer</th>
                  <th>Contact</th>
                  {(isCentre() || isState()) && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((agency, i) => (
                  <tr key={agency.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.03}s` }}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{
                            background: agency.component === 'ADARSH_GRAM'
                              ? 'var(--gradient-1)'
                              : agency.component === 'GIA'
                              ? 'var(--gradient-3)'
                              : 'var(--gradient-5)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          }}
                        >
                          {agency.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{agency.name}</p>
                          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{agency.type}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        agency.component === 'ADARSH_GRAM' ? 'badge-in-progress' :
                        agency.component === 'GIA' ? 'badge-completed' : 'badge-pending'
                      }`}>
                        {agency.component?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{getStateName(agency.stateId)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{agency.district}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{agency.nodalOfficer}</td>
                    <td>
                      <span className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                        <HiOutlinePhone size={13} style={{ color: 'var(--text-muted)' }} />
                        {agency.contact}
                      </span>
                    </td>
                    {(isCentre() || isState()) && (
                      <td>
                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/state/agencies/edit/${agency.id}`}
                            className="p-2 rounded-lg transition-all duration-200"
                            style={{ color: 'var(--primary-light)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <HiOutlinePencil size={15} />
                          </Link>
                          {isCentre() && (
                            <button
                              onClick={() => handleDelete(agency.id)}
                              className="p-2 rounded-lg transition-all duration-200"
                              style={{ color: '#f87171' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <HiOutlineTrash size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
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
