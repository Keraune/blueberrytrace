interface StatusBadgeProps {
  value?: string | null;
}

const positive = new Set(['ACTIVO', 'ACTIVA', 'VALIDADA', 'APROBADO', 'CERRADO', 'REGISTRADA']);
const warning = new Set(['PENDIENTE', 'OBSERVADO', 'MANTENIMIENTO']);

export function StatusBadge({ value }: StatusBadgeProps) {
  const label = value || 'SIN ESTADO';
  const normalized = label.toUpperCase();
  const tone = positive.has(normalized) ? 'success' : warning.has(normalized) ? 'warning' : 'neutral';

  return <span className={`status-badge status-badge--${tone}`}>{label}</span>;
}
