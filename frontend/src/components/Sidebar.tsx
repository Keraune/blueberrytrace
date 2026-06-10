import { BarChart3, Boxes, ClipboardList, Factory, Home, Layers3, PackageCheck, Sprout, Truck, UsersRound } from 'lucide-react';
import type { ModuleResponse } from '../types/api';

const icons = {
  dashboard: Home,
  lotes: Factory,
  camas: Layers3,
  siembra: Sprout,
  procesos: ClipboardList,
  clasificacion: Boxes,
  despacho: Truck,
  reportes: BarChart3,
  usuarios: UsersRound
} as const;

interface SidebarProps {
  modules: ModuleResponse[];
  activeKey: string;
  onSelect: (key: string) => void;
}

export function Sidebar({ modules, activeKey, onSelect }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand__mark">BT</div>
        <div>
          <strong>BlueberryTrace</strong>
          <span>Vivero Los Viñedos</span>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Módulos principales">
        {modules.map((module) => {
          const Icon = icons[module.key as keyof typeof icons] || PackageCheck;
          return (
            <button
              key={module.key}
              className={module.key === activeKey ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}
              type="button"
              onClick={() => onSelect(module.key)}
            >
              <Icon size={18} />
              <span>{module.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
