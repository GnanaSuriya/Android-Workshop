
import { useNavigate, useParams } from 'react-router-dom';
import { AuroraBackground } from '../components/AuroraBackground';
import { GlassCard } from '../components/GlassCard';
import { Check, User, Calendar, Copy, Info, Share } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useStore } from '../store';

export default function SuccessScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const participant = useStore(state => state.getParticipant(id || ''));

  if (!participant) return null;

  return (
    <AuroraBackground>
      <div className="flex-1 flex flex-col items-center p-6 max-w-md w-full mx-auto overflow-y-auto no-scrollbar pt-12">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-android-green/30 flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-android-green" />
        </div>
        
        <h1 className="text-[28px] font-black text-center leading-tight mb-2">
          REGISTRATION<br />SUCCESSFUL
        </h1>
        <p className="text-sm text-slate-400 mb-8">Your seat has been reserved.</p>

        <GlassCard className="w-full flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-android-green" />
            <span className="text-sm font-medium text-white">{participant.name}</span>
          </div>
          <div className="w-full h-px bg-white/10" />
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-android-green" />
            <span className="text-sm font-medium text-white">SAT, 18 OCT</span>
          </div>
          <div className="w-full h-px bg-white/10" />
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">ID:</span>
              <span className="text-sm font-bold text-android-green">{participant.id}</span>
            </div>
            <button className="text-slate-400 hover:text-white transition-colors">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>

        <GlassCard className="w-full flex flex-col items-center p-6 mb-8">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 mb-4">DIGITAL PASS QR</span>
          <div className="bg-white p-2 rounded-xl mb-3">
            <QRCode value={participant.id} size={144} />
          </div>
          <p className="text-xs text-center text-slate-400 leading-relaxed">
            Show this code at the entrance<br />to mark your attendance.
          </p>
        </GlassCard>

        <button
          onClick={() => navigate(`/pass/${id}`)}
          className="w-full h-14 bg-android-green text-zinc-950 rounded-full font-extrabold text-xs tracking-wide flex items-center justify-center gap-2 mb-3"
        >
          <Info className="w-4 h-4" />
          VIEW DIGITAL PASS
        </button>
        
        <button className="w-full h-12 bg-transparent border border-white/10 text-white rounded-full font-bold text-xs tracking-wide flex items-center justify-center gap-2 mb-4 hover:bg-white/5 transition-colors">
          <Share className="w-4 h-4" />
          SHARE PASS
        </button>

        <button onClick={() => navigate('/')} className="text-xs text-slate-400 pb-8 hover:text-white transition-colors">
          Return to Home
        </button>
      </div>
    </AuroraBackground>
  );
}
