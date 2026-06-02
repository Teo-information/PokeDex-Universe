import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Heart, Circle } from 'lucide-react';
import { useState } from 'react';
import { useUiStore } from '@/store/uiStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useCompareStore } from '@/store/compareStore';
import { SearchBar } from '@/components/shared/SearchBar/SearchBar';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/utils/cn';

const NAV_LINKS = [
  { to: '/catalog', label: 'Catálogo' },
  { to: '/compare', label: 'Comparar' },
  { to: '/favorites', label: 'Favoritos' },
  { to: '/berries', label: 'Bayas' },
  { to: '/items', label: 'Objetos' },
  { to: '/moves', label: 'Movimientos' },
];

export function Navbar() {
  const { theme, toggleTheme } = useUiStore();
  const favoriteCount = useFavoritesStore((s) => s.ids.length);
  const compareCount = useCompareStore((s) => s.slots.filter(Boolean).length);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const handleSearch = () => {
    if (debouncedSearch.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(debouncedSearch.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background-secondary/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-bold text-foreground">
          <Circle className="h-6 w-6 fill-accent text-accent" />
          <span className="hidden sm:inline">PokeDex Universe</span>
        </Link>

        <nav className="hidden flex-1 justify-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground-secondary transition-colors hover:bg-background-tertiary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden w-48 md:block lg:w-56">
          <SearchBar
            value={search}
            onChange={setSearch}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Buscar..."
            size="md"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/favorites"
            className="relative rounded-lg p-2 hover:bg-background-tertiary"
            aria-label="Favoritos"
          >
            <Heart className="h-5 w-5" />
            {favoriteCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-white">
                {favoriteCount}
              </span>
            )}
          </Link>
          <Link
            to="/compare"
            className={cn(
              'rounded-lg px-2 py-1 text-sm font-medium',
              compareCount > 0 ? 'bg-accent/10 text-accent' : 'hover:bg-background-tertiary',
            )}
          >
            vs {compareCount}/4
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 hover:bg-background-tertiary"
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
