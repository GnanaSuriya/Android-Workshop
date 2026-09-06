import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from '../components/AuroraBackground';
import { GlassCard } from '../components/GlassCard';
import { ArrowLeft, User, Mail, Phone, Building2, GraduationCap, Info, BookOpen } from 'lucide-react';
import { useStore } from '../store';

export default function RegistrationFormScreen() {
  const navigate = useNavigate();
  const addParticipant = useStore(state => state.addParticipant);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 2) newErrors.name = 'Name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email required';
    if (formData.phone.trim().length < 7) newErrors.phone = 'Valid phone required';
    if (formData.college.trim().length < 2) newErrors.college = 'Institution required';
    if (formData.department.trim().length < 2) newErrors.department = 'Department required';
    if (!formData.year.trim()) newErrors.year = 'Year is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const id = 'REG-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      await addParticipant({
        id,
        ...formData,
        year: formData.year || 'N/A',
        checkedIn: false,
        checkInTime: null,
        registeredAt: new Date().toISOString()
      });
      navigate(`/success/${id}`, { replace: true });
    }
  };

  return (
    <AuroraBackground>
      <div className="flex-1 flex flex-col p-6 max-w-md w-full mx-auto overflow-y-auto no-scrollbar">
        <div className="flex items-center gap-3 mb-8 mt-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/10">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-android-green" />
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Android Club
            </span>
          </div>
        </div>

        <h1 className="text-3xl font-black leading-tight mb-2">
          JOIN THE<br />
          <span className="text-android-green">WORKSHOP</span>
        </h1>
        <p className="text-sm text-slate-400 mb-8">Reserve your seat and build something real.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-8">
          <GlassCard className="flex flex-col gap-4">
            <FormField
              label="Full Name"
              icon={<User className="w-4 h-4" />}
              value={formData.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
              error={errors.name}
            />
            <FormField
              label="Email Address"
              icon={<Mail className="w-4 h-4" />}
              value={formData.email}
              onChange={(v) => setFormData({ ...formData, email: v })}
              error={errors.email}
              type="email"
            />
            <FormField
              label="Phone Number"
              icon={<Phone className="w-4 h-4" />}
              value={formData.phone}
              onChange={(v) => setFormData({ ...formData, phone: v })}
              error={errors.phone}
              type="tel"
            />
            <FormField
              label="Institution"
              icon={<Building2 className="w-4 h-4" />}
              value={formData.college}
              onChange={(v) => setFormData({ ...formData, college: v })}
              error={errors.college}
            />
            <FormField
              label="Department"
              icon={<GraduationCap className="w-4 h-4" />}
              value={formData.department}
              onChange={(v) => setFormData({ ...formData, department: v })}
              error={errors.department}
            />
            <FormField
              label="Year of Study"
              icon={<BookOpen className="w-4 h-4" />}
              value={formData.year}
              onChange={(v) => setFormData({ ...formData, year: v })}
              error={errors.year}
            />
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 mt-4 bg-android-green text-zinc-950 rounded-full font-extrabold text-xs tracking-wide flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" />
              ) : (
                <>
                  <Info className="w-4 h-4" />
                  COMPLETE REGISTRATION
                </>
              )}
            </button>
          </GlassCard>
        </form>
      </div>
    </AuroraBackground>
  );
}

function FormField({
  label, icon, value, onChange, error, type = "text"
}: {
  label: string; icon: React.ReactNode; value: string; onChange: (v: string) => void; error?: string; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-400">{label}</label>
      <div className="relative">
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${value ? 'text-android-green' : 'text-slate-500'}`}>
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-12 bg-white/5 border ${error ? 'border-red-500' : 'border-white/10 focus:border-white/20'} rounded-xl pl-10 pr-4 text-white text-sm outline-none transition-colors`}
        />
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
