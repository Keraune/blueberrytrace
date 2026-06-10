import { Bell, Search } from 'lucide-react';
import { initials } from '../lib/format';
import type { AuthenticatedUserResponse } from '../types/api';

interface TopbarProps {
  user: AuthenticatedUserResponse | null;
  activeModule: string;
}

export function Topbar({ user, activeModule }: TopbarProps) {
  return (
    <header className="topbar">
      <div>
        <span className="topbar__eyebrow">Panel operativo</span>
        <h1>{activeModule}</h1>
      </div>

      <div className="topbar__actions">
        <label className="search-box">
          <Search size={17} />
          <input placeholder="Buscar módulo o registro" />
        </label>
        <button className="icon-button" type="button" aria-label="Notificaciones">
          <Bell size={18} />
        </button>
        <div className="user-pill">
          <span>{initials(user?.nombreCompleto)}</span>
          <div>
            <strong>{user?.nombreCompleto || 'Sesión activa'}</strong>
            <small>{user?.rol || user?.username || 'Operador'}</small>
          </div>
        </div>
      </div>
    </header>
  );
}
