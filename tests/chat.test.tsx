
import { streamAnswer } from '@/lib/chat/sse-client';

it('streams mock tokens', async () => {
  let out = '';
  await streamAnswer('hello', (t)=> out+=t);
  expect(out.length).toBeGreaterThan(0);
});
