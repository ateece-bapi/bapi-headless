import Fuse from 'fuse.js';
import rawPdfIndex from '@/data/chat/pdf-index.json';
import { slugify } from '@/lib/utils/slugify';

export interface PdfTextPage {
  id: string;
  documentId: string;
  title: string;
  url: string;
  page: number;
  text: string;
  accessGroup: string | null;
  checksum: string;
}

export interface PdfTextIndex {
  version: 1;
  generatedAt: string | null;
  source: string;
  documents: PdfTextPage[];
}

export interface PdfBodySearchResult {
  id: string;
  type: 'pdf';
  title: string;
  url: string;
  excerpt: string;
  page: number;
}

/** Checks document-level OEM access before a page enters the search index. */
function canViewPage(page: PdfTextPage, customerGroups: string[]): boolean {
  if (!page.accessGroup) return true;
  const normalizedGroups = customerGroups.map((group) => slugify(group));
  return normalizedGroups.includes(slugify(page.accessGroup));
}

/** Searches a supplied PDF page index with exact-match boosting and access filtering. */
export function searchPdfIndex(
  query: string,
  index: PdfTextIndex,
  limit: number = 5,
  customerGroups: string[] = ['end-user']
): PdfBodySearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery || index.documents.length === 0) return [];

  const permittedPages = index.documents.filter((page) => canViewPage(page, customerGroups));
  const fuse = new Fuse(permittedPages, {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'text', weight: 1 },
    ],
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
    threshold: 0.4,
  });

  return fuse
    .search(query, { limit: Math.max(limit * 4, 20) })
    .map((match) => ({
      page: match.item,
      rank:
        `${match.item.title} ${match.item.text}`.toLowerCase().includes(normalizedQuery)
          ? -1
          : (match.score ?? 1),
    }))
    .sort((first, second) => first.rank - second.rank)
    .slice(0, limit)
    .map(({ page }) => ({
      id: page.id,
      type: 'pdf' as const,
      title: page.title,
      url: `${page.url}#page=${page.page}`,
      excerpt: page.text.slice(0, 700),
      page: page.page,
    }));
}

const bundledPdfIndex = rawPdfIndex as PdfTextIndex;

/** Searches the generated PDF body index bundled with the application. */
export function searchPdfBody(
  query: string,
  limit: number = 5,
  customerGroups: string[] = ['end-user']
): PdfBodySearchResult[] {
  return searchPdfIndex(query, bundledPdfIndex, limit, customerGroups);
}