import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from '../components/AuroraBackground';
import { GlassCard } from '../components/GlassCard';
import { WorkshopConstants } from '../types';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

function AndroidIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.6 9.48l1.84-3.18c.16-.28.06-.63-.22-.8s-.63-.06-.8.22l-1.88 3.25C15.02 8.35 13.56 8 12 8c-1.56 0-3.02.35-4.54 1.01L5.58 5.76c-.16-.28-.51-.38-.8-.22-.28.16-.38.51-.22.8l1.84 3.18C4.1 11.2 2.5 13.9 2 17h20c-.5-3.1-2.1-5.8-4.4-7.52zm-9.1 5.52c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm7 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </svg>
  );
}

export default function LandingScreen() {
  const navigate = useNavigate();

  return (
    <AuroraBackground className="px-6 pb-8 pt-12 flex flex-col justify-between">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center w-full"
      >
        <div className="flex items-center px-[14px] py-[6px] rounded-full bg-android-green/10 border border-android-green/30">
          <AndroidIcon className="w-[18px] h-[18px] text-android-green" />
          <span className="ml-2 text-[12px] font-bold tracking-[2px] text-text-primary uppercase">{WorkshopConstants.CLUB}</span>
        </div>

        <div className="h-[28px]" />
        
        <h1 className="text-[44px] leading-[46px] font-black tracking-[-1px] text-text-primary w-full whitespace-pre-line font-sans">
          BUILD FOR{"\n"}ANDROID.
        </h1>

        <div className="h-[14px]" />

        <p className="text-[15px] leading-[22px] text-text-secondary w-full">
          {WorkshopConstants.DESCRIPTION}
        </p>

        <div className="h-[32px]" />

        <GlassCard className="w-full">
          <div className="flex flex-col gap-[14px]">
            <div className="flex items-center gap-[14px]">
              <div className="w-[34px] h-[34px] rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Calendar className="w-[18px] h-[18px] text-android-green" />
              </div>
              <span className="text-[14px] font-semibold text-text-primary">{WorkshopConstants.DATE}</span>
            </div>
            
            <div className="h-[1px] bg-glass-border w-full" />
            
            <div className="flex items-center gap-[14px]">
              <div className="w-[34px] h-[34px] rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Clock className="w-[18px] h-[18px] text-android-green" />
              </div>
              <span className="text-[14px] font-semibold text-text-primary">{WorkshopConstants.TIME}</span>
            </div>
            
            <div className="h-[1px] bg-glass-border w-full" />
            
            <div className="flex items-center gap-[14px]">
              <div className="w-[34px] h-[34px] rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <MapPin className="w-[18px] h-[18px] text-android-green" />
              </div>
              <span className="text-[14px] font-semibold text-text-primary">{WorkshopConstants.VENUE}</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col items-center w-full mt-8"
      >
        <button
          onClick={() => navigate('/register')}
          className="w-full h-[56px] rounded-full bg-android-green text-bg-dark flex items-center justify-center hover:bg-android-greendark transition-colors active:scale-[0.98]"
        >
          <AndroidIcon className="w-[20px] h-[20px]" />
          <span className="ml-[10px] text-[14px] font-extrabold tracking-[1px] uppercase">Register Now</span>
        </button>
        
        <div className="h-[12px]" />
        
        <button
          onClick={() => navigate('/coordinator')}
          className="py-2 px-4"
        >
          <span className="text-[13px] text-text-label font-medium hover:text-text-primary transition-colors">
            Coordinator? Mark attendance →
          </span>
        </button>
      </motion.div>
    </AuroraBackground>
  );
}
