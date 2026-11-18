import type { ReactNode } from 'react';

interface ComicGridProps {
  columns?: 2 | 3 | 'asymmetric';
  className?: string;
  children: ReactNode;
}

const columnClasses: Record<NonNullable<ComicGridProps['columns']>, string> = {
  2: 'grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8',
  3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  asymmetric: 'grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8',
};

export function ComicGrid({
  columns = 2,
  className = '',
  children,
}: ComicGridProps) {
  return <div className={`${columnClasses[columns]} ${className}`}>{children}</div>;
}
