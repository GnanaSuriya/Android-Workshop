import { db } from './firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
  
  try {
    const { id, name, email, phone, college, department, year, registeredAt } = req.body;
    if (!id || !name) {
      return res.status(400).json({ success: false, error: 'Invalid registration data' });
    }

    const payload = { id, name, email, phone, college, department, year, checkedIn: false, checkInTime: null, registeredAt };

    await db.collection('registrations').doc(id).set(payload);

    return res.status(201).json({ success: true, registration: payload });
  } catch (error) {
    console.error('Firebase error:', error);
    return res.status(500).json({ success: false, error: 'Registration service unavailable' });
  }
}
