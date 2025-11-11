type Chunk = { token: string; citations?: {title:string; url:string}[] };
type Sample = { id: string; user: string; assistant: Chunk[] };

let loaded: Sample[] | null = null;

async function loadSamples(): Promise<Sample[]> {
  if (loaded) return loaded;
  const res = await fetch('/fixtures/chat_samples.json');
  loaded = await res.json();
  return loaded!;
}

export async function* mockTokenStream(prompt: string) {
  const samples = await loadSamples();
  const pick = samples[Math.abs(hash(prompt)) % samples.length];
  for (const chunk of pick.assistant) {
    await new Promise(r => setTimeout(r, 50));
    yield chunk;
  }
}

function hash(s:string){ let h=0; for (let i=0;i<s.length;i++) h=(h*31 + s.charCodeAt(i))|0; return h; }
