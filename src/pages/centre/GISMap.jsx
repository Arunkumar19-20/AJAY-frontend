import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { projectAPI, stateAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  HiOutlineMap, HiOutlineFilter, HiOutlineLocationMarker,
  HiOutlineEye, HiOutlineRefresh, HiOutlineX,
} from 'react-icons/hi';
import 'leaflet/dist/leaflet.css';

/* ─── State Capital Coordinates ─── */
const STATE_COORDS = {
  'Andhra Pradesh':   { lat: 16.5062, lng: 80.6480 },
  'Bihar':            { lat: 25.6093, lng: 85.1376 },
  'Chhattisgarh':     { lat: 21.2514, lng: 81.6296 },
  'Gujarat':          { lat: 23.2156, lng: 72.6369 },
  'Jharkhand':        { lat: 23.3441, lng: 85.3096 },
  'Karnataka':        { lat: 12.9716, lng: 77.5946 },
  'Madhya Pradesh':   { lat: 23.2599, lng: 77.4126 },
  'Maharashtra':      { lat: 19.0760, lng: 72.8777 },
  'Odisha':           { lat: 20.2961, lng: 85.8245 },
  'Rajasthan':        { lat: 26.9124, lng: 75.7873 },
  'Tamil Nadu':       { lat: 13.0827, lng: 80.2707 },
  'Telangana':        { lat: 17.3850, lng: 78.4867 },
  'Uttar Pradesh':    { lat: 26.8467, lng: 80.9462 },
  'West Bengal':      { lat: 22.5726, lng: 88.3639 },
};

const STATUS_CONFIG = {
  COMPLETED:   { color: '#15803d', label: 'Completed',   glow: 'rgba(21, 128, 61, 0.4)' },
  IN_PROGRESS: { color: '#0369a1', label: 'In Progress', glow: 'rgba(3, 105, 161, 0.4)' },
  PENDING:     { color: '#d97706', label: 'Pending',     glow: 'rgba(217, 119, 6, 0.4)' },
  DELAYED:     { color: '#dc2626', label: 'Delayed',     glow: 'rgba(220, 38, 38, 0.4)' },
};

const COMPONENT_LABELS = {
  ADARSH_GRAM: 'Adarsh Gram',
  GIA: 'GIA',
  HOSTEL: 'Hostel',
};

/* ─── Map auto-fit helper ─── */
function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 7 });
    }
  }, [bounds, map]);
  return null;
}

