import type { SVGProps } from 'react';

type IconName =
  | 'book'
  | 'search'
  | 'arrow'
  | 'return'
  | 'chart'
  | 'sun'
  | 'moon'
  | 'check'
  | 'close'
  | 'bookmark'
  | 'info'
  | 'refresh';
const paths: Record<IconName, string> = {
  book: 'M12 6v15m0-15C9 3 5 3 2 4v16c3-1 7-1 10 1m0-15c3-3 7-3 10-2v16c-3-1-7-1-10 1',
  search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  return: 'M9 4 3 10l6 6M3 10h11a6 6 0 0 1 0 12',
  chart: 'M4 3v18h17M9 16v-5m5 5V7m5 9V4',
  sun: 'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
  moon: 'M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10',
  check: 'm5 12 4 4L19 6',
  close: 'm6 6 12 12M6 18 18 6',
  bookmark: 'M5 3h14v19l-7-5-7 5z',
  info: 'M12 11v6m0-10v1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  refresh: 'M20 8a8 8 0 1 0 1 7M20 2v6h-6',
};

export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
