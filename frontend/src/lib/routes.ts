export interface AppRoute {
  key: string;
  path: string;
  label: string;
}

export const appRoutes: AppRoute[] = [
  { key: 'dashboard', path: '/dashboard', label: 'Dashboard' },
  { key: 'lotes', path: '/lotes', label: 'Lotes e invernaderos' },
  { key: 'camas', path: '/camas', label: 'Camas' },
  { key: 'siembra', path: '/siembra', label: 'Siembra' },
  { key: 'procesos', path: '/procesos', label: 'Procesos' },
  { key: 'clasificacion', path: '/clasificacion', label: 'Clasificación' },
  { key: 'despacho', path: '/despacho', label: 'Despacho' },
  { key: 'reportes', path: '/reportes', label: 'Reportes' },
  { key: 'usuarios', path: '/usuarios', label: 'Usuarios' }
];

export function routeByKey(key: string) {
  return appRoutes.find((route) => route.key === key) || appRoutes[0];
}

export function routeKeyFromPath(pathname: string) {
  const cleanPath = pathname === '/' ? '/dashboard' : pathname;
  return appRoutes.find((route) => route.path === cleanPath)?.key || 'dashboard';
}
