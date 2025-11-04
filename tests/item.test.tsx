
import { render, screen } from '@testing-library/react';
import ItemPage from '@/app/items/[slug]/page';

vi.mock('@/lib/data', () => ({
  getDataClient: () => ({
    item: async () => ({ title:'Item Title', source_url:'https://x', published_at:new Date().toISOString(), summary_md:'- point', tags:[], related:[] })
  })
}));

it('renders Item with summary', async () => {
  // @ts-ignore
  const ui = await ItemPage({ params: { slug: 'x' } });
  render(ui as any);
  expect(screen.getByText('Item Title')).toBeInTheDocument();
});
