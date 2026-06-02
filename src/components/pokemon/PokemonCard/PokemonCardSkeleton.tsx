export function PokemonCardSkeleton() {
  return (
    <div className="h-64 animate-pulse rounded-card border border-border bg-background-tertiary">
      <div className="mx-auto mt-8 h-28 w-28 rounded-full bg-border" />
      <div className="mx-auto mt-4 h-4 w-24 rounded bg-border" />
    </div>
  );
}
