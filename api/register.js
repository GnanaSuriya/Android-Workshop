export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
  
  try {
    const { id, name, email, phone, college, department, year, registeredAt } = req.body;
    if (!id || !name) {
      return res.status(400).json({ success: false, error: 'Invalid registration data' });
    }

    const KV_URL = process.env.KV_REST_API_URL;
    const KV_TOKEN = process.env.KV_REST_API_TOKEN;

    if (!KV_URL || !KV_TOKEN) {
      return res.status(500).json({ success: false, error: 'Registration service unavailable' });
    }

    const payload = { id, name, email, phone, college, department, year, checkedIn: false, checkInTime: null, registeredAt };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(KV_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['SET', `reg:${id}`, JSON.stringify(payload)]),
      signal: controller.signal
    });
    
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(500).json({ success: false, error: 'Registration service unavailable' });
    }

    const result = await response.json();
    if (result.error) {
      return res.status(500).json({ success: false, error: 'Registration service unavailable' });
    }

    return res.status(201).json({ success: true, registration: payload });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Registration service unavailable' });
  }
}
