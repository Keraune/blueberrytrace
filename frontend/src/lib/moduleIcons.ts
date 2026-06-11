import {
  BarChart3,
  Boxes,
  ClipboardList,
  Factory,
  Home,
  Layers3,
  PackageCheck,
  Route,
  Sprout,
  Truck,
  UsersRound,
  type LucideIcon
} from 'lucide-react';

export const moduleIcons: Record<string, LucideIcon> = {
  dashboard: Home,
  lotes: Factory,
  camas: Layers3,
  siembra: Sprout,
  procesos: ClipboardList,
  clasificacion: Boxes,
  despacho: Truck,
  trazabilidad: Route,
  reportes: BarChart3,
  usuarios: UsersRound
};

export function getModuleIcon(key?: string | null): LucideIcon {
  if (!key) {
    return PackageCheck;
  }
  return moduleIcons[key] || PackageCheck;
}
