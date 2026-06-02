export function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatPokedexId(id: number): string {
  return `#${String(id).padStart(4, '0')}`;
}

export function extractIdFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1] ?? '0', 10);
}

export function heightInMeters(decimeters: number): string {
  return `${(decimeters / 10).toFixed(1)} m`;
}

export function weightInKg(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1)} kg`;
}

export function getSpanishFlavorText(
  entries: { language: { name: string }; flavor_text: string }[],
): string {
  const es = entries.find((e) => e.language.name === 'es');
  const en = entries.find((e) => e.language.name === 'en');
  const text = (es ?? en)?.flavor_text ?? 'Sin descripción disponible.';
  return text.replace(/\f/g, ' ').replace(/\n/g, ' ');
}
