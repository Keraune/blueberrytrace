import { LogOut } from 'lucide-react';
import { BlueberryMark } from './icons/BlueberryMark';
import { initials } from '../lib/format';
import { getModuleIcon } from '../lib/moduleIcons';
import { routeByKey } from '../lib/routes';
import type { AuthenticatedUserResponse, ModuleResponse } from '../types/api';

const sections = [
  { title: 'Principal', keys: ['dashboard', 'usuarios', 'lotes'] },
  { title: 'Proceso Productivo', keys: ['siembra', 'procesos', 'camas', 'clasificacion', 'despacho'] },
  { title: 'Análisis', keys: ['trazabilidad', 'reportes'] }
] as const;

interface SidebarProps {
  modules: ModuleResponse[];
  activeKey: string;
  user: AuthenticatedUserResponse | null;
  onSelect: (key: string) => void;
  onLogout?: () => void | Promise<void>;
}

export function Sidebar({ modules, activeKey, user, onSelect, onLogout }: SidebarProps) {
  const modulesByKey = new Map(modules.map((module) => [module.key, module]));

  return (
    <aside className="sidebar">
      <div className="brand brand--sidebar">
        <BlueberryMark />
        <div>
          <strong>BlueberryTrace</strong>
          <span>Vivero Los Viñedos</span>
        </div>
      </div>

      <div className="sidebar__sections">
        {sections.map((section) => {
          const sectionModules = section.keys
            .map((key) => modulesByKey.get(key))
            .filter((module): module is ModuleResponse => Boolean(module));

          if (sectionModules.length === 0) {
            return null;
          }

          return (
            <section key={section.title} className="sidebar__section">
              <span className="sidebar__section-title">{section.title}</span>
              <nav className="sidebar__nav" aria-label={section.title}>
                {sectionModules.map((module) => {
                  const Icon = getModuleIcon(module.key);
                  const route = routeByKey(module.key);
                  return (
                    <a
                      key={module.key}
                      className={module.key === activeKey ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}
                      href={route.path}
                      onClick={(event) => {
                        event.preventDefault();
                        onSelect(module.key);
                      }}
                    >
                      <Icon size={17} />
                      <span>{module.label}</span>
                    </a>
                  );
                })}
              </nav>
            </section>
          );
        })}
      </div>

      <div className="sidebar__footer">
        <div className="sidebar-user-card">
          <span className={`sidebar-user-card__avatar sidebar-user-card__avatar--${user?.avatarColor || 'emerald'}`}>{initials(user?.nombreCompleto)}</span>
          <div>
            <strong>{user?.nombreCompleto || 'Sesión activa'}</strong>
            <small>{user?.cargo || user?.rol || user?.username || 'Operario'}</small>
          </div>
        </div>
        <button type="button" className="sidebar-logout" onClick={onLogout}>
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
