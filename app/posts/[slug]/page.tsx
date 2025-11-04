
import { getDataClient } from '@/lib/data';
import MDXContent from '@/components/mdx-content';

export default async function PostPage({ params }: { params: { slug: string } }){
  const data = getDataClient();
  const { meta, mdx } = await data.post(params.slug);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <div className="text-sm opacity-70 mb-4">{new Date(meta.published_at).toLocaleDateString()}</div>
      <MDXContent source={mdx} />
    </div>
  );
}
