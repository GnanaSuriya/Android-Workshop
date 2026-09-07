import { db, doc, getDoc, updateDoc } from './firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Missing registration ID' });
    }

    const docRef = doc(db, 'registrations', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ success: false, error: 'Registration not found' });
    }

    const data = docSnap.data();

    if (data.checkedIn) {
      return res.status(400).json({ success: false, error: 'Already checked in', registration: data });
    }

    const checkInTime = new Date().toISOString();
    await updateDoc(docRef, {
      checkedIn: true,
      checkInTime: checkInTime
    });

    const updatedRegistration = { ...data, checkedIn: true, checkInTime };

    return res.status(200).json({ success: true, registration: updatedRegistration });
  } catch (error) {
    console.error('Firebase error:', error);
    return res.status(500).json({ success: false, error: 'Failed to mark attendance' });
  }
}
