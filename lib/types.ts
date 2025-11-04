// lib/types.ts
export type Topic = { slug: string; name: string };

export type FeedItem = {
  id: string;
  slug: string;
  title: string;
  source: string;        // e.g., "The Verge"
  source_url: string;    // canonical article URL
  favicon?: string;
  excerpt: string;
  tags: string[];        // we map from backend `topics`
  published_at: string;  // ISO string
  rank?: number;         // map from rankScore
  why?: string;          // map from whyItMatters
  topics?: string[];
};

export type ItemDetail = FeedItem & {
  summary_md: string;    // built from summaryBullets
  entities?: string[];   // optional until backend adds them
  related: FeedItem[];   // can be empty for now
};

export type PostMeta = {
  slug: string;
  title: string;
  tags: string[];
  published_at: string;
  readingTime?: string;
};

export type SearchResult = FeedItem;

// --- DTOs from your backend (live API) ---
export type FeedItemDto = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  url: string;
  source: { id: string; name: string; type: string; domain: string };
  publishedAt: string;         // Instant -> ISO
  topics: string[];
  summaryBullets?: string;     // optional in lists
  whyItMatters?: string | null;
  rankScore?: number | null;
};

export type SearchResultDto = {
  results: FeedItemDto[];
  page: number;
  pageSize: number;
  total: number;
};
