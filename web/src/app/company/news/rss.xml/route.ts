import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/wordpress';
import { stripHtml } from '@/lib/sanitize';

export async function GET() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi.com';
    const { posts } = await getPosts({ perPage: 50 });

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>BAPI News &amp; Updates</title>
    <link>${siteUrl}/en/company/news</link>
    <description>Latest news and updates from BAPI - Building Automation Products, Inc.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/company/news/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/images/logo.png</url>
      <title>BAPI</title>
      <link>${siteUrl}</link>
    </image>
${posts
  .map(
    (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/en/company/news/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/en/company/news/${post.slug}</guid>
      <description><![CDATA[${stripHtml(post.excerpt)}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <dc:creator>${post.author?.name || 'BAPI'}</dc:creator>
${post.categories?.map((cat) => `      <category>${cat.name}</category>`).join('\n') || ''}
${post.featuredImage ? `      <enclosure url="${post.featuredImage}" type="image/jpeg"/>` : ''}
    </item>`
  )
  .join('\n')}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}
