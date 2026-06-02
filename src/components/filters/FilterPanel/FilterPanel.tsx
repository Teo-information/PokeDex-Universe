import { GENERATIONS } from '@/constants/generations';
import { POKEMON_TYPES } from '@/constants/types';
import { useFilterStore } from '@/store/filterStore';
import { TypeBadge } from '@/components/shared/TypeBadge/TypeBadge';
import { Button } from '@/components/shared/Button/Button';

export function FilterPanel() {
  const {
    types,
    typeMatchMode,
    generation,
    favoritesOnly,
    toggleType,
    setTypeMatchMode,
    setGeneration,
    setFavoritesOnly,
    resetFilters,
  } = useFilterStore();

  return (
    <aside className="space-y-6 rounded-card border border-border bg-background-secondary p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filtros</h2>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Limpiar
        </Button>
      </div>

      <section>
        <h3 className="mb-2 text-sm font-medium text-foreground-secondary">Tipos (máx. 2)</h3>
        <div className="mb-2 flex gap-2">
          <button
            type="button"
            onClick={() => setTypeMatchMode('any')}
            className={`rounded px-2 py-1 text-xs ${typeMatchMode === 'any' ? 'bg-accent text-white' : 'bg-background-tertiary'}`}
          >
            Cualquiera
          </button>
          <button
            type="button"
            onClick={() => setTypeMatchMode('all')}
            className={`rounded px-2 py-1 text-xs ${typeMatchMode === 'all' ? 'bg-accent text-white' : 'bg-background-tertiary'}`}
          >
            Ambos
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {POKEMON_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className={`rounded-full ring-2 ring-offset-1 ring-offset-background-secondary transition-all ${
                types.includes(type) ? 'ring-accent' : 'ring-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <TypeBadge type={type} />
            </button>
          ))}
        </div>
      </section>

      <section>
        <label className="mb-2 block text-sm font-medium text-foreground-secondary">
          Generación
        </label>
        <select
          value={generation ?? ''}
          onChange={(e) =>
            setGeneration(e.target.value ? parseInt(e.target.value, 10) : null)
          }
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">Todas</option>
          {GENERATIONS.map((g) => (
            <option key={g.id} value={g.id}>
              {g.label}
            </option>
          ))}
        </select>
      </section>

      <section>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(e) => setFavoritesOnly(e.target.checked)}
          />
          Solo favoritos
        </label>
      </section>
    </aside>
  );
}
