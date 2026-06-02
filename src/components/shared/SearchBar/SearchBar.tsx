import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { InputHTMLAttributes } from 'react';

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: 'md' | 'lg';
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar Pokémon...',
  size = 'md',
  className,
  ...inputProps
}: SearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        className={cn(
          'absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary',
          size === 'lg' ? 'h-5 w-5' : 'h-4 w-4',
        )}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        {...inputProps}
        className={cn(
          'w-full rounded-xl border border-border bg-background-secondary pl-10 pr-4 text-foreground placeholder:text-foreground-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20',
          size === 'lg' ? 'py-4 text-lg' : 'py-2.5 text-sm',
        )}
      />
    </div>
  );
}
