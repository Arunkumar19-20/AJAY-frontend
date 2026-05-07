import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { expenseAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { HiOutlineCurrencyRupee, HiOutlineArrowLeft, HiOutlinePlus } from 'react-icons/hi';

export default function AddExpense() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ item: '', amount: '', category: 'MATERIAL', expenseDate: '', voucherNo: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = user?.agencyId ? await expenseAPI.getByAgency(user.agencyId) : await expenseAPI.getAll();
      setExpenses(res.data);
    } catch { /* empty */ } finally { setLoading(false); }
  };

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.item || !form.amount) { toast.error('Fill required fields'); return; }
    setSubmitting(true);
    try {
      const res = await expenseAPI.create({
        item: form.item, amount: parseFloat(form.amount), category: form.category,
        expenseDate: form.expenseDate || null, voucherNo: form.voucherNo || null,
        agencyId: user?.agencyId, createdBy: user?.userId,
      });
      setExpenses(prev => [res.data, ...prev]);
      toast.success('Expense recorded!');
      setForm({ item: '', amount: '', category: 'MATERIAL', expenseDate: '', voucherNo: '' });
    } catch { toast.error('Failed to save expense'); }
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
        <button onClick={() => navigate('/agency/funds')} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <HiOutlineArrowLeft size={18} />
        </button>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <HiOutlineCurrencyRupee size={18} style={{ color: '#fbbf24' }} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Add Expense Entry</h1>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Log fund utilization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm font-bold text-white">New Expense</h3>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Item Description *</label>
            <input value={form.item} onChange={e => update('item', e.target.value)} className="form-input" placeholder="e.g. Cement bags purchased" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Amount (₹) *</label>
              <input type="number" value={form.amount} onChange={e => update('amount', e.target.value)} className="form-input" placeholder="0" required /></div>
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Category</label>
              <select value={form.category} onChange={e => update('category', e.target.value)} className="form-input">
                <option value="MATERIAL">Material</option><option value="LABOUR">Labour</option><option value="EQUIPMENT">Equipment</option><option value="TRANSPORT">Transport</option><option value="OTHER">Other</option>
              </select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Date</label>
              <input type="date" value={form.expenseDate} onChange={e => update('expenseDate', e.target.value)} className="form-input" /></div>
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Voucher No.</label>
              <input value={form.voucherNo} onChange={e => update('voucherNo', e.target.value)} className="form-input" placeholder="V-XXXX" /></div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center" style={{ borderRadius: '0.75rem' }}>
            <HiOutlinePlus size={16} /> {submitting ? 'Saving...' : 'Add Expense'}
          </button>
        </form>

        <div className="glass rounded-2xl p-6 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
          <h3 className="text-sm font-bold text-white mb-4">Recent Expenses</h3>
          {expenses.length === 0 ? (
            <div className="text-center py-12"><p className="text-sm" style={{ color: 'var(--text-muted)' }}>No expenses recorded</p></div>
          ) : (
            <div className="space-y-2.5">
              {expenses.map(exp => (
                <div key={exp.id} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{exp.item}</p>
                    <p className="text-sm font-bold" style={{ color: '#fbbf24' }}>₹{Number(exp.amount).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    <span className="badge badge-in-progress" style={{ padding: '0.1rem 0.4rem', fontSize: '0.6rem' }}>{exp.category}</span>
                    {exp.expenseDate && <span>📅 {exp.expenseDate}</span>}
                    {exp.voucherNo && <span>🧾 {exp.voucherNo}</span>}
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
