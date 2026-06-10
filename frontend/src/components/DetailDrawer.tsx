import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface DetailDrawerProps {
  open: boolean;
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  onClose: () => void;
}

export function DetailDrawer({ open, title, subtitle, children, actions, onClose }: DetailDrawerProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside className="detail-drawer" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <header className="detail-drawer__header">
          <div>
            <span className="detail-drawer__eyebrow">Vista rápida</span>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar vista rápida">
            <X size={17} />
          </button>
        </header>
        <div className="detail-drawer__body">
          {children}
        </div>
        {actions ? <footer className="detail-drawer__actions">{actions}</footer> : null}
      </aside>
    </div>
  );
}
