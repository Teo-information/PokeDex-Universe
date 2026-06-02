import { cn } from '@/utils/cn';

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent',
        className,
      )}
      role="status"
      aria-label="Cargando"
    />
  );
}
