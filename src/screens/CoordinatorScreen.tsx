import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from '../components/AuroraBackground';
import { GlassCard } from '../components/GlassCard';
import { ArrowLeft, ScanLine, Keyboard, Users, Search, CheckCircle2, Clock, X, AlertTriangle, AlertCircle } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useStore } from '../store';

export default function CoordinatorScreen() {
  const navigate = useNavigate();
  const store = useStore();
  
  const [activeTab, setActiveTab] = useState<'scan' | 'manual' | 'list'>('manual');
  const [manualId, setManualId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [validationResult, setValidationResult] = useState<{
    success: boolean; message: string; participant?: any;
  } | null>(null);

  const filteredParticipants = store.participants.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.college.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleValidate = (id: string) => {
    if (!id.trim()) return;
    const res = store.markAttendance(id.trim().toUpperCase());
    setValidationResult(res);
    setManualId('');
    if (activeTab === 'scan') setActiveTab('manual');
  };

  return (
    <AuroraBackground>
      <div className="flex-1 flex flex-col p-6 max-w-md w-full mx-auto h-[100svh]">
        <div className="flex items-center gap-3 mb-6 mt-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/10">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            COORDINATOR
          </span>
        </div>

        <div className="flex gap-2 mb-6">
          <TabButton icon={<ScanLine className="w-4 h-4" />} text="Scan" active={activeTab === 'scan'} onClick={() => { setActiveTab('scan'); setValidationResult(null); }} />
          <TabButton icon={<Keyboard className="w-4 h-4" />} text="Manual" active={activeTab === 'manual'} onClick={() => { setActiveTab('manual'); setValidationResult(null); }} />
          <TabButton icon={<Users className="w-4 h-4" />} text="List" active={activeTab === 'list'} onClick={() => { setActiveTab('list'); setValidationResult(null); }} />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
          {activeTab === 'scan' && (
            <div className="w-full rounded-[24px] overflow-hidden border border-white/10">
              <Scanner onScan={(res) => { if (res && res.length > 0) handleValidate(res[0].rawValue); }} formats={['qr_code']} />
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="flex flex-col gap-6">
              <GlassCard>
                <h3 className="font-bold text-sm mb-4">Manual Check-In</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    placeholder="REG-ID"
                    className="flex-1 h-12 bg-zinc-950 border border-white/10 rounded-xl px-4 text-white text-sm outline-none uppercase placeholder:normal-case"
                  />
                  <button
                    onClick={() => handleValidate(manualId)}
                    disabled={!manualId.trim()}
                    className="h-12 px-6 bg-android-green text-zinc-950 rounded-xl font-bold text-xs tracking-wide disabled:opacity-50"
                  >
                    VERIFY
                  </button>
                </div>
              </GlassCard>

              {validationResult && (
                <ResultCard result={validationResult} onDismiss={() => setValidationResult(null)} />
              )}
            </div>
          )}

          {activeTab === 'list' && (
            <div className="flex flex-col h-full">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, ID..."
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-white text-sm outline-none"
                />
              </div>
              <div className="flex justify-between items-center px-1 mb-4">
                <span className="text-xs text-slate-500">{filteredParticipants.length} Registrations</span>
                <span className="text-xs text-slate-500">{store.participants.filter(p => p.checkedIn).length} Checked In</span>
              </div>
              
              <div className="flex flex-col gap-3">
                {filteredParticipants.map(p => (
                  <GlassCard key={p.id} className="p-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-white">{p.name}</span>
                      <span className="font-bold text-xs text-android-green">{p.id}</span>
                      <span className="text-xs text-slate-500 truncate max-w-[150px]">{p.college}</span>
                    </div>
                    {p.checkedIn ? (
                      <div className="flex flex-col items-end">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-1" />
                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] font-medium">{p.checkInTime}</span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleValidate(p.id)}
                        className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors"
                      >
                        Check In
                      </button>
                    )}
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuroraBackground>
  );
}

function TabButton({ icon, text, active, onClick }: { icon: React.ReactNode; text: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-colors ${
        active ? 'bg-android-green/20 border-android-green/30 text-android-green' : 'bg-white/5 border-transparent text-slate-400'
      }`}
    >
      {icon}
      <span className="text-[10px] font-semibold">{text}</span>
    </button>
  );
}

function ResultCard({ result, onDismiss }: { result: any, onDismiss: () => void }) {
  if (result.success) {
    return (
      <GlassCard className="bg-emerald-500/10 border-emerald-500/30 relative flex flex-col items-center text-center">
        <button onClick={onDismiss} className="absolute right-4 top-4 text-slate-400"><X className="w-5 h-5" /></button>
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
        <span className="font-bold text-lg mb-1">Check-in Successful</span>
        <span className="font-medium text-emerald-400 text-sm">{result.participant?.name}</span>
        <span className="text-xs text-slate-400">{result.participant?.id}</span>
      </GlassCard>
    );
  }
  if (result.participant) {
    return (
      <GlassCard className="bg-[#452D09] border-amber-500/30 relative flex flex-col items-center text-center">
        <button onClick={onDismiss} className="absolute right-4 top-4 text-slate-400"><X className="w-5 h-5" /></button>
        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
        </div>
        <span className="font-bold text-lg mb-1">Already Checked In</span>
        <span className="font-medium text-amber-500 text-sm">{result.participant?.name}</span>
        <span className="text-xs text-slate-400">{result.message}</span>
      </GlassCard>
    );
  }
  return (
    <GlassCard className="bg-[#451515] border-red-500/30 relative flex flex-col items-center text-center">
      <button onClick={onDismiss} className="absolute right-4 top-4 text-slate-400"><X className="w-5 h-5" /></button>
      <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6 text-red-500" />
      </div>
      <span className="font-bold text-lg mb-1">Invalid Pass</span>
      <span className="font-medium text-red-500 text-sm">Registration Not Found</span>
    </GlassCard>
  );
}
