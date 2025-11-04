
import { getDataClient } from '@/lib/data';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default async function PostsPage(){
  const data = getDataClient();
  const posts = await data.posts();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <ul className="space-y-3">
        {posts.map(p=> (
          <li key={p.slug} className="flex items-center gap-2">
            <Link className="underline" href={`/posts/${p.slug}`}>{p.title}</Link>
            <span className="text-xs opacity-60">{new Date(p.published_at).toLocaleDateString()}</span>
            <div className="flex gap-1">{p.tags.map(t=> <Badge key={t}>{t}</Badge>)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
