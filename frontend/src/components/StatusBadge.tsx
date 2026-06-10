interface StatusBadgeProps {
  value?: string | null;
}

const success = new Set(['ACTIVO', 'ACTIVA', 'VALIDADA', 'APROBADO', 'CERRADO', 'REGISTRADO', 'REGISTRADA', 'COMPLETADO']);
const warning = new Set(['PENDIENTE', 'OBSERVADO', 'OBSERVADA', 'MANTENIMIENTO', 'INICIADO']);
const info = new Set(['EN PROCESO', 'EN_PROCESO', 'TRANSITO', 'EN TRÁNSITO', 'EN_TRÁNSITO']);
const danger = new Set(['INACTIVO', 'INACTIVA', 'RECHAZADO', 'DESCARTE']);

export function StatusBadge({ value }: StatusBadgeProps) {
  const label = value || 'SIN ESTADO';
  const normalized = label.toUpperCase();
  const tone = success.has(normalized)
    ? 'success'
    : warning.has(normalized)
      ? 'warning'
      : info.has(normalized)
        ? 'info'
        : danger.has(normalized)
          ? 'danger'
          : 'neutral';

  return <span className={`status-badge status-badge--${tone}`}>{label}</span>;
}
