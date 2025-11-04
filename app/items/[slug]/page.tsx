
import { getDataClient } from '@/lib/data';
import MDXContent from '@/components/mdx-content';
import { Badge } from '@/components/ui/badge';

export const revalidate = 300;

export default async function ItemPage({ params }: { params: { slug: string } }){
  const data = getDataClient();
  const item = await data.item(params.slug);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
      <div className="text-sm opacity-80 mb-4 flex items-center gap-2">
        <a className="underline" href={item.source_url} target="_blank">{new URL(item.source_url).hostname}</a>
        <span>•</span>
        <span>{new Date(item.published_at).toLocaleString()}</span>
      </div>
      {item.why && <div className="mb-3"><Badge>Why it matters</Badge></div>}
      <section className="prose dark:prose-invert">
        <MDXContent source={item.summary_md} />
      </section>
      <div className="mt-4 flex flex-wrap gap-2">{item.tags.map(t=> <Badge key={t}>{t}</Badge>)}</div>
      <h3 className="text-xl font-semibold mt-6 mb-2">Related</h3>
      <ul className="list-disc pl-6">
        {item.related.map(r=> <li key={r.id}><a className="underline" href={`/items/${r.slug}`}>{r.title}</a></li>)}
      </ul>
    </div>
  );
}
