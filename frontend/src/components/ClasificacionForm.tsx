import { useMemo, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import type { CamaResponse, ClasificacionFormPayload, ReferenceResponse } from '../types/api';

interface ClasificacionFormProps {
  lotes: ReferenceResponse[];
  camas: CamaResponse[];
  onSubmit: (payload: ClasificacionFormPayload) => Promise<void>;
  onCancel: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export function ClasificacionForm({ lotes, camas, onSubmit, onCancel }: ClasificacionFormProps) {
  const [payload, setPayload] = useState<ClasificacionFormPayload>({
    loteId: lotes[0]?.id || 0,
    camaId: 0,
    fechaClasificacion: today(),
    estadoPlanta: 'Apta',
    tamano: 'Mediana',
    condicion: 'Exportación',
    cantidad: 1,
    observacion: '',
    estado: 'PENDIENTE'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const camasDisponibles = useMemo(() => camas.filter((cama) => cama.lote?.id === payload.loteId), [camas, payload.loteId]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await onSubmit(payload);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'No se pudo registrar la clasificación.');
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
        Fecha
        <input type="date" value={payload.fechaClasificacion} onChange={(event) => setPayload({ ...payload, fechaClasificacion: event.target.value })} required />
      </label>
      <label>
        Cantidad
        <input type="number" min={1} value={payload.cantidad} onChange={(event) => setPayload({ ...payload, cantidad: Number(event.target.value) })} required />
      </label>
      <label>
        Estado planta
        <input value={payload.estadoPlanta} onChange={(event) => setPayload({ ...payload, estadoPlanta: event.target.value })} required maxLength={60} />
      </label>
      <label>
        Tamaño
        <input value={payload.tamano} onChange={(event) => setPayload({ ...payload, tamano: event.target.value })} required maxLength={60} />
      </label>
      <label>
        Condición
        <input value={payload.condicion} onChange={(event) => setPayload({ ...payload, condicion: event.target.value })} required maxLength={120} />
      </label>
      <label>
        Estado
        <select value={payload.estado} onChange={(event) => setPayload({ ...payload, estado: event.target.value })}>
          <option value="PENDIENTE">Pendiente</option>
          <option value="VALIDADA">Validada</option>
          <option value="OBSERVADA">Observada</option>
        </select>
      </label>
      <label className="form-grid__full">
        Observación
        <textarea value={payload.observacion} onChange={(event) => setPayload({ ...payload, observacion: event.target.value })} maxLength={255} />
      </label>
      <footer className="form-actions">
        <button type="button" className="ghost-button" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="action-button" disabled={saving || payload.loteId === 0 || payload.camaId === 0}>
          {saving ? <Loader2 className="spin" size={16} /> : <Save size={16} />} Guardar
        </button>
      </footer>
    </form>
  );
}
