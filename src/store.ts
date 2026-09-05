import { ParticipantRegistration, AttendanceValidationResult } from './types';
import { extractId } from './lib/utils';
import { format } from 'date-fns';

const STORAGE_KEY = 'workshop_registrations';

export const db = {
  getRegistrations: (): ParticipantRegistration[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveRegistrations: (registrations: ParticipantRegistration[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
    window.dispatchEvent(new Event('registrationsUpdated'));
  },

  register: (participant: ParticipantRegistration): boolean => {
    try {
      const regs = db.getRegistrations();
      regs.push(participant);
      db.saveRegistrations(regs);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  getById: (id: string): ParticipantRegistration | null => {
    const cleanId = extractId(id);
    const regs = db.getRegistrations();
    return regs.find(r => r.id === cleanId) || null;
  },

  markAttendance: (rawId: string): AttendanceValidationResult => {
    const id = extractId(rawId);
    const regs = db.getRegistrations();
    const index = regs.findIndex(r => r.id === id);
    
    if (index === -1) {
      return { type: 'not_found', id };
    }
    
    const existing = regs[index];
    if (existing.checkedIn) {
      return { type: 'duplicate', participant: existing };
    }
    
    const checkInTime = format(new Date(), "hh:mm a");
    const updated = { ...existing, checkedIn: true, checkInTime };
    regs[index] = updated;
    
    db.saveRegistrations(regs);
    
    return { type: 'success', participant: updated };
  }
};
