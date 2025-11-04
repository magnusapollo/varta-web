
export const isMock = () => process.env.NEXT_PUBLIC_USE_MOCKS !== 'false' && process.env.NEXT_PUBLIC_USE_MOCKS !== '0' && process.env.NEXT_PUBLIC_API_BASE !== 'force-live-no' && (process.env.NEXT_PUBLIC_USE_MOCKS ?? 'true') === 'true';
export function timeAgo(iso: string): string {
  const delta = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(delta/1000);
  const min = Math.floor(sec/60);
  const hr = Math.floor(min/60);
  const day = Math.floor(hr/24);
  if (day > 0) return `${day}d ago`;
  if (hr > 0) return `${hr}h ago`;
  if (min > 0) return `${min}m ago`;
  return `${sec}s ago`;
}
