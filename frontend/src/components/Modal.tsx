import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
  onClose: () => void;
}

export function Modal({ open, title, description, children, size = 'lg', closeOnBackdrop = true, onClose }: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 80);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={closeOnBackdrop ? onClose : undefined}>
      <section
        className={`modal-card modal-card--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal-card__header">
          <div>
            <span className="modal-card__eyebrow">BlueberryTrace</span>
            <strong id={titleId}>{title}</strong>
            {description && <span id={descriptionId}>{description}</span>}
          </div>
          <button ref={closeButtonRef} type="button" className="icon-button modal-card__close" onClick={onClose} aria-label="Cerrar modal">
            <X size={18} />
          </button>
        </header>
        <div className="modal-card__body">
          {children}
        </div>
      </section>
    </div>
  );
}
