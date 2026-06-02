import { typeColor } from '@/utils/colorMap';
import { formatPokemonName } from '@/utils/formatters';
import { cn } from '@/utils/cn';

interface TypeBadgeProps {
  type: string;
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase text-white',
        className,
      )}
      style={{ backgroundColor: typeColor(type) }}
    >
      {formatPokemonName(type)}
    </span>
  );
}
