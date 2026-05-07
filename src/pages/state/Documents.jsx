import { useState, useEffect } from 'react';
import { documentAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { HiOutlineDocumentText, HiOutlineDownload, HiOutlineSearch, HiOutlineCheckCircle, HiOutlineEye, HiOutlineX } from 'react-icons/hi';

const typeIcons = { PHOTO: '📸', BILL: '🧾', VOUCHER: '📄', INSPECTION: '📋' };
const typeColors = { INSPECTION: 'badge-in-progress', PHOTO: 'badge-completed', BILL: 'badge-pending', VOUCHER: 'badge-delayed' };

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const res = await documentAPI.getAll(); setDocs(res.data); }
    catch { /* empty */ } finally { setLoading(false); }
  };

  const handleVerify = async (id) => {
    try {
      await documentAPI.verify(id);
      setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'VERIFIED' } : d));
      toast.success('Document verified');
    } catch { toast.error('Verification failed'); }
  };

  const filtered = docs.filter(d =>
    (filterType === 'ALL' || d.fileType === filterType) &&
    ((d.fileName || '').toLowerCase().includes(search.toLowerCase()) || (d.description || '').toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99,102,241,0.15)', borderTopColor: 'var(--primary)' }} />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 animate-fadeInUp">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <HiOutlineDocumentText size={18} style={{ color: '#fbbf24' }} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Agency Documents</h1>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{docs.length} uploads</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3 animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-muted)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="form-input pl-10" placeholder="Search documents..." />
        </div>
        <div className="flex gap-1.5">
          {['ALL', 'PHOTO', 'BILL', 'VOUCHER', 'INSPECTION'].map(t => (
            <button key={t} onClick={() => setFilterType(t)} className="px-3 py-2 rounded-lg text-xs font-bold transition-all" style={{ background: filterType === t ? 'var(--gradient-1)' : 'transparent', color: filterType === t ? 'white' : 'var(--text-muted)', border: filterType === t ? 'none' : '1px solid var(--border)' }}>
              {t === 'ALL' ? 'All' : `${typeIcons[t] || ''} ${t.charAt(0) + t.slice(1).toLowerCase()}`}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl text-center py-16 animate-fadeInUp"><p className="text-sm" style={{ color: 'var(--text-muted)' }}>No documents found</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((doc, i) => (
            <div key={doc.id} className="glass rounded-xl p-4 card-hover animate-fadeInUp" style={{ animationDelay: `${0.1 + i * 0.04}s` }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                  {typeIcons[doc.fileType] || '📎'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{doc.fileName}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : '—'} {doc.fileSize ? `• ${doc.fileSize}` : ''}</p>
                  {doc.description && <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{doc.description}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`badge ${typeColors[doc.fileType] || 'badge-pending'}`}>{doc.fileType}</span>
                    <span className={`badge ${doc.status === 'VERIFIED' ? 'badge-completed' : 'badge-pending'}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>{doc.status}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button onClick={() => setSelectedDoc(doc)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--primary)' }} title="View Document"
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(242, 101, 34, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <HiOutlineEye size={15} />
                  </button>
                  {doc.status === 'PENDING' && (
                    <button onClick={() => handleVerify(doc.id)} className="p-1.5 rounded-lg transition-colors" style={{ color: '#15803d' }} title="Verify"
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(21, 128, 61, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <HiOutlineCheckCircle size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Document Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedDoc(null)} />
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'rgba(242, 101, 34, 0.1)', border: '1px solid rgba(242, 101, 34, 0.2)' }}>
                  {typeIcons[selectedDoc.fileType] || '📎'}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedDoc.fileName}</h2>
                  <p className="text-xs text-slate-500">
                    {selectedDoc.fileType} • {selectedDoc.fileSize} • Uploaded {new Date(selectedDoc.uploadedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                <HiOutlineX size={20} />
              </button>
            </div>

            {/* Modal Body - Fake Document Viewer */}
            <div className="flex-1 bg-slate-100 p-6 overflow-auto flex items-center justify-center relative">
              {/* Dummy Document Paper */}
              <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-10 min-h-[500px]">
                <div className="border-b-2 border-slate-900 pb-4 mb-8 flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">PM-AJAY</h1>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Document Record</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-700">ID: DOC-{selectedDoc.id.toString().padStart(6, '0')}</p>
                    <p className="text-xs text-slate-500 mt-1">Date: {new Date(selectedDoc.uploadedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description</p>
                    <p className="text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                      {selectedDoc.description || 'No description provided for this document.'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Attached Media</p>
                    <div className="w-full h-80 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center">
                      {selectedDoc.fileData && selectedDoc.fileData.startsWith('data:application/pdf') ? (
                        <embed src={selectedDoc.fileData} type="application/pdf" className="w-full h-full" />
                      ) : (
                        <img 
                          src={
                            selectedDoc.fileData ? selectedDoc.fileData :
                            selectedDoc.fileType === 'PHOTO' ? 'https://images.unsplash.com/photo-1541888087405-eb2f01fbd8f1?auto=format&fit=crop&w=800&q=80' :
                            selectedDoc.fileType === 'BILL' || selectedDoc.fileType === 'VOUCHER' ? 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80' :
                            'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80'
                          } 
                          alt="Document Preview" 
                          className="w-full h-full object-cover cursor-zoom-in"
                          onClick={(e) => {
                            // Simple zoom effect
                            const isZoomed = e.target.style.objectFit === 'contain';
                            e.target.style.objectFit = isZoomed ? 'cover' : 'contain';
                            e.target.style.background = isZoomed ? 'transparent' : '#0f172a';
                          }}
                          title="Click to toggle zoom"
                        />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 text-center italic">
                      {selectedDoc.fileData ? '* Showing actual uploaded file.' : '* This is a representative preview of the uploaded document.'}
                    </p>
                  </div>

                  <div className="mt-10 pt-6 border-t border-slate-200 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500">Status</p>
                      <p className={`text-sm font-bold mt-0.5 ${selectedDoc.status === 'VERIFIED' ? 'text-green-600' : 'text-orange-500'}`}>
                        {selectedDoc.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Authorized Signature</p>
                      <div className="w-32 h-8 border-b border-slate-400 mt-4 mx-auto opacity-30"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-between items-center">
              <button onClick={() => setSelectedDoc(null)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Close
              </button>
              <div className="flex gap-3">
                <button className="px-4 py-2 flex items-center gap-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-sm">
                  <HiOutlineDownload size={16} /> Download
                </button>
                {selectedDoc.status === 'PENDING' && (
                  <button
                    onClick={() => {
                      handleVerify(selectedDoc.id);
                      setSelectedDoc(prev => ({ ...prev, status: 'VERIFIED' }));
                    }}
                    className="px-4 py-2 flex items-center gap-2 text-sm font-bold text-white rounded-lg shadow-sm transition-all"
                    style={{ background: '#15803d' }}
                  >
                    <HiOutlineCheckCircle size={16} /> Verify Document
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
