import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from '../components/AuroraBackground';
import { GlassCard } from '../components/GlassCard';
import { Calendar, Clock, MapPin, Info, Lock, X } from 'lucide-react';

export default function LandingScreen() {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <AuroraBackground>
      <div className="flex-1 flex flex-col items-center justify-between p-6 max-w-md w-full mx-auto">
        <div className="w-full flex flex-col items-center pt-8">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-android-green/10 border border-android-green/30">
            <Info className="w-4 h-4 text-android-green" />
            <span className="text-[10px] font-bold tracking-widest text-white uppercase">
              Android Club
            </span>
          </div>

          <h1 className="mt-8 text-[44px] leading-[46px] font-black w-full text-left">
            BUILD FOR<br />
            <span className="text-android-green">ANDROID.</span>
          </h1>

          <p className="mt-4 text-[15px] leading-snug text-slate-400 w-full text-left">
            A hands-on Android Development Workshop for builders ready to ship.
          </p>

          <GlassCard className="w-full mt-8 flex flex-col gap-3">
            <InfoRow icon={<Calendar className="w-4 h-4 text-android-green" />} text="SAT, 18 OCT" />
            <div className="w-full h-px bg-white/10" />
            <InfoRow icon={<Clock className="w-4 h-4 text-android-green" />} text="10:00 AM - 1:00 PM" />
            <div className="w-full h-px bg-white/10" />
            <InfoRow icon={<MapPin className="w-4 h-4 text-android-green" />} text="Android Lab · Block A" />
          </GlassCard>
        </div>

        <div className="w-full flex flex-col items-center pb-8">
          <button
            onClick={() => navigate('/register')}
            className="w-full h-14 bg-android-green text-zinc-950 rounded-full font-extrabold text-sm tracking-wide flex items-center justify-center gap-2"
          >
            <Info className="w-5 h-5" />
            REGISTER NOW
          </button>

          <button
            onClick={() => setShowAuth(true)}
            className="mt-4 p-2 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
          >
            Coordinator? Mark attendance →
          </button>
        </div>
      </div>

      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <GlassCard className="w-full max-w-sm flex flex-col gap-4 relative">
            <button onClick={() => { setShowAuth(false); setPassword(''); setError(''); }} className="absolute right-4 top-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-full bg-android-green/20 flex items-center justify-center mx-auto mt-2">
              <Lock className="w-5 h-5 text-android-green" />
            </div>
            <div className="text-center mb-2">
              <h3 className="text-lg font-bold text-white mb-1">Coordinator Access</h3>
              <p className="text-xs text-slate-400">Enter the admin password to continue.</p>
            </div>
            
            <div className="flex flex-col gap-1.5 mb-2">
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Password"
                className={`w-full h-12 bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 text-white text-sm outline-none focus:border-white/20 transition-colors`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (password === 'admin123') {
                      setShowAuth(false);
                      navigate('/coordinator');
                    } else {
                      setError('Incorrect password');
                    }
                  }
                }}
              />
              {error && <span className="text-xs text-red-500">{error}</span>}
            </div>

            <button
              onClick={() => {
                if (password === 'admin123') {
                  setShowAuth(false);
                  navigate('/coordinator');
                } else {
                  setError('Incorrect password');
                }
              }}
              className="w-full h-12 bg-android-green text-zinc-950 rounded-xl font-bold text-xs tracking-wide flex items-center justify-center"
            >
              ACCESS DASHBOARD
            </button>
          </GlassCard>
        </div>
      )}
    </AuroraBackground>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-sm font-semibold text-white">{text}</span>
    </div>
  );
}
