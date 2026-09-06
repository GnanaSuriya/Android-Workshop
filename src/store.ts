import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Participant } from './types';

interface AppState {
  participants: Participant[];
  addParticipant: (p: Participant) => void;
  markAttendance: (id: string) => { success: boolean; message: string; participant?: Participant };
  getParticipant: (id: string) => Participant | undefined;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      participants: [],
      addParticipant: (p) => set((state) => ({ participants: [...state.participants, p] })),
      markAttendance: (id) => {
        const state = get();
        const p = state.participants.find(x => x.id === id);
        if (!p) return { success: false, message: 'Registration not found' };
        if (p.checkedIn) return { success: false, message: 'Already checked in at ' + p.checkInTime, participant: p };
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updated = { ...p, checkedIn: true, checkInTime: time };
        
        set({ participants: state.participants.map(x => x.id === id ? updated : x) });
        return { success: true, message: 'Check-in successful', participant: updated };
      },
      getParticipant: (id) => get().participants.find(x => x.id === id)
    }),
    { name: 'workshop-storage' }
  )
);
