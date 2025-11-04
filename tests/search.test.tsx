
import { render, screen } from '@testing-library/react';
import SearchPage from '@/app/search/page';

vi.mock('@/lib/data', () => ({
  getDataClient: () => ({
    search: async () => ([{ id:'1', slug:'a', title:'alpha', source:'', source_url:'https://x', excerpt:'', tags:[], published_at:new Date().toISOString() }])
  })
}));

it('renders Search results', async () => {
  // @ts-ignore
  const ui = await SearchPage({ searchParams: { q: 'alp' } });
  render(ui as any);
  expect(screen.getByText(/alpha/i)).toBeInTheDocument();
});
