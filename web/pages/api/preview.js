// Minimal "set preview" route for Next.js Preview Mode.
// Expects ?slug=/path and will enable Preview Mode then redirect to the slug.
// Add authentication/validation as needed for your use case.
export default async function handler(req, res) {
  // You should validate the request here in production.
  const { slug } = req.query;

  // Enable Preview Mode (sets cookies)
  res.setPreviewData({});

  // Redirect to requested slug or home
  const redirectUrl = Array.isArray(slug) ? '/' + slug.join('/') : (slug || '/');
  res.writeHead(307, { Location: redirectUrl });
  res.end();
}