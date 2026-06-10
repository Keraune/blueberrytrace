import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ open, title, description, children, onClose }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal-card__header">
          <div>
            <strong>{title}</strong>
            {description && <span>{description}</span>}
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar modal">
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
