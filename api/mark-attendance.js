export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Missing ID' });

  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return res.status(500).json({ error: 'Database environment variables missing' });
  }

  try {
    // Fetch existing
    const getRes = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['GET', `reg:${id}`])
    });
    const getResult = await getRes.json();
    if (!getResult.result) return res.status(404).json({ error: 'not_found' });

    const data = JSON.parse(getResult.result);
    if (data.checkedIn) {
      return res.status(400).json({ error: 'duplicate', participant: data });
    }

    data.checkedIn = true;
    data.checkInTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const setRes = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['SET', `reg:${id}`, JSON.stringify(data)])
    });
    
    return res.status(200).json({ ok: true, participant: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
