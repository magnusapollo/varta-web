'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { streamAnswer2 } from '@/lib/chat/sse-client';

type ChatMsg = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: { title: string; url: string }[];
};

export default function ChatPanel() {
  const [prompt, setPrompt] = useState('What happened in AI this week?');
  const [messages, setMessages] = useState<ChatMsg[]>([]);

  async function onAsk(e: React.FormEvent) {
    e.preventDefault();

    // 1) push the user message
    const userMsg: ChatMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt,
    };
    // 2) push an empty assistant message we will stream into
    const asstMsg: ChatMsg = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      citations: [],
    };
    setMessages((m) => [...m, userMsg, asstMsg]);
    setPrompt('');

    // 3) stream tokens into the last assistant message
    await streamAnswer2(
      userMsg.content,
      (token) => {
        setMessages((m) => {
          const copy = [...m];
          const lastIdx = copy.length - 1;
          if (lastIdx >= 0 && copy[lastIdx].role === 'assistant') {
            copy[lastIdx] = {
              ...copy[lastIdx],
              content: copy[lastIdx].content + token,
            };
          }
          return copy;
        });
      },
      (cites) => {
        setMessages((m) => {
          const copy = [...m];
          const lastIdx = copy.length - 1;
          if (lastIdx >= 0 && copy[lastIdx].role === 'assistant') {
            copy[lastIdx] = {
              ...copy[lastIdx],
              citations: cites,
            };
          }
          return copy;
        });
      }
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Left column: conversations (static for now) */}
      <div className="col-span-3">
        <h3 className="font-semibold mb-2">Conversations</h3>
        <div className="space-y-2 text-sm opacity-80">
          <div>Welcome</div>
          <div>AI Roundup</div>
          <div>Security Brief</div>
        </div>
      </div>

      {/* Middle: chat history */}
      <div className="col-span-6">
        <div className="rounded-2xl border p-4 min-h-[300px] space-y-4">
          {messages.length === 0 ? (
            <div className="opacity-60">Ask a question to begin…</div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className="flex">
                <div
                  className={[
                    'max-w-[85%] rounded-2xl px-4 py-2 whitespace-pre-wrap',
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted text-foreground',
                  ].join(' ')}
                >
                  {m.content || (m.role === 'assistant' ? '…' : null)}
                  {m.role === 'assistant' && m.citations && m.citations.length > 0 && (
                    <ul className="mt-2 text-xs underline space-y-1">
                      {m.citations.map((c, i) => (
                        <li key={i}>
                          <a href={c.url} target="_blank" rel="noreferrer">
                            {c.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={onAsk} className="mt-3 flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything..."
          />
          <Button type="submit">Ask</Button>
        </form>
      </div>

      {/* Right: latest citations (optional — mirrors the last assistant) */}
      <div className="col-span-3">
        <h3 className="font-semibold mb-2">Citations</h3>
        <ul className="text-sm space-y-1">
          {(messages[messages.length - 1]?.citations ?? []).map((c, i) => (
            <li key={i}>
              <a className="underline" href={c.url} target="_blank" rel="noreferrer">
                {c.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
