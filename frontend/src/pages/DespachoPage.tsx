import { useMemo, useState } from 'react';
import { Download, Eye, Pencil, Plus, RefreshCcw, Truck } from 'lucide-react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DespachoForm } from '../components/DespachoForm';
import { DetailDrawer } from '../components/DetailDrawer';
import { EmptyState } from '../components/EmptyState';
import { InfoGrid } from '../components/InfoGrid';
import { Modal } from '../components/Modal';
import { ModuleHeader } from '../components/ModuleHeader';
import { StatusBadge } from '../components/StatusBadge';
import { blueberryApi } from '../lib/api';
import { downloadCsv } from '../lib/export';
import { dateShort, numberCompact } from '../lib/format';
import { emitToast } from '../lib/uiEvents';
import type { DespachoFormPayload, DespachoResponse, ReferenceResponse } from '../types/api';

interface DespachoPageProps {
  despachos: DespachoResponse[];
  lotes: ReferenceResponse[];
  modalidades: string[];
  validaciones: string[];
  onDespachosChange: (items: DespachoResponse[]) => void;
}

function toPayload(item: DespachoResponse): DespachoFormPayload {
  return {
    loteId: item.lote?.id || 0,
    fechaDespacho: item.fechaDespacho || new Date().toISOString().slice(0, 10),
    modalidad: item.modalidad || '',
    cantidadDespachada: item.cantidadDespachada || 1,
    destino: item.destino || '',
    guiaRemision: item.guiaRemision || '',
    validacionCalidad: item.validacionCalidad || '',
    observacion: item.observacion || '',
    estado: item.estado || 'REGISTRADO'
  };
}

