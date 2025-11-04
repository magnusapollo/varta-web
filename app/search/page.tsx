
import { getDataClient } from '@/lib/data';
import { ArticleCard } from '@/components/article-card';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }){
  const q = searchParams.q ?? '';
  const data = getDataClient();
  const results = q ? await data.search(q) : [];
  const hl = (t:string) => q ? t.replace(new RegExp(q,'ig'), (m)=>`<mark>${m}</mark>`) : t;
  return (
    <div>
      <form className="mb-4">
        <input name="q" defaultValue={q} placeholder="Search…" className="h-10 w-full rounded-2xl border px-3 text-sm border-gray-300 dark:border-gray-700 bg-transparent" />
      </form>
      {results.length === 0 && q && <div>No results</div>}
      {results.map(r=> <div key={r.id} dangerouslySetInnerHTML={{ __html: `<div class='mb-1 text-lg font-semibold'><a href='/items/${r.slug}' class='underline'>${hl(r.title)}</a></div>` }} />)}
      {results.map(r=> <ArticleCard key={r.id+'card'} item={r} />)}
    </div>
  );
}
