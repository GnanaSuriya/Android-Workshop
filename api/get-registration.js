export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing ID' });

  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;
  
  if (!KV_URL || !KV_TOKEN) {
    return res.status(500).json({ error: 'Database environment variables missing' });
  }

  try {
    const response = await fetch(KV_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['GET', `reg:${id}`])
    });

    const result = await response.json();
    if (result.error) throw new Error(result.error);

    if (!result.result) {
      return res.status(404).json({ error: 'not_found' });
    }

    const data = JSON.parse(result.result);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
