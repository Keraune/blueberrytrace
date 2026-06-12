import {
  BarChart3,
  ClipboardCheck,
  ClipboardList,
  Home,
  Layers3,
  Leaf,
  LogOut,
  Route,
  Settings,
  ShieldCheck,
  Sprout,
  Truck,
  UserRound,
  UsersRound,
  X,
  type LucideIcon
} from 'lucide-react';
import blueberryLogoMark from '../assets/brand/blueberry-logo-mark.webp';
import { initials } from '../lib/format';
import type { AuthenticatedUserResponse, ModuleResponse } from '../types/api';

interface SidebarProps {
  modules: ModuleResponse[];
  activeKey: string;
  user: AuthenticatedUserResponse | null;
  onSelect: (key: string) => void;
  onLogout?: () => void | Promise<void>;
  onOpenProfile?: () => void;
  onClose?: () => void;
}

interface SidebarNavigationItem {
  key: string;
  label: string;
  icon: LucideIcon;
  targetKey?: string;
  requiresModule?: string;
  activeWhen?: string[];
  action?: 'profile';
}

const sidebarNavigation: SidebarNavigationItem[] = [
  { key: 'dashboard', label: 'Inicio', icon: Home, targetKey: 'dashboard', requiresModule: 'dashboard' },
  { key: 'usuarios', label: 'Usuarios', icon: UserRound, targetKey: 'usuarios', requiresModule: 'usuarios' },
  { key: 'roles', label: 'Roles', icon: UsersRound, targetKey: 'usuarios', requiresModule: 'usuarios' },
  { key: 'lotes', label: 'Lotes', icon: ClipboardCheck, targetKey: 'lotes', requiresModule: 'lotes' },
  { key: 'camas', label: 'Camas', icon: Layers3, targetKey: 'camas', requiresModule: 'camas' },
  { key: 'siembra', label: 'Siembras', icon: Sprout, targetKey: 'siembra', requiresModule: 'siembra' },
  { key: 'uniformizaciones', label: 'Uniformizaciones', icon: Leaf, targetKey: 'procesos', requiresModule: 'procesos', activeWhen: ['procesos'] },
  { key: 'formalizaciones', label: 'Formalizaciones', icon: ClipboardList, targetKey: 'procesos', requiresModule: 'procesos' },
  { key: 'clasificacion', label: 'Clasificaciones', icon: ShieldCheck, targetKey: 'clasificacion', requiresModule: 'clasificacion' },
  { key: 'despacho', label: 'Despachos', icon: Truck, targetKey: 'despacho', requiresModule: 'despacho' },
  { key: 'trazabilidad', label: 'Trazabilidad', icon: Route, targetKey: 'trazabilidad', requiresModule: 'trazabilidad' },
  { key: 'reportes', label: 'Reportes', icon: BarChart3, targetKey: 'reportes', requiresModule: 'reportes' },
  { key: 'configuracion', label: 'Configuración', icon: Settings, action: 'profile' }
];

export function Sidebar({ modules, activeKey, user, onSelect, onLogout, onOpenProfile, onClose }: SidebarProps) {
  const availableModuleKeys = new Set(modules.map((module) => module.key));
  const visibleNavigation = sidebarNavigation.filter((item) => !item.requiresModule || availableModuleKeys.has(item.requiresModule));

  return (
    <aside className="sidebar sidebar--reference">
      <div className="sidebar__brand-row">
        <div className="brand brand--sidebar" aria-label="BlueberryTrace">
          <img src={blueberryLogoMark} alt="Logo BlueberryTrace" />
          <strong><span>Blueberry</span>Trace</strong>
        </div>
        <button type="button" className="icon-button sidebar-close" aria-label="Cerrar menú" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <nav className="sidebar__nav sidebar__nav--reference" aria-label="Navegación principal">
        {visibleNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === activeKey || item.activeWhen?.includes(activeKey) || false;

          return (
            <button
              key={item.key}
              type="button"
              className={isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}
              onClick={() => {
                if (item.action === 'profile') {
                  onOpenProfile?.();
                  return;
                }
                if (item.targetKey) {
                  onSelect(item.targetKey);
                }
              }}
            >
              <Icon size={19} strokeWidth={1.85} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar-user-card">
          <span className={`sidebar-user-card__avatar sidebar-user-card__avatar--${user?.avatarColor || 'emerald'}`}>{initials(user?.nombreCompleto)}</span>
          <div>
            <strong>{user?.nombreCompleto || 'Sesión activa'}</strong>
            <small>{user?.cargo || user?.rol || user?.username || 'Operario'}</small>
          </div>
        </div>
        <button type="button" className="sidebar-logout" onClick={() => { onClose?.(); onLogout?.(); }}>
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
