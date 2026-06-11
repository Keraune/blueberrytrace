import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import type { CamaFormPayload, ReferenceResponse } from '../types/api';

interface CamaFormProps {
  lotes: ReferenceResponse[];
  initialData?: CamaFormPayload;
  submitLabel?: string;
  onSubmit: (payload: CamaFormPayload) => Promise<void>;
  onCancel: () => void;
}

export function CamaForm({ lotes, initialData, submitLabel = 'Guardar', onSubmit, onCancel }: CamaFormProps) {
  const [payload, setPayload] = useState<CamaFormPayload>(initialData || {
    codigo: '',
    descripcion: '',
    capacidadReferencial: 1,
    estado: 'ACTIVA',
    loteId: lotes[0]?.id || 0
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await onSubmit(payload);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'No se pudo guardar la cama.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      {error && <div className="form-alert">{error}</div>}
      <label>
        Código
        <input value={payload.codigo} onChange={(event) => setPayload({ ...payload, codigo: event.target.value })} required maxLength={30} placeholder="CMA-001" />
      </label>
      <label>
        Lote/Invernadero
        <select value={payload.loteId} onChange={(event) => setPayload({ ...payload, loteId: Number(event.target.value) })} required>
          <option value={0} disabled>Selecciona un lote</option>
          {lotes.map((lote) => <option key={lote.id} value={lote.id}>{lote.codigo}</option>)}
        </select>
      </label>
      <label>
        Capacidad referencial
        <input type="number" min={1} value={payload.capacidadReferencial} onChange={(event) => setPayload({ ...payload, capacidadReferencial: Number(event.target.value) })} required />
      </label>
      <label>
        Estado
        <select value={payload.estado} onChange={(event) => setPayload({ ...payload, estado: event.target.value })}>
          <option value="ACTIVA">Activa</option>
          <option value="INACTIVA">Inactiva</option>
        </select>
      </label>
      <label className="form-grid__full">
        Descripción
        <input value={payload.descripcion} onChange={(event) => setPayload({ ...payload, descripcion: event.target.value })} required maxLength={150} placeholder="Cama de propagación" />
      </label>
      <footer className="form-actions">
        <button type="button" className="ghost-button" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="action-button" disabled={saving || payload.loteId === 0}>
          {saving ? <Loader2 className="spin" size={16} /> : <Save size={16} />} {submitLabel}
        </button>
      </footer>
    </form>
  );
}
