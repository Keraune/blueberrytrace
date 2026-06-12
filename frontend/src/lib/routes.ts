export interface AppRoute {
  key: string;
  path: string;
  label: string;
}

export const appRoutes: AppRoute[] = [
  { key: 'dashboard', path: '/dashboard', label: 'Panel operativo' },
  { key: 'lotes', path: '/lotes', label: 'Lotes e invernaderos' },
  { key: 'camas', path: '/camas', label: 'Camas' },
  { key: 'siembra', path: '/siembra', label: 'Registro de siembra' },
  { key: 'uniformizaciones', path: '/uniformizaciones', label: 'Uniformizaciones' },
  { key: 'formalizaciones', path: '/formalizaciones', label: 'Formalizaciones' },
  { key: 'clasificacion', path: '/clasificacion', label: 'Control de clasificación' },
  { key: 'despacho', path: '/despacho', label: 'Seguimiento de despacho' },
  { key: 'trazabilidad', path: '/trazabilidad', label: 'Trazabilidad por lote' },
  { key: 'reportes', path: '/reportes', label: 'Reportes operativos' },
  { key: 'usuarios', path: '/usuarios', label: 'Gestión de usuarios' }
];

export function routeByKey(key: string) {
  if (key === 'procesos') {
    return appRoutes.find((route) => route.key === 'uniformizaciones') || appRoutes[0];
  }
  return appRoutes.find((route) => route.key === key) || appRoutes[0];
}

export function routeKeyFromPath(pathname: string) {
  const cleanPath = pathname === '/' ? '/dashboard' : pathname;
  if (cleanPath === '/procesos') {
    return 'uniformizaciones';
  }
  return appRoutes.find((route) => route.path === cleanPath)?.key || 'dashboard';
}
