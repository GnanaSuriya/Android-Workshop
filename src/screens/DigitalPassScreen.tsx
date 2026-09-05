import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuroraBackground } from '../components/AuroraBackground';
import { GlassCard } from '../components/GlassCard';
import { db } from '../store';
import { ArrowLeft, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { WorkshopConstants } from '../types';
import QRCode from 'react-qr-code';
import { format } from 'date-fns';

export default function DigitalPassScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const participant = id ? db.getById(id) : null;

  useEffect(() => {
    if (!participant) navigate('/');
  }, [participant, navigate]);

  if (!participant) return null;

  return (
    <AuroraBackground className="px-6 py-8 flex flex-col">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full h-full">
        {/* Header */}
        <div className="flex items-center w-full mb-8">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-text-primary hover:text-android-green transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="w-2" />
          <span className="text-[12px] font-bold tracking-[2px] text-text-secondary uppercase">DIGITAL PASS</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <GlassCard className="w-full !p-0 overflow-hidden relative">
            <div className="w-full bg-android-green/10 border-b border-glass-border p-6 flex flex-col items-center">
              <span className="text-android-green text-[10px] font-bold tracking-[2px] uppercase mb-1">Android Club</span>
              <h2 className="text-[20px] font-black text-text-primary leading-tight text-center">{WorkshopConstants.NAME}</h2>
            </div>
            
            <div className="p-6 flex flex-col items-center">
              <div className="flex flex-col items-center mb-8">
                <span className="text-[24px] font-bold text-text-primary text-center leading-tight mb-2">{participant.name}</span>
                <div className="flex items-center text-text-secondary text-[14px]">
                  <Building2 size={14} className="mr-1" />
                  <span>{participant.college}</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-[16px] mb-6 border-4 border-white">
                <QRCode value={participant.id} size={200} className="rounded-lg" viewBox="0 0 256 256" />
              </div>

              <div className="text-[14px] font-mono font-bold tracking-[2px] text-text-label mb-8">
                {participant.id}
              </div>

              <div className="w-full h-[1px] bg-glass-border mb-4" />

              <div className="flex w-full justify-between items-center px-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-[1px] text-text-label uppercase mb-1">Registered</span>
                  <span className="text-[13px] font-medium text-text-primary">{format(new Date(participant.registeredAt), 'dd MMM yyyy')}</span>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold tracking-[1px] text-text-label uppercase mb-1">Status</span>
                  <span className={`text-[13px] font-bold ${participant.checkedIn ? 'text-status-successbg' : 'text-android-blue'}`}>
                    {participant.checkedIn ? 'CHECKED IN' : 'CONFIRMED'}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
