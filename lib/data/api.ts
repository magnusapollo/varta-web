// lib/data/api.ts
import {
  FeedItem,
  ItemDetail,
  PostMeta,
  SearchResult,
  FeedItemDto,
  SearchResultDto,
} from '@/lib/types';

const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1';

async function get<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { accept: 'application/json' },
    next: { revalidate: 300 },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json();
}

const mapDtoToFeedItem = (d: FeedItemDto): FeedItem => ({
  id: d.id,
  slug: d.slug,
  title: d.title,
  source: d.source?.name ?? new URL(d.url).hostname,
  source_url: d.url,
  excerpt: d.excerpt,
  tags: d.topics ?? [],
  published_at: d.publishedAt,
  rank: typeof d.rankScore === 'number' ? d.rankScore : undefined,
  why: d.whyItMatters ?? undefined,
  topics: d.topics ?? [],
});

const bulletsToMDX = (bullets?: string) => {
  if (!bullets) return '';
  // Accept either newline-separated or already "• " prefixed text
  const lines = bullets
    .split(/\r?\n/)
    .map((s) => s.replace(/^\s*[•\-]\s?/, '').trim())
    .filter(Boolean);
  if (!lines.length) return '';
  return lines.map((l) => `- ${l}`).join('\n');
};

export function createApiClient() {
  return {
    // Expect /feed to return SearchResultDto (wrapper)
    async feed(params?: { topics?: string[]; timeframe?: string; page?: number }) {
      const q = new URLSearchParams();
      console.log("here "+JSON.stringify(params))
      if (params?.topics?.length) q.set('topics', params.topics.join(','));
      if (params?.timeframe) q.set('since', `P${params.timeframe}`);
      if (params?.page) q.set('page', String(params.page));


      // If your backend path differs, adjust here.
      const payload = (await get<SearchResultDto>(`/feed?${q.toString()}`)) ?? {
        results: [],
        page: 1,
        pageSize: 0,
        total: 0,
      };

      const items = (payload.results ?? []).map(mapDtoToFeedItem);

      // Our UI expects { top, latest }. We’ll synthesize:
      const top = [...items]
        .filter((i) => typeof i.rank === 'number')
        .sort((a, b) => (a.rank! - b.rank!))
        .slice(0, 10);

      const latest = [...items].sort(
        (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
      );

      return { top, latest };
    },

    // Expect /items/{slug} to return a single FeedItemDto or an enriched object.
    // We’ll map to ItemDetail expected by the Item page.
    async item(slug: string) {
      const dto = await get<FeedItemDto | (FeedItemDto & { related?: FeedItemDto[] })>(`/items/${slug}`);
      const base = mapDtoToFeedItem(dto as FeedItemDto);
      const relatedDtos = (dto as any)?.related ?? [];
      const related: FeedItem[] = Array.isArray(relatedDtos)
        ? relatedDtos.map(mapDtoToFeedItem).slice(0, 5)
        : [];
      const summary_md = bulletsToMDX((dto as any).summaryBullets);

      const detail: ItemDetail = {
        ...base,
        summary_md,
        entities: [], // optional until backend provides
        related,
      };
      return detail;
    },

    // If you expose posts from the backend, map them here. For now, keep as-is (fixtures/MDX in mock mode).
    async posts() {
      return get<PostMeta[]>(`/posts`);
    },

    async post(slug: string) {
      return get<{ meta: PostMeta; mdx: string }>(`/posts/${slug}`);
    },

    // Expect /search to return SearchResultDto as well.
    async search(q: string) {
      const payload = await get<SearchResultDto>(`/search?q=${encodeURIComponent(q)}`);
      return (payload.results ?? []).map(mapDtoToFeedItem) as SearchResult[];
    },
  };
}
