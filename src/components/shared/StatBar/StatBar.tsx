import { useEffect, useRef, useState } from 'react';
import { statBarColor, statBarPercent } from '@/utils/statHelpers';
import { cn } from '@/utils/cn';

interface StatBarProps {
  label: string;
  value: number;
  statName: string;
}

export function StatBar({ label, value, statName }: StatBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const percent = statBarPercent(statName, value);

  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-foreground-secondary">{label}</span>
        <span className="font-mono font-medium">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-background-tertiary">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', statBarColor(value))}
          style={{ width: visible ? `${percent}%` : '0%' }}
        />
      </div>
    </div>
  );
}
