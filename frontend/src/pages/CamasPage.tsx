import { useMemo, useState } from 'react';
import { Eye, Plus, RotateCcw } from 'lucide-react';
import { CamaForm } from '../components/CamaForm';
import { DetailDrawer } from '../components/DetailDrawer';
import { DataTable } from '../components/DataTable';
import { FilterToolbar } from '../components/FilterToolbar';
import { InfoGrid } from '../components/InfoGrid';
import { Modal } from '../components/Modal';
import { ModuleHeader } from '../components/ModuleHeader';
import { StatusBadge } from '../components/StatusBadge';
import { blueberryApi } from '../lib/api';
import { numberCompact } from '../lib/format';
import type { CamaFormPayload, CamaResponse, ReferenceResponse } from '../types/api';

interface CamasPageProps {
  camas: CamaResponse[];
  lotes: ReferenceResponse[];
  onCamasChange: (items: CamaResponse[]) => void;
}

export function CamasPage({ camas, lotes, onCamasChange }: CamasPageProps) {
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCama, setSelectedCama] = useState<CamaResponse | null>(null);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return camas;
    }
    return camas.filter((cama) => [cama.codigo, cama.descripcion, cama.estado, cama.lote?.codigo]
      .some((value) => String(value || '').toLowerCase().includes(term)));
  }, [camas, query]);

  const activas = camas.filter((cama) => cama.estado === 'ACTIVA').length;
  const capacidad = camas.reduce((total, cama) => total + (cama.capacidadReferencial || 0), 0);

  async function createCama(payload: CamaFormPayload) {
    const response = await blueberryApi.createCama(payload);
    onCamasChange(response.items);
    setModalOpen(false);
  }

  async function toggleStatus(id: number) {
    const response = await blueberryApi.toggleCamaStatus(id);
    onCamasChange(response.items);
  }

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Infraestructura"
        title="Camas productivas"
        description="Seguimiento de camas por invernadero, capacidad referencial y estado operativo."
        actions={<button className="action-button" type="button" onClick={() => setModalOpen(true)}><Plus size={17} /> Nueva cama</button>}
      />

      <section className="summary-strip summary-strip--three">
        <article className="summary-pill summary-pill--green"><strong>{camas.length}</strong><span>Camas registradas</span><small>en invernaderos</small></article>
        <article className="summary-pill summary-pill--blue"><strong>{activas}</strong><span>Camas activas</span><small>{numberCompact(camas.length - activas)} inactivas</small></article>
        <article className="summary-pill summary-pill--orange"><strong>{numberCompact(capacidad)}</strong><span>Capacidad total</span><small>referencial de plantas</small></article>
      </section>

      <section className="panel-card">
        <FilterToolbar value={query} onChange={setQuery} placeholder="Buscar cama, lote o estado" />
        <DataTable<CamaResponse>
          title="Listado de camas"
          description="Capacidad operativa disponible por cama e invernadero."
          items={filtered}
          columns={[
            { key: 'codigo', label: 'Código' },
            { key: 'lote', label: 'Lote', render: (item) => item.lote?.codigo || 'Sin lote' },
            { key: 'descripcion', label: 'Descripción' },
            { key: 'capacidadReferencial', label: 'Capacidad', render: (item) => numberCompact(item.capacidadReferencial || 0) },
            { key: 'estado', label: 'Estado', render: (item) => <StatusBadge value={item.estado} /> },
            { key: 'acciones', label: 'Acciones', render: (item) => (
              <div className="icon-actions">
                <button type="button" className="icon-action" title="Ver detalle" onClick={() => setSelectedCama(item)}><Eye size={15} /></button>
                <button type="button" className="mini-button" onClick={() => toggleStatus(item.id)}><RotateCcw size={14} /> Estado</button>
              </div>
            ) }
          ]}
        />
      </section>

      <DetailDrawer
        open={Boolean(selectedCama)}
        title={selectedCama?.codigo || 'Detalle de cama'}
        subtitle={selectedCama?.descripcion || selectedCama?.lote?.codigo || 'Capacidad operativa'}
        onClose={() => setSelectedCama(null)}
        actions={selectedCama ? <button type="button" className="action-button" onClick={() => toggleStatus(selectedCama.id)}><RotateCcw size={15} /> Cambiar estado</button> : null}
      >
        {selectedCama ? (
          <>
            <InfoGrid
              items={[
                { label: 'Código', value: selectedCama.codigo, tone: 'green' },
                { label: 'Lote', value: selectedCama.lote?.codigo || 'Sin lote', tone: 'blue' },
                { label: 'Capacidad', value: numberCompact(selectedCama.capacidadReferencial || 0), tone: 'orange' },
                { label: 'Estado', value: <StatusBadge value={selectedCama.estado} /> }
              ]}
            />
            <section className="drawer-section">
              <h3>Descripción</h3>
              <p>{selectedCama.descripcion || 'No se registró una descripción para esta cama.'}</p>
            </section>
          </>
        ) : null}
      </DetailDrawer>

      <Modal open={modalOpen} title="Nueva cama" description="Asocia una cama productiva a un invernadero existente." onClose={() => setModalOpen(false)}>
        <CamaForm lotes={lotes} onSubmit={createCama} onCancel={() => setModalOpen(false)} />
      </Modal>
    </main>
  );
}
