// Server-side proxy that forwards a GraphQL query to WP with Basic Auth.
// Keeps the application password secret (never exposed to browser).
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { query, variables } = req.body || {};
  if (!query) {
    res.status(400).json({ error: 'Missing query' });
    return;
  }

  const headers = { 'Content-Type': 'application/json' };

  const user = process.env.PREVIEW_USER;
  const pass = process.env.PREVIEW_APP_PASSWORD;

  if (user && pass) {
    const auth = Buffer.from(`${user}:${pass}`).toString('base64');
    headers['Authorization'] = `Basic ${auth}`;
  }

  try {
    const r = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}