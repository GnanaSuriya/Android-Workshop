export interface ParticipantRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  checkedIn: boolean;
  checkInTime: string | null;
  registeredAt: string;
}

export type AttendanceValidationResult = 
  | { type: 'success'; participant: ParticipantRegistration }
  | { type: 'duplicate'; participant: ParticipantRegistration }
  | { type: 'not_found'; id: string };

export const WorkshopConstants = {
    NAME: "Android Development Workshop",
    CLUB: "Android Club",
    DATE: "SAT, 18 OCT",
    TIME: "10:00 AM – 1:00 PM",
    VENUE: "Android Lab · Block A",
    DESCRIPTION: "A hands-on Android Development Workshop for builders ready to ship."
};
