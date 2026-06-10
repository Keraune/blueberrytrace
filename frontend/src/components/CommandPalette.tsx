import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Command, RefreshCcw, Search, Sparkles, X } from 'lucide-react';
import type { ModuleResponse } from '../types/api';

interface CommandPaletteProps {
  open: boolean;
  modules: ModuleResponse[];
  activeKey: string;
  onClose: () => void;
  onSelect: (key: string) => void;
  onRefresh: () => void | Promise<void>;
}

const hints: Record<string, string> = {
  dashboard: 'Resumen visual de producción, despacho y calidad',
  lotes: 'Consulta lotes, invernaderos y estado productivo',
  camas: 'Revisa camas productivas y capacidad referencial',
  siembra: 'Registra nuevas siembras por lote y cama',
  procesos: 'Controla uniformización y formalización',
  clasificacion: 'Gestiona clasificación y validación de plantas',
  despacho: 'Registra salidas y seguimiento de despachos',
  reportes: 'Genera reportes y lectura de trazabilidad',
  usuarios: 'Administra usuarios, roles y accesos'
};

export function CommandPalette({ open, modules, activeKey, onClose, onSelect, onRefresh }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }

    const timeout = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const filteredModules = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return modules;
    }
    return modules.filter((module) => [module.label, module.key, hints[module.key]]
      .some((value) => String(value || '').toLowerCase().includes(term)));
  }, [modules, query]);

  if (!open) {
    return null;
  }

  return (
    <div className="command-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="command-palette" role="dialog" aria-modal="true" aria-label="Comandos rápidos" onMouseDown={(event) => event.stopPropagation()}>
        <header className="command-palette__header">
          <div className="command-palette__brand">
            <span><Command size={18} /></span>
            <div>
              <strong>Centro de acciones</strong>
              <small>Navega, sincroniza y accede rápido al flujo operativo</small>
            </div>
          </div>
          <button type="button" className="icon-button" aria-label="Cerrar buscador" onClick={onClose}>
            <X size={17} />
          </button>
        </header>

        <label className="command-search">
          <Search size={18} />
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar módulo o acción..." />
          <kbd>ESC</kbd>
        </label>

        <div className="command-section">
          <span className="command-section__title">Acciones rápidas</span>
          <button
            type="button"
            className="command-item command-item--accent"
            onClick={async () => {
              await onRefresh();
              onClose();
            }}
          >
            <span className="command-item__icon"><RefreshCcw size={17} /></span>
            <div>
              <strong>Sincronizar datos</strong>
              <small>Actualiza dashboard, lotes, procesos y reportes</small>
            </div>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="command-section">
          <span className="command-section__title">Módulos</span>
          <div className="command-list">
            {filteredModules.map((module) => (
              <button
                key={module.key}
                type="button"
                className={module.key === activeKey ? 'command-item command-item--active' : 'command-item'}
                onClick={() => {
                  onSelect(module.key);
                  onClose();
                }}
              >
                <span className="command-item__icon"><Sparkles size={16} /></span>
                <div>
                  <strong>{module.label}</strong>
                  <small>{hints[module.key] || module.apiPath}</small>
                </div>
                <ArrowRight size={16} />
              </button>
            ))}
            {filteredModules.length === 0 && (
              <div className="command-empty">
                No encontré coincidencias para “{query}”.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
