
import { getDataClient } from '@/lib/data';
import { ArticleCard } from '@/components/article-card';
import { FiltersBar } from '@/components/filters-bar';

export const revalidate = 300;

export default async function HomePage(){
  const data = getDataClient();
  const { top, latest } = await data.feed();
  return (
    <div>
      <FiltersBar />
      <h2 className="text-xl font-semibold mb-2">Top</h2>
      {top.map(i=> <ArticleCard key={i.id} item={i} />)}
      <h2 className="text-xl font-semibold mt-6 mb-2">Latest</h2>
      {latest.map(i=> <ArticleCard key={i.id} item={i} />)}
    </div>
  );
}
