import { cn } from '@/utils/cn';
import type { HTMLAttributes } from 'react';

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-card border border-border bg-background-secondary shadow-card',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
