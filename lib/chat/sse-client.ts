
import { mockTokenStream } from './mock-stream';

const AGENT = process.env.NEXT_PUBLIC_AGENT_BASE || 'http://localhost:8090/agent/v1';
const useMocks = (process.env.NEXT_PUBLIC_USE_MOCKS ?? 'true') === 'true';
const PROXY = '/api/agent/chat';

export async function streamAnswer(prompt: string, onToken: (t: string) => void, onCitations?: (c: {title:string; url:string}[])=>void) {
  if (useMocks) {
    for await (const chunk of mockTokenStream(prompt)) {
      onToken(chunk.token);
      if (chunk.citations && onCitations) onCitations(chunk.citations);
    }
    return;
  }
  const res = await fetch(PROXY, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'accept': 'text/event-stream' },
    body: JSON.stringify({ message: prompt, role: 'user' })
  });
  if (!res.body) throw new Error('No body');
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value);
    // naive SSE parse: lines starting with "data: "
    for (const line of text.split('\n')) {
      if (line.startsWith('data: ')) {
        const payload = line.slice(6);
        try {
          const evt = JSON.parse(payload);
          if (evt.token) onToken(evt.token);
          if (evt.citations && onCitations) onCitations(evt.citations);
        } catch {}
      }
    }
  }
}
