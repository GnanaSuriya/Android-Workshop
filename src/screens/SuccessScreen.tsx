import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuroraBackground } from '../components/AuroraBackground';
import { GlassCard } from '../components/GlassCard';
import { db } from '../store';
import { Check, User, Calendar, Copy, Share2, Calendar as CalIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { WorkshopConstants } from '../types';
import QRCode from 'react-qr-code';

function AndroidIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.6 9.48l1.84-3.18c.16-.28.06-.63-.22-.8s-.63-.06-.8.22l-1.88 3.25C15.02 8.35 13.56 8 12 8c-1.56 0-3.02.35-4.54 1.01L5.58 5.76c-.16-.28-.51-.38-.8-.22-.28.16-.38.51-.22.8l1.84 3.18C4.1 11.2 2.5 13.9 2 17h20c-.5-3.1-2.1-5.8-4.4-7.52zm-9.1 5.52c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm7 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </svg>
  );
}

export default function SuccessScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const participant = id ? db.getById(id) : null;

  useEffect(() => {
    if (!participant) navigate('/');
  }, [participant, navigate]);

  if (!participant) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(participant.id);
  };

  return (
    <AuroraBackground className="px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full min-h-[100dvh]">
        <div className="flex-1">
          <div className="h-8" />
          
          <div className="flex flex-col items-center">
            <div className="w-[84px] h-[84px] rounded-full bg-status-successbg flex items-center justify-center border border-android-green/30">
              <Check className="w-10 h-10 text-android-green" />
            </div>
            <div className="h-6" />
            <h1 className="text-[28px] font-black text-text-primary text-center leading-tight">REGISTRATION<br/>SUCCESSFUL</h1>
            <div className="h-2" />
            <p className="text-[14px] text-text-secondary text-center">Your seat has been reserved.</p>
          </div>

          <div className="h-10" />

          <GlassCard className="w-full">
            <div className="flex flex-col gap-4">
              <div className="flex items-center">
                <User className="w-4 h-4 text-android-green shrink-0" />
                <div className="w-3" />
                <span className="text-[13px] font-medium text-text-primary">{participant.name}</span>
              </div>
              <div className="h-[1px] w-full bg-glass-border" />
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-android-green shrink-0" />
                <div className="w-3" />
                <span className="text-[13px] font-medium text-text-primary">{WorkshopConstants.DATE}</span>
              </div>
              <div className="h-[1px] w-full bg-glass-border" />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="font-mono text-text-label text-[12px] uppercase">ID: </span>
                  <div className="w-2" />
                  <span className="text-[15px] font-mono font-bold text-android-green">{participant.id}</span>
                </div>
                <button onClick={handleCopy} className="p-1">
                  <Copy className="w-4 h-4 text-text-secondary hover:text-text-primary" />
                </button>
              </div>
            </div>
          </GlassCard>

          <div className="h-4" />

          <GlassCard className="w-full flex flex-col items-center py-6">
            <span className="text-[11px] font-bold tracking-[2px] text-text-label uppercase">DIGITAL PASS QR</span>
            <div className="h-[14px]" />
            <div className="p-2 bg-white rounded-xl">
              <QRCode value={participant.id} size={144} className="rounded-lg" viewBox="0 0 256 256" />
            </div>
            <div className="h-[12px]" />
            <p className="text-[12px] text-text-secondary text-center leading-tight">
              Show this code at the entrance<br/>to mark your attendance.
            </p>
          </GlassCard>
          
          <div className="h-6" />
        </div>

        <div className="flex flex-col w-full pb-8">
          <button
            onClick={() => navigate(`/pass/${id}`)}
            className="w-full h-[54px] rounded-full bg-android-green text-bg-dark flex items-center justify-center hover:bg-android-greendark transition-colors"
          >
            <AndroidIcon className="w-[18px] h-[18px]" />
            <span className="ml-[10px] text-[13px] font-extrabold tracking-[1px] uppercase">VIEW DIGITAL PASS</span>
          </button>
          
          <div className="h-3" />
          
          <button
            onClick={() => {}}
            className="w-full h-[50px] rounded-full border border-glass-border flex items-center justify-center hover:bg-glass-bg transition-colors text-text-primary"
          >
            <Share2 className="w-[18px] h-[18px]" />
            <span className="ml-[8px] text-[13px] font-bold tracking-[1px] uppercase">SHARE PASS</span>
          </button>
          
          <div className="h-3" />
          
          <button
            onClick={() => {}}
            className="w-full h-[50px] rounded-full border border-glass-border flex items-center justify-center hover:bg-glass-bg transition-colors text-text-primary"
          >
            <CalIcon className="w-[18px] h-[18px]" />
            <span className="ml-[8px] text-[13px] font-bold tracking-[1px] uppercase">ADD TO CALENDAR</span>
          </button>

          <div className="h-2" />
          
          <button
            onClick={() => navigate('/')}
            className="py-2 text-[13px] text-text-label hover:text-text-primary transition-colors mt-2"
          >
            Return to Home
          </button>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
