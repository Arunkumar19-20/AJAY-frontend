import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { agencyAPI, stateAPI } from '../services/api';
import { toast } from 'react-toastify';
import { HiOutlineSave, HiOutlineArrowLeft, HiOutlineOfficeBuilding } from 'react-icons/hi';

export default function AgencyForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    loadStates();
    if (isEdit) loadAgency();
  }, [id]);

  const loadStates = async () => {
    try {
      const res = await stateAPI.getAll();
      setStates(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAgency = async () => {
    try {
      const res = await agencyAPI.getById(id);
      reset(res.data);
    } catch (err) {
      toast.error('Failed to load agency');
      navigate('/agencies');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await agencyAPI.update(id, data);
        toast.success('Agency updated successfully');
      } else {
        await agencyAPI.create(data);
        toast.success('Agency created successfully');
      }
      navigate('/agencies');
    } catch (err) {
      toast.error('Failed to save agency');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Agency Name', type: 'text', required: true, placeholder: 'Enter agency name' },
    { name: 'type', label: 'Agency Type', type: 'text', required: true, placeholder: 'e.g., Government, Corporation, Society' },
    {
      name: 'component', label: 'Component', type: 'select', required: true,
      options: [
        { value: '', label: 'Select Component' },
        { value: 'ADARSH_GRAM', label: 'Adarsh Gram' },
        { value: 'GIA', label: 'GIA' },
        { value: 'HOSTEL', label: 'Hostel' },
      ],
    },
    {
      name: 'stateId', label: 'State', type: 'select', required: true,
      options: [{ value: '', label: 'Select State' }, ...states.map((s) => ({ value: s.id, label: s.name }))],
    },
    { name: 'district', label: 'District', type: 'text', required: true, placeholder: 'Enter district name' },
    { name: 'nodalOfficer', label: 'Nodal Officer', type: 'text', required: true, placeholder: 'Officer name' },
    { name: 'contact', label: 'Contact Number', type: 'text', required: true, placeholder: '9876543210' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 animate-fadeInUp">
        <button
          onClick={() => navigate('/agencies')}
          className="btn-secondary px-3 py-2.5"
          style={{ borderRadius: '0.875rem' }}
        >
          <HiOutlineArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
            <HiOutlineOfficeBuilding size={18} style={{ color: 'var(--primary-light)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">
              {isEdit ? 'Edit Agency' : 'Add New Agency'}
            </h1>
            <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {isEdit ? 'Update agency information' : 'Register a new executing agency'}
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl p-7 space-y-5 animate-fadeInUp"
        style={{
          background: 'rgba(17, 24, 39, 0.6)',
          backdropFilter: 'blur(24px)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-xl)',
          animationDelay: '0.1s',
        }}
      >
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
              {field.label} {field.required && <span style={{ color: '#f87171' }}>*</span>}
            </label>
            {field.type === 'select' ? (
              <select
                {...register(field.name, { required: field.required && `${field.label} is required` })}
                className="form-input"
                id={`agency-${field.name}`}
              >
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                {...register(field.name, { required: field.required && `${field.label} is required` })}
                className="form-input"
                placeholder={field.placeholder}
                id={`agency-${field.name}`}
              />
            )}
            {errors[field.name] && (
              <p className="text-xs font-medium mt-1.5" style={{ color: '#f87171' }}>{errors[field.name].message}</p>
            )}
          </div>
        ))}

        <div className="flex gap-3 pt-3">
          <button type="submit" disabled={loading} className="btn-primary" id="agency-submit" style={{ borderRadius: '0.875rem' }}>
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <HiOutlineSave size={18} />
            )}
            {isEdit ? 'Update Agency' : 'Create Agency'}
          </button>
          <button type="button" onClick={() => navigate('/agencies')} className="btn-secondary" style={{ borderRadius: '0.875rem' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