export function DespachoPage({ despachos, lotes, modalidades, validaciones, onDespachosChange }: DespachoPageProps) {
  const [tab, setTab] = useState<'historial' | 'nuevo'>('historial');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [selectedDespacho, setSelectedDespacho] = useState<DespachoResponse | null>(null);
  const [editingDespacho, setEditingDespacho] = useState<DespachoResponse | null>(null);
  const [pendingStatus, setPendingStatus] = useState<{ item: DespachoResponse; estado: string } | null>(null);
  const [confirming, setConfirming] = useState(false);

  const availableStates = useMemo(() => Array.from(new Set(despachos.map((item) => item.estado).filter(Boolean))) as string[], [despachos]);
  const filteredDespachos = useMemo(() => despachos.filter((item) => statusFilter === 'TODOS' || item.estado === statusFilter), [despachos, statusFilter]);

  const plantas = despachos.reduce((total, item) => total + (item.cantidadDespachada || 0), 0);
  const enSeguimiento = despachos
    .filter((item) => !/CERRADO|ANULADO/i.test(item.estado || ''))
    .reduce((total, item) => total + (item.cantidadDespachada || 0), 0);
  const cerrados = despachos.filter((item) => /CERRADO/i.test(item.estado || '')).length;
  const observados = despachos.filter((item) => /OBSERVADO|RECHAZADO/i.test(`${item.estado || ''} ${item.validacionCalidad || ''}`)).length;

  async function create(payload: DespachoFormPayload) {
    const response = await blueberryApi.createDespacho(payload);
    onDespachosChange(response.items);
    setTab('historial');
    emitToast('success', 'Despacho registrado', 'La salida fue creada correctamente.');
  }

  async function update(payload: DespachoFormPayload) {
    if (!editingDespacho) return;
    const response = await blueberryApi.updateDespacho(editingDespacho.id, payload);
    onDespachosChange(response.items);
    setEditingDespacho(null);
    setSelectedDespacho(null);
    emitToast('success', 'Despacho actualizado', 'Los datos del despacho fueron guardados.');
  }

  async function confirmChangeStatus() {
    if (!pendingStatus) return;
    try {
      setConfirming(true);
      const response = await blueberryApi.changeDespachoStatus(pendingStatus.item.id, pendingStatus.estado);
      onDespachosChange(response.items);
      emitToast('success', 'Estado actualizado', `El despacho cambió a ${pendingStatus.estado}.`);
      setPendingStatus(null);
    } catch (exception) {
      emitToast('error', 'No se pudo actualizar', exception instanceof Error ? exception.message : 'Ocurrió un error inesperado.');
    } finally {
      setConfirming(false);
    }
  }

  function exportCsv() {
    downloadCsv('blueberrytrace-despachos.csv', [
      'Código', 'Lote', 'Fecha', 'Cantidad despachada', 'Modalidad', 'Destino', 'Guía de remisión', 'Validación calidad', 'Estado', 'Responsable'
    ], filteredDespachos.map((item) => [
      `D-${String(item.id).padStart(4, '0')}`,
      item.lote?.codigo || '',
      item.fechaDespacho || '',
      item.cantidadDespachada || 0,
      item.modalidad || '',
      item.destino || '',
      item.guiaRemision || '',
      item.validacionCalidad || '',
      item.estado || '',
      item.usuarioRegistro?.nombreCompleto || ''
    ]));
  }

  const summary = [
    { label: 'Total despachado', value: plantas, suffix: 'plantas', tone: 'green' },
    { label: 'En seguimiento', value: enSeguimiento, suffix: 'plantas', tone: 'blue' },
    { label: 'Cerrados', value: cerrados, suffix: 'registros', tone: 'purple' },
    { label: 'Con observación', value: observados, suffix: 'registros', tone: 'orange' }
  ];

  return (
    <main className="content-grid dispatch-screen">
      <ModuleHeader
        eyebrow="Salida"
        title="Seguimiento de despacho"
        description="Registro, edición y seguimiento de salidas de plantas por lote."
      />

      <div className="tab-switcher">
        <button type="button" className={tab === 'historial' ? 'tab-switcher__item tab-switcher__item--active' : 'tab-switcher__item'} onClick={() => setTab('historial')}>Historial de despachos</button>
        <button type="button" className={tab === 'nuevo' ? 'tab-switcher__item tab-switcher__item--active' : 'tab-switcher__item'} onClick={() => setTab('nuevo')}><Plus size={15} /> Nuevo despacho</button>
      </div>

      <section className="summary-strip summary-strip--four">
        {summary.map((card) => (
          <article key={card.label} className={`summary-pill summary-pill--${card.tone}`}>
            <span>{card.label}</span>
            <strong>{numberCompact(card.value)}</strong>
            <small>{card.suffix}</small>
          </article>
        ))}
      </section>

      {tab === 'historial' ? (
        <section className="panel-card">
          <div className="panel-card__header">
            <div>
              <h2>Historial de despachos</h2>
              <p>Salidas registradas con lote, cantidad, modalidad y validación.</p>
            </div>
            <div className="button-group">
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="toolbar-select">
                <option value="TODOS">Todos los estados</option>
                {availableStates.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
              </select>
              <button type="button" className="ghost-button" onClick={exportCsv} disabled={filteredDespachos.length === 0}><Download size={15} /> Exportar CSV</button>
            </div>
          </div>

          {filteredDespachos.length > 0 ? (
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID despacho</th>
                    <th>Lote</th>
                    <th>Fecha</th>
                    <th>Cantidad</th>
                    <th>Modalidad</th>
                    <th>Destino</th>
                    <th>Validación</th>
                    <th>Estado</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filteredDespachos.map((item) => (
                    <tr key={item.id}>
                      <td><strong className="table-code">D-{String(item.id).padStart(4, '0')}</strong></td>
                      <td>{item.lote?.codigo || 'Sin lote'}</td>
                      <td>{dateShort(item.fechaDespacho)}</td>
                      <td>{numberCompact(item.cantidadDespachada || 0)}</td>
                      <td><StatusBadge value={item.modalidad} /></td>
                      <td>{item.destino || 'Sin destino'}</td>
                      <td><StatusBadge value={item.validacionCalidad} /></td>
                      <td><StatusBadge value={item.estado} /></td>
                      <td>
                        <div className="icon-actions">
                          <button type="button" className="icon-action" onClick={() => setSelectedDespacho(item)}><Eye size={15} /></button>
                          <button type="button" className="icon-action" onClick={() => setEditingDespacho(item)}><Pencil size={15} /></button>
                          <button type="button" className="icon-action" onClick={() => setPendingStatus({ item, estado: 'CERRADO' })}><RefreshCcw size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={<Truck size={26} />}
              title="Sin despachos registrados"
              description="Cuando se registren salidas de plantas, el historial aparecerá en esta sección."
              compact
              action={<button type="button" className="action-button" onClick={() => setTab('nuevo')}><Plus size={15} /> Registrar despacho</button>}
            />
          )}
          <div className="table-footer-note">{filteredDespachos.length} de {despachos.length} despachos registrados</div>
        </section>
      ) : (
        <section className="panel-card panel-card--form-only dispatch-form-card">
          <div className="panel-card__header"><div><h2>Nuevo despacho</h2><p>Registro de salida, destino y validación de calidad.</p></div></div>
          <DespachoForm lotes={lotes} modalidades={modalidades} validaciones={validaciones} onSubmit={create} onCancel={() => setTab('historial')} />
        </section>
      )}

      <DetailDrawer
        open={Boolean(selectedDespacho)}
        title={selectedDespacho ? `D-${String(selectedDespacho.id).padStart(4, '0')}` : 'Detalle de despacho'}
        subtitle={selectedDespacho?.destino || selectedDespacho?.lote?.codigo || 'Registro de salida'}
        onClose={() => setSelectedDespacho(null)}
        actions={selectedDespacho ? <button type="button" className="action-button" onClick={() => setEditingDespacho(selectedDespacho)}><Pencil size={15} /> Editar despacho</button> : null}
      >
        {selectedDespacho ? (
          <>
            <InfoGrid
              items={[
                { label: 'Lote', value: selectedDespacho.lote?.codigo || 'Sin lote', tone: 'green' },
                { label: 'Fecha', value: dateShort(selectedDespacho.fechaDespacho) },
                { label: 'Cantidad', value: numberCompact(selectedDespacho.cantidadDespachada || 0), tone: 'blue' },
                { label: 'Modalidad', value: <StatusBadge value={selectedDespacho.modalidad} />, tone: 'purple' },
                { label: 'Estado', value: <StatusBadge value={selectedDespacho.estado} />, tone: 'orange' },
                { label: 'Validación', value: <StatusBadge value={selectedDespacho.validacionCalidad} /> }
              ]}
            />
            <section className="drawer-section">
              <h3>Guía y observación</h3>
              <p><strong>Guía:</strong> {selectedDespacho.guiaRemision || 'Sin guía registrada'}</p>
              <p>{selectedDespacho.observacion || 'No se registraron observaciones.'}</p>
            </section>
          </>
        ) : null}
      </DetailDrawer>

      <Modal open={Boolean(editingDespacho)} title="Editar despacho" description="Actualiza salida, destino, guía y validación." onClose={() => setEditingDespacho(null)}>
        {editingDespacho ? <DespachoForm lotes={lotes} modalidades={modalidades} validaciones={validaciones} initialData={toPayload(editingDespacho)} submitLabel="Guardar cambios" onSubmit={update} onCancel={() => setEditingDespacho(null)} /> : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingStatus)}
        title="Cerrar despacho"
        description="Se marcará este despacho como cerrado."
        confirmLabel="Cerrar despacho"
        tone="success"
        loading={confirming}
        onCancel={() => setPendingStatus(null)}
        onConfirm={confirmChangeStatus}
      />
    </main>
  );
}
