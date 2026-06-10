import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ModuleHeader } from '../components/ModuleHeader';
import { StatusBadge } from '../components/StatusBadge';
import { blueberryApi } from '../lib/api';
import { dateShort, numberCompact } from '../lib/format';
import type { CamaResponse, ReferenceResponse, SiembraFormPayload, SiembraResponse } from '../types/api';

interface SiembrasPageProps {
  siembras: SiembraResponse[];
  lotes: ReferenceResponse[];
  camas: CamaResponse[];
  onSiembrasChange: (items: SiembraResponse[]) => void;
}

const today = new Date().toISOString().slice(0, 10);

export function SiembrasPage({ siembras, lotes, camas, onSiembrasChange }: SiembrasPageProps) {
  const [step, setStep] = useState(1);
  const [payload, setPayload] = useState<SiembraFormPayload>({
    loteId: lotes[0]?.id || 0,
    camaId: 0,
    fechaSiembra: today,
    cantidadRegistrada: 1,
    observacion: '',
    estado: 'REGISTRADO'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const camasDisponibles = useMemo(() => camas.filter((cama) => cama.lote?.id === payload.loteId), [camas, payload.loteId]);
  const recientes = siembras.slice(0, 6);

  async function submit() {
    try {
      setSaving(true);
      setError(null);
      const response = await blueberryApi.createSiembra(payload);
      onSiembrasChange(response.items);
      setStep(1);
      setPayload({ ...payload, camaId: 0, fechaSiembra: today, cantidadRegistrada: 1, observacion: '', estado: 'REGISTRADO' });
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'No se pudo registrar la siembra.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Proceso productivo"
        title="Registro de Siembra"
        description="Registrar plantas sembradas por cama y bandeja."
      />

      <section className="panel-card step-card">
        <div className="stepper">
          {[1, 2, 3].map((current) => (
            <div key={current} className="stepper__item">
              <span className={current === step ? 'stepper__index stepper__index--active' : 'stepper__index'}>{current}</span>
              <strong>{current === 1 ? 'Selección de Lote' : current === 2 ? 'Datos de Siembra' : 'Confirmación'}</strong>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="step-card__body">
            <h3>Paso 1: Selección de Lote y Cama</h3>
            <p>Seleccione el lote e invernadero donde se realizará la siembra.</p>
            <div className="form-grid form-grid--two">
              <label>
                Lote
                <select value={payload.loteId} onChange={(event) => setPayload({ ...payload, loteId: Number(event.target.value), camaId: 0 })}>
                  <option value={0}>Seleccionar lote...</option>
                  {lotes.map((lote) => <option key={lote.id} value={lote.id}>{lote.codigo}</option>)}
                </select>
              </label>
              <label>
                Cama
                <select value={payload.camaId} onChange={(event) => setPayload({ ...payload, camaId: Number(event.target.value) })}>
                  <option value={0}>Seleccionar cama...</option>
                  {camasDisponibles.map((cama) => <option key={cama.id} value={cama.id}>{cama.codigo}</option>)}
                </select>
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-card__body">
            <h3>Paso 2: Datos de Siembra</h3>
            <p>Registre la fecha y la cantidad de plantas sembradas.</p>
            <div className="form-grid form-grid--two">
              <label>
                Fecha de siembra
                <input type="date" value={payload.fechaSiembra} onChange={(event) => setPayload({ ...payload, fechaSiembra: event.target.value })} />
              </label>
              <label>
                Cantidad registrada
                <input type="number" min={1} value={payload.cantidadRegistrada} onChange={(event) => setPayload({ ...payload, cantidadRegistrada: Number(event.target.value) })} />
              </label>
              <label className="form-grid__full">
                Observación
                <textarea value={payload.observacion} onChange={(event) => setPayload({ ...payload, observacion: event.target.value })} placeholder="Notas del registro de siembra" />
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-card__body">
            <h3>Paso 3: Confirmación</h3>
            <p>Verifique los datos antes de registrar la siembra.</p>
            <div className="confirmation-grid">
              <div><span>Lote</span><strong>{lotes.find((lote) => lote.id === payload.loteId)?.codigo || 'No seleccionado'}</strong></div>
              <div><span>Cama</span><strong>{camasDisponibles.find((cama) => cama.id === payload.camaId)?.codigo || 'No seleccionada'}</strong></div>
              <div><span>Fecha</span><strong>{dateShort(payload.fechaSiembra)}</strong></div>
              <div><span>Cantidad</span><strong>{numberCompact(payload.cantidadRegistrada)}</strong></div>
            </div>
            {error ? <div className="form-alert">{error}</div> : null}
          </div>
        )}

        <div className="step-card__footer">
          <button type="button" className="ghost-button" onClick={() => setStep(Math.max(step - 1, 1))} disabled={step === 1}><ChevronLeft size={16} /> Anterior</button>
          {step < 3 ? (
            <button type="button" className="action-button" onClick={() => setStep(Math.min(step + 1, 3))} disabled={(step === 1 && (!payload.loteId || !payload.camaId))}><span>Siguiente</span> <ChevronRight size={16} /></button>
          ) : (
            <button type="button" className="action-button" onClick={submit} disabled={saving || !payload.loteId || !payload.camaId}>{saving ? 'Guardando...' : 'Registrar siembra'}</button>
          )}
        </div>
      </section>

      <section className="panel-card">
        <div className="panel-card__header">
          <div>
            <h2>Siembras recientes</h2>
            <p>Últimos registros confirmados.</p>
          </div>
          <span className="panel-card__count">{siembras.length} registros</span>
        </div>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Lote</th>
                <th>Cama</th>
                <th>Fecha</th>
                <th>Cantidad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {recientes.map((siembra) => (
                <tr key={siembra.id}>
                  <td>{siembra.lote?.codigo || 'Sin lote'}</td>
                  <td>{siembra.cama?.codigo || 'Sin cama'}</td>
                  <td>{dateShort(siembra.fechaSiembra)}</td>
                  <td>{numberCompact(siembra.cantidadRegistrada || 0)}</td>
                  <td><StatusBadge value={siembra.estado} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
