import { useMemo, useState } from 'react';
import { Download, Pencil, Plus, RotateCcw } from 'lucide-react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { ModuleHeader } from '../components/ModuleHeader';
import { ProcesoForm } from '../components/ProcesoForm';
import { StatusBadge } from '../components/StatusBadge';
import { blueberryApi } from '../lib/api';
import { dateShort, numberCompact } from '../lib/format';
import { emitToast } from '../lib/uiEvents';
import type { CamaResponse, FormalizacionFormPayload, FormalizacionResponse, ProcesoOperativoResponse, ReferenceResponse, SiembraResponse, UniformizacionFormPayload, UniformizacionResponse } from '../types/api';

interface ProcesosPageProps {
  procesos: ProcesoOperativoResponse | null;
  lotes: ReferenceResponse[];
  camas: CamaResponse[];
  siembras: SiembraResponse[];
  onProcesosChange: (items: ProcesoOperativoResponse) => void;
}

export function ProcesosPage({ procesos, lotes, camas, siembras, onProcesosChange }: ProcesosPageProps) {
  const [modal, setModal] = useState<'uniformizacion' | 'formalizacion' | null>(null);
  const [editingUniformizacion, setEditingUniformizacion] = useState<UniformizacionResponse | null>(null);
  const [editingFormalizacion, setEditingFormalizacion] = useState<FormalizacionResponse | null>(null);
  const [pendingStatus, setPendingStatus] = useState<{ type: 'uniformizacion' | 'formalizacion'; id: number; code: string } | null>(null);
  const [confirming, setConfirming] = useState(false);

  const uniformizaciones = procesos?.uniformizaciones.items || [];
  const formalizaciones = procesos?.formalizaciones.items || [];

  const aggregated = useMemo(() => {
    return lotes.map((lote) => {
      const siembrasLote = siembras.filter((siembra) => siembra.lote?.id === lote.id);
      const planted = siembrasLote.reduce((total, siembra) => total + (siembra.cantidadRegistrada || 0), 0);
      const registros = uniformizaciones.filter((registro) => registro.lote?.id === lote.id);
      const uniformized = registros.reduce((total, registro) => total + (registro.cantidadUniformizada || 0), 0);
      const latest = registros[0];
      const progress = planted === 0 ? 0 : Math.min(100, Math.round((uniformized / planted) * 100));
      return {
        lote,
        planted,
        uniformized,
        progress,
        latest,
        status: progress >= 100 ? 'COMPLETADO' : progress > 0 ? 'EN PROCESO' : 'PENDIENTE'
      };
    }).filter((item) => item.planted > 0 || item.uniformized > 0).slice(0, 6);
  }, [lotes, siembras, uniformizaciones]);

  async function createUniformizacion(payload: UniformizacionFormPayload | FormalizacionFormPayload) {
    onProcesosChange(await blueberryApi.createUniformizacion(payload as UniformizacionFormPayload));
    setModal(null);
    emitToast('success', 'Uniformización registrada', 'El proceso fue guardado correctamente.');
  }

  async function createFormalizacion(payload: UniformizacionFormPayload | FormalizacionFormPayload) {
    onProcesosChange(await blueberryApi.createFormalizacion(payload as FormalizacionFormPayload));
    setModal(null);
    emitToast('success', 'Formalización registrada', 'El proceso fue guardado correctamente.');
  }

  async function updateUniformizacion(payload: UniformizacionFormPayload | FormalizacionFormPayload) {
    if (!editingUniformizacion) return;
    onProcesosChange(await blueberryApi.updateUniformizacion(editingUniformizacion.id, payload as UniformizacionFormPayload));
    setEditingUniformizacion(null);
    emitToast('success', 'Uniformización actualizada', 'Los cambios fueron guardados.');
  }

  async function updateFormalizacion(payload: UniformizacionFormPayload | FormalizacionFormPayload) {
    if (!editingFormalizacion) return;
    onProcesosChange(await blueberryApi.updateFormalizacion(editingFormalizacion.id, payload as FormalizacionFormPayload));
    setEditingFormalizacion(null);
    emitToast('success', 'Formalización actualizada', 'Los cambios fueron guardados.');
  }

  async function confirmToggleStatus() {
    if (!pendingStatus) return;
    try {
      setConfirming(true);
      if (pendingStatus.type === 'uniformizacion') {
        onProcesosChange(await blueberryApi.toggleUniformizacionStatus(pendingStatus.id));
      } else {
        onProcesosChange(await blueberryApi.toggleFormalizacionStatus(pendingStatus.id));
      }
      emitToast('success', 'Estado actualizado', `El registro ${pendingStatus.code} fue actualizado.`);
      setPendingStatus(null);
    } catch (exception) {
      emitToast('error', 'No se pudo cambiar el estado', exception instanceof Error ? exception.message : 'Ocurrió un error inesperado.');
    } finally {
      setConfirming(false);
    }
  }

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Proceso productivo"
        title="Uniformización y Formalización"
        description="Control, edición y seguimiento del proceso productivo por lote."
        actions={<div className="button-group"><button type="button" className="ghost-button" onClick={() => setModal('uniformizacion')}><Plus size={15} /> Uniformización</button><button type="button" className="action-button" onClick={() => setModal('formalizacion')}><Plus size={15} /> Formalización</button></div>}
      />

      <div className="module-utility-row">
        <button type="button" className="ghost-button"><Download size={15} /> Exportar reporte</button>
      </div>

      <section className="stacked-process-list">
        {aggregated.map((item) => (
          <article className="process-card" key={item.lote.id}>
            <div className="process-card__header">
              <div className="process-card__identity">
                <span className="process-card__icon">◎</span>
                <div>
                  <div className="process-card__title"><strong>{item.lote.codigo}</strong> <span>{item.lote.descripcion || 'Invernadero'}</span></div>
                  <small>{numberCompact(item.planted)} plantas · Actualizado: {dateShort(item.latest?.fechaActualizacion || item.latest?.fechaCreacion || null)}</small>
                </div>
              </div>
              <div className="process-card__meta">
                <StatusBadge value={item.status} />
                <strong>{item.progress}%</strong>
              </div>
            </div>
            <span className="process-card__caption">Progreso de uniformización</span>
            <div className="progress-track progress-track--wide"><span style={{ width: `${item.progress}%` }} /></div>
            <div className="process-card__footer">
              <span>{numberCompact(item.uniformized)} uniformizadas</span>
              <span>{numberCompact(item.planted)} sembradas</span>
            </div>
          </article>
        ))}
      </section>

      <section className="tables-grid">
        <DataTable<UniformizacionResponse>
          title="Uniformizaciones"
          description="Registros editables por lote y cama."
          items={uniformizaciones}
          columns={[
            { key: 'lote', label: 'Lote', render: (item) => item.lote?.codigo || 'Sin lote' },
            { key: 'cama', label: 'Cama', render: (item) => item.cama?.codigo || 'Sin cama' },
            { key: 'fechaUniformizacion', label: 'Fecha', render: (item) => dateShort(item.fechaUniformizacion) },
            { key: 'cantidadUniformizada', label: 'Cantidad', render: (item) => numberCompact(item.cantidadUniformizada || 0) },
            { key: 'estado', label: 'Estado', render: (item) => <StatusBadge value={item.estado} /> },
            { key: 'acciones', label: 'Acciones', render: (item) => (
              <div className="icon-actions">
                <button type="button" className="icon-action" onClick={() => setEditingUniformizacion(item)}><Pencil size={15} /></button>
                <button type="button" className="icon-action" onClick={() => setPendingStatus({ type: 'uniformizacion', id: item.id, code: item.lote?.codigo || `UNI-${item.id}` })}><RotateCcw size={15} /></button>
              </div>
            ) }
          ]}
        />
        <DataTable<FormalizacionResponse>
          title="Formalizaciones"
          description="Bandejas y plantas formalizadas con edición directa."
          items={formalizaciones}
          columns={[
            { key: 'lote', label: 'Lote', render: (item) => item.lote?.codigo || 'Sin lote' },
            { key: 'cama', label: 'Cama', render: (item) => item.cama?.codigo || 'Sin cama' },
            { key: 'fechaFormalizacion', label: 'Fecha', render: (item) => dateShort(item.fechaFormalizacion) },
            { key: 'cantidadPlantas', label: 'Plantas', render: (item) => numberCompact(item.cantidadPlantas || 0) },
            { key: 'estado', label: 'Estado', render: (item) => <StatusBadge value={item.estado} /> },
            { key: 'acciones', label: 'Acciones', render: (item) => (
              <div className="icon-actions">
                <button type="button" className="icon-action" onClick={() => setEditingFormalizacion(item)}><Pencil size={15} /></button>
                <button type="button" className="icon-action" onClick={() => setPendingStatus({ type: 'formalizacion', id: item.id, code: item.lote?.codigo || `FOR-${item.id}` })}><RotateCcw size={15} /></button>
              </div>
            ) }
          ]}
        />
      </section>

      <Modal open={modal === 'uniformizacion'} title="Nueva uniformización" description="Registra cantidad inicial y cantidad uniformizada." onClose={() => setModal(null)}>
        <ProcesoForm mode="uniformizacion" lotes={lotes} camas={camas} onSubmit={createUniformizacion} onCancel={() => setModal(null)} />
      </Modal>
      <Modal open={modal === 'formalizacion'} title="Nueva formalización" description="Registra bandejas y plantas formalizadas." onClose={() => setModal(null)}>
        <ProcesoForm mode="formalizacion" lotes={lotes} camas={camas} onSubmit={createFormalizacion} onCancel={() => setModal(null)} />
      </Modal>

      <Modal open={Boolean(editingUniformizacion)} title="Editar uniformización" description="Actualiza cantidades y criterio del proceso." onClose={() => setEditingUniformizacion(null)}>
        {editingUniformizacion ? <ProcesoForm mode="uniformizacion" lotes={lotes} camas={camas} initialData={editingUniformizacion} submitLabel="Guardar cambios" onSubmit={updateUniformizacion} onCancel={() => setEditingUniformizacion(null)} /> : null}
      </Modal>
      <Modal open={Boolean(editingFormalizacion)} title="Editar formalización" description="Actualiza bandejas y plantas formalizadas." onClose={() => setEditingFormalizacion(null)}>
        {editingFormalizacion ? <ProcesoForm mode="formalizacion" lotes={lotes} camas={camas} initialData={editingFormalizacion} submitLabel="Guardar cambios" onSubmit={updateFormalizacion} onCancel={() => setEditingFormalizacion(null)} /> : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingStatus)}
        title="Cambiar estado del proceso"
        description="Se alternará el estado entre registrado y anulado."
        confirmLabel="Cambiar estado"
        loading={confirming}
        onCancel={() => setPendingStatus(null)}
        onConfirm={confirmToggleStatus}
      />
    </main>
  );
}
