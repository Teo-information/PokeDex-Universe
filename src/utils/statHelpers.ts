import type { PokemonStat } from '@/types/pokemon.types';

const STAT_MAX: Record<string, number> = {
  hp: 255,
  attack: 190,
  defense: 230,
  'special-attack': 194,
  'special-defense': 230,
  speed: 200,
};

export function getStatValue(stats: PokemonStat[], name: string): number {
  return stats.find((s) => s.stat.name === name)?.base_stat ?? 0;
}

export function getTotalStats(stats: PokemonStat[]): number {
  return stats.reduce((sum, s) => sum + s.base_stat, 0);
}

export function statBarPercent(statName: string, value: number): number {
  const max = STAT_MAX[statName] ?? 255;
  return Math.min(100, (value / max) * 100);
}

export function statBarColor(value: number): string {
  if (value >= 90) return 'bg-green-500';
  if (value >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

export const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
};
