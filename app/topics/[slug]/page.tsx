
import { getDataClient } from '@/lib/data';
import { ArticleCard } from '@/components/article-card';

export const revalidate = 300;

export default async function TopicPage({ params }: { params: { slug: string } }){
  const data = getDataClient();
  const feed = await data.feed({ topics: [params.slug] });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Topic: {params.slug}</h1>
      {feed.latest.map(i=> <ArticleCard key={i.id} item={i} />)}
    </div>
  );
}
