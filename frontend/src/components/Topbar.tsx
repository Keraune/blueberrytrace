import { Bell, ChevronRight, Leaf, RefreshCcw, Search } from 'lucide-react';
import { initials } from '../lib/format';
import type { AuthenticatedUserResponse } from '../types/api';

interface TopbarProps {
  user: AuthenticatedUserResponse | null;
  activeModule: string;
  onRefresh?: () => void | Promise<void>;
  refreshing?: boolean;
}

export function Topbar({ user, activeModule, onRefresh, refreshing = false }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar__breadcrumb">
        <Leaf size={15} />
        <ChevronRight size={15} />
        <span>{activeModule}</span>
      </div>

      <div className="topbar__actions">
        <label className="search-box">
          <Search size={16} />
          <input placeholder="Buscar en el sistema..." />
        </label>
        {onRefresh ? (
          <button className="icon-button" type="button" aria-label="Sincronizar" onClick={onRefresh} disabled={refreshing}>
            <RefreshCcw className={refreshing ? 'spin' : undefined} size={17} />
          </button>
        ) : null}
        <button className="icon-button notification-button" type="button" aria-label="Notificaciones">
          <Bell size={17} />
          <span />
        </button>
        <div className="topbar-avatar" title={user?.nombreCompleto || 'Sesión activa'}>
          {initials(user?.nombreCompleto)}
        </div>
      </div>
    </header>
  );
}
