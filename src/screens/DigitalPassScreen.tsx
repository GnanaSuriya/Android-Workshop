
import { useNavigate, useParams } from 'react-router-dom';
import { AuroraBackground } from '../components/AuroraBackground';
import { GlassCard } from '../components/GlassCard';
import { ArrowLeft, Building2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useStore } from '../store';
import { format, parseISO } from 'date-fns';

export default function DigitalPassScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const participant = useStore(state => state.getParticipant(id || ''));

  if (!participant) return null;

  return (
    <AuroraBackground>
      <div className="flex-1 flex flex-col p-6 max-w-md w-full mx-auto">
        <div className="flex items-center gap-3 mb-8 mt-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/10">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            DIGITAL PASS
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center w-full">
          <GlassCard className="w-full flex flex-col items-center px-6 py-8">
            <span className="text-[10px] font-bold tracking-widest text-android-green mb-1">
              ANDROID CLUB
            </span>
            <h2 className="text-xl font-black text-white mb-8">
              Android Development Workshop
            </h2>

            <h3 className="text-2xl font-bold text-white mb-2">{participant.name}</h3>
            <div className="flex items-center gap-1.5 text-slate-400 mb-8">
              <Building2 className="w-3.5 h-3.5" />
              <span className="text-sm">{participant.college}</span>
            </div>

            <div className="bg-white p-3 rounded-2xl mb-8">
              <QRCode value={participant.id} size={200} />
            </div>

            <span className="text-sm font-bold tracking-widest text-slate-500 mb-6">
              {participant.id}
            </span>

            <div className="w-full h-px bg-white/10 mb-6" />

            <div className="w-full flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold tracking-widest text-slate-500 mb-1">REGISTERED</span>
                <span className="text-xs font-medium text-white">
                  {format(parseISO(participant.registeredAt), 'dd MMM yyyy')}
                </span>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold tracking-widest text-slate-500 mb-1">STATUS</span>
                <span className={`text-xs font-bold ${participant.checkedIn ? 'text-emerald-400' : 'text-blue-400'}`}>
                  {participant.checkedIn ? 'CHECKED IN' : 'CONFIRMED'}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </AuroraBackground>
  );
}
