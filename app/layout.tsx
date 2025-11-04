
import '../styles/globals.css';
import type { Metadata } from 'next';
import LayoutShell from '@/components/layout-shell';

export const metadata: Metadata = {
  title: 'Varta',
  description: 'AI news, curated with insight.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
