// Example page showing server-side preview-aware fetch.
// When preview === true, this attaches Basic auth using server-side env vars.
export async function getStaticProps({ preview = false }) {
  const query = `
    query GetPosts {
      posts(first: 5) {
        edges {
          node {
            databaseId
            title
            status
          }
        }
      }
    }
  `;

  const headers = { 'Content-Type': 'application/json' };
  if (preview) {
    const user = process.env.PREVIEW_USER;
    const pass = process.env.PREVIEW_APP_PASSWORD;
    if (user && pass) {
      const auth = Buffer.from(`${user}:${pass}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }
  }

  const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query }),
  });

  const json = await res.json();

  return {
    props: {
      posts: json.data?.posts?.edges || [],
      preview: !!preview,
    },
    revalidate: 60,
  };
}

export default function Home({ posts, preview }) {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 20 }}>
      <h1>{preview ? 'Preview mode (drafts included)' : 'Published'}</h1>
      <ul>
        {posts.map(({ node }) => (
          <li key={node.databaseId}>
            {node.title} — {node.status}
          </li>
        ))}
      </ul>
      <p>
        To enable preview mode, visit <code>/api/preview?slug=/</code> which will set preview cookies and redirect to the page.
      </p>
    </main>
  );
}