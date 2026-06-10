import { useMemo, useState } from 'react';
import { Eye, Factory, Pencil, Plus } from 'lucide-react';
import { FilterToolbar } from '../components/FilterToolbar';
import { LoteForm } from '../components/LoteForm';
import { Modal } from '../components/Modal';
import { ModuleHeader } from '../components/ModuleHeader';
import { StatusBadge } from '../components/StatusBadge';
import { blueberryApi } from '../lib/api';
import { dateShort, numberCompact } from '../lib/format';
import type { CamaResponse, LoteFormPayload, LoteResponse, SiembraResponse } from '../types/api';

interface LotesPageProps {
  lotes: LoteResponse[];
  camas: CamaResponse[];
  siembras: SiembraResponse[];
  onLotesChange: (items: LoteResponse[]) => void;
}

const statusTabs = ['TODOS', 'ACTIVO', 'EN PROCESO', 'COSECHA', 'COMPLETADO', 'PENDIENTE'] as const;

export function LotesPage({ lotes, camas, siembras, onLotesChange }: LotesPageProps) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof statusTabs)[number]>('TODOS');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return lotes.filter((lote) => {
      const matchesQuery = !term || [lote.codigo, lote.descripcion, lote.cultivo, lote.variedad, lote.estado]
        .some((value) => String(value || '').toLowerCase().includes(term));
      const matchesStatus = status === 'TODOS' || String(lote.estado || '').toUpperCase() === status;
      return matchesQuery && matchesStatus;
    });
  }, [lotes, query, status]);

  async function createLote(payload: LoteFormPayload) {
    const response = await blueberryApi.createLote(payload);
    onLotesChange(response.items);
    setModalOpen(false);
  }

  const cards = [
    { label: 'Total Lotes', value: lotes.length, tone: 'default' },
    { label: 'Activos', value: lotes.filter((item) => (item.estado || '').toUpperCase() === 'ACTIVO').length, tone: 'green' },
    { label: 'En Proceso', value: lotes.filter((item) => /PROCESO|MANTENIMIENTO/i.test(item.estado || '')).length, tone: 'blue' },
    { label: 'Cosecha', value: lotes.filter((item) => /COSECHA/i.test(item.estado || '')).length, tone: 'purple' },
    { label: 'Pendientes', value: lotes.filter((item) => /PENDIENTE/i.test(item.estado || '')).length, tone: 'orange' }
  ];

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Producción"
        title="Gestión de Lotes e Invernaderos"
        description="Control de lotes, camas y bandejas de arándano."
        actions={<button className="action-button" type="button" onClick={() => setModalOpen(true)}><Plus size={16} /> Nuevo lote</button>}
      />

      <section className="summary-strip summary-strip--five">
        {cards.map((card) => (
          <article key={card.label} className={`summary-pill summary-pill--${card.tone}`}>
            <strong>{card.value}</strong>
            <span>{card.label}</span>
          </article>
        ))}
      </section>

      <section className="panel-card">
        <div className="module-toolbar-card">
          <FilterToolbar value={query} onChange={setQuery} placeholder="Buscar lote o invernadero..." />
          <div className="segmented-tabs">
            {statusTabs.map((tab) => (
              <button key={tab} type="button" className={tab === status ? 'segmented-tabs__item segmented-tabs__item--active' : 'segmented-tabs__item'} onClick={() => setStatus(tab)}>
                {tab === 'TODOS' ? 'Todos' : tab === 'ACTIVO' ? 'Activo' : tab === 'EN PROCESO' ? 'En Proceso' : tab === 'COMPLETADO' ? 'Completado' : tab === 'PENDIENTE' ? 'Pendiente' : 'Cosecha'}
              </button>
            ))}
          </div>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Lote</th>
                <th>Invernadero</th>
                <th>Variedad</th>
                <th>Camas</th>
                <th>Plantas</th>
                <th>Inicio</th>
                <th>Supervisor</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((lote) => {
                const camasCount = camas.filter((cama) => cama.lote?.id === lote.id).length;
                const plantas = siembras.filter((siembra) => siembra.lote?.id === lote.id).reduce((total, siembra) => total + (siembra.cantidadRegistrada || 0), 0);
                return (
                  <tr key={lote.id}>
                    <td><strong className="table-code">{lote.codigo}</strong></td>
                    <td>{lote.descripcion || 'Sin descripción'}</td>
                    <td>{lote.variedad || 'No definida'}</td>
                    <td>{camasCount}</td>
                    <td>{plantas ? numberCompact(plantas) : '—'}</td>
                    <td>{dateShort(lote.fechaRegistro)}</td>
                    <td>{lote.usuarioRegistro?.nombreCompleto || 'Sin asignar'}</td>
                    <td><StatusBadge value={lote.estado} /></td>
                    <td>
                      <div className="icon-actions">
                        <button type="button" className="icon-action" title="Visualizar"><Eye size={15} /></button>
                        <button type="button" className="icon-action" title="Editar estado" onClick={async () => onLotesChange((await blueberryApi.toggleLoteStatus(lote.id)).items)}><Pencil size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="table-footer-note">Mostrando {filtered.length} de {lotes.length} lotes registrados</div>
      </section>

      <Modal open={modalOpen} title="Nuevo lote" description="Registra un lote productivo o invernadero." onClose={() => setModalOpen(false)}>
        <LoteForm onSubmit={createLote} onCancel={() => setModalOpen(false)} />
      </Modal>
    </main>
  );
}
