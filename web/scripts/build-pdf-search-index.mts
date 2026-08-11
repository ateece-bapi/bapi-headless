import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

interface WordPressPdf {
  id: number;
  title?: { rendered?: string };
  source_url?: string;
  media_details?: { filesize?: number | null };
}

interface WordPressPdfResponse {
  documents?: WordPressPdf[];
}

interface IndexedPage {
  id: string;
  documentId: string;
  title: string;
  url: string;
  page: number;
  text: string;
  accessGroup: string | null;
  checksum: string;
}

const validAccessGroups = new Set(['alc', 'acs', 'emc', 'ccg', 'ccga']);
const outputPath = path.resolve('src/data/chat/pdf-index.json');
const documentLimit = Math.max(1, Number.parseInt(process.env.PDF_INDEX_LIMIT ?? '75', 10));
const includeRestricted = process.env.PDF_INDEX_INCLUDE_RESTRICTED === 'true';
const maxPdfBytes = Math.max(
  1,
  Number.parseInt(process.env.PDF_INDEX_MAX_BYTES ?? `${20 * 1024 * 1024}`, 10)
);

/** Extracts an OEM access group from the established document-title prefixes. */
function getAccessGroup(title: string): string | null {
  const parenthesized = title.match(/^\((\w+)\)/)?.[1];
  const slashPrefixed = title.match(/^([A-Z]{3,4})\//)?.[1];
  const group = (parenthesized ?? slashPrefixed)?.toLowerCase();
  return group && validAccessGroups.has(group) ? group : null;
}

/** Collapses extracted PDF text into a compact searchable representation. */
function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/** Fetches an index or PDF resource with a bounded request time. */
async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

/** Downloads and extracts each text-bearing page from one PDF. */
async function extractDocument(document: WordPressPdf): Promise<IndexedPage[]> {
  const title = normalizeText(document.title?.rendered ?? 'Untitled Document');
  const url = document.source_url ?? '';
  const accessGroup = getAccessGroup(title);
  if (!url.startsWith('http')) return [];

  const response = await fetchWithTimeout(url, 30_000);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const contentLength = Number.parseInt(response.headers.get('content-length') ?? '0', 10);
  if (contentLength > maxPdfBytes) throw new Error(`exceeds ${maxPdfBytes} byte limit`);

  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > maxPdfBytes) throw new Error(`exceeds ${maxPdfBytes} byte limit`);

  const checksum = createHash('sha256').update(bytes).digest('hex');
  const loadingTask = getDocument({ data: bytes, useWorkerFetch: false });
  const pdf = await loadingTask.promise;
  const pages: IndexedPage[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = normalizeText(
      content.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')
    );
    if (text.length < 20) continue;

    pages.push({
      id: `${document.id}-page-${pageNumber}`,
      documentId: String(document.id),
      title,
      url,
      page: pageNumber,
      text,
      accessGroup,
      checksum,
    });
  }

  await loadingTask.destroy();
  return pages;
}

/** Builds a bounded local search index from the WordPress PDF catalog. */
async function main(): Promise<void> {
  const graphqlUrl = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;
  const wordpressUrl = process.env.WORDPRESS_URL ?? graphqlUrl?.replace(/\/graphql\/?$/, '');
  if (!wordpressUrl) {
    throw new Error('Set WORDPRESS_URL or NEXT_PUBLIC_WORDPRESS_GRAPHQL before indexing PDFs.');
  }

  const endpoint = `${wordpressUrl.replace(/\/$/, '')}/wp-json/bapi/v1/all-pdfs`;
  const response = await fetchWithTimeout(endpoint, 30_000);
  if (!response.ok) throw new Error(`PDF listing returned HTTP ${response.status}`);

  const payload = (await response.json()) as WordPressPdfResponse;
  const candidates = (payload.documents ?? [])
    .filter((document) => {
      const title = document.title?.rendered ?? '';
      return includeRestricted || !getAccessGroup(title);
    })
    .filter((document) => (document.media_details?.filesize ?? 0) <= maxPdfBytes)
    .slice(0, documentLimit);

  const indexedPages: IndexedPage[] = [];
  let failedDocuments = 0;
  for (const [index, document] of candidates.entries()) {
    const title = document.title?.rendered ?? `Document ${document.id}`;
    process.stdout.write(`[${index + 1}/${candidates.length}] ${title}\n`);
    try {
      indexedPages.push(...(await extractDocument(document)));
    } catch (error) {
      failedDocuments++;
      const message = error instanceof Error ? error.message : String(error);
      process.stderr.write(`  Skipped: ${message}\n`);
    }
  }

  const index = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: endpoint,
    documents: indexedPages,
  };
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(index)}\n`, 'utf8');

  const indexedDocumentCount = new Set(indexedPages.map((page) => page.documentId)).size;
  process.stdout.write(
    `Indexed ${indexedPages.length} pages from ${indexedDocumentCount} documents; ${failedDocuments} failed.\n`
  );
  process.stdout.write(`Wrote ${outputPath}\n`);
}

await main();