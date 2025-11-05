// app/page.tsx
import { getDataClient } from '@/lib/data';
import { ArticleCard } from '@/components/article-card';
import { FiltersBar } from '@/components/filters-bar';

export const revalidate = 300;

// Normalize UI → API values
function normalizeTimeframe(tf?: string) {
  // Accept 24h | 7d | 30d; default 7d
  if (tf === '24h' || tf === '7d' || tf === '30d') return tf;
  return '7d';
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { tf?: string; topic?: string; page?: string };
}) {
  const data = getDataClient();

  const timeframe = normalizeTimeframe(searchParams?.tf);
  const topic = (searchParams?.topic ?? '').trim();
  const page = Number(searchParams?.page ?? '1') || 1;

  // Build params only with defined values
  const params: { topics?: string[]; timeframe?: string; page?: number } = {
    timeframe,
    page,
  };
  if (topic) params.topics = [topic];

  const { top, latest } = await data.feed(params);

  return (
    <div>
      <FiltersBar />
      <h2 className="text-xl font-semibold mb-2">Top</h2>
      {top.length === 0 && (
        <div className="opacity-70 text-sm mb-2">No top items.</div>
      )}
      {top.map((i) => (
        <ArticleCard key={i.id ?? i.slug} item={i} />
      ))}

      <h2 className="text-xl font-semibold mt-6 mb-2">Latest</h2>
      {latest.length === 0 && (
        <div className="opacity-70 text-sm">No latest items.</div>
      )}
      {latest.map((i) => (
        <ArticleCard key={(i.id ?? i.slug) + '-latest'} item={i} />
      ))}
    </div>
  );
}
