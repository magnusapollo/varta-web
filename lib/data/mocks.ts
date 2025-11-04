
import fs from 'node:fs/promises';
import path from 'node:path';
import { FeedItem, ItemDetail, PostMeta, SearchResult } from '@/lib/types';

const root = process.cwd();

const delay = (ms:number) => new Promise(res=>setTimeout(res, ms));

async function readJson<T>(p: string): Promise<T> {
  const full = path.join(root, 'fixtures', p);
  const buf = await fs.readFile(full, 'utf-8');
  return JSON.parse(buf) as T;
}

export function createMockClient() {
  return {
    async feed(_params?: { topics?: string[]; timeframe?: string; page?: number }) {
      await delay(120);
      const items = await readJson<FeedItem[]>('feed.json');
      // deterministic split: top = rank present; latest = rest sorted by recency
      const top = items.filter(i => i.rank).sort((a,b)=> (a.rank||999)-(b.rank||999)).slice(0,10);
      const latest = items.sort((a,b)=> new Date(b.published_at).getTime() - new Date(a.published_at).getTime()).slice(0,20);
      return { top, latest };
    },
    async item(slug: string) {
      await delay(80);
      return readJson<ItemDetail>(`items/${slug}.json`);
    },
    async posts() {
      await delay(60);
      return readJson<PostMeta[]>('posts.json');
    },
    async post(slug: string) {
      await delay(60);
      const mdxPath = path.join(root, 'fixtures', 'posts', `${slug}.mdx`);
      const metaList = await readJson<PostMeta[]>('posts.json');
      const meta = metaList.find(p => p.slug === slug);
      const mdx = await fs.readFile(mdxPath, 'utf-8');
      if (!meta) throw new Error('post not found');
      return { meta, mdx };
    },
    async search(q: string) {
      await delay(90);
      const index = await readJson<SearchResult[]>('search_index.json');
      const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      return index.filter(i => terms.every(t => i.title.toLowerCase().includes(t))).slice(0,20);
    }
  };
}
