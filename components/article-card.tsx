// components/article-card.tsx
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { timeAgo } from '@/lib/utils';
import type { FeedItem } from '@/lib/types';

export function ArticleCard({ item }: { item: FeedItem }) {
  const host = (() => {
    try {
      return new URL(item.source_url).hostname;
    } catch {
      return item.source || 'source';
    }
  })();

  return (
    <Card className="mb-3">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <Link href={`/items/${item.slug}`} className="text-lg font-semibold hover:underline">
            {item.title}
          </Link>
          <a href={item.source_url} target="_blank" className="text-xs underline opacity-70">
            {host}
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <p className="opacity-80 line-clamp-2">{item.excerpt}</p>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {item.tags.slice(0, 4).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
          <span className="text-xs opacity-70 ml-auto">{timeAgo(item.published_at)}</span>
          {item.why && <Badge>Why it matters</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}
