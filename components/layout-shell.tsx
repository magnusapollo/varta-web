
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LayoutShell({ children }: { children: React.ReactNode }){
  const pathname = usePathname();
  const tabs = [
    { href: '/', label: 'Home' },
    { href: '/topics/ai', label: 'Topics' },
    { href: '/posts', label: 'Posts' },
    { href: '/search', label: 'Search' },
    { href: '/chat', label: 'Chat' }
  ];
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-white/80 dark:bg-gray-950/60 backdrop-blur">
        <div className="mx-auto max-w-6xl flex items-center justify-between p-4">
          <Link href="/" className="text-lg font-bold">Varta</Link>
          <nav className="flex gap-2">
            {tabs.map(t => (
              <Link key={t.href} href={t.href}>
                <Button variant={pathname===t.href ? 'default' : 'ghost'} size="sm">{t.label}</Button>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">
        {children}
      </main>
      <footer className="mx-auto max-w-6xl p-4 text-sm opacity-70">© Varta</footer>
    </div>
  );
}
