import https from 'https';
import http from 'http';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const visited = new Set();
const broken = [];
const working = [];
const maxPages = 500; // Prevent infinite crawls
const VERBOSE = process.env.VERBOSE === 'true';

async function fetchPage(url, redirectCount = 0) {
  return new Promise((resolve) => {
    // Prevent infinite redirect loops
    if (redirectCount > 5) {
      console.warn(`⚠️  Too many redirects: ${url}`);
      return resolve({ status: 0, body: '', finalUrl: url });
    }
    
    const protocol = url.startsWith('https') ? https : http;
    const options = { timeout: 15000 }; // Increased timeout to 15s
    
    const req = protocol.get(url, options, (res) => {
      // Follow redirects (307, 308, 301, 302)
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url).href;
        if (VERBOSE) console.log(`  → Redirecting to: ${redirectUrl}`);
        return fetchPage(redirectUrl, redirectCount + 1).then(resolve);
      }
      
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, finalUrl: url }));
      res.on('error', (err) => {
        console.error(`⚠️  Response error for ${url}:`, err.message);
        resolve({ status: 0, body: '', finalUrl: url });
      });
    });
    
    req.on('timeout', () => {
      console.warn(`⏱️  Request timeout (15s): ${url}`);
      req.destroy();
      resolve({ status: 0, body: '', finalUrl: url });
    });
    
    req.on('error', (err) => {
      console.error(`⚠️  Request error for ${url}:`, err.message);
      resolve({ status: 0, body: '', finalUrl: url });
    });
  });
}

function extractLinks(html, baseUrl) {
  const links = [];
  // Match both regular href and Next.js Link href patterns
  const patterns = [
    /href=["']([^"']+)["']/g,
    /to=["']([^"']+)["']/g,
    /<a[^>]+href=["']([^"']+)["']/gi,
  ];
  
  patterns.forEach(regex => {
    let match;
    while ((match = regex.exec(html)) !== null) {
      try {
        const url = new URL(match[1], baseUrl);
        if (url.origin === new URL(baseUrl).origin && !url.href.includes('#')) {
          links.push(url.href.split('?')[0]); // Remove query params and anchors
        }
      } catch (e) {
        // Invalid URL, skip
      }
    }
  });
  
  if (VERBOSE && links.length > 0) {
    console.log(`  Found ${links.length} internal links on this page`);
  }
  
  return [...new Set(links)];
}

// Known routes to check based on project structure
const knownRoutes = [
  '/',
  '/products',
  '/products/categories',
  '/support',
  '/support/contact',
  '/company',
  '/company/about',
  '/account',
  '/cart',
  '/checkout',
  '/sign-in',
  '/sign-up',
];

async function crawl(url, depth = 0) {
  if (visited.has(url) || visited.size >= maxPages || depth > 3) return;
  
  visited.add(url);
  console.log(`Checking [${visited.size}/${maxPages}] (depth ${depth}): ${url}`);
  
  try {
    const { status, body, finalUrl } = await fetchPage(url);
    
    // Mark finalUrl as visited too to avoid re-checking redirected URLs
    if (finalUrl !== url) visited.add(finalUrl);
    
    if (status === 404) {
      broken.push({ url, status: 404, depth });
      console.error(`❌ 404 Found: ${url}`);
      return;
    }
    
    if (status === 0) {
      broken.push({ url, status: 'TIMEOUT', depth });
      console.error(`⏱️  Timeout/Error: ${url}`);
      return;
    }
    
    if (status !== 200) {
      console.warn(`⚠️  Status ${status}: ${url}`);
      if (status >= 500) {
        broken.push({ url, status, depth });
      }
      return;
    }
    
    working.push(url);
    if (VERBOSE) console.log(`✅ 200 OK`);
    
    const links = extractLinks(body, finalUrl || url);
    
    // Add small delay between requests to avoid overwhelming dev server
    for (const link of links) {
      await crawl(link, depth + 1);
      await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay
    }
  } catch (error) {
    console.error(`💥 Unexpected error crawling ${url}:`, error.message);
    broken.push({ url, status: 'ERROR', depth });
  }
}

console.log(`Starting 404 check on: ${SITE_URL}\n`);
console.log(`Checking ${knownRoutes.length} known routes first...\n`);

// Graceful shutdown handler
let isShuttingDown = false;
process.on('SIGINT', () => {
  if (isShuttingDown) {
    console.log('\n\nForce exiting...');
    process.exit(1);
  }
  isShuttingDown = true;
  console.log('\n\n⚠️  Interrupted! Generating partial report...\n');
  printResults();
  process.exit(130);
});

// Check known routes first
for (const route of knownRoutes) {
  if (isShuttingDown) break;
  await crawl(new URL(route, SITE_URL).href);
}

function printResults() {
  console.log('\n=== RESULTS ===');
  console.log(`Pages checked: ${visited.size}`);
  console.log(`Working pages: ${working.length}`);
  console.log(`Broken links: ${broken.length}`);

  if (broken.length > 0) {
    console.log('\n❌ Errors Found:');
    const grouped = {};
    broken.forEach(({ url, status, depth }) => {
      grouped[status] = grouped[status] || [];
      grouped[status].push({ url, depth });
    });
    
    Object.entries(grouped).forEach(([status, urls]) => {
      console.log(`\n  [${status}] (${urls.length} errors):`);
      urls.forEach(({ url, depth }) => {
        console.log(`    - ${url} (depth: ${depth})`);
      });
    });
  } else {
    console.log('\n✅ No broken links found!');
  }
}

printResults();

if (broken.length > 0) {
  process.exit(1);
}