export default function GISMap() {
  const [projects, setProjects] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterComponent, setFilterComponent] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, sRes] = await Promise.all([projectAPI.getAll(), stateAPI.getAll()]);
      setProjects(pRes.data);
      setStates(sRes.data);
    } catch {
      toast.error('Failed to load map data');
    } finally {
      setLoading(false);
    }
  };

  const stateMap = useMemo(() => {
    const m = {};
    states.forEach(s => { m[s.id] = s; });
    return m;
  }, [states]);

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const ms = filterStatus === 'ALL' || p.status === filterStatus;
      const mc = filterComponent === 'ALL' || p.component === filterComponent;
      return ms && mc;
    });
  }, [projects, filterStatus, filterComponent]);

  /* Group projects by state for clustering */
  const stateGroups = useMemo(() => {
    const groups = {};
    filtered.forEach(p => {
      const stateName = stateMap[p.stateId]?.name;
      if (!stateName || !STATE_COORDS[stateName]) return;
      if (!groups[stateName]) {
        groups[stateName] = {
          name: stateName,
          coords: STATE_COORDS[stateName],
          projects: [],
          counts: { COMPLETED: 0, IN_PROGRESS: 0, PENDING: 0, DELAYED: 0 },
        };
      }
      groups[stateName].projects.push(p);
      groups[stateName].counts[p.status] = (groups[stateName].counts[p.status] || 0) + 1;
    });
    return Object.values(groups);
  }, [filtered, stateMap]);

  /* Get dominant status for marker color */
  const getDominantStatus = (counts) => {
    if (counts.DELAYED > 0) return 'DELAYED';
    if (counts.PENDING > counts.IN_PROGRESS && counts.PENDING > counts.COMPLETED) return 'PENDING';
    if (counts.IN_PROGRESS > counts.COMPLETED) return 'IN_PROGRESS';
    return 'COMPLETED';
  };

  const bounds = stateGroups.map(g => [g.coords.lat, g.coords.lng]);

  /* Stats */
  const statusCounts = useMemo(() => {
    const c = { COMPLETED: 0, IN_PROGRESS: 0, PENDING: 0, DELAYED: 0 };
    filtered.forEach(p => { c[p.status] = (c[p.status] || 0) + 1; });
    return c;
  }, [filtered]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="w-12 h-12 border-3 rounded-full animate-spin" style={{ borderColor: 'rgba(99, 102, 241, 0.15)', borderTopColor: 'var(--primary)' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeInUp">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(3, 105, 161, 0.1)', border: '1px solid rgba(3, 105, 161, 0.15)' }}>
            <HiOutlineMap size={20} style={{ color: '#0ea5e9' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">GIS Project Map</h1>
            <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {filtered.length} projects across {stateGroups.length} states
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary text-xs py-2 px-3`}
            style={showFilters ? { background: 'rgba(242, 101, 34, 0.08)', borderColor: 'rgba(242, 101, 34, 0.25)' } : {}}
          >
            <HiOutlineFilter size={15} />
            Filters
            {(filterStatus !== 'ALL' || filterComponent !== 'ALL') && (
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--primary)' }} />
            )}
          </button>
          <button onClick={loadData} className="btn-secondary text-xs py-2 px-3">
            <HiOutlineRefresh size={15} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="glass rounded-2xl p-4 animate-fadeInDown">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Status:</span>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="form-input py-1.5 text-xs w-36">
                <option value="ALL">All Status</option>
                <option value="COMPLETED">✅ Completed</option>
                <option value="IN_PROGRESS">🔵 In Progress</option>
                <option value="PENDING">🟡 Pending</option>
                <option value="DELAYED">🔴 Delayed</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Component:</span>
              <select value={filterComponent} onChange={e => setFilterComponent(e.target.value)} className="form-input py-1.5 text-xs w-36">
                <option value="ALL">All Components</option>
                <option value="ADARSH_GRAM">Adarsh Gram</option>
                <option value="GIA">GIA</option>
                <option value="HOSTEL">Hostel</option>
              </select>
            </div>
            {(filterStatus !== 'ALL' || filterComponent !== 'ALL') && (
              <button
                onClick={() => { setFilterStatus('ALL'); setFilterComponent('ALL'); }}
                className="text-xs font-semibold flex items-center gap-1 px-2 py-1 rounded-lg transition-colors"
                style={{ color: '#f87171' }}
              >
                <HiOutlineX size={13} />
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Map + Legend Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Map */}
        <div className="lg:col-span-3 glass rounded-2xl overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <div className="relative" style={{ height: '520px' }}>
            <MapContainer
              center={[22.5, 82.0]}
              zoom={5}
              style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
              zoomControl={true}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              <FitBounds bounds={bounds} />

              {stateGroups.map(group => {
                const dominant = getDominantStatus(group.counts);
                const cfg = STATUS_CONFIG[dominant];
                const total = group.projects.length;
                const radius = Math.max(12, Math.min(28, 10 + total * 4));

                return (
                  <CircleMarker
                    key={group.name}
                    center={[group.coords.lat, group.coords.lng]}
                    radius={radius}
                    pathOptions={{
                      fillColor: cfg.color,
                      fillOpacity: 0.75,
                      color: cfg.color,
                      weight: 2.5,
                      opacity: 0.9,
                    }}
                  >
                    <Popup className="pmajay-popup" maxWidth={320} minWidth={260}>
                      <div style={{ fontFamily: 'inherit' }}>
                        {/* Header */}
                        <div style={{
                          background: 'var(--gradient-1)',
                          margin: '-10px -10px 12px -10px',
                          padding: '14px 16px',
                          borderRadius: '8px 8px 0 0',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <HiOutlineLocationMarker size={18} color="white" />
                            <span style={{ fontWeight: 800, fontSize: '14px', color: 'white' }}>{group.name}</span>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                            {total} project{total !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Status Breakdown */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '12px' }}>
                          {Object.entries(group.counts).filter(([,v]) => v > 0).map(([status, count]) => (
                            <div key={status} style={{
                              background: STATUS_CONFIG[status].glow,
                              borderRadius: '8px',
                              padding: '6px 10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}>
                              <div style={{
                                width: '8px', height: '8px', borderRadius: '50%',
                                background: STATUS_CONFIG[status].color,
                              }} />
                              <span style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                                {count} {STATUS_CONFIG[status].label}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Project List */}
                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                          {group.projects.slice(0, 5).map(p => (
                            <div key={p.id} style={{
                              padding: '8px 0',
                              borderBottom: '1px solid rgba(0,0,0,0.06)',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px',
                            }}>
                              <div style={{
                                width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, marginTop: '5px',
                                background: STATUS_CONFIG[p.status]?.color || '#94a3b8',
                              }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                                  {p.title}
                                </p>
                                <p style={{ fontSize: '10px', color: '#64748b', margin: '2px 0 0 0' }}>
                                  {COMPONENT_LABELS[p.component] || p.component} • {p.deadline || 'No deadline'}
                                </p>
                              </div>
                            </div>
                          ))}
                          {group.projects.length > 5 && (
                            <p style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600, marginTop: '6px', textAlign: 'center' }}>
                              +{group.projects.length - 5} more projects
                            </p>
                          )}
                        </div>

                        {/* View All Link */}
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                          <Link
                            to="/centre/projects"
                            style={{
                              fontSize: '11px', fontWeight: 700, color: 'white',
                              background: 'var(--gradient-1)', padding: '6px 16px',
                              borderRadius: '8px', textDecoration: 'none', display: 'inline-block',
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <HiOutlineEye size={13} /> View All Projects
                            </span>
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>

            {/* Floating count badge */}
            <div style={{
              position: 'absolute', top: '12px', right: '12px', zIndex: 1000,
              background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
              borderRadius: '12px', padding: '8px 14px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
                📍 {filtered.length} Projects • {stateGroups.length} States
              </span>
            </div>
          </div>
        </div>

        {/* Legend + Stats Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Legend */}
          <div className="glass rounded-2xl p-5 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(3, 105, 161, 0.1)' }}>
                <HiOutlineMap size={14} style={{ color: '#0ea5e9' }} />
              </div>
              Legend
            </h3>
            <div className="space-y-2.5">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={key === 'DELAYED' ? 'gis-pulse-dot' : ''}
                      style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: cfg.color,
                        boxShadow: `0 0 6px ${cfg.glow}`,
                      }}
                    />
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{cfg.label}</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                    background: cfg.glow,
                    color: cfg.color,
                  }}>
                    {statusCounts[key] || 0}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Total</span>
                <span className="text-sm font-black text-white">{filtered.length}</span>
              </div>
            </div>
          </div>

          {/* Top States */}
          <div className="glass rounded-2xl p-5 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-sm font-bold text-white mb-4">📊 Projects by State</h3>
            <div className="space-y-3">
              {stateGroups
                .sort((a, b) => b.projects.length - a.projects.length)
                .slice(0, 6)
                .map((g, i) => {
                  const pct = (g.projects.length / (filtered.length || 1)) * 100;
                  return (
                    <div key={g.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                          {g.name}
                        </span>
                        <span className="text-xs font-bold text-white">{g.projects.length}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.04)' }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: i === 0 ? 'var(--gradient-1)' : i === 1 ? 'var(--gradient-3)' : 'var(--gradient-4)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
