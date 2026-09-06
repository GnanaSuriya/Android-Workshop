export interface Participant {
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
