export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Missing ID' });

  const KV_URL = process.env.UPSTASH_REDIS_REST_URL;
  const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!KV_URL || !KV_TOKEN) {
    return res.status(500).json({ ok: false, reason: 'error', error: 'Database environment variables missing' });
  }

  try {
    // ── Fetch existing registration (with timeout) ──
    const getController = new AbortController();
    const getTimeout = setTimeout(() => getController.abort(), 8000);

    let getRes;
    try {
      getRes = await fetch(KV_URL, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(['GET', `reg:${id}`]),
        signal: getController.signal,
      });
    } finally {
      clearTimeout(getTimeout);
    }

    const getResult = await getRes.json();
    if (getResult.error) {
      return res.status(500).json({ ok: false, reason: 'error', error: getResult.error });
    }
    if (!getResult.result) {
      return res.status(404).json({ ok: false, reason: 'not_found' });
    }

    const data = JSON.parse(getResult.result);

    // ── Already checked in — return duplicate shape ──
    if (data.checkedIn) {
      return res.status(200).json({ ok: false, reason: 'duplicate', participant: data });
    }

    // ── Mark as checked in ──
    data.checkedIn = true;
    data.checkInTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // ── Persist update (with timeout) ──
    const setController = new AbortController();
    const setTimeoutId = setTimeout(() => setController.abort(), 8000);

    try {
      await fetch(KV_URL, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(['SET', `reg:${id}`, JSON.stringify(data)]),
        signal: setController.signal,
      });
    } finally {
      clearTimeout(setTimeoutId);
    }

    return res.status(200).json({ ok: true, participant: data });
  } catch (error) {
    const reason = error.name === 'AbortError' ? 'timeout' : 'error';
    return res.status(500).json({ ok: false, reason, error: error.message });
  }
}
