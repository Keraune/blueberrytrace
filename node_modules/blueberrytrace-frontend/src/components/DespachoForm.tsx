import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import type { DespachoFormPayload, ReferenceResponse } from '../types/api';

interface DespachoFormProps {
  lotes: ReferenceResponse[];
  modalidades: string[];
  validaciones: string[];
  initialData?: DespachoFormPayload;
  submitLabel?: string;
  onSubmit: (payload: DespachoFormPayload) => Promise<void>;
  onCancel: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export function DespachoForm({ lotes, modalidades, validaciones, initialData, submitLabel = 'Guardar', onSubmit, onCancel }: DespachoFormProps) {
  const [payload, setPayload] = useState<DespachoFormPayload>(initialData || {
    loteId: lotes[0]?.id || 0,
    fechaDespacho: today(),
    modalidad: modalidades[0] || '',
    cantidadDespachada: 1,
    destino: '',
    guiaRemision: '',
    validacionCalidad: validaciones[0] || '',
    observacion: '',
    estado: 'REGISTRADO'
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
      setError(exception instanceof Error ? exception.message : 'No se pudo guardar el despacho.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      {error && <div className="form-alert">{error}</div>}
      <label>
        Invernadero
        <select value={payload.loteId} onChange={(event) => setPayload({ ...payload, loteId: Number(event.target.value) })} required>
          <option value={0} disabled>Selecciona un invernadero</option>
          {lotes.map((lote) => <option key={lote.id} value={lote.id}>{lote.codigo}</option>)}
        </select>
      </label>
      <label>
        Fecha
        <input type="date" value={payload.fechaDespacho} onChange={(event) => setPayload({ ...payload, fechaDespacho: event.target.value })} required />
      </label>
      <label>
        Modalidad
        <select value={payload.modalidad} onChange={(event) => setPayload({ ...payload, modalidad: event.target.value })}>
          {modalidades.length === 0 ? <option value="" disabled>Sin modalidades configuradas</option> : modalidades.map((modalidad) => <option key={modalidad} value={modalidad}>{modalidad}</option>)}
        </select>
      </label>
      <label>
        Cantidad despachada
        <input type="number" min={1} value={payload.cantidadDespachada} onChange={(event) => setPayload({ ...payload, cantidadDespachada: Number(event.target.value) })} required />
      </label>
      <label>
        Destino
        <input value={payload.destino} onChange={(event) => setPayload({ ...payload, destino: event.target.value })} maxLength={120} placeholder="Cliente o zona de envío" />
      </label>
      <label>
        Guía de remisión
        <input value={payload.guiaRemision} onChange={(event) => setPayload({ ...payload, guiaRemision: event.target.value })} maxLength={80} />
      </label>
      <label>
        Validación calidad
        <select value={payload.validacionCalidad} onChange={(event) => setPayload({ ...payload, validacionCalidad: event.target.value })}>
          {validaciones.length === 0 ? <option value="" disabled>Sin validaciones configuradas</option> : validaciones.map((validacion) => <option key={validacion} value={validacion}>{validacion}</option>)}
        </select>
      </label>
      <label>
        Estado
        <select value={payload.estado} onChange={(event) => setPayload({ ...payload, estado: event.target.value })}>
          <option value="REGISTRADO">Registrado</option>
          <option value="CERRADO">Cerrado</option>
          <option value="OBSERVADO">Observado</option>
          <option value="ANULADO">Anulado</option>
        </select>
      </label>
      <label className="form-grid__full">
        Observación
        <textarea value={payload.observacion} onChange={(event) => setPayload({ ...payload, observacion: event.target.value })} maxLength={255} />
      </label>
      <footer className="form-actions">
        <button type="button" className="ghost-button" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="action-button" disabled={saving || payload.loteId === 0 || !payload.modalidad || !payload.validacionCalidad}>
          {saving ? <Loader2 className="spin" size={16} /> : <Save size={16} />} {submitLabel}
        </button>
      </footer>
    </form>
  );
}
