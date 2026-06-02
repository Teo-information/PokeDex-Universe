import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from '@/components/shared/SearchBar/SearchBar';
import { TypeBadge } from '@/components/shared/TypeBadge/TypeBadge';
import { PokemonGrid } from '@/components/pokemon/PokemonGrid/PokemonGrid';
import { POKEMON_TYPES } from '@/constants/types';
import { getPokemonList } from '@/services/pokemonService';
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { extractIdFromUrl } from '@/utils/formatters';
import { Card } from '@/components/shared/Card/Card';

export function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search);

  const { data: listData } = useQuery({
    queryKey: ['pokemon-list-home'],
    queryFn: () => getPokemonList(151, 0),
  });

  const featured = useMemo(() => {
    if (!listData?.results) return [];
    const shuffled = [...listData.results].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 8).map((r) => ({
      id: extractIdFromUrl(r.url),
      name: r.name,
    }));
  }, [listData]);

  const suggestions = useMemo(() => {
    if (!debounced || debounced.length < 2 || !listData?.results) return [];
    const q = debounced.toLowerCase();
    return listData.results
      .filter((r) => r.name.includes(q))
      .slice(0, 8)
      .map((r) => ({ id: extractIdFromUrl(r.url), name: r.name }));
  }, [debounced, listData]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          Explora el universo Pokémon
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-foreground-secondary">
          Catálogo interactivo con filtros, comparador, evoluciones y más — powered by PokeAPI.
        </p>
        <div className="relative mx-auto max-w-xl">
          <SearchBar value={search} onChange={setSearch} size="lg" />
          {suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-border bg-background-secondary shadow-lg">
              {suggestions.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left hover:bg-background-tertiary"
                    onClick={() => navigate(`/pokemon/${s.id}`)}
                  >
                    #{String(s.id).padStart(3, '0')} — {s.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.section>

      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">Tipos</h2>
        <div className="flex flex-wrap gap-2">
          {POKEMON_TYPES.map((type) => (
            <Link key={type} to={`/catalog?type=${type}`}>
              <TypeBadge type={type} className="cursor-pointer transition-transform hover:scale-105" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-16 grid gap-4 sm:grid-cols-3">
        <Link to="/berries">
          <Card className="p-6 transition-shadow hover:shadow-card-hover">
            <h3 className="font-semibold">Bayas</h3>
            <p className="text-sm text-foreground-secondary">64 bayas con filtros</p>
          </Card>
        </Link>
        <Link to="/items">
          <Card className="p-6 transition-shadow hover:shadow-card-hover">
            <h3 className="font-semibold">Objetos</h3>
            <p className="text-sm text-foreground-secondary">Catálogo paginado</p>
          </Card>
        </Link>
        <Link to="/moves">
          <Card className="p-6 transition-shadow hover:shadow-card-hover">
            <h3 className="font-semibold">Movimientos</h3>
            <p className="text-sm text-foreground-secondary">Potencia, tipo, PP</p>
          </Card>
        </Link>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold">Destacados</h2>
        {featured.length > 0 && <PokemonGrid names={featured} />}
      </section>
    </div>
  );
}
