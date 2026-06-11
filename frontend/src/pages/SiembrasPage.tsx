import { useMemo, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, ClipboardCheck, MapPin, Pencil, RotateCcw, Sprout, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { ModuleHeader } from '../components/ModuleHeader';
import { SiembraForm } from '../components/SiembraForm';
import { StatusBadge } from '../components/StatusBadge';
import { blueberryApi } from '../lib/api';
import { dateShort, numberCompact } from '../lib/format';
import { emitToast } from '../lib/uiEvents';
import type { CamaResponse, ReferenceResponse, SiembraFormPayload, SiembraResponse } from '../types/api';

interface SiembrasPageProps {
  siembras: SiembraResponse[];
  lotes: ReferenceResponse[];
  camas: CamaResponse[];
  onSiembrasChange: (items: SiembraResponse[]) => void;
}

const today = new Date().toISOString().slice(0, 10);

function toPayload(siembra: SiembraResponse): SiembraFormPayload {
  return {
    loteId: siembra.lote?.id || 0,
    camaId: siembra.cama?.id || 0,
    fechaSiembra: siembra.fechaSiembra || today,
    cantidadRegistrada: siembra.cantidadRegistrada || 1,
    observacion: siembra.observacion || '',
    estado: siembra.estado || 'REGISTRADA'
  };
}

export function SiembrasPage({ siembras, lotes, camas, onSiembrasChange }: SiembrasPageProps) {
  const [step, setStep] = useState(1);
  const [payload, setPayload] = useState<SiembraFormPayload>({
    loteId: lotes[0]?.id || 0,
    camaId: 0,
    fechaSiembra: today,
    cantidadRegistrada: 1,
    observacion: '',
    estado: 'REGISTRADA'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingSiembra, setEditingSiembra] = useState<SiembraResponse | null>(null);
  const [pendingStatus, setPendingStatus] = useState<SiembraResponse | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SiembraResponse | null>(null);
  const [confirming, setConfirming] = useState(false);

  const camasDisponibles = useMemo(() => camas.filter((cama) => cama.lote?.id === payload.loteId), [camas, payload.loteId]);
  const selectedLote = lotes.find((lote) => lote.id === payload.loteId);
  const selectedCama = camasDisponibles.find((cama) => cama.id === payload.camaId);
  const recientes = siembras.slice(0, 10);
  const wizardSteps = [
    { id: 1, label: 'Lote y cama', icon: MapPin },
    { id: 2, label: 'Datos de siembra', icon: ClipboardCheck },
    { id: 3, label: 'Confirmación', icon: CheckCircle2 }
  ];

  const selectionError = !payload.loteId
    ? 'Selecciona un lote para continuar.'
    : !payload.camaId
      ? 'Selecciona una cama asociada al lote.'
      : null;
  const dataError = !payload.fechaSiembra
    ? 'La fecha de siembra es obligatoria.'
    : payload.cantidadRegistrada <= 0
      ? 'La cantidad registrada debe ser mayor a cero.'
      : null;

  function goNext() {
    if (step === 1 && selectionError) return;
    if (step === 2 && dataError) return;
    setStep(Math.min(step + 1, 3));
  }

  async function submit() {
    if (selectionError || dataError) {
      setError(selectionError || dataError);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const response = await blueberryApi.createSiembra(payload);
      onSiembrasChange(response.items);
      setStep(1);
      setPayload({ loteId: payload.loteId, camaId: 0, fechaSiembra: today, cantidadRegistrada: 1, observacion: '', estado: 'REGISTRADA' });
      emitToast('success', 'Siembra registrada', 'El registro fue creado correctamente.');
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'No se pudo registrar la siembra.');
    } finally {
      setSaving(false);
    }
  }

  async function updateSiembra(payload: SiembraFormPayload) {
    if (!editingSiembra) return;
    const response = await blueberryApi.updateSiembra(editingSiembra.id, payload);
    onSiembrasChange(response.items);
    setEditingSiembra(null);
    emitToast('success', 'Siembra actualizada', 'Los datos de la siembra fueron guardados.');
  }

  async function confirmToggleStatus() {
    if (!pendingStatus) return;
    try {
      setConfirming(true);
      const response = await blueberryApi.toggleSiembraStatus(pendingStatus.id);
      onSiembrasChange(response.items);
      emitToast('success', 'Estado actualizado', 'El estado de la siembra fue modificado.');
      setPendingStatus(null);
    } catch (exception) {
      emitToast('error', 'No se pudo cambiar el estado', exception instanceof Error ? exception.message : 'Ocurrió un error inesperado.');
    } finally {
      setConfirming(false);
    }
  }

  async function confirmDeleteSiembra() {
    if (!pendingDelete) return;
    try {
      setConfirming(true);
      const response = await blueberryApi.deleteSiembra(pendingDelete.id);
      onSiembrasChange(response.items);
      emitToast('warning', 'Siembra eliminada', 'El registro fue retirado de la base operativa.');
      setPendingDelete(null);
    } catch (exception) {
      emitToast('error', 'No se pudo eliminar la siembra', exception instanceof Error ? exception.message : 'Ocurrió un error inesperado.');
    } finally {
      setConfirming(false);
    }
  }

  return (
    <main className="content-grid planting-screen">
      <ModuleHeader
        eyebrow="Proceso productivo"
        title="Registro de siembra"
        description="Registra plantas sembradas por lote y cama con validación previa."
        icon={<Sprout size={21} />}
        tone="green"
      />

      <section className="panel-card step-card step-card--refined">
        <div className="stepper stepper--corporate">
          {wizardSteps.map(({ id, label, icon: StepIcon }) => (
            <div key={id} className={id === step ? 'stepper__item stepper__item--active' : 'stepper__item'}>
              <span className={id <= step ? 'stepper__index stepper__index--active' : 'stepper__index'}><StepIcon size={15} /></span>
              <span className="stepper__label">
                <strong>{label}</strong>
              </span>
            </div>
          ))}
        </div>

        {lotes.length === 0 || camas.length === 0 ? (
          <EmptyState
            icon={<Sprout size={28} />}
            title="Faltan datos base para registrar siembra"
            description="Primero registra lotes e invernaderos y camas productivas para habilitar este flujo."
          />
        ) : null}

        {step === 1 && lotes.length > 0 && camas.length > 0 && (
          <div className="step-card__body">
            <h3>Selecciona ubicación productiva</h3>
            <p>Elige el lote y la cama donde se colocará la siembra. Solo se listan camas asociadas al lote seleccionado.</p>
            <div className="form-grid form-grid--two">
              <label>
                Lote
                <select value={payload.loteId} onChange={(event) => setPayload({ ...payload, loteId: Number(event.target.value), camaId: 0 })}>
                  <option value={0}>Seleccionar lote...</option>
                  {lotes.map((lote) => <option key={lote.id} value={lote.id}>{lote.codigo} {lote.descripcion ? `· ${lote.descripcion}` : ''}</option>)}
                </select>
              </label>
              <label>
                Cama
                <select value={payload.camaId} onChange={(event) => setPayload({ ...payload, camaId: Number(event.target.value) })} disabled={!payload.loteId}>
                  <option value={0}>{payload.loteId ? 'Seleccionar cama...' : 'Selecciona un lote primero'}</option>
                  {camasDisponibles.map((cama) => <option key={cama.id} value={cama.id}>{cama.codigo} {cama.descripcion ? `· ${cama.descripcion}` : ''}</option>)}
                </select>
              </label>
            </div>
            {payload.loteId && camasDisponibles.length === 0 ? <div className="form-alert">El lote seleccionado todavía no tiene camas registradas.</div> : null}
            {selectionError ? <div className="form-hint form-hint--warning">{selectionError}</div> : null}
          </div>
        )}

        {step === 2 && (
          <div className="step-card__body">
            <h3>Registra datos de siembra</h3>
            <p>La fecha y la cantidad permiten conservar la trazabilidad desde el primer registro operativo.</p>
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
                <textarea value={payload.observacion} onChange={(event) => setPayload({ ...payload, observacion: event.target.value })} placeholder="Notas relevantes del registro de siembra" />
              </label>
            </div>
            {dataError ? <div className="form-hint form-hint--warning">{dataError}</div> : null}
          </div>
        )}

        {step === 3 && (
          <div className="step-card__body">
            <h3>Confirma el registro</h3>
            <p>Verifica los datos antes de guardar la siembra en la trazabilidad del lote.</p>
            <div className="confirmation-grid confirmation-grid--refined">
              <div><span>Lote</span><strong>{selectedLote?.codigo || 'No seleccionado'}</strong><small>{selectedLote?.descripcion || 'Sin descripción'}</small></div>
              <div><span>Cama</span><strong>{selectedCama?.codigo || 'No seleccionada'}</strong><small>{selectedCama?.descripcion || 'Sin descripción'}</small></div>
              <div><span>Fecha</span><strong>{dateShort(payload.fechaSiembra)}</strong></div>
              <div><span>Cantidad</span><strong>{numberCompact(payload.cantidadRegistrada)}</strong></div>
            </div>
            {payload.observacion ? <div className="confirmation-note"><strong>Observación:</strong> {payload.observacion}</div> : null}
            {error ? <div className="form-alert">{error}</div> : null}
          </div>
        )}

        <div className="step-card__footer">
          <button type="button" className="ghost-button" onClick={() => setStep(Math.max(step - 1, 1))} disabled={step === 1}><ChevronLeft size={16} /> Anterior</button>
          {step < 3 ? (
            <button type="button" className="action-button" onClick={goNext} disabled={(step === 1 && Boolean(selectionError)) || (step === 2 && Boolean(dataError)) || lotes.length === 0 || camas.length === 0}><span>Siguiente</span> <ChevronRight size={16} /></button>
          ) : (
            <button type="button" className="action-button" onClick={submit} disabled={saving || Boolean(selectionError) || Boolean(dataError)}>{saving ? 'Guardando...' : 'Registrar siembra'}</button>
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
        {recientes.length > 0 ? (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Lote</th>
                  <th>Cama</th>
                  <th>Fecha</th>
                  <th>Cantidad</th>
                  <th>Estado</th>
                  <th />
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
                    <td>
                      <div className="icon-actions">
                        <button type="button" className="icon-action" title="Editar" onClick={() => setEditingSiembra(siembra)}><Pencil size={15} /></button>
                        <button type="button" className="icon-action" title="Cambiar estado" onClick={() => setPendingStatus(siembra)}><RotateCcw size={15} /></button>
                        <button type="button" className="icon-action icon-action--danger" title="Eliminar" onClick={() => setPendingDelete(siembra)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState compact icon={<Sprout size={24} />} title="Sin siembras registradas" description="Los registros recientes aparecerán luego de guardar la primera siembra." />
        )}
      </section>

      <Modal open={Boolean(editingSiembra)} title="Editar siembra" description="Actualiza lote, cama, fecha, cantidad y estado." onClose={() => setEditingSiembra(null)}>
        {editingSiembra ? <SiembraForm lotes={lotes} camas={camas} initialData={toPayload(editingSiembra)} submitLabel="Guardar cambios" onSubmit={updateSiembra} onCancel={() => setEditingSiembra(null)} /> : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingStatus)}
        title="Cambiar estado de siembra"
        description="Se alternará el estado entre registrada y anulada."
        confirmLabel="Cambiar estado"
        loading={confirming}
        onCancel={() => setPendingStatus(null)}
        onConfirm={confirmToggleStatus}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Eliminar registro de siembra"
        description={pendingDelete ? `Se eliminará la siembra #${pendingDelete.id} del lote ${pendingDelete.lote?.codigo || 'seleccionado'}. Esta acción actualiza la trazabilidad y los reportes.` : ''}
        confirmLabel="Eliminar"
        tone="danger"
        loading={confirming}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDeleteSiembra}
      />
    </main>
  );
}
