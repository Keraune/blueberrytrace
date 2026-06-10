import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'success' | 'warning' | 'danger';
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'warning',
  loading = false,
  onCancel,
  onConfirm
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  const Icon = tone === 'success' ? CheckCircle2 : AlertTriangle;

  return (
    <div className="confirm-backdrop" role="presentation" onMouseDown={onCancel}>
      <section className={`confirm-dialog confirm-dialog--${tone}`} role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="confirm-dialog__close" aria-label="Cerrar confirmación" onClick={onCancel}>
          <X size={16} />
        </button>
        <span className="confirm-dialog__icon"><Icon size={22} /></span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <footer className="confirm-dialog__actions">
          <button type="button" className="ghost-button" onClick={onCancel} disabled={loading}>{cancelLabel}</button>
          <button type="button" className={tone === 'danger' ? 'action-button action-button--danger' : 'action-button'} onClick={onConfirm} disabled={loading}>
            {loading ? 'Procesando...' : confirmLabel}
          </button>
        </footer>
      </section>
    </div>
  );
}
