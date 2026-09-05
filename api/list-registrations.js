export default async function handler(req, res) {
  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;

  if (!KV_URL || !KV_TOKEN) {
    return res.status(500).json({ error: 'Database environment variables missing' });
  }

  try {
    let cursor = 0;
    let allKeys = [];
    do {
      const scanRes = await fetch(KV_URL, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(['SCAN', cursor, 'MATCH', 'reg:*', 'COUNT', 500])
      });
      const scanResult = await scanRes.json();
      if (scanResult.error) throw new Error(scanResult.error);
      
      cursor = scanResult.result[0];
      allKeys = allKeys.concat(scanResult.result[1]);
    } while (cursor !== "0" && cursor !== 0);

    if (allKeys.length === 0) {
      return res.status(200).json({});
    }

    const mgetRes = await fetch(KV_URL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['MGET', ...allKeys])
    });
    const mgetResult = await mgetRes.json();
    
    const resultObj = {};
    for (let i = 0; i < allKeys.length; i++) {
      if (mgetResult.result[i]) {
        const parsed = JSON.parse(mgetResult.result[i]);
        resultObj[parsed.id] = parsed;
      }
    }

    return res.status(200).json(resultObj);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
