import { db, collection, getDocs } from './firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const registrationsCol = collection(db, 'registrations');
    const snapshot = await getDocs(registrationsCol);
    const list = snapshot.docs.map(doc => doc.data());

    return res.status(200).json({ success: true, count: list.length, registrations: list });
  } catch (error) {
    console.error('Firebase error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch registrations' });
  }
}
