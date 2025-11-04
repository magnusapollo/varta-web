
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

vi.mock('@/lib/data', () => ({
  getDataClient: () => ({
    feed: async () => ({ top: [{ id:'1', slug:'a', title:'A', source:'', source_url:'https://x', excerpt:'', tags:[], published_at:new Date().toISOString() }], latest: [] })
  })
}));

it('renders Home with Top section', async () => {
  // @ts-ignore
  const ui = await HomePage();
  render(ui as any);
  expect(screen.getByText('Top')).toBeInTheDocument();
});
