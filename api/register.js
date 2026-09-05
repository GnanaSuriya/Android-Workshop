export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
  const { id, name, email, phone, college, department, year, registeredAt } = req.body;
  if (!id || !name) return res.status(400).json({ error: 'Missing fields' });

  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return res.status(500).json({ error: 'Database environment variables missing' });
  }

  const payload = { id, name, email, phone, college, department, year, checkedIn: false, checkInTime: null, registeredAt };

  try {
    const response = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['SET', `reg:${id}`, JSON.stringify(payload)])
    });

    const result = await response.json();
    if (result.error) throw new Error(result.error);

    return res.status(200).json({ ok: true, participant: payload });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
