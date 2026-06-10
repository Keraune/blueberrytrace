import { useMemo, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import type { CamaResponse, FormalizacionFormPayload, FormalizacionResponse, ReferenceResponse, UniformizacionFormPayload, UniformizacionResponse } from '../types/api';

type ProcessMode = 'uniformizacion' | 'formalizacion';

interface ProcesoFormProps {
  mode: ProcessMode;
  lotes: ReferenceResponse[];
  camas: CamaResponse[];
  initialData?: UniformizacionResponse | FormalizacionResponse;
  submitLabel?: string;
  onSubmit: (payload: UniformizacionFormPayload | FormalizacionFormPayload) => Promise<void>;
  onCancel: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

function isUniformizacionData(data?: UniformizacionResponse | FormalizacionResponse): data is UniformizacionResponse {
  return Boolean(data && 'fechaUniformizacion' in data);
}

export function ProcesoForm({ mode, lotes, camas, initialData, submitLabel = 'Guardar', onSubmit, onCancel }: ProcesoFormProps) {
  const isUniformizacion = mode === 'uniformizacion';
  const [loteId, setLoteId] = useState(initialData?.lote?.id || lotes[0]?.id || 0);
  const [camaId, setCamaId] = useState(initialData?.cama?.id || 0);
  const [fecha, setFecha] = useState(isUniformizacionData(initialData) ? initialData.fechaUniformizacion || today() : initialData && 'fechaFormalizacion' in initialData ? initialData.fechaFormalizacion || today() : today());
  const [criterio, setCriterio] = useState(isUniformizacionData(initialData) ? initialData.criterio || 'Tamaño y vigor de planta' : 'Tamaño y vigor de planta');
  const [detalle, setDetalle] = useState(initialData && 'detalle' in initialData ? initialData.detalle || 'Ordenamiento y formalización de bandejas' : 'Ordenamiento y formalización de bandejas');
  const [cantidadInicial, setCantidadInicial] = useState(isUniformizacionData(initialData) ? initialData.cantidadInicial || 0 : 1);
  const [cantidadUniformizada, setCantidadUniformizada] = useState(isUniformizacionData(initialData) ? initialData.cantidadUniformizada || 0 : 1);
  const [cantidadBandejas, setCantidadBandejas] = useState(initialData && 'cantidadBandejas' in initialData ? initialData.cantidadBandejas || 0 : 1);
  const [cantidadPlantas, setCantidadPlantas] = useState(initialData && 'cantidadPlantas' in initialData ? initialData.cantidadPlantas || 0 : 1);
  const [observacion, setObservacion] = useState(initialData?.observacion || '');
  const [estado, setEstado] = useState(initialData?.estado || 'REGISTRADA');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const camasDisponibles = useMemo(() => camas.filter((cama) => cama.lote?.id === loteId), [camas, loteId]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      if (isUniformizacion) {
        await onSubmit({ loteId, camaId, fechaUniformizacion: fecha, criterio, cantidadInicial, cantidadUniformizada, observacion, estado });
      } else {
        await onSubmit({ loteId, camaId, fechaFormalizacion: fecha, detalle, cantidadBandejas, cantidadPlantas, observacion, estado });
      }
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'No se pudo guardar el proceso.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      {error && <div className="form-alert">{error}</div>}
      <label>
        Invernadero
        <select value={loteId} onChange={(event) => { setLoteId(Number(event.target.value)); setCamaId(0); }} required>
          <option value={0} disabled>Selecciona un invernadero</option>
          {lotes.map((lote) => <option key={lote.id} value={lote.id}>{lote.codigo}</option>)}
        </select>
      </label>
      <label>
        Cama
        <select value={camaId} onChange={(event) => setCamaId(Number(event.target.value))} required>
          <option value={0} disabled>Selecciona una cama</option>
          {camasDisponibles.map((cama) => <option key={cama.id} value={cama.id}>{cama.codigo}</option>)}
        </select>
      </label>
      <label>
        Fecha
        <input type="date" value={fecha} onChange={(event) => setFecha(event.target.value)} required />
      </label>
      <label>
        Estado
        <select value={estado} onChange={(event) => setEstado(event.target.value)}>
          <option value="REGISTRADA">Registrada</option>
          <option value="ANULADA">Anulada</option>
        </select>
      </label>

      {isUniformizacion ? (
        <>
          <label className="form-grid__full">
            Criterio
            <input value={criterio} onChange={(event) => setCriterio(event.target.value)} required maxLength={120} />
          </label>
          <label>
            Cantidad inicial
            <input type="number" min={0} value={cantidadInicial} onChange={(event) => setCantidadInicial(Number(event.target.value))} required />
          </label>
          <label>
            Cantidad uniformizada
            <input type="number" min={0} value={cantidadUniformizada} onChange={(event) => setCantidadUniformizada(Number(event.target.value))} required />
          </label>
        </>
      ) : (
        <>
          <label className="form-grid__full">
            Detalle
            <input value={detalle} onChange={(event) => setDetalle(event.target.value)} required maxLength={180} />
          </label>
          <label>
            Bandejas
            <input type="number" min={0} value={cantidadBandejas} onChange={(event) => setCantidadBandejas(Number(event.target.value))} required />
          </label>
          <label>
            Plantas
            <input type="number" min={0} value={cantidadPlantas} onChange={(event) => setCantidadPlantas(Number(event.target.value))} required />
          </label>
        </>
      )}

      <label className="form-grid__full">
        Observación
        <textarea value={observacion} onChange={(event) => setObservacion(event.target.value)} maxLength={255} />
      </label>
      <footer className="form-actions">
        <button type="button" className="ghost-button" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="action-button" disabled={saving || loteId === 0 || camaId === 0}>
          {saving ? <Loader2 className="spin" size={16} /> : <Save size={16} />} {submitLabel}
        </button>
      </footer>
    </form>
  );
}
