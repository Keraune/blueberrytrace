import { useMemo, useState } from 'react';
import { BedDouble, CheckCircle2, Layers3, Plus, RotateCcw } from 'lucide-react';
import { CamaForm } from '../components/CamaForm';
import { DataTable } from '../components/DataTable';
import { FilterToolbar } from '../components/FilterToolbar';
import { MetricCard } from '../components/MetricCard';
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

      <section className="metrics-grid metrics-grid--three">
        <MetricCard label="Camas registradas" value={camas.length} detail="en invernaderos" icon={<BedDouble size={20} />} tone="green" />
        <MetricCard label="Camas activas" value={activas} detail={`${numberCompact(camas.length - activas)} inactivas`} icon={<CheckCircle2 size={20} />} tone="blue" />
        <MetricCard label="Capacidad total" value={capacidad} detail="referencial de plantas" icon={<Layers3 size={20} />} tone="orange" />
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
            { key: 'acciones', label: 'Acciones', render: (item) => <button type="button" className="mini-button" onClick={() => toggleStatus(item.id)}><RotateCcw size={14} /> Estado</button> }
          ]}
        />
      </section>

      <Modal open={modalOpen} title="Nueva cama" description="Asocia una cama productiva a un invernadero existente." onClose={() => setModalOpen(false)}>
        <CamaForm lotes={lotes} onSubmit={createCama} onCancel={() => setModalOpen(false)} />
      </Modal>
    </main>
  );
}
