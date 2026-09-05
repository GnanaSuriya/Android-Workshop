import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from '../components/AuroraBackground';
import { GlassCard } from '../components/GlassCard';
import { db } from '../store';
import { generateRegId } from '../lib/utils';
import { ArrowLeft, User, Mail, Phone, Building2, Shapes, GraduationCap, ChevronDown, ChevronUp, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

function AndroidIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.6 9.48l1.84-3.18c.16-.28.06-.63-.22-.8s-.63-.06-.8.22l-1.88 3.25C15.02 8.35 13.56 8 12 8c-1.56 0-3.02.35-4.54 1.01L5.58 5.76c-.16-.28-.51-.38-.8-.22-.28.16-.38.51-.22.8l1.84 3.18C4.1 11.2 2.5 13.9 2 17h20c-.5-3.1-2.1-5.8-4.4-7.52zm-9.1 5.52c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm7 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </svg>
  );
}

function FormField({ label, name, type = 'text', placeholder, icon: Icon, value, error, onChange }: any) {
  const hasValue = !!value;
  const hasError = !!error;
  
  return (
    <div className="flex flex-col w-full mb-4">
      <label className="text-[12px] font-semibold text-text-label mb-[6px]">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Icon size={18} className={hasValue ? "text-android-green" : "text-text-label"} />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className={`w-full bg-glass-bg border rounded-xl pl-10 pr-4 py-3 text-[14px] text-text-primary placeholder:text-text-label focus:outline-none focus:border-glass-borderfocus transition-colors ${hasError ? 'border-status-error' : 'border-glass-border'}`}
        />
      </div>
      {hasError && (
        <div className="flex items-center mt-1">
          <AlertCircle size={12} className="text-status-error mr-1.5" />
          <span className="text-[12px] font-medium text-status-error">{error}</span>
        </div>
      )}
    </div>
  );
}

export default function RegistrationFormScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', college: '', department: '', year: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year", "PG / Masters", "Other"];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 2) newErrors.name = 'Name is required (min 2 characters)';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = 'Enter a valid email address';
    if (formData.phone.trim().length < 7) newErrors.phone = 'Enter a valid phone number';
    if (formData.college.trim().length < 2) newErrors.college = 'Institution name is required';
    if (formData.department.trim().length < 2) newErrors.department = 'Department is required';
    if (!formData.year) newErrors.year = 'Please select your year of study';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const regId = generateRegId();
      const participant = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        college: formData.college.trim(),
        department: formData.department.trim(),
        id: regId,
        checkedIn: false,
        checkInTime: null,
        registeredAt: new Date().toISOString()
      };
      
      // Simulate network request for UI feedback
      setTimeout(() => {
        if (db.register(participant)) {
          navigate(`/success/${regId}`);
        } else {
          setErrors({ submit: 'Failed to register. Please try again.' });
          setIsSubmitting(false);
        }
      }, 800);
    }
  };

  return (
    <AuroraBackground className="px-6 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col w-full">
        {/* Header */}
        <div className="flex items-center w-full mb-[18px]">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-text-primary hover:text-android-green transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="w-2" />
          <AndroidIcon className="w-4 h-4 text-android-green" />
          <div className="w-[6px]" />
          <span className="text-[11px] font-bold tracking-[2px] text-text-secondary uppercase">Android Club</span>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-[32px] leading-tight font-black text-text-primary">JOIN THE</h2>
          <h2 className="text-[32px] leading-tight font-black text-android-green">WORKSHOP</h2>
          <div className="h-[6px]" />
          <p className="text-[14px] text-text-secondary">Reserve your seat and build something real.</p>
        </div>

        {/* Form Card */}
        <GlassCard className="w-full mb-12">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <FormField label="Full Name" name="name" value={formData.name} error={errors.name} onChange={handleFieldChange} placeholder="Aarav Mehta" icon={User} />
            <FormField label="Email Address" name="email" value={formData.email} error={errors.email} onChange={handleFieldChange} type="email" placeholder="aarav@example.com" icon={Mail} />
            <FormField label="Phone Number" name="phone" value={formData.phone} error={errors.phone} onChange={handleFieldChange} type="tel" placeholder="+91 9876543210" icon={Phone} />
            <FormField label="Institution" name="college" value={formData.college} error={errors.college} onChange={handleFieldChange} placeholder="SRM Institute" icon={Building2} />
            <FormField label="Department" name="department" value={formData.department} error={errors.department} onChange={handleFieldChange} placeholder="Computer Science" icon={Shapes} />
            
            {/* Year Dropdown */}
            <div className="flex flex-col w-full mb-4">
              <label className="text-[12px] font-semibold text-text-label mb-[6px]">Year of Study</label>
              <div className="relative">
                <div 
                  className={`w-full bg-glass-bg border ${errors.year ? 'border-status-error' : 'border-glass-border'} rounded-xl pl-10 pr-10 py-3 text-[14px] ${formData.year ? 'text-text-primary' : 'text-text-label'} cursor-pointer flex items-center justify-between`}
                  onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <GraduationCap size={18} className={formData.year ? "text-android-green" : "text-text-label"} />
                  </div>
                  <span>{formData.year || "Select Year"}</span>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {yearDropdownOpen ? <ChevronUp size={20} className="text-text-secondary" /> : <ChevronDown size={20} className="text-text-secondary" />}
                  </div>
                </div>
                
                {yearDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-bg-card border border-glass-border rounded-xl shadow-xl z-50 overflow-hidden">
                    {yearOptions.map(year => (
                      <div 
                        key={year}
                        className="px-4 py-3 text-[14px] text-text-primary hover:bg-glass-bg cursor-pointer"
                        onClick={() => {
                          setFormData({ ...formData, year });
                          if (errors.year) setErrors({ ...errors, year: '' });
                          setYearDropdownOpen(false);
                        }}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.year && (
                <div className="flex items-center mt-1">
                  <AlertCircle size={12} className="text-status-error mr-1.5" />
                  <span className="text-[12px] font-medium text-status-error">{errors.year}</span>
                </div>
              )}
            </div>

            {errors.submit && (
              <div className="flex items-center mt-2 mb-4">
                <AlertCircle size={12} className="text-status-error mr-1.5" />
                <span className="text-[12px] font-medium text-status-error">{errors.submit}</span>
              </div>
            )}
            
            <div className="h-1" />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[56px] mt-2 rounded-full bg-android-green text-bg-dark flex items-center justify-center hover:bg-android-greendark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="ml-[10px] text-[13px] font-bold tracking-[1px] uppercase">Processing...</span>
                </>
              ) : (
                <>
                  <AndroidIcon className="w-[18px] h-[18px]" />
                  <span className="ml-[10px] text-[13px] font-extrabold tracking-[1px] uppercase">Complete Registration</span>
                </>
              )}
            </button>
          </form>
        </GlassCard>
      </motion.div>
    </AuroraBackground>
  );
}
