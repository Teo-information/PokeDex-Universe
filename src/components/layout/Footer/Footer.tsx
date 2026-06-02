export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background-secondary py-8">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-foreground-secondary">
        <p>
          PokeDex Universe — Datos de{' '}
          <a
            href="https://pokeapi.co"
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            PokeAPI
          </a>
        </p>
        <p className="mt-1">Proyecto educativo. Pokémon © Nintendo / Game Freak.</p>
      </div>
    </footer>
  );
}
