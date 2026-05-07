import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { documentAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { HiOutlineUpload, HiOutlinePhotograph, HiOutlineDocumentText } from 'react-icons/hi';

export default function DocumentUpload() {
  const { user } = useAuth();
  const [docType, setDocType] = useState('PHOTO');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileData, setFileData] = useState('');
  const [description, setDescription] = useState('');
  const [pastUploads, setPastUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = user?.agencyId ? await documentAPI.getByAgency(user.agencyId) : await documentAPI.getAll();
      setPastUploads(res.data);
    } catch { /* empty */ } finally { setLoading(false); }
  };

  const handleFileSelect = (e) => {
    const file = e.target?.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / 1024 / 1024).toFixed(1)} MB`);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileData(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!fileName) { toast.error('Select a file first'); return; }
    setSubmitting(true);
    try {
      const res = await documentAPI.create({
        fileName, fileType: docType, fileSize, description, fileData,
        agencyId: user?.agencyId, uploadedBy: user?.userId,
      });
      setPastUploads(prev => [res.data, ...prev]);
      toast.success('Document uploaded!');
      setFileName(''); setFileSize(''); setDescription(''); setFileData('');
    } catch { toast.error('Upload failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99,102,241,0.15)', borderTopColor: 'var(--primary)' }} />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 animate-fadeInUp">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <HiOutlineUpload size={18} style={{ color: 'var(--primary-light)' }} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Upload Documents</h1>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Photos, inspection reports, bills & vouchers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass rounded-2xl p-6 space-y-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Document Type</label>
              <select value={docType} onChange={e => setDocType(e.target.value)} className="form-input">
                <option value="PHOTO">Completion Photo</option><option value="BILL">Bill / Invoice</option><option value="VOUCHER">Voucher</option><option value="INSPECTION">Inspection Report</option>
              </select></div>
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>File Name</label>
              <input value={fileName} onChange={e => setFileName(e.target.value)} className="form-input" placeholder="File name" /></div>
          </div>

          <div className="rounded-xl p-8 text-center cursor-pointer transition-all duration-300"
            style={{ border: '2px dashed var(--border-light)', background: 'rgba(99,102,241,0.02)' }}
            onClick={() => document.getElementById('file-input').click()}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.background = 'rgba(99,102,241,0.02)'; }}>
            <HiOutlinePhotograph size={32} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{fileName || 'Click to browse files'}</p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{fileSize || 'JPG, PNG, PDF — Max 10MB'}</p>
            <input id="file-input" type="file" className="hidden" onChange={handleFileSelect} accept=".jpg,.jpeg,.png,.pdf" />
          </div>

          <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="form-input" rows={2} placeholder="Brief note about this document" /></div>

          <button onClick={handleUpload} disabled={submitting} className="btn-primary w-full justify-center" style={{ borderRadius: '0.75rem' }}>
            <HiOutlineUpload size={16} /> {submitting ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>

        <div className="glass rounded-2xl p-6 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
          <h3 className="text-sm font-bold text-white mb-4">Past Uploads</h3>
          {pastUploads.length === 0 ? (
            <div className="text-center py-12"><p className="text-sm" style={{ color: 'var(--text-muted)' }}>No uploads yet</p></div>
          ) : (
            <div className="space-y-2.5">
              {pastUploads.map(u => (
                <div key={u.id} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'rgba(99,102,241,0.08)' }}>
                      {u.fileType === 'PHOTO' ? '📸' : u.fileType === 'BILL' ? '🧾' : u.fileType === 'VOUCHER' ? '📄' : '📋'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{u.fileName}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{u.fileSize || ''} {u.uploadedAt ? `• ${new Date(u.uploadedAt).toLocaleDateString()}` : ''}</p>
                    </div>
                    <span className={`badge ${u.status === 'VERIFIED' ? 'badge-completed' : 'badge-pending'}`} style={{ fontSize: '0.6rem', padding: '0.15rem 0.5rem' }}>{u.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
