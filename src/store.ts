import { create } from 'zustand';
import { Participant } from './types';
import { db, collection, doc, setDoc, updateDoc, onSnapshot } from './firebase';

interface AppState {
  participants: Participant[];
  setParticipants: (participants: Participant[]) => void;
  addParticipant: (p: Participant) => Promise<void>;
  markAttendance: (id: string) => Promise<{ success: boolean; message: string; participant?: Participant }>;
  getParticipant: (id: string) => Participant | undefined;
}

export const useStore = create<AppState>((set, get) => ({
  participants: [],
  setParticipants: (participants) => set({ participants }),
  addParticipant: async (p) => {
    // Write to Firestore
    await setDoc(doc(db, 'participants', p.id), p);
  },
  markAttendance: async (id) => {
    const state = get();
    const p = state.participants.find(x => x.id === id);
    if (!p) return { success: false, message: 'Registration not found' };
    if (p.checkedIn) return { success: false, message: 'Already checked in at ' + p.checkInTime, participant: p };
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = { ...p, checkedIn: true, checkInTime: time };
    
    // Write to Firestore
    await updateDoc(doc(db, 'participants', id), {
      checkedIn: true,
      checkInTime: time
    });
    
    return { success: true, message: 'Check-in successful', participant: updated };
  },
  getParticipant: (id) => get().participants.find(x => x.id === id)
}));

// Setup Firestore listener
const participantsRef = collection(db, 'participants');
onSnapshot(participantsRef, (snapshot) => {
  const participants = snapshot.docs.map(doc => doc.data() as Participant);
  useStore.getState().setParticipants(participants);
});
