import { NextRequest } from 'next/server';

export const runtime = 'nodejs';           // needed for streaming
export const dynamic = 'force-dynamic';    // don’t cache the proxy

export async function GET() {
  return new Response('OK', { status: 200 });
}

export async function POST(req: NextRequest) {
  const AGENT =
    process.env.NEXT_PUBLIC_AGENT_BASE || 'http://localhost:8090/agent/v1';

  const body = await req.text();

  const upstream = await fetch(`${AGENT}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body,
  });

  if (!upstream.ok || !upstream.body) {
    return new Response(`Upstream error: ${upstream.status}`, { status: 502 });
  }

  // Normalize headers for SSE passthrough
  const headers = new Headers();
  headers.set('Content-Type', 'text/event-stream');
  headers.set('Cache-Control', 'no-cache');
  headers.set('Connection', 'keep-alive');

  return new Response(upstream.body, { status: 200, headers });
}
