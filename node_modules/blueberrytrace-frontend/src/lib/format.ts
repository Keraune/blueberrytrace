export function numberCompact(value: number | null | undefined) {
  return new Intl.NumberFormat('es-PE', {
    maximumFractionDigits: 0
  }).format(value || 0);
}

export function dateShort(value: string | null | undefined) {
  if (!value) {
    return 'Sin fecha';
  }

  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
}

export function initials(name: string | null | undefined) {
  if (!name) {
    return 'BT';
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}
