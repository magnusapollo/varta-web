
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
    const text = decoder.decode(value);
    // naive SSE parse: lines starting with "data: "
    for (const line of text.split('\n')) {
      if (line.startsWith('data: ')) {
        const payload = line.slice(6);
        try {
          const evt = JSON.parse(payload);
          if (evt.content) onToken(evt.content);
          if (evt.citations && onCitations) onCitations(evt.citations);
        } catch {}
      }
    }
    if (done) break;
  }
}

export async function streamAnswer2(
  prompt: string,
  onToken: (t: string) => void,
  onCitations?: (c: { title: string; url: string }[]) => void
) {
  if (useMocks) {
    for await (const chunk of mockTokenStream(prompt)) {
      onToken(chunk.token);
      if (chunk.citations && onCitations) onCitations(chunk.citations);
    }
    return;
  }

  const res = await fetch(PROXY, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'accept': 'text/event-stream',
    },
    // match your backend ChatRequest shape
    body: JSON.stringify({ message: prompt, role: 'user' }),
    // helps some runtimes and proxies avoid buffering
    cache: 'no-store',
  });
  if (!res.body) throw new Error('No body');

  const reader = res.body.getReader();
  const decoder = new TextDecoder(); // we’ll pass {stream:true} on decode
  let buffer = '';

  let eventType: string | null = null;
  let eventDataLines: string[] = [];

  const dispatch = () => {
    const dataStr = eventDataLines.join('\n');
    try {
      const evt = dataStr ? JSON.parse(dataStr) : {};
      // Route by event type when available; fall back to payload shape
      if (eventType === 'token' || evt.token) {
        if (evt.content) onToken(evt.content);
      } else if (eventType === 'citations' || evt.citations) {
        if (evt.citations && onCitations) onCitations(evt.citations);
      } else if (eventType === 'done') {
        // optional: you could break out early here
      }
    } catch {
      // swallow malformed partial JSON; real ones come once complete
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Process complete SSE frames separated by \n\n (or \r\n\r\n)
    let sepIndex: number;
    // Loop to handle multiple events in one buffer
    while ((sepIndex = buffer.search(/\r?\n\r?\n/)) !== -1) {
      const rawEvent = buffer.slice(0, sepIndex);
      buffer = buffer.slice(sepIndex + (buffer[sepIndex] === '\r' ? 4 : 2)); // handle CRLF or LF

      // Parse lines within the event
      eventType = null;
      eventDataLines = [];
      for (const line of rawEvent.split(/\r?\n/)) {
        
        if (line.startsWith('event:')) {
          eventType = line.slice(6).trim();
        } else if (line.startsWith('data:')) {
          eventDataLines.push(line.slice(5).trimStart());

        } // ignore id:, retry:, comments, etc.
      }
      dispatch();
    }

    // If buffer gets huge without separators, trim (defensive)
    if (buffer.length > 1 << 20) buffer = buffer.slice(-1 << 20);
  }

  // Flush any trailing text if the server ended without a final separator
  if (buffer.trim().length) {
    const trailing = buffer.split(/\r?\n/);
    for (const line of trailing) {
      if (line.startsWith('data:')) {
        try {
          const evt = JSON.parse(line.slice(5).trimStart());
          if (evt.content) onToken(evt.content);
          if (evt.citations && onCitations) onCitations(evt.citations);
        } catch {}
      }
    }
  }
}

