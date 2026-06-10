import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import type { LoteFormPayload } from '../types/api';

const today = new Date().toISOString().slice(0, 10);

interface LoteFormProps {
  onSubmit: (payload: LoteFormPayload) => Promise<void>;
  onCancel: () => void;
}

export function LoteForm({ onSubmit, onCancel }: LoteFormProps) {
  const [payload, setPayload] = useState<LoteFormPayload>({
    codigo: '',
    descripcion: '',
    cultivo: 'Arándano',
    variedad: '',
    fechaRegistro: today,
    observacion: '',
    estado: 'ACTIVO'
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
      setError(exception instanceof Error ? exception.message : 'No se pudo guardar el invernadero.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      {error && <div className="form-alert">{error}</div>}
      <label>
        Código
        <input value={payload.codigo} onChange={(event) => setPayload({ ...payload, codigo: event.target.value })} required maxLength={30} placeholder="INV-001" />
      </label>
      <label>
        Variedad
        <input value={payload.variedad} onChange={(event) => setPayload({ ...payload, variedad: event.target.value })} required maxLength={120} placeholder="Biloxi" />
      </label>
      <label>
        Cultivo
        <input value={payload.cultivo} onChange={(event) => setPayload({ ...payload, cultivo: event.target.value })} required maxLength={120} />
      </label>
      <label>
        Fecha de registro
        <input type="date" value={payload.fechaRegistro} onChange={(event) => setPayload({ ...payload, fechaRegistro: event.target.value })} required />
      </label>
      <label className="form-grid__full">
        Descripción
        <input value={payload.descripcion} onChange={(event) => setPayload({ ...payload, descripcion: event.target.value })} required maxLength={150} placeholder="Invernadero principal de propagación" />
      </label>
      <label>
        Estado
        <select value={payload.estado} onChange={(event) => setPayload({ ...payload, estado: event.target.value })}>
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
          <option value="MANTENIMIENTO">Mantenimiento</option>
        </select>
      </label>
      <label className="form-grid__full">
        Observación
        <textarea value={payload.observacion} onChange={(event) => setPayload({ ...payload, observacion: event.target.value })} maxLength={255} placeholder="Notas internas del invernadero" />
      </label>
      <footer className="form-actions">
        <button type="button" className="ghost-button" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="action-button" disabled={saving}>
          {saving ? <Loader2 className="spin" size={16} /> : <Save size={16} />} Guardar
        </button>
      </footer>
    </form>
  );
}
