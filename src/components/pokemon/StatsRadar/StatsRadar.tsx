import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { getStatValue } from '@/utils/statHelpers';
import { STAT_LABELS } from '@/utils/statHelpers';
import type { PokemonStat } from '@/types/pokemon.types';

const STAT_KEYS = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

interface StatsRadarProps {
  stats: PokemonStat[];
}

export function StatsRadar({ stats }: StatsRadarProps) {
  const data = STAT_KEYS.map((key) => ({
    stat: STAT_LABELS[key] ?? key,
    value: getStatValue(stats, key),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="stat" tick={{ fontSize: 11 }} />
        <Radar
          name="Stats"
          dataKey="value"
          stroke="#EF4444"
          fill="#EF4444"
          fillOpacity={0.35}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
