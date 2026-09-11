import { db } from './firebase.js';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing ID' });

  try {
    const docSnap = await db.collection('registrations').doc(id).get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'not_found' });
    }

    return res.status(200).json(docSnap.data());
  } catch (error) {
    console.error('Firebase error:', error);
    return res.status(500).json({ error: 'Database service unavailable' });
  }
}
