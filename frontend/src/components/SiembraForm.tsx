import { useMemo, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import type { CamaResponse, ReferenceResponse, SiembraFormPayload } from '../types/api';

interface SiembraFormProps {
  lotes: ReferenceResponse[];
  camas: CamaResponse[];
  initialData?: SiembraFormPayload;
  submitLabel?: string;
  onSubmit: (payload: SiembraFormPayload) => Promise<void>;
  onCancel: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export function SiembraForm({ lotes, camas, initialData, submitLabel = 'Guardar', onSubmit, onCancel }: SiembraFormProps) {
  const [payload, setPayload] = useState<SiembraFormPayload>(initialData || {
    loteId: lotes[0]?.id || 0,
    camaId: 0,
    fechaSiembra: today(),
    cantidadRegistrada: 1,
    observacion: '',
    estado: 'REGISTRADA'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const camasDisponibles = useMemo(
    () => camas.filter((cama) => cama.lote?.id === payload.loteId),
    [camas, payload.loteId]
  );

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await onSubmit(payload);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'No se pudo guardar la siembra.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      {error && <div className="form-alert">{error}</div>}
      <label>
        Invernadero
        <select value={payload.loteId} onChange={(event) => setPayload({ ...payload, loteId: Number(event.target.value), camaId: 0 })} required>
          <option value={0} disabled>Selecciona un invernadero</option>
          {lotes.map((lote) => <option key={lote.id} value={lote.id}>{lote.codigo}</option>)}
        </select>
      </label>
      <label>
        Cama
        <select value={payload.camaId} onChange={(event) => setPayload({ ...payload, camaId: Number(event.target.value) })} required>
          <option value={0} disabled>Selecciona una cama</option>
          {camasDisponibles.map((cama) => <option key={cama.id} value={cama.id}>{cama.codigo}</option>)}
        </select>
      </label>
      <label>
        Fecha de siembra
        <input type="date" value={payload.fechaSiembra} onChange={(event) => setPayload({ ...payload, fechaSiembra: event.target.value })} required />
      </label>
      <label>
        Cantidad registrada
        <input type="number" min={1} value={payload.cantidadRegistrada} onChange={(event) => setPayload({ ...payload, cantidadRegistrada: Number(event.target.value) })} required />
      </label>
      <label>
        Estado
        <select value={payload.estado} onChange={(event) => setPayload({ ...payload, estado: event.target.value })}>
          <option value="REGISTRADA">Registrada</option>
          <option value="ANULADA">Anulada</option>
        </select>
      </label>
      <label className="form-grid__full">
        Observación
        <textarea value={payload.observacion} onChange={(event) => setPayload({ ...payload, observacion: event.target.value })} maxLength={255} placeholder="Detalle operativo opcional" />
      </label>
      <footer className="form-actions">
        <button type="button" className="ghost-button" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="action-button" disabled={saving || payload.loteId === 0 || payload.camaId === 0}>
          {saving ? <Loader2 className="spin" size={16} /> : <Save size={16} />} {submitLabel}
        </button>
      </footer>
    </form>
  );
}
