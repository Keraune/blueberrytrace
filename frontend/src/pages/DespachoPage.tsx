import { useMemo, useState } from 'react';
import { Download, Eye, Filter, Plus, Truck } from 'lucide-react';
import { DespachoForm } from '../components/DespachoForm';
import { DetailDrawer } from '../components/DetailDrawer';
import { InfoGrid } from '../components/InfoGrid';
import { ModuleHeader } from '../components/ModuleHeader';
import { StatusBadge } from '../components/StatusBadge';
import { blueberryApi } from '../lib/api';
import { dateShort, numberCompact } from '../lib/format';
import type { DespachoFormPayload, DespachoResponse, ReferenceResponse } from '../types/api';

interface DespachoPageProps {
  despachos: DespachoResponse[];
  lotes: ReferenceResponse[];
  modalidades: string[];
  validaciones: string[];
  onDespachosChange: (items: DespachoResponse[]) => void;
}

export function DespachoPage({ despachos, lotes, modalidades, validaciones, onDespachosChange }: DespachoPageProps) {
  const [tab, setTab] = useState<'historial' | 'nuevo'>('historial');
  const [selectedDespacho, setSelectedDespacho] = useState<DespachoResponse | null>(null);
  const plantas = despachos.reduce((total, item) => total + (item.cantidadDespachada || 0), 0);
  const enTransito = despachos.filter((item) => /TRANSITO/i.test(item.estado || '')).reduce((total, item) => total + (item.cantidadDespachada || 0), 0);
  const exportaciones = despachos.filter((item) => /EXPORT/i.test(item.modalidad || '')).length;
  const locales = despachos.length - exportaciones;

  async function create(payload: DespachoFormPayload) {
    const response = await blueberryApi.createDespacho(payload);
    onDespachosChange(response.items);
    setTab('historial');
  }

  const summary = [
    { label: 'Total despachado', value: plantas, suffix: 'plantas', tone: 'green' },
    { label: 'En tránsito ahora', value: enTransito, suffix: 'plantas', tone: 'blue' },
    { label: 'Exportaciones', value: exportaciones, suffix: 'este mes', tone: 'purple' },
    { label: 'Ventas locales', value: locales, suffix: 'este mes', tone: 'orange' }
  ];

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Salida"
        title="Módulo de Despacho"
        description="Registro y seguimiento de despachos de exportación."
      />

      <div className="tab-switcher">
        <button type="button" className={tab === 'historial' ? 'tab-switcher__item tab-switcher__item--active' : 'tab-switcher__item'} onClick={() => setTab('historial')}>Historial de Despachos</button>
        <button type="button" className={tab === 'nuevo' ? 'tab-switcher__item tab-switcher__item--active' : 'tab-switcher__item'} onClick={() => setTab('nuevo')}><Plus size={15} /> Nuevo Despacho</button>
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
              <h2>Historial de Despachos</h2>
            </div>
            <div className="button-group">
              <button type="button" className="ghost-button"><Filter size={15} /> Filtrar</button>
              <button type="button" className="ghost-button"><Download size={15} /> Excel</button>
            </div>
          </div>
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
                  <th>Estado</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {despachos.map((item) => (
                  <tr key={item.id}>
                    <td><strong className="table-code">D-{String(item.id).padStart(4, '0')}</strong></td>
                    <td>{item.lote?.codigo || 'Sin lote'}</td>
                    <td>{dateShort(item.fechaDespacho)}</td>
                    <td>{numberCompact(item.cantidadDespachada || 0)}</td>
                    <td><StatusBadge value={item.modalidad} /></td>
                    <td>{item.destino || 'Sin destino'}</td>
                    <td><StatusBadge value={item.estado} /></td>
                    <td><button type="button" className="icon-action" onClick={() => setSelectedDespacho(item)}><Eye size={15} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer-note">{despachos.length} despachos registrados</div>
        </section>
      ) : (
        <section className="panel-card panel-card--form-only">
          <div className="panel-card__header"><div><h2>Nuevo Despacho</h2><p>Registro de salida y validación de calidad.</p></div></div>
          <DespachoForm lotes={lotes} modalidades={modalidades} validaciones={validaciones} onSubmit={create} onCancel={() => setTab('historial')} />
        </section>
      )}
      <DetailDrawer
        open={Boolean(selectedDespacho)}
        title={selectedDespacho ? `D-${String(selectedDespacho.id).padStart(4, '0')}` : 'Detalle de despacho'}
        subtitle={selectedDespacho?.destino || selectedDespacho?.lote?.codigo || 'Registro de salida'}
        onClose={() => setSelectedDespacho(null)}
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
                { label: 'Validación', value: selectedDespacho.validacionCalidad || 'No registrada' }
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

    </main>
  );
}
