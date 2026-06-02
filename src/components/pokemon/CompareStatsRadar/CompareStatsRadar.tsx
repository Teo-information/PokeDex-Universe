import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { getStatValue, STAT_LABELS } from '@/utils/statHelpers';
import { formatPokemonName } from '@/utils/formatters';
import type { PokemonStat } from '@/types/pokemon.types';

const STAT_KEYS = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

export const COMPARE_RADAR_COLORS = ['#EF4444', '#3B82F6', '#22C55E', '#F59E0B'] as const;

export interface CompareRadarSeries {
  id: number;
  name: string;
  stats: PokemonStat[];
  color?: string;
}

interface CompareStatsRadarProps {
  series: CompareRadarSeries[];
}

export function CompareStatsRadar({ series }: CompareStatsRadarProps) {
  if (series.length === 0) return null;

  const data = STAT_KEYS.map((key) => {
    const row: Record<string, string | number> = {
      stat: STAT_LABELS[key] ?? key,
    };
    series.forEach((s) => {
      row[s.name] = getStatValue(s.stats, key);
    });
    return row;
  });

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="var(--color-border)" />
          <PolarAngleAxis dataKey="stat" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: 16 }}
            formatter={(value) => formatPokemonName(String(value))}
          />
          {series.map((s, index) => {
            const color = s.color ?? COMPARE_RADAR_COLORS[index % COMPARE_RADAR_COLORS.length];
            return (
              <Radar
                key={s.id}
                name={s.name}
                dataKey={s.name}
                stroke={color}
                fill={color}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            );
          })}
        </RadarChart>
      </ResponsiveContainer>
      <ul className="mt-4 flex flex-wrap justify-center gap-4">
        {series.map((s, index) => {
          const color = s.color ?? COMPARE_RADAR_COLORS[index % COMPARE_RADAR_COLORS.length];
          return (
            <li key={s.id} className="flex items-center gap-2 text-sm">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
                aria-hidden
              />
              <span className="font-medium">{formatPokemonName(s.name)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
