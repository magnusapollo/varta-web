
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { streamAnswer } from '@/lib/chat/sse-client';

export default function ChatPanel(){
  const [prompt, setPrompt] = useState('What happened in AI this week?');
  const [answer, setAnswer] = useState('');
  const [cites, setCites] = useState<{title:string;url:string}[]>([]);

  async function onAsk(e: React.FormEvent){
    e.preventDefault();
    setAnswer('');
    setCites([]);
    await streamAnswer(prompt, (t)=> setAnswer(a=>a+t), (c)=> setCites(c));
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-3">
        <h3 className="font-semibold mb-2">Conversations</h3>
        <div className="space-y-2 text-sm opacity-80">
          <div>Welcome</div>
          <div>AI Roundup</div>
          <div>Security Brief</div>
        </div>
      </div>
      <div className="col-span-6">
        <div className="rounded-2xl border p-4 min-h-[300px] whitespace-pre-wrap">{answer || 'Ask a question to begin…'}</div>
        <form onSubmit={onAsk} className="mt-3 flex gap-2">
          <Input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Ask anything..." />
          <Button type="submit">Ask</Button>
        </form>
      </div>
      <div className="col-span-3">
        <h3 className="font-semibold mb-2">Citations</h3>
        <ul className="text-sm space-y-1">
          {cites.map((c,i)=> <li key={i}><a className="underline" href={c.url} target="_blank">{c.title}</a></li>)}
        </ul>
      </div>
    </div>
  );
}
