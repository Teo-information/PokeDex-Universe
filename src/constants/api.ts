export const POKEAPI_BASE_URL =
  import.meta.env.VITE_POKEAPI_BASE_URL ?? 'https://pokeapi.co/api/v2';

export const POKEMON_SPRITES_URL =
  import.meta.env.VITE_POKEMON_SPRITES_URL ??
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export const DEFAULT_PAGE_SIZE = 20;
export const STALE_TIME_MS = 5 * 60 * 1000;
