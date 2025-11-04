
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function FiltersBar() {
  const sp = useSearchParams();
  const router = useRouter();
  const timeframe = sp.get('tf') ?? '7d';
  const topic = sp.get('topic') ?? '';

  function setParam(key:string, val:string){
    const p = new URLSearchParams(sp);
    p.set(key, val);
    router.push(`?${p.toString()}`);
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <label className="text-sm">Topic</label>
      <Input defaultValue={topic} placeholder="ai, security..." onBlur={(e)=>setParam('topic', e.target.value)} className="w-40" />
      <label className="text-sm ml-2">Timeframe</label>
      <select className="h-10 rounded-2xl border px-3 text-sm bg-transparent" value={timeframe} onChange={e=>setParam('tf', e.target.value)}>
        <option value="24h">24h</option>
        <option value="7d">7d</option>
        <option value="30d">30d</option>
      </select>
      <Button variant="outline" className="ml-auto" title="Source type disabled">Source type (soon)</Button>
    </div>
  );
}
