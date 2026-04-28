/**
 * Application Note types for categorization and display
 */

export interface ApplicationNoteCategory {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

export interface ApplicationNote {
  id: string;
  databaseId: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  date: string;
  modified: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  } | null;
  applicationNoteCategories?: {
    nodes: ApplicationNoteCategory[];
  };
}

export interface CategoryWithNotes {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
  notes: ApplicationNote[];
}
