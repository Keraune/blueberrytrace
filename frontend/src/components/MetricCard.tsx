import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { numberCompact } from '../lib/format';

interface MetricCardProps {
  label: string;
  value: number;
  detail: string;
  icon: ReactNode;
  tone?: 'green' | 'blue' | 'purple' | 'orange';
}

export function MetricCard({ label, value, detail, icon, tone = 'green' }: MetricCardProps) {
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <div className="metric-card__header">
        <span className="metric-card__icon">{icon}</span>
        <span className="metric-card__trend"><ArrowUpRight size={15} /> Operativo</span>
      </div>
      <p>{label}</p>
      <strong>{numberCompact(value)}</strong>
      <small>{detail}</small>
    </article>
  );
}
