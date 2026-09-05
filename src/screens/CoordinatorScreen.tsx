import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from '../components/AuroraBackground';
import { GlassCard } from '../components/GlassCard';
import { db } from '../store';
import { ParticipantRegistration, AttendanceValidationResult } from '../types';
import { ArrowLeft, ScanLine, Keyboard, Users, Search, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function CoordinatorScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'scan' | 'manual' | 'list'>('manual');
  const [manualId, setManualId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [registrations, setRegistrations] = useState<ParticipantRegistration[]>([]);
  const [validationResult, setValidationResult] = useState<AttendanceValidationResult | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const loadData = () => {
    setRegistrations(db.getRegistrations());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('registrationsUpdated', loadData);
    return () => window.removeEventListener('registrationsUpdated', loadData);
  }, []);

  const handleValidate = (id: string) => {
    if (!id.trim()) return;
    const result = db.markAttendance(id);
    setValidationResult(result);
    setManualId('');
  };

  const filteredRegistrations = registrations.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.college.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AuroraBackground className="flex flex-col">
      <div className="flex-1 flex flex-col pt-8 pb-4">
        <div className="flex items-center px-6 mb-6">
          <button onClick={() => navigate('/')} className="p-1 -ml-1 text-text-primary hover:text-android-green transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="w-2" />
          <span className="text-[12px] font-bold tracking-[2px] text-text-secondary uppercase">COORDINATOR</span>
        </div>
        
        <div className="flex px-6 gap-2 mb-6">
          {[
            { id: 'scan', icon: ScanLine, label: 'Scan' },
            { id: 'manual', icon: Keyboard, label: 'Manual' },
            { id: 'list', icon: Users, label: 'List' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setValidationResult(null); }}
              className={`flex-1 flex flex-col items-center py-[10px] rounded-[14px] text-[12px] font-semibold transition-colors ${activeTab === tab.id ? 'bg-android-green/20 text-android-green border border-android-green/30' : 'bg-glass-bg text-text-secondary border border-transparent'}`}
            >
              <tab.icon size={18} className="mb-1" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-8 no-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'scan' && (
              <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 h-[60dvh] flex flex-col items-center justify-center">
                {!cameraError ? (
                  <GlassCard className="w-full text-center border-glass-border p-4 relative">
                    <h3 className="text-[16px] font-bold text-text-primary mb-4">Scan QR Pass</h3>
                    <div className="rounded-xl overflow-hidden bg-black border-2 border-glass-border aspect-square relative flex items-center justify-center">
                      <Scanner 
                        onScan={(result) => {
                          let scannedVal = '';
                          if (Array.isArray(result) && result.length > 0) {
                            scannedVal = result[0].rawValue;
                          } else if (result && typeof result === 'string') {
                            scannedVal = result;
                          } else if (result && typeof (result as any).text === 'string') {
                            scannedVal = (result as any).text;
                          }
                          
                          if (scannedVal) {
                            handleValidate(scannedVal);
                            setActiveTab('manual');
                          }
                        }} 
                        onError={(error: any) => {
                          // Ignore minor frame errors, catch actual device/permission errors
                          if (error?.name === 'NotAllowedError' || error?.name === 'NotFoundError' || error?.message?.includes('denied') || error?.message?.includes('requested device not found')) {
                            setCameraError(error.message || 'Camera access denied or unavailable.');
                          }
                        }}
                      />
                    </div>
                  </GlassCard>
                ) : (
                  <GlassCard className="w-full text-center border-dashed border-2 p-10 border-glass-border">
                    <ScanLine size={48} className="mx-auto text-text-label mb-4" />
                    <h3 className="text-[16px] font-bold text-text-primary mb-2">Camera Unavailable</h3>
                    <p className="text-[13px] text-text-secondary mb-6">{cameraError}</p>
                    <button onClick={() => setActiveTab('manual')} className="px-6 py-[10px] bg-glass-bg border border-glass-border rounded-full text-text-primary text-[12px] font-bold tracking-[1px] uppercase">
                      Switch to Manual
                    </button>
                  </GlassCard>
                )}
              </motion.div>
            )}

            {activeTab === 'manual' && (
              <motion.div key="manual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full mt-4">
                <GlassCard className="mb-6">
                  <h2 className="text-[15px] font-bold text-text-primary mb-4">Manual Check-In</h2>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="REG-ID"
                      value={manualId}
                      onChange={e => setManualId(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === 'Enter' && handleValidate(manualId)}
                      className="flex-1 bg-bg-dark border border-glass-border rounded-[14px] px-4 py-[14px] text-[14px] font-mono text-text-primary placeholder:text-text-label focus:outline-none focus:border-glass-borderfocus uppercase"
                    />
                    <button
                      onClick={() => handleValidate(manualId)}
                      disabled={!manualId.trim()}
                      className="px-6 bg-android-green text-bg-dark rounded-[14px] font-bold text-[13px] tracking-[1px] uppercase disabled:opacity-50"
                    >
                      Verify
                    </button>
                  </div>
                </GlassCard>

                {validationResult && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <ResultCard result={validationResult} onDismiss={() => setValidationResult(null)} />
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'list' && (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-label" size={18} />
                  <input
                    type="text"
                    placeholder="Search name, ID..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-glass-bg border border-glass-border rounded-[14px] pl-10 pr-4 py-[12px] text-[14px] text-text-primary placeholder:text-text-label focus:outline-none focus:border-glass-borderfocus"
                  />
                </div>

                <div className="flex justify-between items-center px-1 mb-4 text-[12px] text-text-secondary">
                  <span>{filteredRegistrations.length} Registrations</span>
                  <span>{registrations.filter(r => r.checkedIn).length} Checked In</span>
                </div>

                <div className="space-y-3">
                  {filteredRegistrations.map(reg => (
                    <GlassCard key={reg.id} className="p-4 flex items-center justify-between">
                      <div className="flex-1 overflow-hidden pr-2">
                        <h4 className="font-bold text-text-primary text-[15px] truncate">{reg.name}</h4>
                        <p className="text-android-green text-[12px] font-mono mt-[2px]">{reg.id}</p>
                        <p className="text-text-secondary text-[12px] mt-[2px] truncate">{reg.college}</p>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        {reg.checkedIn ? (
                          <div className="flex flex-col items-end">
                            <CheckCircle2 size={24} className="text-status-successbg mb-1" />
                            <span className="text-[10px] font-medium text-text-secondary flex items-center">
                              <Clock size={10} className="mr-1" /> {reg.checkInTime}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => db.markAttendance(reg.id)}
                            className="px-[14px] py-[8px] bg-glass-bg border border-glass-border hover:bg-glass-border text-text-primary rounded-lg text-[12px] font-bold"
                          >
                            Check In
                          </button>
                        )}
                      </div>
                    </GlassCard>
                  ))}
                  
                  {filteredRegistrations.length === 0 && (
                    <div className="text-center text-text-label py-12 text-[14px]">
                      No registrations found.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AuroraBackground>
  );
}

function ResultCard({ result, onDismiss }: { result: AttendanceValidationResult, onDismiss: () => void }) {
  if (result.type === 'success') {
    return (
      <GlassCard className="bg-android-green/10 border-android-green/30 text-center relative">
        <button onClick={onDismiss} className="absolute top-3 right-3 text-text-label hover:text-text-primary"><XCircle size={20}/></button>
        <div className="w-14 h-14 bg-android-green/20 rounded-full flex items-center justify-center mx-auto mb-3 text-android-green">
          <CheckCircle2 size={28} />
        </div>
        <h3 className="text-[18px] font-bold text-text-primary mb-1">Check-in Successful</h3>
        <p className="text-android-green font-medium text-[15px]">{result.participant.name}</p>
        <p className="text-text-secondary text-[13px] mt-1 font-mono">{result.participant.id}</p>
      </GlassCard>
    );
  }
  
  if (result.type === 'duplicate') {
    return (
      <GlassCard className="bg-status-warnbg border-status-warn/30 text-center relative">
        <button onClick={onDismiss} className="absolute top-3 right-3 text-text-label hover:text-text-primary"><XCircle size={20}/></button>
        <div className="w-14 h-14 bg-status-warn/20 rounded-full flex items-center justify-center mx-auto mb-3 text-status-warn">
          <AlertTriangle size={28} />
        </div>
        <h3 className="text-[18px] font-bold text-text-primary mb-1">Already Checked In</h3>
        <p className="text-status-warn font-medium text-[15px]">{result.participant.name}</p>
        <p className="text-text-secondary text-[13px] mt-1">Checked in at {result.participant.checkInTime}</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="bg-status-errorbg border-status-error/30 text-center relative">
      <button onClick={onDismiss} className="absolute top-3 right-3 text-text-label hover:text-text-primary"><XCircle size={20}/></button>
      <div className="w-14 h-14 bg-status-error/20 rounded-full flex items-center justify-center mx-auto mb-3 text-status-error">
        <XCircle size={28} />
      </div>
      <h3 className="text-[18px] font-bold text-text-primary mb-1">Invalid Pass</h3>
      <p className="text-status-error font-medium text-[15px]">Registration Not Found</p>
      <p className="text-text-secondary text-[13px] mt-1 font-mono">{result.id}</p>
    </GlassCard>
  );
}
